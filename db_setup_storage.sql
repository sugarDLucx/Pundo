-- Run this script in your Supabase SQL Editor to enable Avatar uploads

-- 1. Create a new storage bucket for avatars
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true);

-- 2. Setup Security Policies (RLS) for the storage bucket

-- Allow anyone to view avatars (public read access)
create policy "Avatar images are publicly accessible."
on storage.objects for select
using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload their own avatars
create policy "Users can upload an avatar."
on storage.objects for insert
with check ( bucket_id = 'avatars' and auth.uid() = owner );

-- Allow users to update their own avatars
create policy "Users can update their own avatar."
on storage.objects for update
using ( auth.uid() = owner );

-- Allow users to delete their own avatars
create policy "Users can delete their own avatar."
on storage.objects for delete
using ( auth.uid() = owner );

-- 3. Add avatar_url column to profiles table if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
