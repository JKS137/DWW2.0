import React, { useState, useRef, useCallback } from 'react';
import { useWarranties } from '../context/WarrantyContext';
import { UploadIcon } from './icons/UploadIcon';
import { Spinner } from './icons/Spinner';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const UploadForm: React.FC = () => {
    const { uploadAndProcessReceipt } = useWarranties();
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(async (file: File) => {
        if (!file) return;

        const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (!acceptedTypes.includes(file.type)) {
            setError('Invalid file type. Please upload an image or PDF.');
            setUploadStatus('error');
            return;
        }

        setError(null);
        setUploadStatus('uploading');

        try {
            await uploadAndProcessReceipt(file);
            setUploadStatus('success');
            setTimeout(() => setUploadStatus('idle'), 3000); // Reset after 3 seconds
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
            setUploadStatus('error');
        }
    }, [uploadAndProcessReceipt]);
    
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
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        handleFile(file);
        // Reset file input value to allow uploading the same file again
        if (e.target) {
            e.target.value = '';
        }
    };

    const baseClasses = "relative block w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300";
    const draggingClasses = isDragging ? "border-brand-primary bg-brand-primary/10" : "border-base-300/70 hover:border-brand-primary/70";

    return (
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
                className="hidden"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleFileSelect}
            />
            
            {uploadStatus === 'idle' && (
                <div className="space-y-2">
                    <UploadIcon className="mx-auto h-10 w-10 text-content-secondary" />
                    <p className="font-semibold text-content-primary">Quick Upload &amp; Analyze</p>
                    <p className="text-sm text-content-secondary">Drag &amp; drop or click to upload a receipt. <br/> AI will automatically extract the details.</p>
                </div>
            )}

            {uploadStatus === 'uploading' && (
                <div className="flex flex-col items-center justify-center">
                    <Spinner className="w-10 h-10" />
                    <p className="mt-2 text-sm text-content-secondary">Uploading &amp; Analyzing...</p>
                </div>
            )}

            {uploadStatus === 'success' && (
                 <div className="flex flex-col items-center justify-center">
                    <CheckCircleIcon className="w-10 h-10 text-brand-secondary" />
                    <p className="mt-2 text-sm font-semibold text-brand-secondary">Analysis Complete!</p>
                </div>
            )}

            {uploadStatus === 'error' && (
                <div className="flex flex-col items-center justify-center">
                    <XCircleIcon className="w-10 h-10 text-brand-pink" />
                    <p className="mt-2 text-sm font-semibold text-brand-pink">Processing Failed</p>
                    <p className="text-xs text-content-secondary mt-1">{error}</p>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setUploadStatus('idle'); }} 
                        className="mt-4 px-3 py-1 text-xs bg-base-300 rounded-md hover:bg-opacity-80"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadForm;