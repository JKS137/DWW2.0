import React from 'react';
import { motion } from 'framer-motion';
import type { Warranty } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { EditIcon } from './icons/EditIcon';
import { TagIcon } from './icons/TagIcon';
import { WarningIcon } from './icons/WarningIcon';
import { staggerContainerVariant, fadeUpVariant } from '../services/animations';

interface WarrantyListProps {
  warranties: (Warranty & { status: 'safe' | 'expiring' | 'expired' })[];
  onEdit: (warranty: Warranty) => void;
  onDelete: (id: string, fileUrl: string) => void;
  isDemo?: boolean;
}

const statusStyles = {
    safe: 'bg-green-500/20 text-green-300',
    expiring: 'bg-orange-500/20 text-orange-300',
    expired: 'bg-red-500/20 text-red-300',
};

const WarrantyList: React.FC<WarrantyListProps> = ({ warranties, onEdit, onDelete, isDemo = false }) => {

  const handleDelete = (warranty: Warranty) => {
    if (isDemo) return;
    if (window.confirm(`Are you sure you want to delete the warranty for "${warranty.product_name}"?`)) {
        onDelete(warranty.id, warranty.file_url);
    }
  };

  return (
    <motion.div 
      className="bg-base-200/40 backdrop-blur-sm border border-base-300/50 rounded-lg shadow-sm overflow-hidden"
      variants={staggerContainerVariant}
      initial="hidden"
      animate="visible"
    >
      <div className="divide-y divide-base-300/50">
        {warranties.map((warranty) => (
          <motion.div
            key={warranty.id}
            className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-base-300/50 transition-colors"
            variants={fadeUpVariant}
          >
            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
              <img src={warranty.file_url} alt={warranty.product_name} className="h-12 w-12 rounded-md object-cover flex-shrink-0" />
              <div>
                <p className="font-bold text-content-primary">{warranty.product_name}</p>
                {warranty.category && (
                    <div className="flex items-center space-x-1.5 text-xs text-content-secondary mt-1">
                        <TagIcon className="h-3.5 w-3.5" />
                        <span className="capitalize">{warranty.category}</span>
                    </div>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 text-sm text-content-secondary text-left sm:text-right w-full sm:w-auto">
              <p>Expires: {new Date(warranty.expiry_date).toLocaleDateString()}</p>
              <p>Purchased: {new Date(warranty.purchase_date).toLocaleDateString()}</p>
            </div>
            <div className="flex-shrink-0">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1 ${statusStyles[warranty.status]}`}>
                    {warranty.status !== 'safe' && <WarningIcon className="h-3.5 w-3.5" />}
                    {warranty.status.charAt(0).toUpperCase() + warranty.status.slice(1)}
                </span>
            </div>
            <div className={`flex-shrink-0 flex items-center space-x-2 ${isDemo ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <button onClick={() => onEdit(warranty)} disabled={isDemo} className="p-2 text-content-secondary hover:text-brand-primary" aria-label="Edit"><EditIcon className="h-5 w-5"/></button>
              <button onClick={() => handleDelete(warranty)} disabled={isDemo} className="p-2 text-content-secondary hover:text-red-500" aria-label="Delete"><TrashIcon className="h-5 w-5" /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WarrantyList;
