#!/usr/bin/env node

/**
 * Business Hours Testing Script
 * Tests the business hours functionality and database connection
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://yliofvqfyimlbxjmsuow.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🕒 Testing Business Hours System...\n');

async function testBusinessHours() {
  try {
    console.log('📋 1. Fetching current business hours from database...');

    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'businessHours')
      .single();

    if (error) {
      console.error('❌ Error fetching business hours:', error);
      return;
    }

    if (!data?.value) {
      console.log('⚠️ No business hours found in database');
      return;
    }

    const businessHours = data.value;
    console.log('✅ Business hours loaded:', JSON.stringify(businessHours, null, 2));

    console.log('\n📋 2. Testing current day status...');
    const now = new Date();
    const dayOfWeek = now.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[dayOfWeek];
    const todayHours = businessHours[currentDay];

    console.log(`Today is: ${currentDay}`);
    console.log(`Today's hours:`, todayHours);

    if (!todayHours.isOpen) {
      console.log('🚫 Business is closed today');
      return;
    }

    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    console.log(`Current time: ${currentTime}`);
    console.log(`Open time: ${todayHours.openTime}`);
    console.log(`Close time: ${todayHours.closeTime}`);

    // Check if currently open
    const isCurrentlyOpen = isTimeWithinRange(currentTime, todayHours.openTime, todayHours.closeTime);
    console.log(`Is currently open: ${isCurrentlyOpen ? '✅ YES' : '❌ NO'}`);

    console.log('\n📋 3. Testing all days...');
    Object.entries(businessHours).forEach(([day, hours]) => {
      const status = hours.isOpen ? `${hours.openTime}-${hours.closeTime}` : 'CLOSED';
      console.log(`${day.padEnd(10)}: ${status}`);
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

function isTimeWithinRange(currentTime, openTime, closeTime) {
  // Handle overnight periods (e.g., 18:30-02:00)
  if (closeTime < openTime) {
    return currentTime >= openTime || currentTime <= closeTime;
  } else {
    return currentTime >= openTime && currentTime <= closeTime;
  }
}

// Run the test
testBusinessHours();