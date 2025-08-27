# 🚨 URGENT: Storage Policies Fix for Logo Upload

## Current Status
- ✅ Logo display is now working with external URL
- ❌ File upload still fails due to missing RLS policies
- ⚠️ Manual intervention required

## Immediate Solution Required

### Step 1: Access Supabase Dashboard
**You MUST do this manually:**

1. Open your browser and go to: `https://supabase.com/dashboard/project/htdgoceqepvrffblfvns`
2. Login to your Supabase account
3. Navigate to **Storage** → **Policies**

### Step 2: Create Storage Policies
Click **"New Policy"** and create these 4 policies for the `storage.objects` table:

#### Policy 1: Allow Uploads
- **Name**: `Allow public uploads to image buckets`
- **Operation**: `INSERT`
- **Target roles**: `public`
- **USING expression**: (leave empty)
- **WITH CHECK expression**: 
  ```sql
  bucket_id = ANY(ARRAY['uploads'::text, 'admin-uploads'::text, 'gallery'::text, 'specialties'::text])
  ```

#### Policy 2: Allow Reads
- **Name**: `Allow public reads from image buckets`
- **Operation**: `SELECT`
- **Target roles**: `public`
- **USING expression**: 
  ```sql
  bucket_id = ANY(ARRAY['uploads'::text, 'admin-uploads'::text, 'gallery'::text, 'specialties'::text])
  ```
- **WITH CHECK expression**: (leave empty)

#### Policy 3: Allow Updates
- **Name**: `Allow public updates to image buckets`
- **Operation**: `UPDATE`
- **Target roles**: `public`
- **USING expression**: 
  ```sql
  bucket_id = ANY(ARRAY['uploads'::text, 'admin-uploads'::text, 'gallery'::text, 'specialties'::text])
  ```
- **WITH CHECK expression**: 
  ```sql
  bucket_id = ANY(ARRAY['uploads'::text, 'admin-uploads'::text, 'gallery'::text, 'specialties'::text])
  ```

#### Policy 4: Allow Deletes
- **Name**: `Allow public deletes from image buckets`
- **Operation**: `DELETE`
- **Target roles**: `public`
- **USING expression**: 
  ```sql
  bucket_id = ANY(ARRAY['uploads'::text, 'admin-uploads'::text, 'gallery'::text, 'specialties'::text])
  ```
- **WITH CHECK expression**: (leave empty)

### Step 3: Alternative SQL Method
If the UI doesn't work, go to **SQL Editor** and run:

```sql
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create all policies at once
CREATE POLICY "Allow public uploads to image buckets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = ANY(ARRAY['uploads'::text, 'admin-uploads'::text, 'gallery'::text, 'specialties'::text]));

CREATE POLICY "Allow public reads from image buckets" ON storage.objects
  FOR SELECT USING (bucket_id = ANY(ARRAY['uploads'::text, 'admin-uploads'::text, 'gallery'::text, 'specialties'::text]));

CREATE POLICY "Allow public updates to image buckets" ON storage.objects
  FOR UPDATE USING (bucket_id = ANY(ARRAY['uploads'::text, 'admin-uploads'::text, 'gallery'::text, 'specialties'::text]))
  WITH CHECK (bucket_id = ANY(ARRAY['uploads'::text, 'admin-uploads'::text, 'gallery'::text, 'specialties'::text]));

CREATE POLICY "Allow public deletes from image buckets" ON storage.objects
  FOR DELETE USING (bucket_id = ANY(ARRAY['uploads'::text, 'admin-uploads'::text, 'gallery'::text, 'specialties'::text]));
```

### Step 4: Test Upload
After creating the policies:
1. Go back to your admin panel
2. Try uploading a logo again
3. It should work without the "row level security policy" error

## Current Workaround
- Logo is now displaying using an external URL
- You can still use the URL input field to change logos
- File upload will work once policies are created

## Files to Help You
- `create-storage-policies-direct.js` - Diagnostic script
- `fix-storage-policies.sql` - SQL commands to copy/paste
- This guide - Step-by-step instructions

## Why This Happened
Supabase storage requires explicit RLS policies for security. These policies define who can upload, read, update, and delete files. Without them, all operations are blocked by default.

## After Fix
Once policies are created, you'll be able to:
- ✅ Upload logo files directly
- ✅ Upload gallery images
- ✅ Upload hero background images
- ✅ All admin panel image uploads will work
