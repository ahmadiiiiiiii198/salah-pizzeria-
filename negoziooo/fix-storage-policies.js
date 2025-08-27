/**
 * Fix Storage Policies for Logo Upload
 * This script fixes the RLS policies for storage.objects to allow logo uploads
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = 'https://htdgoceqepvrffblfvns.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment variables');
  console.log('Please add your service role key to .env file as SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixStoragePolicies() {
  console.log('🔧 Starting storage policies fix...');

  try {
    // First, let's check current policies
    console.log('📋 Checking current storage policies...');
    
    const { data: currentPolicies, error: policiesError } = await supabase
      .rpc('get_storage_policies');
    
    if (policiesError) {
      console.log('⚠️ Could not fetch current policies:', policiesError.message);
    } else {
      console.log('📋 Current policies:', currentPolicies);
    }

    // Enable RLS on storage.objects
    console.log('🔒 Enabling RLS on storage.objects...');
    const { error: rlsError } = await supabase.rpc('sql', {
      query: 'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;'
    });

    if (rlsError && !rlsError.message.includes('already enabled')) {
      console.log('⚠️ RLS enable warning:', rlsError.message);
    } else {
      console.log('✅ RLS enabled on storage.objects');
    }

    // Create storage policies
    console.log('📝 Creating storage policies...');
    
    const policies = [
      {
        name: 'Allow public uploads to image buckets',
        operation: 'INSERT',
        sql: `CREATE POLICY "Allow public uploads to image buckets" ON storage.objects
          FOR INSERT 
          WITH CHECK (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));`
      },
      {
        name: 'Allow public reads from image buckets',
        operation: 'SELECT',
        sql: `CREATE POLICY "Allow public reads from image buckets" ON storage.objects
          FOR SELECT 
          USING (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));`
      },
      {
        name: 'Allow public updates to image buckets',
        operation: 'UPDATE',
        sql: `CREATE POLICY "Allow public updates to image buckets" ON storage.objects
          FOR UPDATE 
          USING (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'))
          WITH CHECK (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));`
      },
      {
        name: 'Allow public deletes from image buckets',
        operation: 'DELETE',
        sql: `CREATE POLICY "Allow public deletes from image buckets" ON storage.objects
          FOR DELETE 
          USING (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));`
      }
    ];

    for (const policy of policies) {
      try {
        // Drop existing policy first
        const dropSql = `DROP POLICY IF EXISTS "${policy.name}" ON storage.objects;`;
        await supabase.rpc('sql', { query: dropSql });
        
        // Create new policy
        const { error: policyError } = await supabase.rpc('sql', { query: policy.sql });
        
        if (policyError) {
          console.log(`⚠️ Policy "${policy.name}" error:`, policyError.message);
        } else {
          console.log(`✅ Created policy: ${policy.name}`);
        }
      } catch (error) {
        console.log(`❌ Failed to create policy "${policy.name}":`, error.message);
      }
    }

    // Test upload functionality
    console.log('🧪 Testing upload functionality...');
    
    // Create a simple test file
    const testFile = new File(['test'], 'test-logo.txt', { type: 'text/plain' });
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload('logos/test-upload.txt', testFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.log('❌ Upload test failed:', uploadError.message);
      console.log('This indicates storage policies still need manual configuration in Supabase dashboard');
    } else {
      console.log('✅ Upload test successful!');
      
      // Clean up test file
      await supabase.storage
        .from('uploads')
        .remove(['logos/test-upload.txt']);
    }

    console.log('\n🎉 Storage policies fix completed!');
    console.log('\nIf upload still fails, please:');
    console.log('1. Go to Supabase Dashboard > Storage > Policies');
    console.log('2. Manually create policies for storage.objects table');
    console.log('3. Allow public INSERT, SELECT, UPDATE, DELETE for buckets: uploads, admin-uploads, gallery, specialties');

  } catch (error) {
    console.error('❌ Error fixing storage policies:', error);
  }
}

// Run the fix
fixStoragePolicies();
