import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yliofvqfyimlbxjmsuow.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testGallerySave() {
  console.log('🧪 Testing Gallery Save Functionality...\n');

  try {
    // Test 1: Check authentication (skip for now since RLS is disabled)
    console.log('1. 🔐 Testing authentication...');
    console.log('   RLS disabled - authentication not required for testing');

    // Test 2: Check table structure
    console.log('\n2. 📋 Checking gallery_images table structure...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'gallery_images')
      .order('ordinal_position');

    if (columnsError) {
      console.log('❌ Error checking table structure:', columnsError.message);
    } else {
      console.log('✅ Table structure:');
      columns.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(required)' : '(optional)'}`);
      });
    }

    // Test 3: Try a simple insert
    console.log('\n3. 💾 Testing simple insert...');
    const testRecord = {
      title: 'Test Gallery Image',
      description: 'Test description',
      image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'main',
      sort_order: 1,
      is_active: true
    };

    const { data: insertData, error: insertError } = await supabase
      .from('gallery_images')
      .insert([testRecord])
      .select();

    if (insertError) {
      console.log('❌ Insert failed:', insertError.message);
      console.log('   Code:', insertError.code);
      console.log('   Details:', insertError.details);
      console.log('   Hint:', insertError.hint);
    } else {
      console.log('✅ Insert successful:', insertData);
      
      // Clean up test record
      const { error: deleteError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', insertData[0].id);
        
      if (deleteError) {
        console.log('⚠️ Warning: Could not clean up test record:', deleteError.message);
      } else {
        console.log('✅ Test record cleaned up');
      }
    }

    // Test 4: Check RLS policies
    console.log('\n4. 🔒 Checking RLS policies...');
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('policyname, cmd, roles, qual')
      .eq('tablename', 'gallery_images');

    if (policiesError) {
      console.log('❌ Error checking policies:', policiesError.message);
    } else {
      console.log('✅ RLS Policies:');
      policies.forEach(policy => {
        console.log(`   - ${policy.policyname}: ${policy.cmd} for ${policy.roles}`);
        console.log(`     Condition: ${policy.qual || 'None'}`);
      });
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

testGallerySave();
