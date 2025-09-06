import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useWarranties } from '../context/WarrantyContext';
import { Spinner } from '../components/icons/Spinner';
import type { Warranty } from '../types';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { TagIcon } from '../components/icons/TagIcon';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';

interface WarrantyDetailPageProps {
    warrantyId: string;
}

const WarrantyDetailPage: React.FC<WarrantyDetailPageProps> = ({ warrantyId }) => {
    const { getWarrantyById } = useWarranties();
    const [warranty, setWarranty] = useState<Warranty | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = (path: string) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    useEffect(() => {
        const fetchWarranty = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getWarrantyById(warrantyId);
                setWarranty(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchWarranty();
    }, [warrantyId, getWarrantyById]);

    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center py-16"><Spinner className="w-8 h-8" /></div>;
        }
        if (error) {
            return (
                <div className="text-center py-16 px-6 bg-red-900/50 text-red-300 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Error loading warranty</h3>
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

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                        <div className="flex items-center space-x-3">
                            <CalendarIcon className="h-8 w-8 text-brand-primary p-1.5 bg-brand-primary/10 rounded-full" />
                            <div>
                                <p className="font-semibold text-content-secondary">Purchase Date</p>
                                <p className="text-content-primary">{new Date(warranty.purchase_date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <CalendarIcon className="h-8 w-8 text-brand-secondary p-1.5 bg-brand-secondary/10 rounded-full" />
                            <div>
                                <p className="font-semibold text-content-secondary">Expiry Date</p>
                                <p className="text-content-primary">{new Date(warranty.expiry_date).toLocaleDateString()}</p>
                            </div>
                        </div>
                         <div className="flex items-center space-x-3">
                            <CalendarIcon className="h-8 w-8 text-brand-pink p-1.5 bg-brand-pink/10 rounded-full" />
                            <div>
                                <p className="font-semibold text-content-secondary">Duration</p>
                                <p className="text-content-primary">{warranty.warranty_duration} months</p>
                            </div>
                        </div>
                    </div>

                    {warranty.ocr_raw && (
                        <div className="pt-6 border-t border-base-300/50">
                            <h3 className="text-lg font-semibold text-content-primary">AI-Extracted Data</h3>
                            <pre className="mt-2 bg-base-100/70 p-4 rounded-md text-xs text-content-secondary whitespace-pre-wrap overflow-x-auto">
                                <code>{warranty.ocr_raw}</code>
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <div 
              className="max-w-4xl mx-auto animate-slide-up"
            >
                <header className="mb-6">
                     <button 
                        onClick={() => navigate('/dashboard')} 
                        className="flex items-center space-x-2 text-content-secondary hover:text-content-primary mb-4 text-sm font-medium"
                        aria-label="Back to Dashboard"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>Back to Dashboard</span>
                    </button>
                    <h1 className="text-3xl font-bold text-content-primary">Warranty Details</h1>
                </header>
                {renderContent()}
            </div>
        </Layout>
    );
};

export default WarrantyDetailPage;