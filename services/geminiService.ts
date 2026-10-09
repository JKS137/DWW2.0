import type { OcrData } from '../types';
import { supabase } from './supabaseClient';

/**
 * Converts a File object to a base64 encoded string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

/**
 * Sends receipt OCR requests to the authenticated server endpoint.
 * The Gemini API key must only exist in server-side environment variables.
 */
export const extractWarrantyInfoFromImage = async (base64Image: string, mimeType: string): Promise<OcrData> => {
    if (!supabase) {
        throw new Error("Authentication is not configured. Please contact the administrator.");
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
        throw new Error("Please sign in before analyzing a receipt.");
    }

    try {
        const response = await fetch('/api/ocr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ base64Image, mimeType }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(typeof result.error === 'string' ? result.error : 'Receipt analysis failed.');
        }

        const parsedData = result.data as OcrData | undefined;
        if (!parsedData || typeof parsedData.productName !== 'string' || typeof parsedData.purchaseDate !== 'string') {
            throw new Error('The AI response could not be validated.');
        }
        if (!parsedData.productName || !parsedData.purchaseDate) {
            throw new Error('Receipt details were not clear enough. Please enter them manually.');
        }
        return parsedData;
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : '';
        console.error('Error extracting warranty info:', message);
        throw new Error(message || 'Failed to analyze receipt. Please try a clearer image or enter details manually.');
    }
};
