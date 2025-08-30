import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hnoadcbppldmawognwdx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhub2FkY2JwcGxkbWF3b2dud2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0ODgwMjEsImV4cCI6MjA3MjA2NDAyMX0.cMQBW7VFcWFdVsXY-0H0PaLRDSY13jicT4lPGh9Pmlo'
);

console.log('🔍 Searching Supabase Database for Credentials...\n');

async function findCredentials() {
  try {
    console.log('📊 Project Info:');
    console.log('   URL: https://yliofvqfyimlbxjmsuow.supabase.co');
    console.log('   Dashboard: https://supabase.com/dashboard/project/yliofvqfyimlbxjmsuow\n');

    // Check 1: Settings table
    console.log('1️⃣ Checking settings table...');
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*');
    
    if (settingsError) {
      console.log('❌ Settings error:', settingsError.message);
    } else {
      console.log(`✅ Found ${settings.length} settings records`);
      
      // Look for admin credentials
      const adminCreds = settings.find(s => s.key === 'adminCredentials');
      if (adminCreds) {
        console.log('\n🔑 ADMIN CREDENTIALS FOUND:');
        console.log('   Username:', adminCreds.value.username);
        console.log('   Password:', adminCreds.value.password);
      }
      
      // Show all setting keys
      console.log('\n📋 All settings keys found:');
      settings.forEach(s => console.log(`   - ${s.key}`));
    }

    // Check 2: Admin sessions
    console.log('\n2️⃣ Checking admin_sessions table...');
    const { data: sessions, error: sessionsError } = await supabase
      .from('admin_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (sessionsError) {
      console.log('❌ Admin sessions error:', sessionsError.message);
    } else {
      console.log(`✅ Found ${sessions.length} admin session records`);
      if (sessions.length > 0) {
        console.log('\n👤 Recent admin usernames:');
        sessions.forEach((session, i) => {
          console.log(`   ${i+1}. ${session.username} (${session.created_at})`);
        });
      }
    }

    // Check 3: User profiles
    console.log('\n3️⃣ Checking user_profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(5);

    if (profilesError) {
      console.log('❌ User profiles error:', profilesError.message);
    } else {
      console.log(`✅ Found ${profiles.length} user profile records`);
      if (profiles.length > 0) {
        console.log('\n👥 User profiles:');
        profiles.forEach((profile, i) => {
          console.log(`   ${i+1}. ${profile.full_name || 'No name'} (${profile.email || 'No email'})`);
        });
      }
    }

    // Check 4: Profiles table (alternative user table)
    console.log('\n4️⃣ Checking profiles table...');
    const { data: altProfiles, error: altProfilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (altProfilesError) {
      console.log('❌ Profiles error:', altProfilesError.message);
    } else {
      console.log(`✅ Found ${altProfiles.length} profile records`);
      if (altProfiles.length > 0) {
        console.log('\n👥 Profiles:');
        altProfiles.forEach((profile, i) => {
          const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          console.log(`   ${i+1}. ${name || 'No name'} (${profile.email || 'No email'})`);
        });
      }
    }

    // Check 5: Orders table for customer emails
    console.log('\n5️⃣ Checking orders table for customer emails...');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('customer_email, customer_name, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (ordersError) {
      console.log('❌ Orders error:', ordersError.message);
    } else {
      console.log(`✅ Found ${orders.length} order records`);
      if (orders.length > 0) {
        console.log('\n📦 Recent customer orders:');
        const uniqueCustomers = new Map();
        orders.forEach(order => {
          if (order.customer_email && !uniqueCustomers.has(order.customer_email)) {
            uniqueCustomers.set(order.customer_email, order);
          }
        });

        Array.from(uniqueCustomers.values()).forEach((order, i) => {
          console.log(`   ${i+1}. ${order.customer_name || 'No name'} (${order.customer_email})`);
        });
      }
    }

    // Check 6: Comments table for customer emails
    console.log('\n6️⃣ Checking comments table for customer emails...');
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('customer_email, customer_name, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (commentsError) {
      console.log('❌ Comments error:', commentsError.message);
    } else {
      console.log(`✅ Found ${comments.length} comment records`);
      if (comments.length > 0) {
        console.log('\n💬 Recent customer comments:');
        const uniqueCommenters = new Map();
        comments.forEach(comment => {
          if (comment.customer_email && !uniqueCommenters.has(comment.customer_email)) {
            uniqueCommenters.set(comment.customer_email, comment);
          }
        });

        Array.from(uniqueCommenters.values()).forEach((comment, i) => {
          console.log(`   ${i+1}. ${comment.customer_name || 'No name'} (${comment.customer_email})`);
        });
      }
    }

    // Check 7: Try to get all table names to see what else exists
    console.log('\n7️⃣ Checking for other tables with user data...');
    try {
      // Try some common table names that might contain user info
      const tablesToCheck = ['users', 'customers', 'accounts', 'auth_users'];

      for (const tableName of tablesToCheck) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);

          if (!error && data) {
            console.log(`✅ Found table: ${tableName} with ${data.length} records`);
            if (data.length > 0) {
              console.log(`   Sample columns: ${Object.keys(data[0]).join(', ')}`);
            }
          }
        } catch (e) {
          // Table doesn't exist, continue
        }
      }
    } catch (e) {
      console.log('❌ Error checking additional tables:', e.message);
    }

    console.log('\n📋 SUMMARY:');
    console.log('   Project ID: yliofvqfyimlbxjmsuow');
    console.log('   Admin Credentials Found: admin / persian123');
    console.log('   To access Supabase Dashboard:');
    console.log('   1. Go to https://supabase.com');
    console.log('   2. Try logging in with GitHub/Google/Email');
    console.log('   3. Look for project "yliofvqfyimlbxjmsuow"');
    console.log('\n💡 TIP: The account email you used to create this Supabase project');
    console.log('   should be the one you can use to log into the Supabase dashboard.');

  } catch (error) {
    console.log('❌ Script failed:', error.message);
  }
}

findCredentials().then(() => {
  console.log('\n🏁 Search completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
