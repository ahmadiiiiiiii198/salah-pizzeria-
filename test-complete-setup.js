#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// NEW DATABASE CREDENTIALS
const SUPABASE_URL = 'https://hnoadcbppldmawognwdx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhub2FkY2JwcGxkbWF3b2dud2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0ODgwMjEsImV4cCI6MjA3MjA2NDAyMX0.cMQBW7VFcWFdVsXY-0H0PaLRDSY13jicT4lPGh9Pmlo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🧪 COMPREHENSIVE SETUP TEST');
console.log('============================');

async function testDatabaseConnection() {
  console.log('\n📡 Testing Database Connection...');
  
  try {
    const { data, error } = await supabase.from('settings').select('*').limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (err) {
    console.log('❌ Database connection error:', err.message);
    return false;
  }
}

async function testDataIntegrity() {
  console.log('\n📊 Testing Data Integrity...');
  
  try {
    // Test settings
    const { data: settings } = await supabase.from('settings').select('*');
    console.log(`✅ Settings: ${settings?.length || 0} records`);
    
    // Test categories
    const { data: categories } = await supabase.from('categories').select('*');
    console.log(`✅ Categories: ${categories?.length || 0} records`);
    
    // Test products
    const { data: products } = await supabase.from('products').select('*');
    console.log(`✅ Products: ${products?.length || 0} records`);
    
    // Test content sections
    const { data: content } = await supabase.from('content_sections').select('*');
    console.log(`✅ Content Sections: ${content?.length || 0} records`);
    
    return true;
  } catch (err) {
    console.log('❌ Data integrity test failed:', err.message);
    return false;
  }
}

async function testAdminAuth() {
  console.log('\n🔐 Testing Admin Authentication...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin',
      password: 'persian123'
    });
    
    if (error) {
      console.log('❌ Admin auth failed:', error.message);
      return false;
    }
    
    console.log('✅ Admin authentication successful');
    
    // Sign out
    await supabase.auth.signOut();
    return true;
  } catch (err) {
    console.log('❌ Admin auth error:', err.message);
    return false;
  }
}

async function testStorageBuckets() {
  console.log('\n🗂️ Testing Storage Buckets...');
  
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.log('❌ Storage test failed:', error.message);
      return false;
    }
    
    console.log(`✅ Storage buckets: ${buckets?.length || 0} found`);
    buckets?.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });
    
    return true;
  } catch (err) {
    console.log('❌ Storage test error:', err.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive tests...\n');
  
  const results = {
    connection: await testDatabaseConnection(),
    data: await testDataIntegrity(),
    auth: await testAdminAuth(),
    storage: await testStorageBuckets()
  };
  
  console.log('\n📋 TEST RESULTS SUMMARY');
  console.log('========================');
  console.log(`Database Connection: ${results.connection ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Data Integrity: ${results.data ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Admin Authentication: ${results.auth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Storage Buckets: ${results.storage ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result);
  
  console.log('\n🎯 OVERALL STATUS');
  console.log('==================');
  if (allPassed) {
    console.log('🎉 ALL TESTS PASSED! Your setup is complete and ready to use.');
    console.log('\n🌐 Access your website at:');
    console.log('   - Frontend: http://localhost:3000');
    console.log('   - Admin Panel: http://localhost:3000/admin');
    console.log('   - Login: admin / persian123');
  } else {
    console.log('⚠️ Some tests failed. Please check the errors above.');
  }
  
  return allPassed;
}

// Run the tests
runAllTests().catch(console.error);
