/**
 * MCP-Based Connection Test
 * This script tests the database connection
 */

import { createClient } from '@supabase/supabase-js';

// Correct Supabase configuration for Pizzeria Regina 2000
const SUPABASE_URL = 'https://yliofvqfyimlbxjmsuow.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('🔍 MCP: Testing database connection...');
  console.log('=' .repeat(60));

  try {
    // Test basic connection
    console.log('\n1️⃣ Testing basic connection...');
    const { data, error } = await supabase
      .from('categories')
      .select('count(*)')
      .single();

    if (error) {
      console.error('❌ Connection error:', error.message);
      return;
    }

    console.log('✅ Connection successful!');
    console.log('📊 Categories count:', data.count);

    // Check for existing categories
    console.log('\n2️⃣ Checking existing categories...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('name, slug')
      .order('name');

    if (catError) {
      console.error('❌ Error fetching categories:', catError.message);
      return;
    }

    console.log('📂 Existing categories:');
    categories.forEach(cat => {
      console.log(`   • ${cat.name} (${cat.slug})`);
    });

    console.log('\n✅ MCP: Connection test completed successfully!');

  } catch (error) {
    console.error('❌ MCP Error:', error);
  }
}

// Run the test
testConnection();
