import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import { UploadIcon } from './icons/UploadIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { PricingIcon } from './icons/PricingIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

interface SidebarProps {
    onOpenComingSoonModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onOpenComingSoonModal }) => {
    const { signOut } = useAuth();
    const [isExpanded, setIsExpanded] = useState(true);

    const navItems = [
        { icon: DashboardIcon, label: 'Dashboard', action: () => {}, active: true },
        { icon: UploadIcon, label: 'Upload', action: onOpenComingSoonModal, active: false },
        { icon: SettingsIcon, label: 'Settings', action: onOpenComingSoonModal, active: false },
        { icon: PricingIcon, label: 'Pricing', action: onOpenComingSoonModal, active: false },
    ];

    return (
        <aside className={`flex flex-col bg-base-200/50 backdrop-blur-lg border-r border-base-300/50 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'}`}>
            <div className="flex items-center justify-between p-4 border-b border-base-300/50">
                <div className={`flex items-center gap-2 overflow-hidden transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                    <ShieldCheckIcon className="h-8 w-8 text-brand-primary flex-shrink-0" />
                    <span className="font-bold whitespace-nowrap">Warranty Vault</span>
                </div>
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded-full hover:bg-base-300/50">
                    <ChevronLeftIcon className={`h-6 w-6 transition-transform duration-300 ${isExpanded ? 'rotate-0' : 'rotate-180'}`} />
                </button>
            </div>
            
            <nav className="flex-1 px-2 py-4 space-y-2">
                {navItems.map(item => (
                    <button key={item.label} onClick={item.action} className={`flex items-center w-full p-2 rounded-lg transition-colors ${item.active ? 'bg-brand-primary text-white' : 'hover:bg-base-300/50 text-content-secondary hover:text-content-primary'}`}>
                        <item.icon className="h-6 w-6 flex-shrink-0" />
                        <span className={`ml-4 font-semibold whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-base-300/50">
                 <div className="flex items-center">
                     <button onClick={signOut} className="flex items-center w-full p-2 rounded-lg hover:bg-red-500/20 text-red-400">
                        <LogoutIcon className="h-6 w-6 flex-shrink-0" />
                        <span className={`ml-4 font-semibold whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;