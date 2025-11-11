export const categories = ['phone', 'appliance', 'car', 'other'] as const;
export type Category = (typeof categories)[number];

export interface Warranty {
  id: string;
  user_id: string;
  product_name: string;
  purchase_date: string;
  warranty_duration: number; // in months
  expiry_date: string;
  file_url: string;
  ocr_raw: string | null;
  created_at: string;
  category: Category | null;
}

export interface OcrData {
  productName: string;
  purchaseDate: string; // YYYY-MM-DD
  warrantyLengthInMonths: number | null;
}