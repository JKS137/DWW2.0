import React, { useState, useEffect } from 'react';
import type { Warranty, Category } from '../types';
import { categories } from '../types';
import { useWarranties } from '../context/WarrantyContext';
import { extractWarrantyInfoFromImage } from '../services/geminiService';
import { Spinner } from './icons/Spinner';
import { XIcon } from './icons/XIcon';
import { SmartOCRIcon } from './icons/SmartOCRIcon';

interface EditWarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
  warranty: Warranty;
}

const EditWarrantyModal: React.FC<EditWarrantyModalProps> = ({ isOpen, onClose, warranty }) => {
  const { updateWarranty } = useWarranties();

  const [productName, setProductName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyLength, setWarrantyLength] = useState<number | ''>('');
  const [category, setCategory] = useState<Category | ''>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [isRescanning, setIsRescanning] = useState(false);
  const [rescanError, setRescanError] = useState<string | null>(null);

  useEffect(() => {
    if (warranty) {
      setProductName(warranty.product_name || '');
      setPurchaseDate(warranty.purchase_date || '');
      setWarrantyLength(warranty.warranty_duration ?? '');
      setCategory(warranty.category || '');
    }
  }, [warranty]);
  
  const handleRescan = async () => {
    setIsRescanning(true);
    setRescanError(null);
    try {
      const response = await fetch(warranty.file_url);
      if (!response.ok) throw new Error("Could not fetch receipt image for analysis.");
      
      const blob = await response.blob();
      
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
          } else {
            reject(new Error("Failed to read file as base64 string."));
          }
        };
        reader.onerror = error => reject(error);
      });

      const ocrData = await extractWarrantyInfoFromImage(base64Image, blob.type);
      
      setProductName(ocrData.productName || '');
      setPurchaseDate(ocrData.purchaseDate || '');
      setWarrantyLength(ocrData.warrantyLengthInMonths ?? '');

    } catch (err: any) {
        setRescanError(err.message || "An unknown error occurred during re-scan.");
    } finally {
        setIsRescanning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!productName || !purchaseDate || warrantyLength === '' || !category) {
      setFormError("Please fill in all fields.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateWarranty(warranty.id, {
        product_name: productName,
        purchase_date: purchaseDate,
        warranty_duration: Number(warrantyLength),
        category: category,
      });
      onClose();
    } catch (err: any) {
        setFormError(err.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-base-200/50 backdrop-blur-lg border border-base-300/50 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-base-300/50 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-content-primary">Edit Warranty</h2>
            <button onClick={onClose} className="text-content-secondary hover:text-content-primary rounded-full p-1"><XIcon className="w-5 h-5"/></button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-shrink-0 lg:w-1/2">
                    <h3 className="text-base font-semibold text-content-primary mb-2">Receipt Image</h3>
                    <div className="bg-base-100/50 rounded-lg p-2 border border-base-300/50">
                        <img src={warranty.file_url} alt={`Receipt for ${warranty.product_name}`} className="rounded-md w-full h-auto max-h-[500px] object-contain"/>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex-grow space-y-4">
                    <div className="bg-base-100/50 border border-base-300/50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-content-primary mb-2">Improve Details with AI</h3>
                        <p className="text-xs text-content-secondary mb-3">If the details are incorrect, you can ask the AI to analyze the receipt again.</p>
                        <button 
                            type="button" 
                            onClick={handleRescan} 
                            disabled={isRescanning} 
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold bg-brand-secondary text-white rounded-lg shadow-md hover:bg-opacity-90 transition-all transform hover:scale-105 hover:shadow-glow-teal disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isRescanning ? <Spinner className="w-5 h-5" /> : <SmartOCRIcon className="w-5 h-5" />}
                            <span>{isRescanning ? 'Analyzing...' : 'Re-scan with AI'}</span>
                        </button>
                        {rescanError && <p className="text-brand-pink text-xs mt-2 text-center">{rescanError}</p>}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label htmlFor="editProductName" className="block text-sm font-medium text-content-secondary mb-1">Product Name</label>
                            <input type="text" id="editProductName" value={productName} onChange={e => setProductName(e.target.value)} required className="block w-full px-3 py-2 bg-base-100/70 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"/>
                        </div>
                        <div>
                            <label htmlFor="editPurchaseDate" className="block text-sm font-medium text-content-secondary mb-1">Purchase Date</label>
                            <input type="date" id="editPurchaseDate" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} required className="block w-full px-3 py-2 bg-base-100/70 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"/>
                        </div>
                        <div>
                            <label htmlFor="editWarrantyLength" className="block text-sm font-medium text-content-secondary mb-1">Warranty (months)</label>
                            <input type="number" id="editWarrantyLength" value={warrantyLength} onChange={e => setWarrantyLength(e.target.value === '' ? '' : parseInt(e.target.value, 10))} required className="block w-full px-3 py-2 bg-base-100/70 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"/>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="editCategory" className="block text-sm font-medium text-content-secondary mb-1">Category</label>
                            <select id="editCategory" value={category} onChange={e => setCategory(e.target.value as Category)} required className="block w-full px-3 py-2 bg-base-100/70 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary">
                                <option value="" disabled>Select a category</option>
                                {categories.map(c => <option key={c} value={c} className="capitalize bg-base-200">{c}</option>)}
                            </select>
                        </div>
                    </div>
                
                    {formError && <p className="text-brand-pink text-sm">{formError}</p>}

                    <div className="pt-4 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-base-300/50 text-content-primary rounded-md hover:bg-base-300">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-opacity-90 disabled:bg-opacity-50 disabled:cursor-not-allowed flex items-center min-w-[120px] justify-center hover:shadow-glow-blue transition-shadow">
                        {isSubmitting ? <Spinner className="w-5 h-5" /> : 'Save Changes'}
                    </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditWarrantyModal;
