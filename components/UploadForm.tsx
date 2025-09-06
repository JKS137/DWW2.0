

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWarranties } from '../context/WarrantyContext';
import { UploadIcon } from './icons/UploadIcon';
import { Spinner } from './icons/Spinner';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { XIcon } from './icons/XIcon';
import type { Warranty } from '../types';

interface Upload {
    id: string;
    file: File;
    status: 'uploading' | 'success' | 'error';
    error?: string;
    warranty?: Warranty;
}

const UploadForm: React.FC = () => {
    const { uploadAndProcessReceipt } = useWarranties();
    const [isDragging, setIsDragging] = useState(false);
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [progress, setProgress] = useState<Record<string, number>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const navigate = (path: string) => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };
    
    // Simulate upload progress
    useEffect(() => {
        const activeUploads = uploads.filter(u => u.status === 'uploading');
        if (activeUploads.length === 0) return;

        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = { ...prev };
                activeUploads.forEach(upload => {
                    const current = newProgress[upload.id] || 0;
                    if (current < 95) { // Don't let it reach 100% automatically
                        newProgress[upload.id] = current + Math.random() * 5;
                    }
                });
                return newProgress;
            });
        }, 300);

        return () => clearInterval(interval);
    }, [uploads]);

    const processFile = useCallback(async (upload: Upload) => {
        try {
            const newWarranty = await uploadAndProcessReceipt(upload.file);
            setProgress(prev => ({ ...prev, [upload.id]: 100 }));
            setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'success', warranty: newWarranty } : u));
        } catch (err: any) {
            setUploads(prev => prev.map(u => u.id === upload.id ? { ...u, status: 'error', error: err.message || 'An unknown error occurred.' } : u));
        }
    }, [uploadAndProcessReceipt]);

    const handleFiles = useCallback((files: FileList | null) => {
        if (!files || files.length === 0) return;

        const newUploads: Upload[] = Array.from(files).map(file => {
            const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
            if (!acceptedTypes.includes(file.type)) {
                return {
                    id: `${file.name}-${Date.now()}`,
                    file,
                    status: 'error' as const,
                    error: 'Invalid file type.'
                };
            }
            return {
                id: `${file.name}-${Date.now()}`,
                file,
                status: 'uploading' as const,
            };
        });
        
        setUploads(prev => [...newUploads, ...prev]);

        newUploads.forEach(upload => {
            if (upload.status === 'uploading') {
                setProgress(prev => ({...prev, [upload.id]: 0}));
                processFile(upload);
            }
        });
    }, [processFile]);
    
    const handleCancel = (id: string) => {
        setUploads(prev => prev.filter(u => u.id !== id));
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
        if (e.target) {
            e.target.value = '';
        }
    };

    const baseClasses = "relative block w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 cursor-pointer";
    const draggingClasses = isDragging ? "border-brand-primary bg-brand-primary/10" : "border-base-300/70 hover:border-brand-primary/70";

    const DropzoneContent = () => (
        <div 
            className={`${baseClasses} ${draggingClasses}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleFileSelect}
            />
            <div className="space-y-2">
                <UploadIcon className="mx-auto h-10 w-10 text-content-secondary" />
                <p className="font-semibold text-content-primary">Quick Upload &amp; Analyze</p>
                <p className="text-sm text-content-secondary">Drag &amp; drop or click to upload receipts. <br/> AI will automatically extract the details.</p>
            </div>
        </div>
    );

    const UploadsList = () => (
        <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold text-content-primary">Upload Progress</h3>
            {uploads.map(upload => {
                const currentProgress = Math.round(progress[upload.id] || 0);
                return (
                    <motion.div 
                        key={upload.id} 
                        className="bg-base-200/50 p-4 rounded-lg flex items-center justify-between gap-4 transition-all"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        layout
                    >
                        <div className="flex items-center gap-4 overflow-hidden flex-1">
                            <div className="flex-shrink-0">
                                {upload.status === 'uploading' && <Spinner className="w-6 h-6"/>}
                                {upload.status === 'success' && <CheckCircleIcon className="w-6 h-6 text-brand-secondary"/>}
                                {upload.status === 'error' && <XCircleIcon className="w-6 h-6 text-brand-pink"/>}
                            </div>
                            <div className="overflow-hidden w-full">
                                <p className="text-sm font-medium text-content-primary truncate">{upload.file.name}</p>
                                
                                <div className="mt-1.5">
                                    {upload.status === 'uploading' && (
                                        <>
                                            <div className="flex justify-between items-center text-xs text-content-secondary mb-1">
                                                <span>Analyzing with AI...</span>
                                                <span>{currentProgress}%</span>
                                            </div>
                                            <div className="w-full bg-base-300 rounded-full h-2">
                                                <div 
                                                    className="bg-brand-primary h-2 rounded-full transition-all duration-300 ease-linear" 
                                                    style={{ width: `${currentProgress}%` }}
                                                ></div>
                                            </div>
                                        </>
                                    )}
                                    {upload.status === 'error' && <p className="text-xs text-brand-pink">{upload.error}</p>}
                                    {upload.status === 'success' && upload.warranty && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-brand-secondary">
                                                Success! Details extracted.
                                            </span>
                                            <button
                                                onClick={() => navigate(`/warranty/${upload.warranty!.id}`)}
                                                className="ml-4 flex-shrink-0 px-3 py-1 text-xs font-semibold bg-brand-secondary text-white rounded-md hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-secondary"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {upload.status === 'uploading' && (
                            <button onClick={() => handleCancel(upload.id)} className="p-1.5 text-content-secondary hover:text-content-primary rounded-full hover:bg-base-300/50 flex-shrink-0" aria-label="Cancel upload">
                                <XIcon className="w-4 h-4"/>
                            </button>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );

    return (
        <>
            <DropzoneContent />
            {uploads.length > 0 && <UploadsList />}
        </>
    );
};

export default UploadForm;
