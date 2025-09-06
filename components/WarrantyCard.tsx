import React from 'react';
import type { Warranty } from '../types';
import { useWarranties } from '../context/WarrantyContext';
import { TrashIcon } from './icons/TrashIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { WarningIcon } from './icons/WarningIcon';
import { EditIcon } from './icons/EditIcon';
import { TagIcon } from './icons/TagIcon';
import { ShareIcon } from './icons/ShareIcon';
import { formatDate } from '../utils/dateUtils';

interface WarrantyCardProps {
  warranty: Warranty;
  onEdit: () => void;
  onShare: () => void;
  isDemo?: boolean;
}

type WarrantyStatus = 'expired' | 'expiring' | 'safe';

interface DaysRemainingInfo {
    text: string;
    status: WarrantyStatus;
}

// Determines the warranty status and text based on the expiry date.
const getWarrantyStatusInfo = (expiryDate: string): DaysRemainingInfo => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only, ignoring time
    const expiry = new Date(expiryDate);
    
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { text: 'Expired', status: 'expired' };
    }
    if (diffDays <= 30) {
        return { text: `${diffDays} days left`, status: 'expiring' };
    }
    return { text: `${diffDays} days left`, status: 'safe' };
};

// Style mapping for different warranty statuses
const cardStatusStyles: Record<WarrantyStatus, { card: string; text: string; icon: string }> = {
  safe: {
    card: 'bg-base-200/40 border-base-300/50',
    text: 'text-green-400',
    icon: '',
  },
  expiring: {
    card: 'bg-orange-900/40 border-orange-500/80',
    text: 'text-orange-400 font-bold',
    icon: 'text-orange-400',
  },
  expired: {
    card: 'bg-red-900/40 border-red-500/80 opacity-80',
    text: 'text-red-400 font-bold',
    icon: 'text-red-400',
  },
};


const WarrantyCard: React.FC<WarrantyCardProps> = ({ warranty, onEdit, onShare, isDemo = false }) => {
  const { deleteWarranty } = useWarranties();
  const { text, status } = getWarrantyStatusInfo(warranty.expiry_date);
  const styles = cardStatusStyles[status];

  const handleDelete = () => {
    if (isDemo) return;
    if (window.confirm(`Are you sure you want to delete the warranty for "${warranty.product_name}"?`)) {
        deleteWarranty(warranty.id, warranty.file_url);
    }
  };

  return (
    <div 
      className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out border backdrop-blur-sm ${styles.card} animate-slide-up hover:-translate-y-1`}
    >
      <img className="h-48 w-full object-cover" src={warranty.file_url} alt={`Receipt for ${warranty.product_name}`} />
      <div className="p-5">
        <div className="flex justify-between items-start gap-2">
            <div className="flex items-center space-x-2 mr-2">
                <h3 className="text-lg font-bold text-content-primary">{warranty.product_name}</h3>
                {status !== 'safe' && (
                    <WarningIcon 
                        className={`h-6 w-6 ${styles.icon} flex-shrink-0`}
                    >
                        <title>{status === 'expiring' ? 'Warranty expiring soon' : 'Warranty expired'}</title>
                    </WarningIcon>
                )}
            </div>
            <div className={`flex-shrink-0 flex items-center space-x-1 -mt-1 -mr-1 ${isDemo ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <button 
                    onClick={onShare}
                    disabled={isDemo}
                    className="text-content-secondary hover:text-brand-secondary transition-colors p-1"
                    aria-label="Share warranty"
                >
                    <ShareIcon className="h-5 w-5"/>
                </button>
                <button 
                    onClick={onEdit}
                    disabled={isDemo}
                    className="text-content-secondary hover:text-brand-primary transition-colors p-1"
                    aria-label="Edit warranty"
                >
                    <EditIcon className="h-5 w-5"/>
                </button>
                <button 
                    onClick={handleDelete} 
                    disabled={isDemo}
                    className="text-content-secondary hover:text-red-500 transition-colors p-1"
                    aria-label="Delete warranty"
                >
                    <TrashIcon className="h-5 w-5"/>
                </button>
            </div>
        </div>
        {warranty.category && (
            <div className="flex items-center space-x-1.5 text-xs text-content-secondary mt-1">
                <TagIcon className="h-3.5 w-3.5" />
                <span className="capitalize font-medium">{warranty.category}</span>
            </div>
        )}
        <div className="space-y-3 text-sm mt-3">
            <div className="flex items-center text-content-secondary space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Purchased: {formatDate(warranty.purchase_date)}</span>
            </div>
            <div className="flex items-center text-content-secondary space-x-2">
                <CalendarIcon className="h-4 w-4 text-brand-secondary" />
                <span>Expires: {formatDate(warranty.expiry_date)}</span>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-base-300/50">
          <p className={`text-sm font-semibold ${styles.text}`}>
            {text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WarrantyCard;