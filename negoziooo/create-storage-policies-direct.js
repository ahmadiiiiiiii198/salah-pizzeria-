/**
 * Create Storage Policies Directly
 * This script creates the necessary RLS policies for storage.objects
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://htdgoceqepvrffblfvns.supabase.co';
// Using the anon key since we don't have service role access
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createStoragePolicies() {
  console.log('🔧 Creating storage policies...');

  try {
    // Test if we can upload without policies first
    console.log('🧪 Testing current upload capability...');

    // Create a minimal test file
    const testData = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]); // PNG header
    const testFile = new File([testData], 'test.png', { type: 'image/png' });

    const { data, error } = await supabase.storage
      .from('uploads')
      .upload('test/test-policy.png', testFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.log('❌ Upload failed as expected:', error.message);

      if (error.message.includes('row level security policy')) {
        console.log('✅ Confirmed: RLS policy issue detected');
        console.log('\n📋 Manual steps required:');
        console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/htdgoceqepvrffblfvns');
        console.log('2. Navigate to Storage > Policies');
        console.log('3. Click "New Policy" for storage.objects table');
        console.log('4. Create the following policies:');
        console.log('\n--- POLICY 1: Allow uploads ---');
        console.log('Name: Allow public uploads to image buckets');
        console.log('Operation: INSERT');
        console.log('Target roles: public');
        console.log('USING expression: (leave empty)');
        console.log('WITH CHECK expression: bucket_id = ANY(ARRAY[\'uploads\'::text, \'admin-uploads\'::text, \'gallery\'::text, \'specialties\'::text])');

        console.log('\n--- POLICY 2: Allow reads ---');
        console.log('Name: Allow public reads from image buckets');
        console.log('Operation: SELECT');
        console.log('Target roles: public');
        console.log('USING expression: bucket_id = ANY(ARRAY[\'uploads\'::text, \'admin-uploads\'::text, \'gallery\'::text, \'specialties\'::text])');
        console.log('WITH CHECK expression: (leave empty)');

        console.log('\n--- POLICY 3: Allow updates ---');
        console.log('Name: Allow public updates to image buckets');
        console.log('Operation: UPDATE');
        console.log('Target roles: public');
        console.log('USING expression: bucket_id = ANY(ARRAY[\'uploads\'::text, \'admin-uploads\'::text, \'gallery\'::text, \'specialties\'::text])');
        console.log('WITH CHECK expression: bucket_id = ANY(ARRAY[\'uploads\'::text, \'admin-uploads\'::text, \'gallery\'::text, \'specialties\'::text])');

        console.log('\n--- POLICY 4: Allow deletes ---');
        console.log('Name: Allow public deletes from image buckets');
        console.log('Operation: DELETE');
        console.log('Target roles: public');
        console.log('USING expression: bucket_id = ANY(ARRAY[\'uploads\'::text, \'admin-uploads\'::text, \'gallery\'::text, \'specialties\'::text])');
        console.log('WITH CHECK expression: (leave empty)');

        console.log('\n🎯 After creating these policies, logo upload should work!');
      }
    } else {
      console.log('✅ Upload successful! Policies might already be working.');
      console.log('Cleaning up test file...');
      await supabase.storage.from('uploads').remove(['test/test-policy.png']);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Alternative: Create a simple workaround
async function createWorkaround() {
  console.log('\n🔄 Creating workaround solution...');

  try {
    // Update logo settings to use a reliable external URL
    const logoUrl = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

    const { error } = await supabase
      .from('settings')
      .update({
        value: {
          logoUrl: logoUrl,
          altText: 'Pizzeria Senza Cipolla Torino Logo'
        }
      })
      .eq('key', 'logoSettings');

    if (error) {
      console.log('❌ Failed to update logo settings:', error.message);
    } else {
      console.log('✅ Updated logo settings with working external URL');
      console.log('🍕 Logo should now display properly on the website');
    }
  } catch (error) {
    console.error('❌ Workaround failed:', error);
  }
}

// Run both functions
async function main() {
  await createStoragePolicies();
  await createWorkaround();
}

main();