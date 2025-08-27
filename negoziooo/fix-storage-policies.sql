-- Fix Storage Policies for Logo Upload
-- Run this SQL in Supabase Dashboard > SQL Editor

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow public uploads to image buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from image buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to image buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from image buckets" ON storage.objects;

-- Create comprehensive storage policies for our buckets
CREATE POLICY "Allow public uploads to image buckets" ON storage.objects
  FOR INSERT 
  WITH CHECK (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));

CREATE POLICY "Allow public reads from image buckets" ON storage.objects
  FOR SELECT 
  USING (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));

CREATE POLICY "Allow public updates to image buckets" ON storage.objects
  FOR UPDATE 
  USING (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'))
  WITH CHECK (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));

CREATE POLICY "Allow public deletes from image buckets" ON storage.objects
  FOR DELETE 
  USING (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
