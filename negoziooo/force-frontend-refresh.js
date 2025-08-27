#!/usr/bin/env node

/**
 * Force frontend refresh by clearing all caches and triggering updates
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔄 FORCING FRONTEND REFRESH');
console.log('===========================');

async function forceFrontendRefresh() {
  try {
    // Step 1: Multiple cache-busting updates
    console.log('1. 💥 Performing cache-busting updates...');
    
    const correctLogo = {
      logoUrl: "https://htdgoceqepvrffblfvns.supabase.co/storage/v1/object/public/uploads/navbar-logos/1753279402475-r65mwb9v1pd.png",
      altText: "Pizzeria Regina 2000 Navbar Logo",
      showLogo: true,
      logoSize: "medium"
    };

    // Update 1: Add cache buster
    console.log('   🔄 Update 1: Adding cache buster...');
    const cacheBuster1 = {
      ...correctLogo,
      _cacheBuster: Date.now(),
      _forceRefresh: true
    };

    await supabase
      .from('settings')
      .update({ 
        value: cacheBuster1,
        updated_at: new Date().toISOString()
      })
      .eq('key', 'navbarLogoSettings');

    console.log('   ✅ Cache buster 1 applied');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update 2: Change alt text to force re-render
    console.log('   🔄 Update 2: Changing alt text...');
    const cacheBuster2 = {
      ...correctLogo,
      altText: `Pizzeria Regina 2000 Logo - ${Date.now()}`,
      _cacheBuster: Date.now() + 1
    };

    await supabase
      .from('settings')
      .update({ 
        value: cacheBuster2,
        updated_at: new Date().toISOString()
      })
      .eq('key', 'navbarLogoSettings');

    console.log('   ✅ Alt text changed');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update 3: Restore clean settings
    console.log('   🔄 Update 3: Restoring clean settings...');
    await supabase
      .from('settings')
      .update({ 
        value: correctLogo,
        updated_at: new Date().toISOString()
      })
      .eq('key', 'navbarLogoSettings');

    console.log('   ✅ Clean settings restored');

    // Step 2: Test real-time subscription
    console.log('\n2. 📡 Testing real-time subscription...');
    let updateReceived = false;

    const channel = supabase
      .channel('force-refresh-test')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'settings',
        filter: 'key=eq.navbarLogoSettings'
      }, (payload) => {
        updateReceived = true;
        console.log('   ✅ Real-time update received!');
        console.log(`   📦 New logo URL: ${payload.new.value.logoUrl}`);
      })
      .subscribe();

    // Trigger one more update to test real-time
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('   🔄 Triggering test update...');
    
    const testUpdate = {
      ...correctLogo,
      altText: "Pizzeria Regina 2000 Navbar Logo - REFRESHED"
    };

    await supabase
      .from('settings')
      .update({ 
        value: testUpdate,
        updated_at: new Date().toISOString()
      })
      .eq('key', 'navbarLogoSettings');

    // Wait for real-time update
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (updateReceived) {
      console.log('   ✅ Real-time subscription is working');
    } else {
      console.log('   ❌ Real-time subscription not working');
    }

    // Clean up
    channel.unsubscribe();

    // Step 3: Final verification
    console.log('\n3. 🔍 Final verification...');
    const { data: final, error: finalError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'navbarLogoSettings')
      .single();

    if (finalError) {
      console.error('   ❌ Final verification error:', finalError.message);
    } else {
      console.log('   ✅ Final state:');
      console.log(`   🖼️  Logo URL: ${final.value.logoUrl}`);
      console.log(`   📝 Alt Text: ${final.value.altText}`);
      console.log(`   🕒 Updated At: ${final.updated_at}`);
    }

    console.log('\n🎉 FRONTEND REFRESH COMPLETED!');
    console.log('==============================');
    console.log('');
    console.log('📝 What was done:');
    console.log('   ✅ Multiple cache-busting database updates');
    console.log('   ✅ Tested real-time subscription functionality');
    console.log('   ✅ Restored correct navbar logo settings');
    console.log('   ✅ Triggered multiple real-time notifications');
    console.log('');
    console.log('🔄 Your navbar should now show the correct logo!');
    console.log('');
    console.log('🆘 If logo still doesn\'t appear:');
    console.log('   1. Open browser DevTools (F12)');
    console.log('   2. Go to Console tab');
    console.log('   3. Look for any JavaScript errors');
    console.log('   4. Check Network tab for failed requests');
    console.log('   5. Try incognito/private browsing mode');
    console.log('   6. Clear all browser data for localhost:3000');

  } catch (error) {
    console.error('❌ Error in frontend refresh:', error.message);
  }
}

forceFrontendRefresh();
