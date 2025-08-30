import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hnoadcbppldmawognwdx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhub2FkY2JwcGxkbWF3b2dud2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0ODgwMjEsImV4cCI6MjA3MjA2NDAyMX0.cMQBW7VFcWFdVsXY-0H0PaLRDSY13jicT4lPGh9Pmlo'
);

console.log('🔍 Finding Your Supabase Login Email...\n');

async function findLoginEmail() {
  try {
    console.log('📊 Project: hnoadcbppldmawognwdx');
    console.log('🌐 Dashboard: https://supabase.com/dashboard/project/hnoadcbppldmawognwdx\n');

    // Get all settings to extract emails
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*');

    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }

    console.log('🎯 EMAILS FOUND IN YOUR DATABASE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Extract all email addresses from settings
    const emailAddresses = new Set();
    
    settings.forEach(setting => {
      const value = setting.value;
      
      // Check if value is a string and contains email pattern
      if (typeof value === 'string' && value.includes('@')) {
        const emailMatch = value.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
        if (emailMatch) {
          emailMatch.forEach(email => emailAddresses.add(email));
        }
      }
      
      // Check if value is an object and extract emails
      if (typeof value === 'object' && value !== null) {
        const jsonStr = JSON.stringify(value);
        const emailMatch = jsonStr.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
        if (emailMatch) {
          emailMatch.forEach(email => emailAddresses.add(email));
        }
      }
    });

    // Display found emails with likelihood ranking
    const emails = Array.from(emailAddresses);
    
    if (emails.length > 0) {
      console.log('📧 EMAIL ADDRESSES FOUND:');
      emails.forEach((email, index) => {
        console.log(`   ${index + 1}. ${email}`);
        
        // Analyze likelihood
        if (email.includes('orders@') || email.includes('admin@') || email.includes('owner@')) {
          console.log('      🎯 HIGH LIKELIHOOD - Business/admin email');
        } else if (email.includes('noreply') || email.includes('no-reply')) {
          console.log('      ⚠️  LOW LIKELIHOOD - System email');
        } else {
          console.log('      🤔 MEDIUM LIKELIHOOD - Could be personal email');
        }
      });
      
      console.log('\n🏆 MOST LIKELY SUPABASE LOGIN EMAIL:');
      console.log(`   📧 ${emails[0]}`);
      console.log('   ↳ This is configured as your notification email');
      
    } else {
      console.log('❌ No email addresses found in database settings');
    }

    console.log('\n🔐 HOW TO ACCESS YOUR SUPABASE ACCOUNT:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (emails.length > 0) {
      console.log('1️⃣ Try logging in with the email above:');
      console.log('   • Go to: https://supabase.com/dashboard');
      console.log(`   • Email: ${emails[0]}`);
      console.log('   • Use "Forgot Password" if you don\'t remember the password');
      
      console.log('\n2️⃣ Check your email inbox:');
      console.log(`   • Look for emails from Supabase in ${emails[0]}`);
      console.log('   • Search for "Welcome to Supabase" or "Confirm your email"');
    }
    
    console.log('\n3️⃣ Alternative login methods:');
    console.log('   • GitHub: If you signed up with GitHub');
    console.log('   • Google: If you signed up with Google');
    console.log('   • Check browser saved passwords for supabase.com');
    
    console.log('\n4️⃣ Browser detective work:');
    console.log('   • Check browser history for supabase.com visits');
    console.log('   • Look in browser\'s saved passwords');
    console.log('   • Check autofill suggestions on supabase.com login');
    
    console.log('\n5️⃣ Email detective work:');
    console.log('   • Search all your email accounts for "supabase"');
    console.log('   • Look for project creation confirmations');
    console.log('   • Check spam/junk folders');
    
    console.log('\n🆘 If nothing works:');
    console.log('   • Contact Supabase support');
    console.log('   • Provide project ID: yliofvqfyimlbxjmsuow');
    console.log('   • They can help you recover your account');

  } catch (error) {
    console.log('❌ Script failed:', error.message);
  }
}

findLoginEmail().then(() => {
  console.log('\n🏁 Email search completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
