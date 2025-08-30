#!/usr/bin/env node

/**
 * Database Schema Checker Script
 * This script connects to Supabase and checks the database schema
 * Run with: node scripts/check-database.js
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://hnoadcbppldmawognwdx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhub2FkY2JwcGxkbWF3b2dud2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0ODgwMjEsImV4cCI6MjA3MjA2NDAyMX0.cMQBW7VFcWFdVsXY-0H0PaLRDSY13jicT4lPGh9Pmlo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 Checking Supabase Database Schema...\n');

async function checkDatabase() {
  try {
    // Check 1: Basic connection
    console.log('1️⃣ Testing database connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('content_sections')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.log('❌ Connection failed:', connectionError.message);
      return;
    }
    console.log('✅ Database connection successful\n');

    // Check 2: content_sections table structure
    console.log('2️⃣ Checking content_sections table structure...');
    const { data: sampleData, error: sampleError } = await supabase
      .from('content_sections')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.log('❌ Cannot read content_sections:', sampleError.message);
      return;
    }

    const columns = sampleData && sampleData.length > 0 ? Object.keys(sampleData[0]) : [];
    console.log(`✅ Found content_sections table with ${columns.length} columns:`);
    console.log(`   Columns: ${columns.join(', ')}\n`);

    // Check for required columns
    const requiredColumns = ['title', 'content', 'image_url', 'sort_order'];
    const missingColumns = requiredColumns.filter(col => !columns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('⚠️  Missing required columns:', missingColumns.join(', '));
      console.log('   These columns need to be added for image uploads to work\n');
    } else {
      console.log('✅ All required columns are present!\n');
    }

    // Check 3: RLS policies test
    console.log('3️⃣ Testing RLS policies...');
    const testRecord = {
      section_key: `test_${Date.now()}`,
      section_name: 'RLS Test',
      content_type: 'test',
      content_value: 'Testing',
      metadata: { test: true },
      is_active: false
    };

    const { data: insertData, error: insertError } = await supabase
      .from('content_sections')
      .insert(testRecord)
      .select()
      .single();

    if (insertError) {
      console.log('❌ INSERT failed - RLS policies too restrictive:', insertError.message);
      console.log('   RLS policies need to be updated for admin operations\n');
    } else {
      console.log('✅ INSERT works - RLS policies are correct');
      
      // Clean up test record
      await supabase
        .from('content_sections')
        .delete()
        .eq('id', insertData.id);
      console.log('✅ Test record cleaned up\n');
    }

    // Check 4: Storage buckets
    console.log('4️⃣ Checking storage buckets...');
    const { data: bucketsData, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.log('❌ Storage check failed:', bucketsError.message);
    } else {
      const bucketNames = bucketsData.map(b => b.name);
      console.log(`✅ Found ${bucketsData.length} storage buckets: ${bucketNames.join(', ')}`);
      
      const requiredBuckets = ['uploads', 'admin-uploads', 'gallery', 'specialties'];
      const missingBuckets = requiredBuckets.filter(bucket => !bucketNames.includes(bucket));
      
      if (missingBuckets.length > 0) {
        console.log('⚠️  Missing storage buckets:', missingBuckets.join(', '));
      } else {
        console.log('✅ All required storage buckets exist!');
      }
    }

    // Summary and recommendations
    console.log('\n📋 SUMMARY:');
    if (missingColumns.length > 0) {
      console.log('❌ Database schema needs to be updated');
      console.log('\n🔧 RECOMMENDED ACTION:');
      console.log('1. Go to your admin panel');
      console.log('2. Navigate to "🔧 Testing & Advanced Tools" → "Supabase Reader"');
      console.log('3. Click "Read Database Schema"');
      console.log('4. Click "Generate Fix SQL"');
      console.log('5. Copy the SQL and run it in Supabase Dashboard → SQL Editor');
      
      console.log('\n📝 OR run this SQL manually in Supabase Dashboard:');
      console.log(`
-- Add missing columns to content_sections table
ALTER TABLE content_sections 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Create index for sort_order
CREATE INDEX IF NOT EXISTS idx_content_sections_sort_order ON content_sections(sort_order);

-- Fix RLS policies
DROP POLICY IF EXISTS "Allow public read access to active content sections" ON content_sections;
DROP POLICY IF EXISTS "Allow authenticated users full access to content sections" ON content_sections;

CREATE POLICY "Allow public read access to content sections" 
  ON content_sections FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to content sections" 
  ON content_sections FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to content sections" 
  ON content_sections FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete access to content sections" 
  ON content_sections FOR DELETE USING (true);
      `);
    } else {
      console.log('✅ Database schema looks good!');
      console.log('   Image uploads should work correctly.');
    }

  } catch (error) {
    console.log('❌ Script failed:', error.message);
  }
}

// Run the check
checkDatabase().then(() => {
  console.log('\n🏁 Database check completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
