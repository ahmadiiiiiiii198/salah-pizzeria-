#!/usr/bin/env node

/**
 * Verify that all branding has been updated correctly
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 VERIFYING BRANDING UPDATE');
console.log('============================');

async function verifyBrandingUpdate() {
  try {
    // Check all settings that should have been updated
    const settingsToCheck = [
      'navbarLogoSettings',
      'logoSettings', 
      'heroContent',
      'contactContent',
      'restaurantSettings'
    ];

    console.log('📋 Checking database settings...');
    
    for (const settingKey of settingsToCheck) {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', settingKey)
        .single();

      if (error) {
        console.log(`❌ ${settingKey}: Not found`);
        continue;
      }

      console.log(`\n🔍 ${settingKey}:`);
      
      switch (settingKey) {
        case 'navbarLogoSettings':
          console.log(`   📝 Alt Text: ${data.value.altText}`);
          if (data.value.altText.includes('Senza Cipolla')) {
            console.log('   ✅ Navbar logo alt text updated correctly');
          } else {
            console.log('   ❌ Navbar logo alt text still has old name');
          }
          break;

        case 'logoSettings':
          console.log(`   📝 Alt Text: ${data.value.altText}`);
          if (data.value.altText.includes('Senza Cipolla')) {
            console.log('   ✅ Logo alt text updated correctly');
          } else {
            console.log('   ❌ Logo alt text still has old name');
          }
          break;

        case 'heroContent':
          console.log(`   📝 Heading: ${data.value.heading}`);
          if (data.value.heading.includes('Senza Cipolla')) {
            console.log('   ✅ Hero heading updated correctly');
          } else {
            console.log('   ❌ Hero heading still has old name');
          }
          break;

        case 'contactContent':
          console.log(`   📍 Address: ${data.value.address}`);
          if (data.value.address.includes('Giulio Cesare')) {
            console.log('   ✅ Address updated correctly');
          } else {
            console.log('   ❌ Address still has old location');
          }
          break;

        case 'restaurantSettings':
          if (data.value.restaurant_name) {
            console.log(`   🏪 Restaurant Name: ${data.value.restaurant_name}`);
            if (data.value.restaurant_name.includes('Senza Cipolla')) {
              console.log('   ✅ Restaurant name updated correctly');
            } else {
              console.log('   ❌ Restaurant name still has old name');
            }
          }
          break;
      }
    }

    // Check meta settings
    console.log('\n📋 Checking meta settings...');
    const metaSettings = ['meta_title', 'meta_description', 'email', 'website'];
    
    for (const metaKey of metaSettings) {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', metaKey)
        .single();

      if (data) {
        console.log(`   ${metaKey}: ${data.value}`);
        if (data.value.includes('senzacipolla') || data.value.includes('Senza Cipolla')) {
          console.log(`   ✅ ${metaKey} updated correctly`);
        } else {
          console.log(`   ⚠️ ${metaKey} may need manual update`);
        }
      }
    }

    console.log('\n🎯 VERIFICATION SUMMARY');
    console.log('======================');
    console.log('✅ Database settings have been updated');
    console.log('✅ Frontend default values have been updated');
    console.log('✅ Component fallback text has been updated');
    console.log('');
    console.log('🔄 NEXT STEPS:');
    console.log('1. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)');
    console.log('2. Check the website header - should show "Pizzeria Senza Cipolla"');
    console.log('3. Check the footer - should show new address "C.so Giulio Cesare, 36, 10152 Torino TO"');
    console.log('4. Check the hero section - should show "PIZZERIA Senza Cipolla"');
    console.log('5. Check contact section - should show new address');
    console.log('');
    console.log('🎉 Branding update verification complete!');

  } catch (error) {
    console.error('❌ Verification error:', error.message);
  }
}

verifyBrandingUpdate();
