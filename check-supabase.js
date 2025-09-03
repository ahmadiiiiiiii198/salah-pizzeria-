// Quick Supabase database check
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hnoadcbppldmawognwdx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhub2FkY2JwcGxkbWF3b2dud2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0ODgwMjEsImV4cCI6MjA3MjA2NDAyMX0.cMQBW7VFcWFdVsXY-0H0PaLRDSY13jicT4lPGh9Pmlo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkDatabase() {
  console.log('🔍 SUPABASE PROJECT INFORMATION:');
  console.log('================================');
  console.log('Project URL:', SUPABASE_URL);
  console.log('Project Reference:', 'yliofvqfyimlbxjmsuow');
  console.log('Dashboard URL:', 'https://supabase.com/dashboard/project/yliofvqfyimlbxjmsuow');
  console.log('');

  // Check current session
  console.log('🔐 CHECKING AUTHENTICATION:');
  console.log('============================');
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Session Error:', sessionError.message);
    } else if (sessionData.session) {
      const user = sessionData.session.user;
      console.log('✅ Active Session Found!');
      console.log('📧 Email:', user.email || 'N/A');
      console.log('🆔 User ID:', user.id);
      console.log('📅 Created:', new Date(user.created_at).toLocaleString());
    } else {
      console.log('⚠️  No active session - using anonymous access');
    }
  } catch (error) {
    console.log('❌ Auth check failed:', error.message);
  }

  console.log('');

  // Check content_sections table
  console.log('🗄️  CHECKING CONTENT_SECTIONS TABLE:');
  console.log('=====================================');
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Table Error:', error.message);
    } else {
      console.log('✅ Table accessible');
      console.log('📊 Sample data found:', data.length > 0 ? 'Yes' : 'No');
      if (data.length > 0) {
        const columns = Object.keys(data[0]);
        console.log('📋 Current columns:', columns.join(', '));
        
        // Check for missing columns
        const requiredColumns = ['title', 'content', 'image_url', 'sort_order'];
        const missingColumns = requiredColumns.filter(col => !columns.includes(col));
        
        if (missingColumns.length > 0) {
          console.log('❌ Missing columns:', missingColumns.join(', '));
        } else {
          console.log('✅ All required columns present');
        }
      }
    }
  } catch (error) {
    console.log('❌ Table check failed:', error.message);
  }

  // Test RLS policies
  console.log('');
  console.log('🔒 TESTING RLS POLICIES:');
  console.log('=========================');
  try {
    const testRecord = {
      section_key: `test_${Date.now()}`,
      section_name: 'Test Record',
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
      console.log('❌ INSERT failed:', insertError.message);
      console.log('🔧 RLS policies need fixing');
    } else {
      console.log('✅ INSERT works - RLS policies OK');
      
      // Clean up
      await supabase
        .from('content_sections')
        .delete()
        .eq('id', insertData.id);
      console.log('🧹 Test record cleaned up');
    }
  } catch (error) {
    console.log('❌ RLS test failed:', error.message);
  }

  console.log('');
  console.log('🎯 NEXT STEPS:');
  console.log('===============');
  console.log('1. Go to: https://supabase.com/dashboard/project/yliofvqfyimlbxjmsuow');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Run the database migration SQL');
  console.log('4. Test image uploads in admin panel');
}

checkDatabase().catch(console.error);
