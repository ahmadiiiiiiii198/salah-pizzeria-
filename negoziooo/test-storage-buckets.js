#!/usr/bin/env node

/**
 * Test Storage Buckets Configuration
 * This script verifies that all required storage buckets exist and are properly configured
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yliofvqfyimlbxjmsuow.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🧪 TESTING STORAGE BUCKETS CONFIGURATION');
console.log('=========================================');

async function testStorageBuckets() {
  try {
    // List all buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return;
    }
    
    console.log('📋 Available buckets:', buckets?.map(b => b.name) || []);
    
    // Required buckets for the application
    const requiredBuckets = ['uploads', 'admin-uploads', 'gallery', 'specialties'];
    
    console.log('\n🔍 Checking required buckets:');
    
    let allBucketsExist = true;
    
    for (const bucketName of requiredBuckets) {
      const bucket = buckets?.find(b => b.name === bucketName);
      
      if (bucket) {
        console.log(`✅ ${bucketName}: Public=${bucket.public}, Size Limit=${bucket.file_size_limit ? Math.round(bucket.file_size_limit / 1024 / 1024) + 'MB' : 'Unlimited'}`);
      } else {
        console.log(`❌ ${bucketName}: NOT FOUND`);
        allBucketsExist = false;
      }
    }
    
    if (!allBucketsExist) {
      console.log('\n⚠️  MISSING BUCKETS DETECTED');
      console.log('Please create the missing buckets in your Supabase dashboard:');
      console.log('1. Go to: https://supabase.com/dashboard/project/yliofvqfyimlbxjmsuow/storage/buckets');
      console.log('2. Create the missing buckets with these settings:');
      console.log('   - Public: Yes');
      console.log('   - File size limit: 50MB (or unlimited)');
      console.log('   - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp, image/svg+xml');
      return;
    }
    
    console.log('\n🧪 Testing upload functionality...');
    
    // Create a small test image
    const testImageData = new Uint8Array([
      137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 144, 119, 83, 222, 0, 0, 0, 12, 73, 68, 65, 84, 8, 215, 99, 248, 15, 0, 0, 1, 0, 1, 0, 24, 221, 141, 219, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130
    ]);
    
    const testFile = new File([testImageData], 'test.png', { type: 'image/png' });
    
    // Test upload to each bucket
    for (const bucketName of requiredBuckets) {
      const bucket = buckets?.find(b => b.name === bucketName);
      
      if (!bucket) {
        console.log(`⏭️  Skipping ${bucketName} - bucket not found`);
        continue;
      }
      
      try {
        const filePath = `test/test-${Date.now()}.png`;
        
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, testFile);
        
        if (uploadError) {
          console.log(`❌ ${bucketName}: Upload failed - ${uploadError.message}`);
        } else {
          console.log(`✅ ${bucketName}: Upload successful`);
          
          // Clean up test file
          await supabase.storage
            .from(bucketName)
            .remove([filePath]);
        }
      } catch (error) {
        console.log(`❌ ${bucketName}: Upload error - ${error.message}`);
      }
    }
    
    console.log('\n🎯 SUMMARY:');
    if (allBucketsExist) {
      console.log('✅ All required storage buckets are configured');
      console.log('✅ Image upload should work in the "Perché Sceglierci" section');
    } else {
      console.log('❌ Some storage buckets are missing');
      console.log('❌ Image upload will fail until buckets are created');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
testStorageBuckets().catch(console.error);
