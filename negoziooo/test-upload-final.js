/**
 * Final Upload Test
 * Test if storage policies are working with correct client config
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://htdgoceqepvrffblfvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  console.log('🧪 Testing upload with new storage policies...');

  try {
    // Create a minimal test PNG file (1x1 pixel)
    const pngData = new Uint8Array([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
      0x49, 0x48, 0x44, 0x52, // IHDR
      0x00, 0x00, 0x00, 0x01, // width: 1
      0x00, 0x00, 0x00, 0x01, // height: 1
      0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
      0x90, 0x77, 0x53, 0xDE, // CRC
      0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
      0x49, 0x44, 0x41, 0x54, // IDAT
      0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
      0xE2, 0x21, 0xBC, 0x33, // IDAT data + CRC
      0x00, 0x00, 0x00, 0x00, // IEND chunk length
      0x49, 0x45, 0x4E, 0x44, // IEND
      0xAE, 0x42, 0x60, 0x82  // IEND CRC
    ]);

    const testFile = new File([pngData], 'test-logo.png', { type: 'image/png' });
    
    console.log('📤 Attempting upload to uploads bucket...');
    
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload('logos/test-policy-fix.png', testFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.log('❌ Upload failed:', error.message);
      console.log('Error details:', error);
      return false;
    } else {
      console.log('✅ Upload successful!');
      console.log('Upload data:', data);
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl('logos/test-policy-fix.png');
      
      console.log('✅ Public URL:', urlData.publicUrl);
      
      // Clean up
      console.log('🧹 Cleaning up test file...');
      await supabase.storage
        .from('uploads')
        .remove(['logos/test-policy-fix.png']);
      
      console.log('🎉 SUCCESS! Storage policies are working correctly!');
      console.log('🍕 Logo upload should now work in the admin panel!');
      return true;
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

testUpload();
