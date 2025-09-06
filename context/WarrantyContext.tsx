import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import type { Warranty, Category, OcrData } from '../types';
import { useAuth } from './AuthContext';
import {
  fetchWarranties as apiFetchWarranties,
  deleteWarranty as apiDeleteWarranty,
  updateWarranty as apiUpdateWarranty,
  createWarranty as apiCreateWarranty,
  uploadReceiptAndCreateWarranty as apiUploadAndCreate,
  getWarrantyById as apiGetWarrantyById,
  createShareLink as apiCreateShareLink,
} from '../services/warrantyService';
import { fileToBase64, extractWarrantyInfoFromImage } from '../services/geminiService';


interface WarrantyContextType {
  warranties: Warranty[];
  loading: boolean;
  error: string | null;
  addWarranty: (data: Omit<Warranty, 'id' | 'user_id' | 'expiry_date' | 'created_at' | 'ocr_raw' | 'file_url' | 'category'> & { category: Category | null }, receiptFile: File) => Promise<void>;
  updateWarranty: (id: string, updates: Partial<Pick<Warranty, 'product_name' | 'purchase_date' | 'warranty_duration' | 'category'>>) => Promise<void>;
  deleteWarranty: (id: string, fileUrl: string) => Promise<void>;
  uploadAndProcessReceipt: (receiptFile: File) => Promise<Warranty>;
  getWarrantyById: (id: string) => Promise<Warranty>;
  createShareLink: (warrantyId: string) => Promise<string>;
}

const WarrantyContext = createContext<WarrantyContextType | undefined>(undefined);

export const WarrantyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWarranties = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetchWarranties(user.id);
      setWarranties(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
        fetchWarranties();
    } else {
        setWarranties([]);
        setLoading(false);
    }
  }, [user, fetchWarranties]);

  const addWarranty = useCallback(async (data: Omit<Warranty, 'id' | 'user_id' | 'expiry_date' | 'created_at' | 'ocr_raw' | 'file_url' | 'category'> & { category: Category | null }, receiptFile: File) => {
    if (!user) throw new Error("User not authenticated.");
    
    await apiCreateWarranty(user.id, data, receiptFile);
    await fetchWarranties();
  }, [user, fetchWarranties]);

  const updateWarranty = useCallback(async (id: string, updates: Partial<Pick<Warranty, 'product_name' | 'purchase_date' | 'warranty_duration' | 'category'>>) => {
    const originalWarranties = [...warranties];
    
    setWarranties(prev => prev.map(w => w.id === id ? { ...w, ...updates } as Warranty : w));

    try {
      await apiUpdateWarranty(id, updates);
      await fetchWarranties(); 
    } catch (err: any) {
      setError(err.message);
      setWarranties(originalWarranties); 
      throw err;
    }
  }, [warranties, fetchWarranties]);
  
  const deleteWarranty = useCallback(async (id: string, fileUrl: string) => {
    const originalWarranties = [...warranties];
    setWarranties(prev => prev.filter(w => w.id !== id)); 
    try {
      await apiDeleteWarranty(id, fileUrl);
    } catch (err: any) {
      setError(err.message);
      setWarranties(originalWarranties); 
    }
  }, [warranties]);
  
  const uploadAndProcessReceipt = useCallback(async (receiptFile: File): Promise<Warranty> => {
    if (!user) throw new Error("User not authenticated.");

    let newWarrantyStub: Warranty | null = null;
    try {
      // Step 1: Upload file and create a stub record.
      newWarrantyStub = await apiUploadAndCreate(user.id, receiptFile);
      // Step 2: Refresh the list to show the "Processing..." card.
      fetchWarranties();

      // Step 3: Perform OCR.
      const base64 = await fileToBase64(receiptFile);
      const ocrData: OcrData = await extractWarrantyInfoFromImage(base64, receiptFile.type);
      
      // Step 4: Update the record with OCR data.
      await apiUpdateWarranty(newWarrantyStub.id, {
          product_name: ocrData.productName,
          purchase_date: ocrData.purchaseDate,
          warranty_duration: ocrData.warrantyLengthInMonths ?? 0,
          ocr_raw: JSON.stringify(ocrData, null, 2),
      });

      // After a successful OCR update, refetch the single warranty to get the complete data
      // FIX: The call to `apiGetWarrantyById` was missing the `userId` argument.
      const finalWarranty = await apiGetWarrantyById(newWarrantyStub.id, user.id);
      return finalWarranty;

    } catch (error: any) {
        console.error("Failed during upload and process flow:", error);
        // If OCR or update fails, update the stub to show an error state.
        if (newWarrantyStub) {
            await apiUpdateWarranty(newWarrantyStub.id, { product_name: 'Analysis Failed - Please Edit' });
        }
        throw error; // Re-throw to let the component know.
    } finally {
        // Step 5: Final refresh to show the updated card.
        fetchWarranties();
    }
  }, [user, fetchWarranties]);

  const getWarrantyById = useCallback(async (id: string): Promise<Warranty> => {
    if (!user) throw new Error("User not authenticated.");
    return apiGetWarrantyById(id, user.id);
  }, [user]);

  const createShareLink = useCallback(async (warrantyId: string): Promise<string> => {
    if (!user) throw new Error("User not authenticated.");
    return apiCreateShareLink(warrantyId, user.id);
  }, [user]);

  return (
    <WarrantyContext.Provider value={{ warranties, loading, error, addWarranty, updateWarranty, deleteWarranty, uploadAndProcessReceipt, getWarrantyById, createShareLink }}>
      {children}
    </WarrantyContext.Provider>
  );
};

export const useWarranties = () => {
  const context = useContext(WarrantyContext);
  if (context === undefined) {
    throw new Error('useWarranties must be used within a WarrantyProvider');
  }
  return context;
};
