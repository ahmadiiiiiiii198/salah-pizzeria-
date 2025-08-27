#!/usr/bin/env node

/**
 * Test script to verify navbar logo real-time updates
 * This will help diagnose why the navbar isn't updating when logo changes
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 TESTING NAVBAR LOGO REAL-TIME UPDATES');
console.log('========================================');
console.log(`📍 Database: ${SUPABASE_URL}`);
console.log('');

let currentNavbarLogo = null;
let updateCount = 0;

async function testNavbarLogoRealtime() {
  console.log('1. 📋 Fetching Current Navbar Logo Settings');
  console.log('-------------------------------------------');

  // Test 1: Fetch current navbar logo settings
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'navbarLogoSettings')
      .single();

    if (error) {
      console.log(`❌ Error fetching navbar logo: ${error.message}`);
      return false;
    }

    currentNavbarLogo = data.value;
    console.log('✅ Current navbar logo settings:');
    console.log(`   🖼️  Logo URL: ${currentNavbarLogo.logoUrl}`);
    console.log(`   📝 Alt Text: ${currentNavbarLogo.altText}`);
    console.log(`   👁️  Show Logo: ${currentNavbarLogo.showLogo}`);
    console.log(`   📏 Logo Size: ${currentNavbarLogo.logoSize}`);
    console.log(`   🕒 Last Updated: ${data.updated_at}`);
  } catch (error) {
    console.log(`❌ Exception fetching navbar logo: ${error.message}`);
    return false;
  }

  console.log('\n2. 🔄 Testing Real-time Subscription');
  console.log('------------------------------------');

  // Test 2: Set up real-time subscription
  const channel = supabase
    .channel('navbar-logo-test-channel')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'settings',
      filter: 'key=eq.navbarLogoSettings'
    }, (payload) => {
      updateCount++;
      console.log(`\n🔔 NAVBAR LOGO UPDATE RECEIVED #${updateCount}`);
      console.log(`⏰ Timestamp: ${new Date().toLocaleString('it-IT')}`);
      console.log('📦 Payload:', {
        eventType: payload.eventType,
        new: payload.new ? 'Updated data received' : 'No new data',
        old: payload.old ? 'Old data available' : 'No old data'
      });
      
      if (payload.new && payload.new.value) {
        const newLogo = payload.new.value;
        console.log('🆕 New navbar logo settings:');
        console.log(`   🖼️  Logo URL: ${newLogo.logoUrl}`);
        console.log(`   📝 Alt Text: ${newLogo.altText}`);
        console.log(`   👁️  Show Logo: ${newLogo.showLogo}`);
        console.log(`   📏 Logo Size: ${newLogo.logoSize}`);
        
        // Compare with previous
        if (currentNavbarLogo) {
          console.log('\n🔄 Changes detected:');
          if (currentNavbarLogo.logoUrl !== newLogo.logoUrl) {
            console.log(`   🖼️  Logo URL changed: ${currentNavbarLogo.logoUrl} → ${newLogo.logoUrl}`);
          }
          if (currentNavbarLogo.altText !== newLogo.altText) {
            console.log(`   📝 Alt Text changed: ${currentNavbarLogo.altText} → ${newLogo.altText}`);
          }
          if (currentNavbarLogo.showLogo !== newLogo.showLogo) {
            console.log(`   👁️  Show Logo changed: ${currentNavbarLogo.showLogo} → ${newLogo.showLogo}`);
          }
          if (currentNavbarLogo.logoSize !== newLogo.logoSize) {
            console.log(`   📏 Logo Size changed: ${currentNavbarLogo.logoSize} → ${newLogo.logoSize}`);
          }
        }
        
        currentNavbarLogo = newLogo;
        console.log('\n✅ Frontend should now update the navbar logo!');
      }
    })
    .subscribe();

  console.log('✅ Real-time subscription active');
  console.log('🎯 Waiting for navbar logo changes from admin panel...');
  console.log('');
  console.log('📝 Instructions:');
  console.log('   1. Go to your admin panel');
  console.log('   2. Navigate to Navbar Logo settings');
  console.log('   3. Upload a new logo or change settings');
  console.log('   4. Watch this console for real-time updates');
  console.log('');
  console.log('⏰ Test will run for 5 minutes...');

  // Test 3: Simulate an update after 30 seconds to verify the subscription works
  setTimeout(async () => {
    console.log('\n3. 🧪 Testing Update Simulation');
    console.log('-------------------------------');
    
    try {
      const testUpdate = {
        ...currentNavbarLogo,
        altText: `Test Update - ${new Date().toLocaleTimeString()}`
      };
      
      const { error } = await supabase
        .from('settings')
        .update({ value: testUpdate })
        .eq('key', 'navbarLogoSettings');
        
      if (error) {
        console.log(`❌ Failed to simulate update: ${error.message}`);
      } else {
        console.log('✅ Simulated update sent - should trigger real-time event');
      }
    } catch (error) {
      console.log(`❌ Exception during update simulation: ${error.message}`);
    }
  }, 30000);

  // Keep the script running for 5 minutes
  setTimeout(() => {
    console.log('\n⏰ Test completed after 5 minutes');
    console.log(`📊 Total updates received: ${updateCount}`);
    
    if (updateCount === 0) {
      console.log('❌ No real-time updates received - there may be a connection issue');
      console.log('💡 Possible causes:');
      console.log('   - WebSocket connection blocked');
      console.log('   - Real-time not enabled in Supabase');
      console.log('   - Network connectivity issues');
    } else {
      console.log('✅ Real-time updates working correctly!');
    }
    
    process.exit(0);
  }, 300000); // 5 minutes

  return true;
}

// Run the test
testNavbarLogoRealtime().catch(console.error);
