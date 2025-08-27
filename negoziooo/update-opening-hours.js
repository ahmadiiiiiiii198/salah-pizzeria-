#!/usr/bin/env node

/**
 * Update pizzeria opening hours
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🕒 UPDATING PIZZERIA OPENING HOURS');
console.log('==================================');

async function updateOpeningHours() {
  try {
    // New business hours - typical pizzeria schedule
    const newBusinessHours = {
      monday: { isOpen: true, openTime: '12:00', closeTime: '14:30' }, // Lunch only
      tuesday: { isOpen: true, openTime: '12:00', closeTime: '14:30' }, // Lunch only  
      wednesday: { isOpen: true, openTime: '12:00', closeTime: '14:30' }, // Lunch only
      thursday: { isOpen: true, openTime: '12:00', closeTime: '14:30' }, // Lunch only
      friday: { isOpen: true, openTime: '12:00', closeTime: '14:30' }, // Lunch only
      saturday: { isOpen: true, openTime: '18:30', closeTime: '23:00' }, // Dinner only
      sunday: { isOpen: true, openTime: '12:00', closeTime: '14:30' } // Lunch only
    };

    // New pizzeria display hours with multiple periods
    const newPizzeriaDisplayHours = {
      monday: {
        isOpen: true,
        periods: [
          { openTime: '12:00', closeTime: '14:30' },
          { openTime: '18:00', closeTime: '23:00' }
        ]
      },
      tuesday: {
        isOpen: true,
        periods: [
          { openTime: '12:00', closeTime: '14:30' },
          { openTime: '18:00', closeTime: '23:00' }
        ]
      },
      wednesday: {
        isOpen: true,
        periods: [
          { openTime: '12:00', closeTime: '14:30' },
          { openTime: '18:00', closeTime: '23:00' }
        ]
      },
      thursday: {
        isOpen: true,
        periods: [
          { openTime: '12:00', closeTime: '14:30' },
          { openTime: '18:00', closeTime: '23:00' }
        ]
      },
      friday: {
        isOpen: true,
        periods: [
          { openTime: '12:00', closeTime: '14:30' },
          { openTime: '18:30', closeTime: '00:00' }
        ]
      },
      saturday: {
        isOpen: true,
        periods: [
          { openTime: '18:30', closeTime: '00:00' }
        ]
      },
      sunday: {
        isOpen: true,
        periods: [
          { openTime: '12:00', closeTime: '14:30' },
          { openTime: '18:00', closeTime: '23:00' }
        ]
      }
    };

    console.log('1. 🔄 Updating business hours...');
    
    // Update business hours
    const { error: businessError } = await supabase
      .from('settings')
      .upsert({
        key: 'businessHours',
        value: newBusinessHours,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    if (businessError) {
      console.error('❌ Error updating business hours:', businessError.message);
      return;
    }

    console.log('✅ Business hours updated');

    console.log('2. 🔄 Updating pizzeria display hours...');
    
    // Update pizzeria display hours
    const { error: displayError } = await supabase
      .from('settings')
      .upsert({
        key: 'pizzeriaDisplayHours',
        value: newPizzeriaDisplayHours,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    if (displayError) {
      console.error('❌ Error updating pizzeria display hours:', displayError.message);
      return;
    }

    console.log('✅ Pizzeria display hours updated');

    console.log('\n📅 NEW OPENING HOURS:');
    console.log('=====================');
    console.log('🍕 Lunedì:    12:00-14:30, 18:00-23:00');
    console.log('🍕 Martedì:   12:00-14:30, 18:00-23:00');
    console.log('🍕 Mercoledì: 12:00-14:30, 18:00-23:00');
    console.log('🍕 Giovedì:   12:00-14:30, 18:00-23:00');
    console.log('🍕 Venerdì:   12:00-14:30, 18:30-00:00');
    console.log('🍕 Sabato:    18:30-00:00');
    console.log('🍕 Domenica:  12:00-14:30, 18:00-23:00');

    console.log('\n🔄 WHAT TO DO NEXT:');
    console.log('===================');
    console.log('1. 🌐 Refresh your browser');
    console.log('2. 👀 Check the opening hours display');
    console.log('3. 🕒 Hours should now show proper times instead of "11-03"');

    console.log('\n🎉 Opening hours updated successfully!');

  } catch (error) {
    console.error('❌ Error updating opening hours:', error.message);
  }
}

updateOpeningHours();
