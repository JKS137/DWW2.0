import { supabase } from './supabaseClient';
import type { Warranty, Category } from '../types';

const RECEIPTS_BUCKET = 'receipts';

// Helper to calculate expiry date
const calculateExpiryDate = (purchaseDate: string, months: number): string => {
    const date = new Date(purchaseDate);
    // Handle invalid date string
    if (isNaN(date.getTime())) {
        return new Date().toISOString().split('T')[0];
    }
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
};

/**
 * Fetches all warranties for a given user.
 */
export const fetchWarranties = async (userId: string): Promise<Warranty[]> => {
    if (!supabase) throw new Error("Supabase client is not initialized.");
    const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Warranty[];
};

/**
 * Uploads a receipt file to Supabase Storage.
 */
const uploadReceipt = async (userId: string, file: File): Promise<string> => {
    if (!supabase) throw new Error("Supabase client is not initialized.");
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${new Date().getTime()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
        .from(RECEIPTS_BUCKET)
        .upload(fileName, file);

    if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

    const { data } = supabase.storage
        .from(RECEIPTS_BUCKET)
        .getPublicUrl(fileName);

    return data.publicUrl;
};

/**
 * Creates a new warranty record after a full form submission.
 */
export const createWarranty = async (
    userId: string,
    warrantyData: Omit<Warranty, 'id' | 'user_id' | 'expiry_date' | 'created_at' | 'ocr_raw' | 'file_url'>,
    receiptFile: File
): Promise<Warranty> => {
    if (!supabase) throw new Error("Supabase client is not initialized.");

    const file_url = await uploadReceipt(userId, receiptFile);
    const expiry_date = calculateExpiryDate(warrantyData.purchase_date, warrantyData.warranty_duration);
    
    const newWarranty = {
        ...warrantyData,
        user_id: userId,
        file_url,
        expiry_date,
    };

    const { data, error } = await supabase
        .from('warranties')
        .insert(newWarranty)
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    return data as Warranty;
};

/**
 * Uploads a receipt and creates a placeholder warranty for background OCR processing.
 */
export const uploadReceiptAndCreateWarranty = async (userId: string, file: File): Promise<Warranty> => {
    if (!supabase) throw new Error("Supabase client is not initialized.");
    const file_url = await uploadReceipt(userId, file);
    
    const today = new Date().toISOString().split('T')[0];
    const newWarrantyStub = {
        user_id: userId,
        file_url,
        product_name: 'Processing Receipt...',
        purchase_date: today,
        warranty_duration: 0,
        expiry_date: today,
    };

    const { data, error } = await supabase
        .from('warranties')
        .insert(newWarrantyStub)
        .select()
        .single();
        
    if (error) throw new Error(`Failed to create warranty stub: ${error.message}`);
    return data as Warranty;
};

/**
 * Updates an existing warranty.
 */
export const updateWarranty = async (
    warrantyId: string,
    updates: Partial<Pick<Warranty, 'product_name' | 'purchase_date' | 'warranty_duration' | 'category' | 'ocr_raw'>>
): Promise<Warranty> => {
    if (!supabase) throw new Error("Supabase client is not initialized.");

    const finalUpdates: Partial<Warranty> = { ...updates };

    // If purchase date or duration changes, recalculate expiry date
    if (updates.purchase_date || updates.warranty_duration !== undefined) {
        // We need the other value to perform the calculation. Fetch the original warranty.
        const { data: currentWarranty, error: fetchError } = await supabase
            .from('warranties')
            .select('purchase_date, warranty_duration')
            .eq('id', warrantyId)
            .single();

        if (fetchError) throw new Error(fetchError.message);
        
        const purchase_date = updates.purchase_date || currentWarranty.purchase_date;
        const warranty_duration = updates.warranty_duration === undefined ? currentWarranty.warranty_duration : updates.warranty_duration;
        
        if(purchase_date && warranty_duration !== undefined){
            finalUpdates.expiry_date = calculateExpiryDate(purchase_date, warranty_duration);
        }
    }
    
    const { data, error } = await supabase
        .from('warranties')
        .update(finalUpdates)
        .eq('id', warrantyId)
        .select()
        .single();
    
    if (error) throw new Error(error.message);
    return data as Warranty;
};

/**
 * Deletes a warranty and its associated file from storage.
 */
export const deleteWarranty = async (warrantyId: string, fileUrl: string): Promise<void> => {
    if (!supabase) throw new Error("Supabase client is not initialized.");
    
    // 1. Delete the record from the database
    const { error: dbError } = await supabase
        .from('warranties')
        .delete()
        .eq('id', warrantyId);

    if (dbError) throw new Error(dbError.message);

    // 2. Delete the file from storage
    try {
        const urlParts = fileUrl.split('/');
        const fileName = urlParts.slice(urlParts.indexOf(RECEIPTS_BUCKET) + 1).join('/');

        const { error: storageError } = await supabase.storage
            .from(RECEIPTS_BUCKET)
            .remove([fileName]);

        if (storageError) {
             // Log the error but don't throw, as the DB record is already gone.
            console.error("Failed to delete file from storage:", storageError.message);
        }
    } catch (e: any) {
        console.error("Error parsing file URL for deletion:", e.message);
    }
};