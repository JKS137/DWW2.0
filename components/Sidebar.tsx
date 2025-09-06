


import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import { ProfileIcon } from './icons/ProfileIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

const Sidebar: React.FC = () => {
    const { signOut } = useAuth();
    const [isExpanded, setIsExpanded] = useState(true);
    const [activeRoute, setActiveRoute] = useState(window.location.pathname);

    useEffect(() => {
        const handleLocationChange = () => {
            setActiveRoute(window.location.pathname);
        };
        // Listen to popstate event which is triggered by browser back/forward buttons
        // and our custom navigate function.
        window.addEventListener('popstate', handleLocationChange);
        return () => {
            window.removeEventListener('popstate', handleLocationChange);
        };
    }, []);
    
    // Custom navigation function to work with the SPA router in App.tsx
    const navigate = (path: string) => {
        window.history.pushState({}, '', path);
        // Dispatch a popstate event to make the App component re-render
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    const navItems = [
        { icon: DashboardIcon, label: 'Dashboard', action: () => navigate('/dashboard'), path: '/dashboard' },
        { icon: ProfileIcon, label: 'Account', action: () => navigate('/account'), path: '/account' },
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
                {navItems.map(item => {
                    const Icon = item.icon;
                    return (
                        <button 
                            key={item.label} 
                            onClick={item.action} 
                            className={`flex items-center w-full p-2 rounded-lg transition-colors ${activeRoute === item.path ? 'bg-brand-primary text-white' : 'hover:bg-base-300/50 text-content-secondary hover:text-content-primary'}`}
                        >
                            <Icon className="h-6 w-6 flex-shrink-0" />
                            <span className={`ml-4 font-semibold whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-base-300/50">
                 <div className="flex items-center">
                     <button 
                        onClick={async () => {
                            const { error } = await signOut();
                            if (error) {
                                console.error('Sign out failed:', error);
                                return;
                            }
                            navigate('/login');
                        }} 
                        className="flex items-center w-full p-2 rounded-lg hover:bg-red-500/20 text-red-400">
                        <LogoutIcon className="h-6 w-6 flex-shrink-0" />
                        <span className={`ml-4 font-semibold whitespace-nowrap transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;