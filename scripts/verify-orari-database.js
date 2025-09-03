#!/usr/bin/env node

/**
 * Script to verify orari (hours) database connections and data structures
 * This script checks:
 * 1. businessHours setting (for when clients can order)
 * 2. opening_hours setting (for display in contact/footer)
 * 3. Data structure consistency between frontend and backend
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Verifying Orari Database Connections...\n');

async function verifyBusinessHours() {
  console.log('📊 Checking businessHours setting...');
  
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('key, value, updated_at')
      .eq('key', 'businessHours')
      .single();

    if (error) {
      console.error('❌ Error fetching businessHours:', error.message);
      return false;
    }

    if (!data) {
      console.error('❌ businessHours setting not found in database');
      return false;
    }

    console.log('✅ businessHours found');
    console.log('📅 Last updated:', data.updated_at);
    
    // Verify data structure
    const businessHours = data.value;
    const expectedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const expectedFields = ['isOpen', 'openTime', 'closeTime'];
    
    console.log('🔍 Verifying data structure...');
    
    for (const day of expectedDays) {
      if (!businessHours[day]) {
        console.error(`❌ Missing day: ${day}`);
        return false;
      }
      
      for (const field of expectedFields) {
        if (businessHours[day][field] === undefined) {
          console.error(`❌ Missing field ${field} for ${day}`);
          return false;
        }
      }
    }
    
    console.log('✅ businessHours data structure is valid');
    console.log('📋 Sample data:', JSON.stringify(businessHours.monday, null, 2));
    
    return true;
  } catch (error) {
    console.error('❌ Exception checking businessHours:', error.message);
    return false;
  }
}

async function verifyOpeningHours() {
  console.log('\n📊 Checking opening_hours setting...');
  
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('key, value, updated_at')
      .eq('key', 'opening_hours')
      .single();

    if (error) {
      console.error('❌ Error fetching opening_hours:', error.message);
      return false;
    }

    if (!data) {
      console.error('❌ opening_hours setting not found in database');
      return false;
    }

    console.log('✅ opening_hours found');
    console.log('📅 Last updated:', data.updated_at);
    
    // Verify data structure
    const openingHours = data.value;
    const expectedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const expectedFields = ['open', 'close', 'closed'];
    
    console.log('🔍 Verifying data structure...');
    
    for (const day of expectedDays) {
      if (!openingHours[day]) {
        console.error(`❌ Missing day: ${day}`);
        return false;
      }
      
      for (const field of expectedFields) {
        if (openingHours[day][field] === undefined) {
          console.error(`❌ Missing field ${field} for ${day}`);
          return false;
        }
      }
    }
    
    console.log('✅ opening_hours data structure is valid');
    console.log('📋 Sample data:', JSON.stringify(openingHours.monday, null, 2));
    
    return true;
  } catch (error) {
    console.error('❌ Exception checking opening_hours:', error.message);
    return false;
  }
}

async function verifyDatabaseConnection() {
  console.log('\n🔗 Testing database connection...');
  
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }

    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Exception testing database connection:', error.message);
    return false;
  }
}

async function checkAllOrariSettings() {
  console.log('\n📋 Listing all orari-related settings...');
  
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('key, updated_at')
      .or('key.eq.businessHours,key.eq.opening_hours,key.ilike.%hour%,key.ilike.%orari%');

    if (error) {
      console.error('❌ Error fetching orari settings:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log('⚠️ No orari-related settings found');
      return;
    }

    console.log('📊 Found orari-related settings:');
    data.forEach(setting => {
      console.log(`  - ${setting.key} (updated: ${setting.updated_at})`);
    });
    
    // Check for any unexpected orari settings
    const expectedKeys = ['businessHours', 'opening_hours'];
    const unexpectedKeys = data
      .map(s => s.key)
      .filter(key => !expectedKeys.includes(key));
    
    if (unexpectedKeys.length > 0) {
      console.log('\n⚠️ Unexpected orari-related settings found:');
      unexpectedKeys.forEach(key => {
        console.log(`  - ${key} (should this be removed?)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Exception checking orari settings:', error.message);
  }
}

async function main() {
  const connectionOk = await verifyDatabaseConnection();
  if (!connectionOk) {
    console.error('\n❌ Database connection failed. Cannot proceed with verification.');
    process.exit(1);
  }

  const businessHoursOk = await verifyBusinessHours();
  const openingHoursOk = await verifyOpeningHours();
  
  await checkAllOrariSettings();
  
  console.log('\n📊 VERIFICATION SUMMARY:');
  console.log('========================');
  console.log(`Database Connection: ${connectionOk ? '✅ OK' : '❌ FAILED'}`);
  console.log(`businessHours: ${businessHoursOk ? '✅ OK' : '❌ FAILED'}`);
  console.log(`opening_hours: ${openingHoursOk ? '✅ OK' : '❌ FAILED'}`);
  
  if (businessHoursOk && openingHoursOk) {
    console.log('\n🎉 All orari database connections verified successfully!');
    console.log('\n📝 SUMMARY:');
    console.log('- businessHours: Controls when clients can place orders');
    console.log('- opening_hours: Controls display hours in footer/contact sections');
    console.log('- Both settings have proper data structures');
    console.log('- Admin panel should have exactly 2 orari components');
  } else {
    console.log('\n❌ Some orari database connections have issues that need to be fixed.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});
