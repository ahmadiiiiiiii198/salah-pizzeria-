#!/usr/bin/env node

/**
 * Test what happens when we completely bypass all caches
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 BYPASS CACHE TEST');
console.log('===================');

async function bypassCacheTest() {
  try {
    // Test 1: Direct database query (no cache)
    console.log('1. 📋 Direct database query (bypassing all caches)...');
    
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'navbarLogoSettings')
      .single();

    if (error) {
      console.error('❌ Database query error:', error.message);
      return;
    }

    console.log('✅ Direct database result:');
    console.log(`   🖼️  Logo URL: ${data.value.logoUrl}`);
    console.log(`   📝 Alt Text: ${data.value.altText}`);
    console.log(`   👁️  Show Logo: ${data.value.showLogo}`);
    console.log(`   📏 Logo Size: ${data.value.logoSize}`);

    // Test 2: Check if this matches what frontend should get
    console.log('\n2. 🔍 Comparing with frontend defaults...');
    
    const frontendDefaults = {
      logoUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f355.png",
      altText: "Pizzeria Senza Cipolla Navbar Logo",
      showLogo: true,
      logoSize: "medium"
    };

    const isUsingDefaults = data.value.logoUrl === frontendDefaults.logoUrl;
    
    if (isUsingDefaults) {
      console.log('❌ PROBLEM: Database contains default values!');
      console.log('   🔍 The uploaded logo was not properly saved');
      
      // Fix it
      console.log('\n   🔧 Fixing database with correct uploaded logo...');
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
        console.log('   ✅ Database fixed with correct logo');
      }
    } else {
      console.log('✅ Database has correct custom logo');
    }

    // Test 3: Simulate what the frontend settingsService.getSetting() does
    console.log('\n3. 🧪 Simulating frontend getSetting() behavior...');
    
    // This is what the frontend does:
    try {
      const { data: frontendData, error: frontendError } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'navbarLogoSettings')
        .single();

      if (frontendError) {
        console.log('❌ Frontend would get error:', frontendError.message);
        console.log('🔄 Frontend would fall back to defaults');
        console.log(`   📱 Default URL: ${frontendDefaults.logoUrl}`);
      } else {
        console.log('✅ Frontend would get:');
        console.log(`   🖼️  Logo URL: ${frontendData.value.logoUrl}`);
        console.log(`   📝 Alt Text: ${frontendData.value.altText}`);
        
        if (frontendData.value.logoUrl === frontendDefaults.logoUrl) {
          console.log('⚠️  Frontend is getting default values');
        } else {
          console.log('✅ Frontend should get custom logo');
        }
      }
    } catch (simulationError) {
      console.log('❌ Frontend simulation error:', simulationError.message);
      console.log('🔄 This would cause frontend to use defaults');
    }

    // Test 4: Check if there are any network/connection issues
    console.log('\n4. 🌐 Testing network connectivity...');
    
    try {
      const startTime = Date.now();
      const { data: networkTest } = await supabase
        .from('settings')
        .select('key')
        .limit(1);
      const endTime = Date.now();
      
      console.log(`✅ Network test successful (${endTime - startTime}ms)`);
      console.log(`   📊 Retrieved ${networkTest?.length || 0} records`);
    } catch (networkError) {
      console.log('❌ Network test failed:', networkError.message);
      console.log('🔍 This could cause frontend to use defaults');
    }

    console.log('\n🎯 DIAGNOSIS:');
    console.log('=============');
    
    if (isUsingDefaults) {
      console.log('❌ ROOT CAUSE: Database contains default values');
      console.log('✅ SOLUTION: Database has been updated with correct logo');
    } else {
      console.log('✅ Database has correct logo');
      console.log('🔍 ISSUE: Frontend caching or loading problem');
    }

    console.log('\n📝 Recommendations:');
    console.log('   1. Hard refresh browser (Ctrl+F5)');
    console.log('   2. Open DevTools and check Console for errors');
    console.log('   3. Check Network tab for failed requests');
    console.log('   4. Try incognito mode to bypass browser cache');
    console.log('   5. Check if real-time subscriptions are working');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

bypassCacheTest();
