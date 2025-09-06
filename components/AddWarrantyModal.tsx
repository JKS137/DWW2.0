
import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { OcrData, Category } from '../types';
import { categories } from '../types';
import { useWarranties } from '../context/WarrantyContext';
import { fileToBase64, extractWarrantyInfoFromImage } from '../services/geminiService';
import { CameraIcon } from './icons/CameraIcon';
import { Spinner } from './icons/Spinner';
import { XIcon } from './icons/XIcon';

interface AddWarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type OcrStatus = 'pending' | 'analyzing' | 'success' | 'failed';

const AddWarrantyModal: React.FC<AddWarrantyModalProps> = ({ isOpen, onClose }) => {
  const { addWarranty } = useWarranties();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productName, setProductName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyLength, setWarrantyLength] = useState<number | ''>('');
  const [category, setCategory] = useState<Category | ''>('');
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [receiptImageUrl, setReceiptImageUrl] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [ocrStatus, setOcrStatus] = useState<OcrStatus>('pending');
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Cleanup function to revoke the object URL to prevent memory leaks
    return () => {
        if (receiptImageUrl) {
            URL.revokeObjectURL(receiptImageUrl);
        }
    };
  }, [receiptImageUrl]);

  const resetForm = useCallback(() => {
    setProductName('');
    setPurchaseDate('');
    setWarrantyLength('');
    setCategory('');
    setReceiptImage(null);
    if (receiptImageUrl) {
        URL.revokeObjectURL(receiptImageUrl);
    }
    setReceiptImageUrl(null);
    setIsSubmitting(false);
    setFormError(null);
    setOcrError(null);
    setOcrStatus('pending');
    setStep(1);
  }, [receiptImageUrl]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const performOcr = async (file: File) => {
    setOcrStatus('analyzing');
    setOcrError(null);
    try {
        const base64Image = await fileToBase64(file);
        const ocrData: OcrData = await extractWarrantyInfoFromImage(base64Image, file.type);
        setProductName(ocrData.productName || '');
        setPurchaseDate(ocrData.purchaseDate || '');
        setWarrantyLength(ocrData.warrantyLengthInMonths ?? '');
        setOcrStatus('success');
    } catch (err: any) {
        setOcrError(err.message || 'An unknown error occurred during OCR.');
        setOcrStatus('failed');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormError(null);
      setReceiptImage(file);
      // Create a temporary URL for the image preview
      if (receiptImageUrl) {
        URL.revokeObjectURL(receiptImageUrl);
      }
      setReceiptImageUrl(URL.createObjectURL(file));
      setStep(2);
      await performOcr(file);
    }
  };
  
  const handleRetryOcr = () => {
      if(receiptImage) {
          performOcr(receiptImage);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!productName || !purchaseDate || warrantyLength === '' || !category || !receiptImage) {
      setFormError("Please fill in all fields and ensure an image is uploaded.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addWarranty({
        product_name: productName,
        purchase_date: purchaseDate,
        warranty_duration: Number(warrantyLength),
        category: category || null,
      }, receiptImage);
      handleClose();
    } catch (err: any) {
        setFormError(err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isFormDisabled = ocrStatus === 'analyzing';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={handleClose}>
      <div className="bg-base-200/50 backdrop-blur-lg border border-base-300/50 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-content-primary">Add New Warranty</h2>
            <button onClick={handleClose} className="text-content-secondary hover:text-content-primary rounded-full p-1"><XIcon className="w-5 h-5" /></button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {step === 1 && (
            <div
              className="border-2 border-dashed border-base-300 rounded-lg p-10 text-center cursor-pointer hover:border-brand-primary hover:bg-base-200/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <CameraIcon className="mx-auto h-12 w-12 text-content-secondary" />
              <p className="mt-2 text-content-primary font-semibold">Click to upload receipt</p>
              <p className="text-xs text-content-secondary">PNG, JPG, WEBP</p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
              />
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col lg:flex-row gap-8">
                {receiptImageUrl && (
                    <div className="flex-shrink-0 lg:w-1/2">
                        <h3 className="text-base font-semibold text-content-primary mb-2">Receipt Preview</h3>
                        <div className="bg-base-100/50 rounded-lg p-2 border border-base-300/50">
                            <img src={receiptImageUrl} alt="Receipt preview" className="rounded-md w-full h-auto max-h-[500px] object-contain"/>
                        </div>
                    </div>
                )}
                <div className="flex-grow space-y-4">
                  {ocrStatus === 'analyzing' && (
                      <div className="flex flex-col items-center justify-center h-full bg-base-200/50 rounded-md p-4">
                          <Spinner />
                          <p className="mt-2 text-sm text-content-secondary">Analyzing receipt with AI...</p>
                      </div>
                  )}

                  {ocrStatus === 'failed' && (
                    <div className="bg-red-900/40 border border-red-500/50 text-red-300 text-sm rounded-md p-3">
                        <p className="font-bold">AI Analysis Failed</p>
                        <p className="text-xs mt-1">{ocrError}</p>
                        <p className="text-sm mt-2">Please fill in the details manually below, or you can <button type="button" onClick={handleRetryOcr} className="underline font-semibold hover:text-white">try again with a clearer image</button>.</p>
                    </div>
                  )}
                  
                  {ocrStatus === 'success' && (
                        <div className="bg-green-900/40 border border-green-500/50 text-green-300 text-sm rounded-md p-3">
                            <p><strong>AI Extraction Complete!</strong> Please review the auto-filled details below and correct them if necessary before saving.</p>
                        </div>
                  )}

                  <div className={isFormDisabled ? 'opacity-50 pointer-events-none' : ''}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-content-secondary mb-1">Product Name</label>
                        <input type="text" id="productName" value={productName} onChange={e => setProductName(e.target.value)} required className="block w-full px-3 py-2 bg-base-100/70 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"/>
                        </div>
                        <div>
                        <label htmlFor="purchaseDate" className="block text-sm font-medium text-content-secondary mb-1">Purchase Date</label>
                        <input type="date" id="purchaseDate" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} required className="block w-full px-3 py-2 bg-base-100/70 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"/>
                        </div>
                        <div>
                        <label htmlFor="warrantyLength" className="block text-sm font-medium text-content-secondary mb-1">Warranty (months)</label>
                        <input type="number" id="warrantyLength" value={warrantyLength} onChange={e => setWarrantyLength(e.target.value === '' ? '' : parseInt(e.target.value, 10))} required className="block w-full px-3 py-2 bg-base-100/70 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"/>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-content-secondary mb-1">Category</label>
                            <select id="category" value={category} onChange={e => setCategory(e.target.value as Category)} required className="block w-full px-3 py-2 bg-base-100/70 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary">
                                <option value="" disabled>Select a category</option>
                                {categories.map(c => <option key={c} value={c} className="capitalize bg-base-200">{c}</option>)}
                            </select>
                        </div>
                    </div>
                  </div>
              
                  {formError && <p className="text-brand-pink text-sm mt-2 text-center">{formError}</p>}

                  <div className="pt-4 flex justify-end space-x-3">
                    <button type="button" onClick={handleClose} className="px-4 py-2 bg-base-300/50 text-content-primary rounded-md hover:bg-base-300">Cancel</button>
                    <button type="submit" disabled={isFormDisabled || isSubmitting} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-opacity-90 disabled:bg-opacity-50 disabled:cursor-not-allowed flex items-center min-w-[130px] justify-center hover:shadow-glow-blue transition-shadow">
                      {isSubmitting ? <Spinner className="w-5 h-5" /> : 'Save Warranty'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddWarrantyModal;
