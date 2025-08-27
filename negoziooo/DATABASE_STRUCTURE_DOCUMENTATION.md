# Pizzeria Regina 2000 - Complete Database Structure Documentation

## Overview
This document provides a comprehensive analysis of the Supabase database structure for the Pizzeria Regina 2000 project. This documentation is essential for setting up a new Supabase database with identical structure and functionality.

## Database Schema: `public`

### Core Tables Structure

#### 1. **settings** (Key-Value Configuration Store)
**Purpose**: Central configuration table storing all application settings as JSON
```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Critical Settings Keys**:
- `heroContent`: Homepage hero section content
- `logoSettings`: Logo URL and alt text
- `aboutSections`: About page content sections
- `restaurantSettings`: Basic restaurant configuration
- `contactContent`: Contact information
- `businessHours`: Operating hours for orders
- `pizzeriaDisplayHours`: Display hours for website
- `galleryContent`: Gallery section headings
- `galleryImages`: Gallery images array (legacy)
- `weOfferContent`: "We Offer" section content
- `chiSiamoContent`: Multi-language "About Us" content
- `adminCredentials`: Admin login credentials
- `notificationSettings`: Order notification configuration
- `shippingZoneSettings`: Delivery zone configuration
- `deliveryZones`: Delivery zones array
- `popups`: Active popups configuration
- `youtubeVideo`: YouTube video settings

#### 2. **categories** (Product Categories)
```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. **products** (Menu Items)
```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  ingredients TEXT[], -- Array of ingredients
  allergens TEXT[], -- Array of allergens
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  preparation_time INTEGER DEFAULT 15,
  calories INTEGER,
  slug TEXT UNIQUE,
  stock_quantity INTEGER DEFAULT 0,
  compare_price NUMERIC(10,2),
  meta_title TEXT,
  meta_description TEXT,
  labels TEXT[], -- Array of labels
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. **orders** (Customer Orders)
```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  delivery_type TEXT DEFAULT 'delivery',
  total_amount NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT 'cash_on_delivery',
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  order_type TEXT DEFAULT 'online',
  special_instructions TEXT,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  user_id UUID, -- Links to auth.users
  order_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. **order_items** (Order Line Items)
```sql
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_price NUMERIC(10,2) NOT NULL,
  unit_price NUMERIC(10,2),
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal NUMERIC(10,2) NOT NULL,
  special_requests TEXT,
  size TEXT,
  toppings TEXT[], -- Array of toppings
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 6. **user_profiles** (Customer Profiles)
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY, -- Links to auth.users.id
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  default_address TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 7. **gallery_images** (Gallery Management)
```sql
CREATE TABLE gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 8. **comments** (Customer Reviews)
```sql
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  rating INTEGER,
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 9. **youtube_videos** (Video Management)
```sql
CREATE TABLE youtube_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 10. **popups** (Popup Management)
```sql
CREATE TABLE popups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  button_text TEXT,
  button_url TEXT,
  is_active BOOLEAN DEFAULT false,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  display_frequency TEXT DEFAULT 'once_per_session',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Administrative Tables

#### 11. **admin_sessions** (Admin Authentication)
```sql
CREATE TABLE admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

#### 12. **admin_activity_log** (Admin Activity Tracking)
```sql
CREATE TABLE admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Order Management Tables

#### 13. **order_notifications** (Order Notifications)
```sql
CREATE TABLE order_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_acknowledged BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 14. **order_status_history** (Order Status Tracking)
```sql
CREATE TABLE order_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  old_status TEXT,
  new_status TEXT NOT NULL,
  notes TEXT,
  changed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Utility Tables

#### 15. **delivery_zones** (Delivery Zone Management)
```sql
CREATE TABLE delivery_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  max_distance NUMERIC(5,2),
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  estimated_time TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 16. **notification_sounds** (Notification Sound Management)
```sql
CREATE TABLE notification_sounds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  file_path TEXT,
  file_url TEXT,
  sound_type TEXT DEFAULT 'built-in',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 17. **content_sections** (Dynamic Content Management)
```sql
CREATE TABLE content_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  section_name TEXT,
  title TEXT,
  content TEXT,
  content_type TEXT,
  content_value TEXT,
  image_url TEXT,
  video_url TEXT,
  metadata JSONB,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Foreign Key Relationships

```sql
-- Products belong to categories
ALTER TABLE products ADD CONSTRAINT products_category_id_fkey 
  FOREIGN KEY (category_id) REFERENCES categories(id);

-- Order items belong to orders and products
ALTER TABLE order_items ADD CONSTRAINT order_items_order_id_fkey 
  FOREIGN KEY (order_id) REFERENCES orders(id);
ALTER TABLE order_items ADD CONSTRAINT order_items_product_id_fkey 
  FOREIGN KEY (product_id) REFERENCES products(id);

-- Order notifications belong to orders
ALTER TABLE order_notifications ADD CONSTRAINT order_notifications_order_id_fkey 
  FOREIGN KEY (order_id) REFERENCES orders(id);

-- Order status history belongs to orders
ALTER TABLE order_status_history ADD CONSTRAINT order_status_history_order_id_fkey 
  FOREIGN KEY (order_id) REFERENCES orders(id);
```

## Performance Indexes

### Critical Indexes for Performance:
```sql
-- Settings table
CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_updated_at ON settings(updated_at);

-- Categories table
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);
CREATE INDEX idx_categories_active_sort ON categories(is_active, sort_order) WHERE (is_active = true);

-- Products table
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_active_name ON products(is_active, name) WHERE (is_active = true);

-- Orders table
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_user_status ON orders(user_id, status) WHERE (user_id IS NOT NULL);

-- User profiles table
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_id ON user_profiles(id);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at);
CREATE INDEX idx_user_profiles_updated_at ON user_profiles(updated_at);

-- Admin tables
CREATE INDEX idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_username ON admin_sessions(username);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX idx_admin_sessions_active ON admin_sessions(is_active);

CREATE INDEX idx_admin_activity_username ON admin_activity_log(username);
CREATE INDEX idx_admin_activity_action ON admin_activity_log(action);
CREATE INDEX idx_admin_activity_created ON admin_activity_log(created_at);
```

## Row Level Security (RLS) Policies

### Settings Table Policies:
```sql
-- Allow public read access to settings
CREATE POLICY "Allow public read access to settings"
  ON settings FOR SELECT USING (true);

-- Allow authenticated users to update settings
CREATE POLICY "Allow authenticated users to update settings"
  ON settings FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to insert settings
CREATE POLICY "Allow authenticated users to insert settings"
  ON settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete settings
CREATE POLICY "Allow authenticated users to delete settings"
  ON settings FOR DELETE
  USING (auth.role() = 'authenticated');
```

### Categories Table Policies:
```sql
-- Allow public read access to active categories
CREATE POLICY "Allow public read access to active categories"
  ON categories FOR SELECT
  USING (is_active = true);

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated users full access to categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

### Products Table Policies:
```sql
-- Allow public read access to active products
CREATE POLICY "Allow public read access to active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated users full access to products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

### Orders Table Policies:
```sql
-- Allow users to read their own orders
CREATE POLICY "Users can read their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'authenticated');

-- Allow users to insert their own orders
CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'authenticated');

-- Allow authenticated users (admin) to update orders
CREATE POLICY "Allow authenticated users to update orders"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

### User Profiles Table Policies:
```sql
-- Users can read their own profile
CREATE POLICY "Users can read their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admin can read all profiles
CREATE POLICY "Admin can read all profiles"
  ON user_profiles FOR SELECT
  USING (auth.role() = 'authenticated');
```

## Database Functions and Triggers

### Update Timestamp Triggers:
```sql
-- Generic function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at column
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_youtube_videos_updated_at
  BEFORE UPDATE ON youtube_videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_sections_updated_at
  BEFORE UPDATE ON content_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Order Management Functions:
```sql
-- Function to safely delete orders and related data
CREATE OR REPLACE FUNCTION delete_order_cascade(order_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Delete order items first (due to foreign key)
  DELETE FROM order_items WHERE order_id = order_uuid;

  -- Delete order notifications
  DELETE FROM order_notifications WHERE order_id = order_uuid;

  -- Delete order status history
  DELETE FROM order_status_history WHERE order_id = order_uuid;

  -- Finally delete the order
  DELETE FROM orders WHERE id = order_uuid;

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Storage Buckets Configuration

### Required Storage Buckets:
```sql
-- Create storage buckets with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at, updated_at)
VALUES
  ('uploads', 'uploads', true, 52428800, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'], NOW(), NOW()),
  ('admin-uploads', 'admin-uploads', true, 52428800, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'], NOW(), NOW()),
  ('gallery', 'gallery', true, 52428800, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'], NOW(), NOW()),
  ('specialties', 'specialties', true, 52428800, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'], NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types,
  updated_at = NOW();

-- Storage policies for comprehensive access
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

### Storage Structure:
- **uploads**: Main bucket with subdirectories:
  - `uploads/logos/` - Logo files
  - `uploads/hero-images/` - Hero section images
  - `uploads/hero-backgrounds/` - Hero background images
  - `uploads/we-offer/` - "We Offer" section images
  - `uploads/chi-siamo/` - "About Us" section images
- **admin-uploads**: Admin-specific uploads
- **gallery**: Gallery images
- **specialties**: Specialty content images

## Essential Default Data

### Critical Settings Data Structure:
```json
{
  "heroContent": {
    "heading": "Pizzeria Regina 2000",
    "subheading": "Autentica pizza italiana nel cuore di Torino",
    "backgroundImage": "/hero-pizza-bg.jpg",
    "heroImage": "URL_TO_HERO_IMAGE"
  },
  "logoSettings": {
    "logoUrl": "/pizzeria-regina-logo.png",
    "altText": "Pizzeria Regina 2000 Torino Logo"
  },
  "contactContent": {
    "address": "Corso Regina Margherita, 53/b, 10124, Torino TO, Italia",
    "phone": "0110769211",
    "email": "anilamyzyri@gmail.com",
    "mapUrl": "https://maps.google.com",
    "hours": "Lun-Dom: 18:30 - 22:30"
  },
  "restaurantSettings": {
    "totalSeats": 50,
    "reservationDuration": 120,
    "openingTime": "11:30",
    "closingTime": "22:00",
    "languages": ["it", "en", "ar", "fa"],
    "defaultLanguage": "it"
  },
  "businessHours": {
    "monday": {"isOpen": true, "openTime": "14:30", "closeTime": "22:30"},
    "tuesday": {"isOpen": true, "openTime": "14:30", "closeTime": "22:30"},
    "wednesday": {"isOpen": true, "openTime": "18:30", "closeTime": "22:30"},
    "thursday": {"isOpen": true, "openTime": "18:30", "closeTime": "22:30"},
    "friday": {"isOpen": true, "openTime": "18:30", "closeTime": "22:30"},
    "saturday": {"isOpen": true, "openTime": "18:30", "closeTime": "22:30"},
    "sunday": {"isOpen": true, "openTime": "18:30", "closeTime": "22:30"}
  },
  "pizzeriaDisplayHours": {
    "monday": {
      "isOpen": true,
      "periods": [
        {"openTime": "12:00", "closeTime": "14:30"},
        {"openTime": "18:00", "closeTime": "00:00"}
      ]
    }
    // ... similar structure for all days
  },
  "adminCredentials": {
    "username": "admin",
    "password": "persian123"
  },
  "notificationSettings": {
    "soundEnabled": true,
    "emailEnabled": true,
    "emailAddress": "orders@pizzeriaregina2000.it",
    "soundType": "bell",
    "soundVolume": 80,
    "continuousSound": true,
    "browserNotifications": true
  },
  "shippingZoneSettings": {
    "enabled": true,
    "deliveryFee": 5,
    "maxDeliveryDistance": 15,
    "freeDeliveryThreshold": 50,
    "restaurantLat": 45.0703,
    "restaurantLng": 7.6869,
    "googleMapsApiKey": "AIzaSyBkHCjFa0GKD7lJThAyFnSaeCXFDsBtJhs",
    "restaurantAddress": "Piazza della Repubblica, 10100 Torino TO"
  }
}
```

## Migration Files Order

### Required Migration Files (in order):
1. `20250115000000_create_settings_table.sql` - Core settings table
2. `20250115000000_create_category_sections.sql` - Categories and sections
3. `20250115000001_create_content_sections.sql` - Content management
4. `20250115120000_create_delete_order_function.sql` - Order management functions
5. `20250115121000_fix_order_deletion_policies.sql` - Order deletion policies
6. `20250115130000_add_payment_fields.sql` - Payment integration fields
7. `20250116000000_add_performance_indexes.sql` - Performance optimization
8. `20250117000000_create_user_profiles_table.sql` - User management
9. `20250117000001_enhance_admin_authentication.sql` - Admin authentication
10. `20250514151200_add_settings_rls_policy.sql` - Additional RLS policies
11. `20250627000000_create_storage_buckets.sql` - Storage configuration

## Environment Variables Required

### Supabase Configuration:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Stripe Configuration:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Google Maps:
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBkHCjFa0GKD7lJThAyFnSaeCXFDsBtJhs
```

## Critical Notes for New Database Setup

1. **Settings Table is Essential**: The entire application depends on the `settings` table for configuration
2. **RLS Must Be Enabled**: All tables require proper RLS policies for security
3. **Storage Buckets**: Must be created with public access for image uploads
4. **Default Data**: Essential settings must be populated for the app to function
5. **Indexes**: Performance indexes are critical for production use
6. **Foreign Keys**: Maintain referential integrity between related tables
7. **Triggers**: Update timestamp triggers must be applied to all relevant tables

## Authentication Schema

The application uses Supabase Auth with the default `auth` schema tables:
- `auth.users` - User authentication
- `auth.sessions` - User sessions
- `auth.refresh_tokens` - Token management

The `user_profiles` table extends user data with application-specific fields.

---

**Last Updated**: 2025-07-20
**Database Version**: Compatible with Supabase PostgreSQL 15+
**Application**: Pizzeria Regina 2000 - Full-Stack E-commerce Platform
