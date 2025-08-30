import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://yliofvqfyimlbxjmsuow.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaW9mdnFmeWltbGJ4am1zdW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDQzNjEsImV4cCI6MjA3MTI4MDM2MX0.5s5cxf9YHHQJMHPHxFxxzdkb01J2XbZAExa5POxJ6QY'
);

console.log('🔍 Enhanced Supabase Account Information Search...\n');

async function findAccountInfo() {
  try {
    console.log('📊 Project Information:');
    console.log('   Project ID: yliofvqfyimlbxjmsuow');
    console.log('   URL: https://yliofvqfyimlbxjmsuow.supabase.co');
    console.log('   Dashboard: https://supabase.com/dashboard/project/yliofvqfyimlbxjmsuow\n');

    // Check 1: Admin credentials from settings
    console.log('1️⃣ Admin Credentials:');
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*');
    
    if (settingsError) {
      console.log('❌ Settings error:', settingsError.message);
    } else {
      const adminCreds = settings.find(s => s.key === 'adminCredentials');
      if (adminCreds) {
        console.log('   ✅ Admin Username:', adminCreds.value.username);
        console.log('   ✅ Admin Password:', adminCreds.value.password);
      }
    }

    // Check 2: Email settings that might contain account info
    console.log('\n2️⃣ Email-related Settings:');
    const emailSettings = settings?.filter(s => 
      s.key.toLowerCase().includes('email') || 
      s.key.toLowerCase().includes('contact') ||
      s.key.toLowerCase().includes('notification')
    );
    
    if (emailSettings && emailSettings.length > 0) {
      emailSettings.forEach(setting => {
        console.log(`   📧 ${setting.key}:`, setting.value);
      });
    } else {
      console.log('   ❌ No email settings found');
    }

    // Check 3: Restaurant contact information
    console.log('\n3️⃣ Restaurant Contact Information:');
    const contactSettings = settings?.filter(s => 
      ['email', 'phone', 'address', 'website', 'restaurant_name'].includes(s.key)
    );
    
    if (contactSettings && contactSettings.length > 0) {
      contactSettings.forEach(setting => {
        console.log(`   📞 ${setting.key}:`, setting.value);
      });
    } else {
      console.log('   ❌ No contact settings found');
    }

    // Check 4: Try to get project metadata (this might not work with anon key)
    console.log('\n4️⃣ Attempting to get project metadata...');
    try {
      // This is a long shot, but let's try
      const { data: projectInfo, error: projectError } = await supabase
        .rpc('get_project_info'); // This function probably doesn't exist
      
      if (projectError) {
        console.log('   ❌ Cannot access project metadata with anon key');
      } else {
        console.log('   ✅ Project info:', projectInfo);
      }
    } catch (e) {
      console.log('   ❌ Cannot access project metadata with anon key');
    }

    // Check 5: Look for any tables that might contain owner info
    console.log('\n5️⃣ Checking for owner/admin tables...');
    const possibleTables = [
      'owners', 'administrators', 'site_owners', 'project_owners',
      'auth_users', 'system_users', 'admin_users'
    ];
    
    for (const tableName of possibleTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (!error && data !== null) {
          console.log(`   ✅ Found table: ${tableName}`);
          if (data.length > 0) {
            console.log(`      Columns: ${Object.keys(data[0]).join(', ')}`);
          }
        }
      } catch (e) {
        // Table doesn't exist, continue silently
      }
    }

    // Check 6: Database schema information
    console.log('\n6️⃣ Available Tables in Database:');
    try {
      // Try to get table information from information_schema
      const { data: tables, error: tablesError } = await supabase
        .rpc('get_schema_tables'); // This might not exist either
      
      if (tablesError) {
        console.log('   ❌ Cannot access schema information');
      } else {
        console.log('   ✅ Tables found:', tables);
      }
    } catch (e) {
      console.log('   ❌ Cannot access schema information with current permissions');
    }

    console.log('\n🎯 FINDINGS SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const adminCreds = settings?.find(s => s.key === 'adminCredentials');
    if (adminCreds) {
      console.log('✅ Admin Panel Access:');
      console.log(`   Username: ${adminCreds.value.username}`);
      console.log(`   Password: ${adminCreds.value.password}`);
    }

    console.log('\n📧 Email Addresses Found in Database:');
    const notificationEmail = settings?.find(s => s.key === 'notification_email');
    if (notificationEmail && notificationEmail.value) {
      console.log(`   🎯 Notification Email: ${notificationEmail.value}`);
      console.log('   ↳ This might be the account owner\'s email!');
    }

    const notificationSettings = settings?.find(s => s.key === 'notificationSettings');
    if (notificationSettings && notificationSettings.value?.emailAddress) {
      console.log(`   🎯 Settings Email: ${notificationSettings.value.emailAddress}`);
      console.log('   ↳ This is likely the account owner\'s email!');
    }
    
    console.log('\n🔍 To Find Your Supabase Account Email:');
    console.log('   1. Go to https://supabase.com/dashboard');
    console.log('   2. Try logging in with these methods:');
    console.log('      • GitHub account (if you used GitHub to sign up)');
    console.log('      • Google account (if you used Google to sign up)');
    console.log('      • Email/password (try common emails you use)');
    console.log('   3. Look for project "yliofvqfyimlbxjmsuow" in your dashboard');
    
    console.log('\n💡 Common Email Patterns to Try:');
    console.log('   • Your primary email address');
    console.log('   • Email used for GitHub/Google if you signed up via OAuth');
    console.log('   • Work email if this is a work project');
    console.log('   • Email associated with domain registration');
    
    console.log('\n🔐 Alternative Access Methods:');
    console.log('   • Check browser saved passwords for supabase.com');
    console.log('   • Check email for Supabase welcome/confirmation emails');
    console.log('   • Look for Supabase in your password manager');
    
    console.log('\n📧 If All Else Fails:');
    console.log('   • Contact Supabase support with project ID: yliofvqfyimlbxjmsuow');
    console.log('   • They can help you recover access to your account');

  } catch (error) {
    console.log('❌ Script failed:', error.message);
  }
}

findAccountInfo().then(() => {
  console.log('\n🏁 Account information search completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
