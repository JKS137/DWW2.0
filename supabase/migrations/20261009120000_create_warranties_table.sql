-- Digital Warranty Vault: create the core warranties table.
-- Safe to run more than once; preserves any existing rows.
create table if not exists public.warranties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_name text not null,
  purchase_date date not null,
  warranty_duration integer not null default 0 check (warranty_duration >= 0),
  expiry_date date not null,
  file_url text not null,
  ocr_raw text,
  created_at timestamptz not null default now(),
  category text check (category is null or category in ('phone', 'appliance', 'car', 'other'))
);

create index if not exists warranties_user_id_idx on public.warranties(user_id);
create index if not exists warranties_expiry_date_idx on public.warranties(expiry_date);

alter table public.warranties enable row level security;

drop policy if exists "Users can view their own warranties" on public.warranties;
create policy "Users can view their own warranties"
  on public.warranties for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own warranties" on public.warranties;
create policy "Users can insert their own warranties"
  on public.warranties for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own warranties" on public.warranties;
create policy "Users can update their own warranties"
  on public.warranties for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own warranties" on public.warranties;
create policy "Users can delete their own warranties"
  on public.warranties for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.warranties to authenticated;

notify pgrst, 'reload schema';
