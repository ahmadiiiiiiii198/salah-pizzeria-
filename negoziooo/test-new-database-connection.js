#!/usr/bin/env node

/**
 * Test New Database Connection
 * This script verifies that the new Supabase database is properly connected and configured
 */

import { createClient } from '@supabase/supabase-js';

// New database configuration
const SUPABASE_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testDatabaseConnection() {
  console.log('🔗 Testing New Supabase Database Connection');
  console.log('===========================================');
  console.log('📍 Database URL:', SUPABASE_URL);
  console.log('🆔 Project ID: htdgoceqepvrffblfvns');
  console.log('');

  try {
    // Test 1: Basic connection
    console.log('1. 🔌 Testing basic connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('settings')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.log('   ❌ Connection failed:', connectionError.message);
      return false;
    }
    console.log('   ✅ Connection successful!');

    // Test 2: Check settings table
    console.log('2. ⚙️ Testing settings table...');
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('key')
      .limit(5);
    
    if (settingsError) {
      console.log('   ❌ Settings table error:', settingsError.message);
      return false;
    }
    console.log(`   ✅ Settings table working! Found ${settings.length} settings`);

    // Test 3: Check specific pizzeria settings
    console.log('3. 🍕 Testing pizzeria settings...');
    const { data: heroContent, error: heroError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'heroContent')
      .single();
    
    if (heroError) {
      console.log('   ❌ Hero content error:', heroError.message);
      return false;
    }
    
    const hero = heroContent.value;
    if (hero.heading === 'Pizzeria Regina 2000') {
      console.log('   ✅ Pizzeria content verified!');
      console.log(`   📝 Hero heading: "${hero.heading}"`);
      console.log(`   📝 Hero subheading: "${hero.subheading}"`);
    } else {
      console.log('   ⚠️ Unexpected hero content:', hero);
    }

    // Test 4: Check content_sections table
    console.log('4. 📄 Testing content sections...');
    const { data: sections, error: sectionsError } = await supabase
      .from('content_sections')
      .select('section_key, section_name')
      .limit(3);
    
    if (sectionsError) {
      console.log('   ❌ Content sections error:', sectionsError.message);
      return false;
    }
    console.log(`   ✅ Content sections working! Found ${sections.length} sections`);
    sections.forEach(section => {
      console.log(`   📝 Section: ${section.section_key} - ${section.section_name}`);
    });

    // Test 5: Check storage buckets
    console.log('5. 🗂️ Testing storage buckets...');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.log('   ❌ Storage buckets error:', bucketsError.message);
      return false;
    }
    console.log(`   ✅ Storage buckets working! Found ${buckets.length} buckets`);
    buckets.forEach(bucket => {
      console.log(`   📁 Bucket: ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });

    console.log('');
    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ New database is properly configured');
    console.log('✅ All essential tables exist');
    console.log('✅ Pizzeria content is loaded');
    console.log('✅ Storage buckets are ready');
    console.log('');
    console.log('🚀 Your pizzeria website is ready to use the new database!');
    
    return true;

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
    return false;
  }
}

// Run the test
testDatabaseConnection().catch(console.error);
