
-- USERS (Supabase Auth handles authentication)
-- Extend with profile details
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text default 'user', -- could be 'user', 'admin'
  created_at timestamp default now()
);

-- SUBSCRIPTIONS
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  plan text not null, -- 'free', 'starter', 'pro'
  billing_cycle text default 'monthly', -- 'monthly', 'yearly'
  status text default 'active', -- 'active', 'expired', 'canceled'
  start_date timestamp default now(),
  end_date timestamp
);

-- DEVICES (multi-device sync)
create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  device_name text not null,
  device_type text, -- 'mobile', 'tablet', 'desktop'
  created_at timestamp default now()
);

-- FAMILY MEMBERS (sharing warranties)
create table if not exists family_members (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  member_email text not null,
  status text default 'pending', -- 'pending', 'accepted'
  invited_at timestamp default now()
);

-- WARRANTIES
create table if not exists warranties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  device_id uuid references devices(id),
  product_name text not null,
  purchase_date date,
  expiry_date date,
  store_name text,
  receipt_url text, -- stored receipt (Supabase storage)
  notes text,
  tags text[], -- e.g. ['electronics','laptop']
  created_at timestamp default now()
);

-- WARRANTY OCR EXTRACTION
create table if not exists warranty_ocr (
  id uuid primary key default gen_random_uuid(),
  warranty_id uuid references warranties(id) on delete cascade,
  extracted_text text,
  confidence float,
  created_at timestamp default now()
);

-- PAYMENTS (for international/PKR gateways)
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  subscription_id uuid references subscriptions(id),
  amount numeric(10,2) not null,
  currency text not null, -- 'USD', 'PKR'
  provider text, -- 'stripe', 'jazzcash'
  status text default 'pending', -- 'pending', 'paid', 'failed'
  created_at timestamp default now()
);

-- INVOICES
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references payments(id) on delete cascade,
  invoice_url text,
  issued_at timestamp default now()
);

-- NOTIFICATIONS (expiry alerts, reminders)
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text, -- 'expiry_reminder', 'payment_success', etc.
  message text,
  read boolean default false,
  created_at timestamp default now()
);

-- AUDIT LOGS (optional, for security)
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  action text,
  metadata jsonb,
  created_at timestamp default now()
);
