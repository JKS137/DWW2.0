
import { GoogleGenAI, Type } from "@google/genai";
import type { OcrData } from '../types';

// Lazily initialize the AI client to prevent app crash on load if API key is missing.
let ai: GoogleGenAI | null = null;
let initError: string | null = null;

const getAiClient = (): GoogleGenAI => {
    if (ai) {
        return ai;
    }
    if (initError) {
        throw new Error(initError);
    }
    try {
        const API_KEY = process.env.API_KEY;
        if (!API_KEY) {
            throw new Error("API_KEY environment variable not set. Gemini API calls cannot be made.");
        }
        ai = new GoogleGenAI({ apiKey: API_KEY });
        return ai;
    } catch (e: any) {
        initError = `Failed to initialize Gemini AI Client: ${e.message}`;
                throw new Error(initError);
    }
};

/**
 * Converts a File object to a base64 encoded string.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 string.
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
 * Extracts warranty information from an image using Gemini API.
 * @param base64Image The base64 encoded image string.
 * @param mimeType The MIME type of the image.
 * @returns A promise that resolves with the extracted OCR data.
 */
export const extractWarrantyInfoFromImage = async (base64Image: string, mimeType: string): Promise<OcrData> => {
    try {
        const aiClient = getAiClient(); // This will throw if initialization fails

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };

        const prompt = `
You are an expert Optical Character Recognition (OCR) system specializing in extracting structured data from receipts and warranty documents. Analyze the provided image and extract the following information:
1. productName: The name of the product purchased. Be concise.
2. purchaseDate: The date of purchase in YYYY-MM-DD format.
3. warrantyLengthInMonths: The duration of the warranty in months (as an integer). If you see "1 year", use 12. If you see "90 days", use 3. If it's not found, return null.

Return ONLY a single, valid JSON object matching the specified schema. Do not include any explanatory text, markdown formatting, or anything outside of the JSON structure.
        `;

        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        productName: {
                            type: Type.STRING,
                            description: "The name of the product."
                        },
                        purchaseDate: {
                            type: Type.STRING,
                            description: "The purchase date in YYYY-MM-DD format."
                        },
                        warrantyLengthInMonths: {
                            type: Type.INTEGER,
                            description: "The warranty duration in months. Can be null.",
                            nullable: true,
                        }
                    },
                    required: ["productName", "purchaseDate", "warrantyLengthInMonths"]
                }
            }
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText) as OcrData;

        // Basic validation
        if (!parsedData.productName || !parsedData.purchaseDate) {
            throw new Error("Parsed data is missing required fields.");
        }

        return parsedData;

    } catch (error: any) {
                const errorMessage = error.message.includes("API_KEY") 
            ? "Gemini API Key is not configured. OCR functionality is disabled."
            : "Failed to analyze receipt. Please try a clearer image or enter details manually.";
        throw new Error(errorMessage);
    }
};
