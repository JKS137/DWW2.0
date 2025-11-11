import React, { useState, useEffect } from 'react';
import type { Warranty } from '../types';
import { useWarranties } from '../context/WarrantyContext';
import { Spinner } from './icons/Spinner';
import { XIcon } from './icons/XIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ShareWarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
  warranty: Warranty | null;
}

const ShareWarrantyModal: React.FC<ShareWarrantyModalProps> = ({ isOpen, onClose, warranty }) => {
    const { createShareLink } = useWarranties();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shareLink, setShareLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen && warranty) {
            setShareLink(null); // Reset link when a new warranty is selected
            const generateLink = async () => {
                setLoading(true);
                setError(null);
                try {
                    const token = await createShareLink(warranty.id);
                    const link = `${window.location.origin}/share/${token}`;
                    setShareLink(link);
                } catch (err: any) {
                    setError(err.message || 'Failed to create share link.');
                } finally {
                    setLoading(false);
                }
            };
            generateLink();
        }
    }, [isOpen, warranty, createShareLink]);

    const handleClose = () => {
        onClose();
        // Reset state on close for next time it opens
        setTimeout(() => {
            setLoading(false);
            setError(null);
            setShareLink(null);
            setCopied(false);
        }, 300); // delay to allow for closing animation
    };

    const handleCopy = () => {
        if (!shareLink) return;
        navigator.clipboard.writeText(shareLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={handleClose}
        >
            <div
                className="bg-base-200/50 backdrop-blur-lg border border-base-300/50 rounded-lg shadow-xl w-full max-w-lg animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-base-300/50 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-content-primary">Share Warranty</h2>
                        <button onClick={handleClose} className="text-content-secondary hover:text-content-primary rounded-full p-1"><XIcon className="w-5 h-5"/></button>
                    </div>
                    <p className="text-sm text-content-secondary mt-1">
                        Generate a secure, read-only link for "{warranty?.product_name}".
                    </p>
                </div>
                
                <div className="p-6">
                    {loading && (
                        <div className="flex flex-col items-center justify-center space-y-2 text-content-secondary">
                            <Spinner className="w-8 h-8"/>
                            <p>Generating secure link...</p>
                        </div>
                    )}
                    {error && (
                        <div className="text-center text-red-400 bg-red-900/40 border border-red-500/50 rounded-md p-4">
                            <p className="font-semibold">Could not create link</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    {shareLink && (
                        <div className="space-y-4">
                            <p className="text-sm text-content-secondary">Anyone with this link can view the warranty details. The link does not grant permission to edit or delete.</p>
                            <div className="flex items-center gap-2 bg-base-100 border border-base-300 rounded-md p-2">
                                <input 
                                    type="text"
                                    value={shareLink}
                                    readOnly
                                    className="w-full bg-transparent text-content-primary text-sm focus:outline-none"
                                />
                                <button
                                    onClick={handleCopy}
                                    className={`flex-shrink-0 flex items-center justify-center space-x-2 w-28 px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${copied ? 'bg-brand-secondary text-white' : 'bg-brand-primary text-white hover:bg-opacity-90'}`}
                                >
                                    {copied ? <CheckCircleIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />}
                                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareWarrantyModal;