# Storage Policies Setup Guide

## Problem
The logo upload is failing with "row level security policy" error because the storage.objects table needs proper RLS policies configured.

## Solution: Manual Setup in Supabase Dashboard

### Step 1: Access Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/htdgoceqepvrffblfvns
2. Navigate to **Storage** > **Policies**

### Step 2: Create Storage Policies
In the SQL Editor, run the following commands:

```sql
-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy for INSERT (uploads)
CREATE POLICY "Allow public uploads to image buckets" ON storage.objects
  FOR INSERT 
  WITH CHECK (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));

-- Create policy for SELECT (reading files)
CREATE POLICY "Allow public reads from image buckets" ON storage.objects
  FOR SELECT 
  USING (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));

-- Create policy for UPDATE (updating files)
CREATE POLICY "Allow public updates to image buckets" ON storage.objects
  FOR UPDATE 
  USING (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'))
  WITH CHECK (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));

-- Create policy for DELETE (deleting files)
CREATE POLICY "Allow public deletes from image buckets" ON storage.objects
  FOR DELETE 
  USING (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));
```

### Step 3: Verify Policies
Run this query to verify the policies were created:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
```

### Step 4: Test Upload
After creating the policies, try uploading a logo again in the admin panel.

## Alternative: Use External Image URLs
As a temporary workaround, you can:

1. Upload your logo to an external service (like Imgur, Cloudinary, or any image hosting)
2. Copy the public URL
3. In the logo editor, manually enter the URL in the "Logo URL" field
4. Save the settings

## Current Status
- ✅ Storage buckets exist and are configured
- ✅ Logo settings table is working
- ❌ Storage policies need manual setup
- ✅ Temporary logo URL has been set

## Files Created for Debugging
- `fix-storage-policies.sql` - SQL commands to run manually
- `test-logo-upload.js` - Test script to verify upload functionality
- `fix-storage-policies.js` - Automated fix script (requires service role key)

## Next Steps
1. Run the SQL commands in Supabase Dashboard
2. Test logo upload functionality
3. If still having issues, use external image URLs as workaround
