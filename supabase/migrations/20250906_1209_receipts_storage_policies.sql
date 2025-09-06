-- receipts bucket storage policies
-- This script is idempotent: it drops policies if they already exist, then recreates them.
-- Schema: storage.objects

begin;

-- Ensure RLS is enabled (it usually is by default for storage.objects)
alter table storage.objects enable row level security;

-- Public read (useful when the bucket is marked Public, or if you want anonymous reads via RLS)
drop policy if exists "public read receipts" on storage.objects;
create policy "public read receipts"
  on storage.objects for select
  using (bucket_id = 'receipts');

-- Allow authenticated users to upload to this bucket
drop policy if exists "users can upload to receipts" on storage.objects;
create policy "users can upload to receipts"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'receipts');

-- Allow authenticated users to update their own files (owner is set automatically by Supabase on insert)
drop policy if exists "users can update own files in receipts" on storage.objects;
create policy "users can update own files in receipts"
  on storage.objects for update to authenticated
  using (bucket_id = 'receipts' and owner = auth.uid())
  with check (bucket_id = 'receipts' and owner = auth.uid());

-- Allow authenticated users to delete their own files
drop policy if exists "users can delete own files in receipts" on storage.objects;
create policy "users can delete own files in receipts"
  on storage.objects for delete to authenticated
  using (bucket_id = 'receipts' and owner = auth.uid());

commit;

