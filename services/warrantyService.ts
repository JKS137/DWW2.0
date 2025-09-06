import { supabase } from './supabaseClient';
import type { Warranty, Category } from '../types';

const RECEIPTS_BUCKET = (process.env.SUPABASE_BUCKET as string) || 'receipts';

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

    if (uploadError) {
        const msg = uploadError.message?.toLowerCase?.() ?? '';
        if (msg.includes('bucket') && msg.includes('not')) {
            throw new Error(`Storage upload failed: Bucket '${RECEIPTS_BUCKET}' not found. Create this bucket in Supabase Storage (public recommended) or set SUPABASE_BUCKET to an existing bucket name in your environment.`);
        }
        throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

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

/**
 * Fetches a single warranty by its ID for a specific user.
 */
export const getWarrantyById = async (warrantyId: string, userId: string): Promise<Warranty> => {
    if (!supabase) throw new Error("Supabase client is not initialized.");
    const { data, error } = await supabase
        .from('warranties')
        .select('*')
        .eq('id', warrantyId)
        .eq('user_id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') { // Code for "No rows found"
            throw new Error("Warranty not found or you don't have permission to view it.");
        }
        throw new Error(error.message);
    }
    return data as Warranty;
};


/**
 * Creates a shareable link for a warranty.
 */
export const createShareLink = async (warrantyId: string, userId: string): Promise<string> => {
    if (!supabase) throw new Error("Supabase client is not initialized.");
    
    // Insert a new share record and get the token.
    // RLS policy ensures user can only create links for their own warranties.
    const { data, error } = await supabase
        .from('shared_warranties')
        .insert({ warranty_id: warrantyId, user_id: userId })
        .select('share_token')
        .single();
    
    if (error) {
        // Check if a share link for this warranty already exists
        if (error.code === '23505') { // unique_violation
             const { data: existing, error: fetchError } = await supabase
                .from('shared_warranties')
                .select('share_token')
                .eq('warranty_id', warrantyId)
                .single();

            if (fetchError) throw new Error(`Could not create or retrieve share link: ${fetchError.message}`);
            if (existing) return existing.share_token;
        }
        throw new Error(`Could not create share link: ${error.message}`);
    }
    
    return data.share_token;
};


/**
 * Fetches a shared warranty's public details using a share token.
 */
export const getSharedWarranty = async (shareToken: string): Promise<Partial<Warranty>> => {
    if (!supabase) throw new Error("Supabase client is not initialized.");

    const { data: sharedLink, error: linkError } = await supabase
        .from('shared_warranties')
        .select('warranties ( product_name, purchase_date, expiry_date, category, file_url )')
        .eq('share_token', shareToken)
        .single();

    if (linkError) {
        if (linkError.code === 'PGRST116') { // No rows found
             throw new Error("This share link is invalid or has been revoked.");
        }
        throw new Error(linkError.message);
    }
    
    if (!sharedLink || !sharedLink.warranties) {
         throw new Error("Could not find the warranty associated with this link.");
    }

    // Supabase returns the nested object. Handle both object and array-of-one responses.
    const warrantyData = Array.isArray(sharedLink.warranties) ? sharedLink.warranties[0] : sharedLink.warranties;

    return warrantyData as Partial<Warranty>;
};