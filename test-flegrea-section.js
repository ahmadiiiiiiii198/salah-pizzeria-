#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// NEW DATABASE CREDENTIALS
const SUPABASE_URL = 'https://hnoadcbppldmawognwdx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhub2FkY2JwcGxkbWF3b2dud2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0ODgwMjEsImV4cCI6MjA3MjA2NDAyMX0.cMQBW7VFcWFdVsXY-0H0PaLRDSY13jicT4lPGh9Pmlo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🍕 TESTING FLEGREA SECTION');
console.log('==========================');

async function testFlegreaSectionData() {
  console.log('\n📊 Testing Flegrea Section Data...');
  
  try {
    // Test Flegrea sections
    const { data: flegreaSections, error } = await supabase
      .from('content_sections')
      .select('*')
      .ilike('section_key', '%flegrea%')
      .eq('is_active', true)
      .order('sort_order');
    
    if (error) {
      console.log('❌ Flegrea section test failed:', error.message);
      return false;
    }
    
    console.log(`✅ Found ${flegreaSections?.length || 0} Flegrea sections`);
    
    if (flegreaSections && flegreaSections.length > 0) {
      console.log('\n📋 Flegrea Section Details:');
      flegreaSections.forEach((section, index) => {
        console.log(`   ${index + 1}. ${section.section_key}`);
        console.log(`      Title: ${section.title}`);
        console.log(`      Content: ${section.content?.substring(0, 50)}...`);
        console.log(`      Image: ${section.image_url ? '✅ Has image' : '❌ No image'}`);
        console.log(`      Active: ${section.is_active ? '✅ Active' : '❌ Inactive'}`);
        console.log('');
      });
      
      // Test the main Flegrea section specifically
      const mainSection = flegreaSections.find(s => s.section_key === 'flegrea_section');
      if (mainSection) {
        console.log('🎯 Main Flegrea Section Found:');
        console.log(`   Title: ${mainSection.title}`);
        console.log(`   Content: ${mainSection.content}`);
        
        if (mainSection.metadata) {
          console.log('   Metadata:');
          const metadata = mainSection.metadata;
          if (metadata.subtitle) console.log(`     Subtitle: ${metadata.subtitle}`);
          if (metadata.button_text) console.log(`     Button: ${metadata.button_text}`);
          if (metadata.description_1) console.log(`     Description 1: ${metadata.description_1.substring(0, 50)}...`);
          if (metadata.description_2) console.log(`     Description 2: ${metadata.description_2.substring(0, 50)}...`);
        }
      }
      
      return true;
    } else {
      console.log('❌ No Flegrea sections found');
      return false;
    }
    
  } catch (err) {
    console.log('❌ Flegrea section test error:', err.message);
    return false;
  }
}

async function testAllContentSections() {
  console.log('\n📊 Testing All Content Sections...');
  
  try {
    const { data: allSections, error } = await supabase
      .from('content_sections')
      .select('section_key, section_name, title, is_active')
      .order('sort_order');
    
    if (error) {
      console.log('❌ Content sections test failed:', error.message);
      return false;
    }
    
    console.log(`✅ Total content sections: ${allSections?.length || 0}`);
    
    if (allSections && allSections.length > 0) {
      console.log('\n📋 All Content Sections:');
      allSections.forEach((section, index) => {
        const status = section.is_active ? '✅' : '❌';
        console.log(`   ${index + 1}. ${status} ${section.section_key} - ${section.section_name}`);
      });
    }
    
    return true;
  } catch (err) {
    console.log('❌ Content sections test error:', err.message);
    return false;
  }
}

async function runFlegreaSectionTests() {
  console.log('🚀 Starting Flegrea section tests...\n');
  
  const results = {
    flegreaSections: await testFlegreaSectionData(),
    allSections: await testAllContentSections()
  };
  
  console.log('\n📋 TEST RESULTS SUMMARY');
  console.log('========================');
  console.log(`Flegrea Sections: ${results.flegreaSections ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`All Sections: ${results.allSections ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result);
  
  console.log('\n🎯 FLEGREA SECTION STATUS');
  console.log('==========================');
  if (allPassed) {
    console.log('🎉 FLEGREA SECTION IS WORKING! The section data is properly loaded.');
    console.log('\n🌐 Check your website at:');
    console.log('   - Frontend: http://localhost:3000');
    console.log('   - Admin Panel: http://localhost:3000/admin');
    console.log('   - Look for the "A PROPOSITO DI FLEGREA" section on the homepage');
  } else {
    console.log('⚠️ Some Flegrea section tests failed. Please check the errors above.');
  }
  
  return allPassed;
}

// Run the tests
runFlegreaSectionTests().catch(console.error);
