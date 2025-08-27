/**
 * Test Database Access
 * Check RLS policies and settings table access
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://htdgoceqepvrffblfvns.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8'
);

async function checkDatabase() {
  console.log('🔍 Checking database access and RLS policies...\n');
  
  // Test 1: Check if we can read settings table at all
  console.log('📋 Test 1: Basic settings table access');
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('key')
      .limit(5);
      
    if (error) {
      console.error('❌ Cannot access settings table:', error.message);
      console.error('❌ Error details:', error);
    } else {
      console.log('✅ Settings table accessible, found keys:', data.map(d => d.key));
    }
  } catch (err) {
    console.error('❌ Settings table access failed:', err.message);
  }
  
  // Test 2: Try to read logoSettings specifically
  console.log('\n🎨 Test 2: Logo settings access');
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'logoSettings')
      .single();
      
    if (error) {
      console.error('❌ Cannot read logoSettings:', error.message);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error details:', error.details);
      console.error('❌ Error hint:', error.hint);
    } else {
      console.log('✅ Logo settings found:', data);
      console.log('✅ Logo URL:', data.value.logoUrl);
      console.log('✅ Alt text:', data.value.altText);
    }
  } catch (err) {
    console.error('❌ Logo settings access failed:', err.message);
  }
  
  // Test 3: Check RLS status (if we have permission)
  console.log('\n🔒 Test 3: RLS status check');
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: "SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'settings';"
    });
    
    if (error) {
      console.error('❌ Cannot check RLS status:', error.message);
    } else {
      console.log('✅ RLS status:', data);
    }
  } catch (err) {
    console.error('❌ RLS check failed:', err.message);
  }
  
  // Test 4: Check policies (if we have permission)
  console.log('\n📜 Test 4: Policies check');
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: "SELECT policyname, cmd, roles FROM pg_policies WHERE schemaname = 'public' AND tablename = 'settings';"
    });
    
    if (error) {
      console.error('❌ Cannot check policies:', error.message);
    } else {
      console.log('✅ Policies found:', data);
    }
  } catch (err) {
    console.error('❌ Policies check failed:', err.message);
  }
  
  // Test 5: Try to update logoSettings
  console.log('\n💾 Test 5: Update test');
  try {
    const testValue = {
      logoUrl: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f355.png',
      altText: 'Test Pizza Logo'
    };
    
    const { data, error } = await supabase
      .from('settings')
      .update({ value: testValue, updated_at: new Date().toISOString() })
      .eq('key', 'logoSettings')
      .select();
      
    if (error) {
      console.error('❌ Cannot update logoSettings:', error.message);
      console.error('❌ Error code:', error.code);
    } else {
      console.log('✅ Update successful:', data);
    }
  } catch (err) {
    console.error('❌ Update failed:', err.message);
  }
  
  // Test 6: Check current user/role
  console.log('\n👤 Test 6: Current user info');
  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('✅ Current user:', user ? user.email : 'Anonymous');
    console.log('✅ User role:', user ? user.role : 'anon');
  } catch (err) {
    console.error('❌ User info failed:', err.message);
  }
}

checkDatabase().catch(console.error);
