// Script to update Supabase authentication configuration
// This script helps configure email confirmation and rate limits

import { createClient } from '@supabase/supabase-js';

// Your Supabase configuration
const SUPABASE_URL = 'https://htdgoceqepvrffblfvns.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY_HERE'; // You need to get this from Supabase dashboard

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function updateAuthConfig() {
  console.log('🔧 Updating Supabase authentication configuration...');
  
  try {
    // Note: This requires the service role key, not the anon key
    const response = await fetch(`${SUPABASE_URL}/auth/v1/settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        // Disable auto-confirmation to require email verification
        MAILER_AUTOCONFIRM: false,
        
        // Increase rate limits
        RATE_LIMIT_EMAIL_SENT: 1000,
        RATE_LIMIT_ANONYMOUS_USERS: 100,
        RATE_LIMIT_VERIFY: 100,
        
        // Ensure email is enabled
        EXTERNAL_EMAIL_ENABLED: true,
        
        // Email templates (optional customization)
        MAILER_SUBJECTS_CONFIRMATION: 'Conferma la tua registrazione - Pizzeria Senza Cipolla',
        MAILER_TEMPLATES_CONFIRMATION: `
          <h2>Benvenuto in Pizzeria Senza Cipolla!</h2>
          <p>Grazie per esserti registrato. Clicca sul link qui sotto per confermare il tuo account:</p>
          <p><a href="{{ .ConfirmationURL }}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Conferma Account</a></p>
          <p>Se non riesci a cliccare sul pulsante, copia e incolla questo link nel tuo browser:</p>
          <p>{{ .ConfirmationURL }}</p>
          <br>
          <p>Grazie,<br>Il team di Pizzeria Senza Cipolla</p>
        `
      })
    });
    
    if (response.ok) {
      console.log('✅ Authentication configuration updated successfully!');
      console.log('📧 Email confirmation is now enabled');
      console.log('⚡ Rate limits have been increased');
    } else {
      const error = await response.text();
      console.error('❌ Failed to update configuration:', error);
    }
    
  } catch (error) {
    console.error('❌ Error updating auth configuration:', error);
  }
}

// Manual configuration instructions
console.log(`
🔧 MANUAL CONFIGURATION INSTRUCTIONS
=====================================

Since the service role key is required, please follow these steps:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/htdgoceqepvrffblfvns

2. Navigate to Authentication > Settings

3. Update the following settings:

   📧 EMAIL CONFIRMATION:
   - Enable email confirmations: ON
   - Auto Confirm Users: OFF
   
   ⚡ RATE LIMITS:
   - Rate limit for email sent: 1000 (or unlimited)
   - Rate limit for anonymous users: 100
   - Rate limit for verify: 100
   
   📝 EMAIL TEMPLATES (Optional):
   - Confirmation email subject: "Conferma la tua registrazione - Pizzeria Senza Cipolla"
   - Customize the confirmation email template with Italian text

4. Save the changes

5. Test user registration to ensure email confirmation works

🔑 SMTP CONFIGURATION (Required for email sending):
If you haven't configured SMTP yet, you'll need to:
1. Go to Authentication > Settings > SMTP Settings
2. Configure your email provider (Gmail, SendGrid, etc.)
3. Or use Supabase's built-in email service (limited)

📧 EMAIL PROVIDER OPTIONS:
- Gmail SMTP (free, limited)
- SendGrid (recommended for production)
- Mailgun
- Amazon SES
- Or any other SMTP provider
`);

// Run the update function if service role key is provided
if (SUPABASE_SERVICE_ROLE_KEY !== 'YOUR_SERVICE_ROLE_KEY_HERE') {
  updateAuthConfig();
} else {
  console.log('\n⚠️  Please update the SUPABASE_SERVICE_ROLE_KEY in this script first!');
}
