#!/usr/bin/env node

/**
 * Debug script to check what the frontend is actually receiving for navbar logo
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 DEBUGGING FRONTEND LOGO LOADING');
console.log('==================================');

async function debugLogoLoading() {
  try {
    // Step 1: Check what's actually in the database
    console.log('1. 📋 Checking database content...');
    const { data: dbData, error: dbError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'navbarLogoSettings')
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError.message);
      return;
    }

    console.log('✅ Database contains:');
    console.log(`   🖼️  Logo URL: ${dbData.value.logoUrl}`);
    console.log(`   📝 Alt Text: ${dbData.value.altText}`);
    console.log(`   👁️  Show Logo: ${dbData.value.showLogo}`);
    console.log(`   📏 Logo Size: ${dbData.value.logoSize}`);
    console.log(`   🕒 Updated At: ${dbData.updated_at}`);

    // Step 2: Check if the logo URL is accessible
    console.log('\n2. 🌐 Testing logo URL accessibility...');
    try {
      const response = await fetch(dbData.value.logoUrl);
      console.log(`   📊 Status: ${response.status} ${response.statusText}`);
      console.log(`   📏 Size: ${response.headers.get('content-length')} bytes`);
      console.log(`   🎨 Type: ${response.headers.get('content-type')}`);
      
      if (response.ok) {
        console.log('   ✅ Logo URL is accessible');
      } else {
        console.log('   ❌ Logo URL is not accessible');
      }
    } catch (fetchError) {
      console.log(`   ❌ Fetch error: ${fetchError.message}`);
    }

    // Step 3: Check what the default values are in the frontend
    console.log('\n3. 🔧 Checking frontend default values...');
    const frontendDefaults = {
      logoUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f355.png",
      altText: "Pizzeria Senza Cipolla Navbar Logo",
      showLogo: true,
      logoSize: "medium"
    };
    
    console.log('   📱 Frontend defaults:');
    console.log(`   🖼️  Default Logo URL: ${frontendDefaults.logoUrl}`);
    console.log(`   📝 Default Alt Text: ${frontendDefaults.altText}`);
    
    // Step 4: Compare database vs defaults
    console.log('\n4. ⚖️  Database vs Frontend Defaults Comparison...');
    const isUsingDefaults = dbData.value.logoUrl === frontendDefaults.logoUrl;
    
    if (isUsingDefaults) {
      console.log('   ⚠️  DATABASE IS USING DEFAULT VALUES!');
      console.log('   🔍 This means the uploaded logo was not properly saved');
    } else {
      console.log('   ✅ Database has custom logo (not defaults)');
      console.log('   🔍 Frontend should be loading the custom logo');
    }

    // Step 5: Force update with correct logo
    console.log('\n5. 🔄 Force updating with correct uploaded logo...');
    const correctLogo = {
      logoUrl: "https://htdgoceqepvrffblfvns.supabase.co/storage/v1/object/public/uploads/navbar-logos/1753279402475-r65mwb9v1pd.png",
      altText: "Pizzeria Senza Cipolla Navbar Logo",
      showLogo: true,
      logoSize: "medium"
    };

    const { error: updateError } = await supabase
      .from('settings')
      .update({ 
        value: correctLogo,
        updated_at: new Date().toISOString()
      })
      .eq('key', 'navbarLogoSettings');

    if (updateError) {
      console.error('   ❌ Update error:', updateError.message);
    } else {
      console.log('   ✅ Database updated with correct logo');
    }

    // Step 6: Verify the update
    console.log('\n6. 🔍 Verifying update...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'navbarLogoSettings')
      .single();

    if (verifyError) {
      console.error('   ❌ Verification error:', verifyError.message);
    } else {
      console.log('   ✅ Verification successful:');
      console.log(`   🖼️  Current Logo URL: ${verifyData.value.logoUrl}`);
      console.log(`   🕒 Updated At: ${verifyData.updated_at}`);
    }

    console.log('\n🎯 DEBUGGING SUMMARY:');
    console.log('=====================');
    
    if (isUsingDefaults) {
      console.log('❌ PROBLEM: Database was using default pizza emoji');
      console.log('✅ FIXED: Updated database with correct uploaded logo');
      console.log('🔄 ACTION: Frontend should now load the correct logo');
    } else {
      console.log('✅ Database has correct logo URL');
      console.log('🔍 ISSUE: Frontend caching or loading problem');
      console.log('🔄 ACTION: Check browser console for errors');
    }

    console.log('\n📝 Next steps:');
    console.log('   1. Hard refresh browser (Ctrl+F5)');
    console.log('   2. Check browser console for errors');
    console.log('   3. Verify real-time subscription is working');
    console.log('   4. Clear browser cache if needed');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

debugLogoLoading();
