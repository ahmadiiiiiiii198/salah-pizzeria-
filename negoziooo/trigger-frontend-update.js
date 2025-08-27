#!/usr/bin/env node

/**
 * Trigger frontend update with debug logging enabled
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZGdvY2VxZXB2cmZmYmxmdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNTUwNzksImV4cCI6MjA2ODYzMTA3OX0.TJqTe3f0-GjFLoFrT64LKbUJWtXU9ht08tX9O8Yp7y8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🚀 TRIGGERING FRONTEND UPDATE WITH DEBUG LOGGING');
console.log('================================================');

async function triggerUpdate() {
  try {
    console.log('1. 🔧 Setting correct navbar logo...');
    
    const correctLogo = {
      logoUrl: "https://htdgoceqepvrffblfvns.supabase.co/storage/v1/object/public/uploads/navbar-logos/1753279402475-r65mwb9v1pd.png",
      altText: "Pizzeria Regina 2000 Navbar Logo",
      showLogo: true,
      logoSize: "medium"
    };

    const { error } = await supabase
      .from('settings')
      .update({ 
        value: correctLogo,
        updated_at: new Date().toISOString()
      })
      .eq('key', 'navbarLogoSettings');

    if (error) {
      console.error('❌ Update error:', error.message);
      return;
    }

    console.log('✅ Database updated successfully!');
    console.log(`   🖼️  Logo URL: ${correctLogo.logoUrl}`);
    console.log(`   📝 Alt Text: ${correctLogo.altText}`);

    console.log('\n🎯 FRONTEND SHOULD NOW UPDATE!');
    console.log('==============================');
    console.log('');
    console.log('📝 What to check:');
    console.log('   1. Open your browser at http://localhost:3000/');
    console.log('   2. Open DevTools (F12) and go to Console tab');
    console.log('   3. Look for debug messages starting with [Navbar] and [SettingsService]');
    console.log('   4. The navbar should show your uploaded logo');
    console.log('');
    console.log('🔍 Expected debug output in browser console:');
    console.log('   - [SettingsService] NAVBAR LOGO DEBUG: ...');
    console.log('   - [Navbar] Logo settings changed: ...');
    console.log('');
    console.log('✅ If you see the debug messages, the system is working');
    console.log('❌ If you don\'t see debug messages, there\'s a loading issue');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

triggerUpdate();
