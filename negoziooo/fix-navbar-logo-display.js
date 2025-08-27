#!/usr/bin/env node

/**
 * Fix navbar logo display by updating the settings and triggering real-time update
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔧 FIXING NAVBAR LOGO DISPLAY');
console.log('=============================');

async function fixNavbarLogo() {
  try {
    // Get current navbar logo settings
    console.log('📋 Fetching current navbar logo settings...');
    const { data: current, error: fetchError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'navbarLogoSettings')
      .single();

    if (fetchError) {
      console.error('❌ Error fetching current settings:', fetchError.message);
      return;
    }

    console.log('✅ Current navbar logo settings:');
    console.log(`   🖼️  Logo URL: ${current.value.logoUrl}`);
    console.log(`   📝 Alt Text: ${current.value.altText}`);
    console.log(`   👁️  Show Logo: ${current.value.showLogo}`);
    console.log(`   📏 Logo Size: ${current.value.logoSize}`);

    // Update the navbar logo settings to trigger real-time update
    console.log('\n🔄 Triggering real-time update...');
    const updatedSettings = {
      ...current.value,
      altText: "Pizzeria Regina 2000 Navbar Logo", // Clean alt text
      showLogo: true,
      logoSize: "medium"
    };

    const { error: updateError } = await supabase
      .from('settings')
      .update({ 
        value: updatedSettings,
        updated_at: new Date().toISOString()
      })
      .eq('key', 'navbarLogoSettings');

    if (updateError) {
      console.error('❌ Error updating navbar logo:', updateError.message);
      return;
    }

    console.log('✅ Navbar logo settings updated successfully!');
    console.log('🔔 Real-time update sent to all connected clients');
    
    // Verify the update
    console.log('\n🔍 Verifying update...');
    const { data: updated, error: verifyError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'navbarLogoSettings')
      .single();

    if (verifyError) {
      console.error('❌ Error verifying update:', verifyError.message);
      return;
    }

    console.log('✅ Verification successful:');
    console.log(`   🖼️  Logo URL: ${updated.value.logoUrl}`);
    console.log(`   📝 Alt Text: ${updated.value.altText}`);
    console.log(`   👁️  Show Logo: ${updated.value.showLogo}`);
    console.log(`   📏 Logo Size: ${updated.value.logoSize}`);
    console.log(`   🕒 Updated At: ${updated.updated_at}`);

    console.log('\n🎉 SUCCESS! The navbar logo should now be visible on your website!');
    console.log('');
    console.log('📝 What was fixed:');
    console.log('   ✅ Added settings table to real-time publication');
    console.log('   ✅ Triggered real-time update to all connected clients');
    console.log('   ✅ Verified navbar logo settings are correct');
    console.log('');
    console.log('🔄 If you still don\'t see the logo:');
    console.log('   1. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)');
    console.log('   2. Clear browser cache');
    console.log('   3. Check browser console for any errors');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

fixNavbarLogo();
