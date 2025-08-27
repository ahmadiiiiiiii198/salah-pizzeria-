/**
 * Test Logo Upload Functionality
 * This script tests if logo upload works and provides debugging info
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://htdgoceqepvrffblfvns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE1MTY4NzMsImV4cCI6MjAzNzA5Mjg3M30.VJBdbaWJBbKzQpUpnhJdVGGBcNhRuQkQOaUhEKLlBQs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogoUpload() {
  console.log('🧪 Testing logo upload functionality...');

  try {
    // Test 1: Check if buckets exist
    console.log('\n📦 Checking storage buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.log('❌ Error fetching buckets:', bucketsError.message);
      return;
    }

    console.log('✅ Available buckets:', buckets.map(b => b.name).join(', '));

    // Test 2: Check uploads bucket specifically
    const uploadsBucket = buckets.find(b => b.name === 'uploads');
    if (!uploadsBucket) {
      console.log('❌ uploads bucket not found!');
      return;
    }

    console.log('✅ uploads bucket found:', {
      public: uploadsBucket.public,
      allowedMimeTypes: uploadsBucket.allowed_mime_types
    });

    // Test 3: Try to list files in uploads bucket
    console.log('\n📁 Testing bucket access...');
    const { data: files, error: listError } = await supabase.storage
      .from('uploads')
      .list('logos', { limit: 1 });

    if (listError) {
      console.log('❌ Error listing files:', listError.message);
    } else {
      console.log('✅ Can list files in uploads/logos');
    }

    // Test 4: Try to upload a simple test file
    console.log('\n⬆️ Testing file upload...');

    // Create a simple test image data (1x1 pixel PNG)
    const testImageData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
      0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33,
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    const testFile = new File([testImageData], 'test-logo.png', { type: 'image/png' });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload('logos/test-upload.png', testFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.log('❌ Upload failed:', uploadError.message);
      console.log('Error details:', uploadError);

      // Provide solutions
      console.log('\n🔧 Possible solutions:');
      console.log('1. Storage policies need to be configured in Supabase Dashboard');
      console.log('2. Go to: https://supabase.com/dashboard/project/htdgoceqepvrffblfvns/storage/policies');
      console.log('3. Create policies for storage.objects table:');
      console.log('   - Allow INSERT for bucket_id IN (\'uploads\', \'admin-uploads\', \'gallery\', \'specialties\')');
      console.log('   - Allow SELECT for bucket_id IN (\'uploads\', \'admin-uploads\', \'gallery\', \'specialties\')');

    } else {
      console.log('✅ Upload successful!');
      console.log('Upload data:', uploadData);

      // Test getting public URL
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl('logos/test-upload.png');

      console.log('✅ Public URL:', urlData.publicUrl);

      // Clean up test file
      await supabase.storage
        .from('uploads')
        .remove(['logos/test-upload.png']);

      console.log('✅ Test file cleaned up');
    }

    // Test 5: Check current logo settings
    console.log('\n⚙️ Checking current logo settings...');
    const { data: logoSettings, error: settingsError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'logoSettings')
      .single();

    if (settingsError) {
      console.log('❌ Error fetching logo settings:', settingsError.message);
    } else {
      console.log('✅ Current logo settings:', logoSettings.value);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testLogoUpload();