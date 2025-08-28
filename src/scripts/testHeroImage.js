#!/usr/bin/env node

/**
 * Hero Image Testing Script
 * Tests the hero image configuration and mobile display
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://yliofvqfyimlbxjmsuow.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🖼️ Testing Hero Image Configuration...\n');

async function testHeroImage() {
  try {
    console.log('📋 1. Fetching hero content from database...');
    
    const { data, error } = await supabase
      .from('settings')
      .select('value, updated_at')
      .eq('key', 'heroContent')
      .single();

    if (error) {
      console.error('❌ Error fetching hero content:', error);
      return;
    }

    if (!data?.value) {
      console.log('⚠️ No hero content found in database');
      return;
    }

    const heroContent = data.value;
    console.log('✅ Hero content loaded successfully');
    console.log(`✅ Last updated: ${data.updated_at}`);

    console.log('\n📋 2. Analyzing hero content...');
    console.log(`Heading: ${heroContent.heading || 'N/A'}`);
    console.log(`Subheading: ${heroContent.subheading || 'N/A'}`);
    console.log(`Background Image: ${heroContent.backgroundImage || 'N/A'}`);
    console.log(`Hero Image: ${heroContent.heroImage || 'N/A'}`);

    console.log('\n📋 3. Checking background image...');
    if (!heroContent.backgroundImage) {
      console.log('❌ No background image configured');
    } else if (heroContent.backgroundImage.includes('supabase.co')) {
      console.log('✅ Using uploaded background image (Supabase)');
      console.log(`   URL: ${heroContent.backgroundImage}`);
      
      // Test if the image is accessible
      try {
        const response = await fetch(heroContent.backgroundImage, { method: 'HEAD' });
        if (response.ok) {
          console.log('✅ Background image is accessible');
          console.log(`   Status: ${response.status}`);
          console.log(`   Content-Type: ${response.headers.get('content-type')}`);
        } else {
          console.log(`❌ Background image not accessible (${response.status})`);
        }
      } catch (fetchError) {
        console.log(`❌ Error accessing background image: ${fetchError.message}`);
      }
    } else if (heroContent.backgroundImage.includes('unsplash.com')) {
      console.log('⚠️ Using default Unsplash image');
      console.log(`   URL: ${heroContent.backgroundImage}`);
    } else {
      console.log('⚠️ Using other external image');
      console.log(`   URL: ${heroContent.backgroundImage}`);
    }

    console.log('\n📋 4. Mobile display conditions...');
    const hasSupabaseImage = heroContent.backgroundImage && heroContent.backgroundImage.includes('supabase.co');
    console.log(`Has Supabase image: ${hasSupabaseImage ? '✅ YES' : '❌ NO'}`);
    console.log(`Should show background: ${hasSupabaseImage ? '✅ YES' : '❌ NO (will show video instead)'}`);

    if (hasSupabaseImage) {
      console.log('\n✅ Background image should be visible on mobile');
      console.log('   - Image will be displayed with mobile-optimized CSS');
      console.log('   - Video will be hidden when background image is present');
    } else {
      console.log('\n⚠️ Background image may not be visible on mobile');
      console.log('   - Video will be displayed instead');
      console.log('   - Consider uploading a background image through admin panel');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testHeroImage();
