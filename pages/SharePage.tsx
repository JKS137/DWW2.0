import React, { useState, useEffect } from 'react';
import { getSharedWarranty } from '../services/warrantyService';
import { Spinner } from '../components/icons/Spinner';
import type { Warranty } from '../types';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { TagIcon } from '../components/icons/TagIcon';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';

interface SharePageProps {
    shareToken: string;
}

const SharePage: React.FC<SharePageProps> = ({ shareToken }) => {
    const [warranty, setWarranty] = useState<Partial<Warranty> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSharedWarranty = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getSharedWarranty(shareToken);
                setWarranty(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSharedWarranty();
    }, [shareToken]);

    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center py-16"><Spinner className="w-8 h-8" /></div>;
        }
        if (error) {
            return (
                <div className="text-center py-16 px-6 bg-red-900/50 text-red-300 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Cannot Load Warranty</h3>
                    <p>{error}</p>
                </div>
            );
        }
        if (!warranty) {
            return <div className="text-center py-16 text-content-secondary">Warranty details could not be found.</div>;
        }

        return (
            <div className="bg-base-200/50 backdrop-blur-sm rounded-lg border border-base-300/50 overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-8">
                    <img
                        src={warranty.file_url}
                        alt={`Receipt for ${warranty.product_name}`}
                        className="w-full max-h-[500px] object-contain rounded-lg bg-base-100/50 p-2"
                    />
                </div>
                <div className="p-6 border-t border-base-300/50 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-content-primary">{warranty.product_name}</h2>
                        {warranty.category && (
                            <div className="flex items-center space-x-1.5 text-sm text-content-secondary mt-2">
                                <TagIcon className="h-4 w-4" />
                                <span className="capitalize font-medium">{warranty.category}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                        <div className="flex items-center space-x-3">
                            <CalendarIcon className="h-8 w-8 text-brand-primary p-1.5 bg-brand-primary/10 rounded-full" />
                            <div>
                                <p className="font-semibold text-content-secondary">Purchase Date</p>
                                <p className="text-content-primary">{warranty.purchase_date ? new Date(warranty.purchase_date).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <CalendarIcon className="h-8 w-8 text-brand-secondary p-1.5 bg-brand-secondary/10 rounded-full" />
                            <div>
                                <p className="font-semibold text-content-secondary">Expiry Date</p>
                                <p className="text-content-primary">{warranty.expiry_date ? new Date(warranty.expiry_date).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="py-4">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                     <a href="/" className="flex items-center space-x-2">
                        <ShieldCheckIcon className="h-8 w-8 text-brand-primary" />
                        <span className="font-bold text-xl text-content-primary">Warranty Vault</span>
                    </a>
                </div>
            </header>
            <main className="flex-grow flex items-center p-4">
                <div 
                    className="max-w-2xl w-full mx-auto animate-slide-up"
                >
                    <header className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-content-primary">Shared Warranty Details</h1>
                        <p className="text-content-secondary mt-1">This is a read-only view of a shared warranty.</p>
                    </header>
                    {renderContent()}
                </div>
            </main>
            <footer className="py-4">
                 <div className="text-center text-sm text-content-secondary">
                    <p>&copy; {new Date().getFullYear()} Digital Warranty Vault. <a href="/" className="font-semibold text-brand-primary hover:underline">Create your own vault for free</a>.</p>
                </div>
            </footer>
        </div>
    );
};

export default SharePage;