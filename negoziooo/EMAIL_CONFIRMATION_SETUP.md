# Email Confirmation Setup Guide

## 🎯 Overview
This guide will help you enable email confirmation for user registration with unlimited rate limits.

## 📧 Step 1: Configure Supabase Authentication Settings

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/htdgoceqepvrffblfvns
   - Navigate to **Authentication > Settings**

2. **Email Confirmation Settings**
   ```
   ✅ Enable email confirmations: ON
   ❌ Auto Confirm Users: OFF
   ```

3. **Rate Limits (Increase to Maximum)**
   ```
   📧 Rate limit for email sent: 1000 (or set to 0 for unlimited)
   👥 Rate limit for anonymous users: 1000
   ✅ Rate limit for verify: 1000
   🔄 Rate limit for token refresh: 1000
   📱 Rate limit for OTP: 1000
   ```

4. **Email Templates (Optional - Customize for Italian)**
   - **Confirmation Subject**: `Conferma la tua registrazione - Pizzeria Senza Cipolla`
   - **Confirmation Template**:
   ```html
   <h2>Benvenuto in Pizzeria Senza Cipolla!</h2>
   <p>Grazie per esserti registrato. Clicca sul link qui sotto per confermare il tuo account:</p>
   <p><a href="{{ .ConfirmationURL }}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Conferma Account</a></p>
   <p>Se non riesci a cliccare sul pulsante, copia e incolla questo link nel tuo browser:</p>
   <p>{{ .ConfirmationURL }}</p>
   <br>
   <p>Grazie,<br>Il team di Pizzeria Senza Cipolla</p>
   ```

5. **Site URL Configuration**
   - Make sure **Site URL** is set to: `http://localhost:3000`
   - Add **Redirect URLs**: 
     - `http://localhost:3000/auth/confirm`
     - `http://localhost:3000/auth/confirm/**`

### Option B: Using the Configuration Script

1. **Get your Service Role Key**
   - Go to **Settings > API** in your Supabase dashboard
   - Copy the **service_role** key (not the anon key)

2. **Update the script**
   ```bash
   # Edit the file
   nano update-auth-config.js
   
   # Replace YOUR_SERVICE_ROLE_KEY_HERE with your actual service role key
   ```

3. **Run the script**
   ```bash
   node update-auth-config.js
   ```

## 📨 Step 2: Configure SMTP (Required for Email Sending)

### Option 1: Gmail SMTP (Free, Limited)
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-gmail@gmail.com
SMTP Pass: your-app-password (not your regular password)
```

### Option 2: SendGrid (Recommended for Production)
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Pass: your-sendgrid-api-key
```

### Option 3: Use Supabase Built-in Email (Limited)
- No configuration needed
- Limited to 3 emails per hour on free plan
- Good for testing only

## 🔧 Step 3: Frontend Configuration

The frontend is already configured with:

1. **Email Confirmation Page**: `/auth/confirm`
2. **Enhanced Error Handling**: Detailed logging for debugging
3. **User-Friendly Messages**: Italian language support
4. **Automatic Redirects**: After successful confirmation

## 🧪 Step 4: Testing Email Confirmation

1. **Register a New User**
   - Go to http://localhost:3000
   - Click "Registrati" (Register)
   - Fill out the form with a real email address
   - Click "Crea Account"

2. **Check Your Email**
   - Look for confirmation email
   - Click the confirmation link
   - Should redirect to `/auth/confirm` page

3. **Verify in Database**
   ```sql
   -- Check if user was created
   SELECT id, email, email_confirmed_at FROM auth.users;
   
   -- Check if profile was created
   SELECT * FROM user_profiles;
   ```

## 🐛 Troubleshooting

### Email Not Received
1. Check spam/junk folder
2. Verify SMTP configuration
3. Check rate limits (might be exceeded)
4. Look at Supabase logs in dashboard

### Confirmation Link Not Working
1. Check Site URL configuration
2. Verify redirect URLs are set correctly
3. Check if link has expired (default: 24 hours)

### Database Errors
1. Check browser console for detailed error messages
2. Verify user_profiles table exists and has correct permissions
3. Check if trigger function is working

## 📊 Monitoring

### Check Email Sending Status
```sql
-- Check recent auth events
SELECT * FROM auth.audit_log_entries 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

### Check User Registration Status
```sql
-- Check users and their confirmation status
SELECT 
  id, 
  email, 
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN 'Confirmed'
    ELSE 'Pending'
  END as status
FROM auth.users 
ORDER BY created_at DESC;
```

## 🎉 Success Indicators

✅ User receives confirmation email immediately
✅ Clicking link redirects to confirmation page
✅ User can sign in after confirmation
✅ User profile is created automatically
✅ No "Database error saving new user" messages

## 📞 Support

If you encounter issues:
1. Check browser console for error messages
2. Check Supabase dashboard logs
3. Verify all configuration steps above
4. Test with a different email address
