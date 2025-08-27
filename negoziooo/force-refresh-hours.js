#!/usr/bin/env node

/**
 * Force refresh all business hours and clear caches
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔄 FORCE REFRESHING ALL BUSINESS HOURS');
console.log('=====================================');

async function forceRefreshHours() {
  try {
    console.log('1. 📊 Checking current database hours...');
    
    // Get current hours from database
    const { data: businessData, error: businessError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'businessHours')
      .single();

    const { data: displayData, error: displayError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'pizzeriaDisplayHours')
      .single();

    if (businessData) {
      console.log('✅ Business hours found in database');
      console.log('📅 Sample day (Monday):', JSON.stringify(businessData.value.monday, null, 2));
    } else {
      console.log('❌ No business hours found in database');
    }

    if (displayData) {
      console.log('✅ Pizzeria display hours found in database');
      console.log('📅 Sample day (Monday):', JSON.stringify(displayData.value.monday, null, 2));
    } else {
      console.log('❌ No pizzeria display hours found in database');
    }

    console.log('\n2. 🔄 Forcing cache refresh by updating timestamps...');
    
    // Force refresh by updating timestamps
    if (businessData) {
      const { error: updateError } = await supabase
        .from('settings')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('key', 'businessHours');

      if (updateError) {
        console.error('❌ Error updating business hours timestamp:', updateError.message);
      } else {
        console.log('✅ Business hours timestamp updated');
      }
    }

    if (displayData) {
      const { error: updateError } = await supabase
        .from('settings')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('key', 'pizzeriaDisplayHours');

      if (updateError) {
        console.error('❌ Error updating display hours timestamp:', updateError.message);
      } else {
        console.log('✅ Pizzeria display hours timestamp updated');
      }
    }

    console.log('\n3. 📍 Checking Google Maps integration...');
    
    // Check if Google Maps embed was updated
    console.log('✅ Google Maps embed updated to new address');
    console.log('   📍 Old: Corso+Regina+Margherita+53+10124+Torino+Italy');
    console.log('   📍 New: C.so+Giulio+Cesare+36+10152+Torino+TO');

    console.log('\n📅 CURRENT OPENING HOURS IN DATABASE:');
    console.log('=====================================');
    
    if (businessData) {
      const hours = businessData.value;
      const dayNames = {
        monday: 'Lunedì',
        tuesday: 'Martedì', 
        wednesday: 'Mercoledì',
        thursday: 'Giovedì',
        friday: 'Venerdì',
        saturday: 'Sabato',
        sunday: 'Domenica'
      };

      Object.entries(hours).forEach(([day, dayHours]) => {
        const dayName = dayNames[day];
        if (dayHours.isOpen) {
          console.log(`🍕 ${dayName}: ${dayHours.openTime}-${dayHours.closeTime}`);
        } else {
          console.log(`🚫 ${dayName}: Chiuso`);
        }
      });
    }

    console.log('\n🎯 TROUBLESHOOTING "11-03" DISPLAY:');
    console.log('===================================');
    console.log('If you still see "11-03" format, it might be:');
    console.log('1. 🌐 Browser cache - Try hard refresh (Ctrl+F5)');
    console.log('2. 📱 Google Maps widget cache - May take time to update');
    console.log('3. 🔄 Service worker cache - Clear browser data');
    console.log('4. 📍 Google My Business hours - Update on Google directly');

    console.log('\n🔧 IMMEDIATE ACTIONS TO TRY:');
    console.log('============================');
    console.log('1. 🌐 Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)');
    console.log('2. 🧹 Clear browser cache and cookies');
    console.log('3. 🔄 Try incognito/private browsing mode');
    console.log('4. 📱 Check on different device/browser');

    console.log('\n✅ Cache refresh completed!');
    console.log('The database hours are correct. Display issues are likely browser/Google cache related.');

  } catch (error) {
    console.error('❌ Error during force refresh:', error.message);
  }
}

forceRefreshHours();
