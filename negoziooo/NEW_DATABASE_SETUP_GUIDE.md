# Pizzeria Regina 2000 - New Database Setup Guide

## Quick Setup Instructions

### 1. Create New Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and enter project details:
   - **Name**: `pizzeria-regina-2000`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your location
4. Wait for project creation (2-3 minutes)

### 2. Run Database Setup Script
1. Go to your new project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **"New Query"**
4. Copy and paste the entire content of `NEW_DATABASE_SETUP_SCRIPT.sql`
5. Click **"Run"** to execute the script
6. Verify no errors occurred

### 3. Create Storage Buckets
1. Navigate to **Storage** in the left sidebar
2. Create the following buckets (click "New bucket" for each):
   - `uploads` (Public: Yes) - Main uploads with subdirectories
   - `admin-uploads` (Public: Yes) - Admin-specific uploads
   - `gallery` (Public: Yes) - Gallery images
   - `specialties` (Public: Yes) - Specialty content images

**Note**: The `uploads` bucket uses subdirectories like:
- `uploads/logos/` - Logo files
- `uploads/hero-images/` - Hero section images
- `uploads/hero-backgrounds/` - Hero background images
- `uploads/we-offer/` - "We Offer" section images
- `uploads/chi-siamo/` - "About Us" section images

### 4. Set Storage Policies
**Note**: Storage policies are included in the main setup script, but if you need to set them manually:

1. In **Storage**, go to **Policies** tab
2. Run this SQL in the SQL Editor:

```sql
-- Storage policies for public access
CREATE POLICY "Allow public reads from image buckets" ON storage.objects
  FOR SELECT USING (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));

CREATE POLICY "Allow public uploads to image buckets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));

CREATE POLICY "Allow public updates to image buckets" ON storage.objects
  FOR UPDATE USING (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'))
  WITH CHECK (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));

CREATE POLICY "Allow public deletes from image buckets" ON storage.objects
  FOR DELETE USING (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));

CREATE POLICY "Allow public bucket access" ON storage.buckets
  FOR SELECT USING (true);
```

### 5. Get Project Credentials
1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (Keep this secret!)

### 6. Update Environment Variables
Update your `.env` file with the new credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-new-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-new-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-new-service-role-key

# Stripe Configuration (if using payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBkHCjFa0GKD7lJThAyFnSaeCXFDsBtJhs
```

### 7. Update Application Configuration
Update `src/integrations/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 8. Test the Setup
1. Start your development server: `npm run dev`
2. Visit the application in your browser
3. Check that:
   - Homepage loads correctly
   - Settings are loaded from database
   - Admin panel is accessible (username: `admin`, password: `persian123`)
   - Image uploads work in admin panel

### 9. Upload Default Images (Optional)
1. Go to admin panel → Settings
2. Upload images for:
   - Logo
   - Hero background
   - Hero image
   - "We Offer" section images
   - "Chi Siamo" section image

### 10. Configure Stripe (If Using Payments)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your API keys from **Developers** → **API keys**
3. Set up webhook endpoint: `https://your-project-id.supabase.co/functions/v1/stripe-webhook`
4. Add webhook events: `checkout.session.completed`, `payment_intent.succeeded`

## Verification Checklist

- [ ] Database tables created successfully
- [ ] RLS policies applied
- [ ] Storage buckets created with public access
- [ ] Environment variables updated
- [ ] Application starts without errors
- [ ] Settings load from database
- [ ] Admin panel accessible
- [ ] Image uploads work
- [ ] Orders can be placed (if testing e-commerce)

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `persian123`

**⚠️ Important**: Change the admin password after setup!

## Troubleshooting

### Common Issues:

1. **"relation does not exist" errors**
   - Make sure the setup script ran completely without errors
   - Check that all tables were created in the SQL Editor

2. **RLS policy errors**
   - Verify RLS is enabled on all tables
   - Check that policies were created correctly

3. **Storage upload errors**
   - Ensure storage buckets are created and set to public
   - Verify storage policies are applied

4. **Settings not loading**
   - Check that default settings were inserted
   - Verify the `settings` table has data

5. **Admin login not working**
   - Verify `adminCredentials` setting exists in database
   - Check that the credentials match exactly

### Getting Help:

1. Check the browser console for JavaScript errors
2. Check the Supabase logs in the dashboard
3. Verify all environment variables are set correctly
4. Ensure the database setup script completed successfully

## Database Structure Summary

The database includes:
- **17 main tables** for core functionality
- **Comprehensive RLS policies** for security
- **Performance indexes** for optimization
- **Essential default data** for immediate functionality
- **Storage buckets** for file uploads
- **Admin authentication** system
- **Order management** system
- **User profiles** and authentication
- **Multi-language content** support

## Next Steps

After successful setup:
1. Customize the default content and images
2. Add your menu items and categories
3. Configure delivery zones
4. Set up payment processing (if needed)
5. Test the complete order flow
6. Deploy to production

---

**Setup Complete!** Your new Pizzeria Regina 2000 database is ready to use.
