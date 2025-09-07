export const categories = ['phone', 'appliance', 'car', 'other'] as const;
export type Category = (typeof categories)[number];

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'starter' | 'pro';
  billing_cycle: 'monthly' | 'yearly';
  status: 'active' | 'expired' | 'canceled';
  start_date: string;
  end_date: string | null;
}

export interface Device {
  id: string;
  user_id: string;
  device_name: string;
  device_type: 'mobile' | 'tablet' | 'desktop' | null;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  owner_id: string;
  member_email: string;
  status: 'pending' | 'accepted';
  invited_at: string;
}

// Updated Warranty interface to match the SQL schema
export interface Warranty {
  id: string;
  user_id: string;
  device_id: string | null;
  product_name: string;
  purchase_date: string | null;
  warranty_duration: number | null; // This was in original types.ts, re-adding.
  expiry_date: string | null;
  store_name: string | null;
  receipt_url: string | null; // Changed from file_url
  notes: string | null;
  tags: string[] | null;
  created_at: string;
  category: Category | null;
}

export interface WarrantyOcr {
  id: string;
  warranty_id: string;
  extracted_text: string | null;
  confidence: number | null;
  created_at: string;
}

export interface SharedWarranty {
  id: string;
  warranty_id: string;
  user_id: string;
  share_token: string;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string | null;
  amount: number;
  currency: string;
  provider: string | null;
  status: 'pending' | 'paid' | 'failed';
  created_at: string;
}

export interface Invoice {
  id: string;
  payment_id: string;
  invoice_url: string | null;
  issued_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string | null;
  message: string | null;
  read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface OcrData {
  productName: string;
  purchaseDate: string;
  warrantyLengthInMonths: number | null;
}