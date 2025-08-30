-- Supabase Database Recreation Script
-- Generated on: 2025-08-29T17:19:51.454Z
-- Original Project: yliofvqfyimlbxjmsuow

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: settings
CREATE TABLE IF NOT EXISTS settings (
  key TEXT,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  slug TEXT,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id TEXT,
  name TEXT,
  description TEXT,
  price INTEGER,
  image_url TEXT,
  ingredients JSONB,
  allergens TEXT,
  is_vegetarian BOOLEAN,
  is_vegan BOOLEAN,
  is_gluten_free BOOLEAN,
  is_featured BOOLEAN,
  is_active BOOLEAN,
  sort_order INTEGER,
  preparation_time INTEGER,
  calories TEXT,
  slug TEXT,
  stock_quantity INTEGER,
  compare_price TEXT,
  meta_title TEXT,
  meta_description TEXT,
  labels TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (

);

-- Table: order_items
CREATE TABLE IF NOT EXISTS order_items (

);

-- Table: comments
CREATE TABLE IF NOT EXISTS comments (

);

-- Table: user_profiles
CREATE TABLE IF NOT EXISTS user_profiles (

);

-- Table: admin_sessions
CREATE TABLE IF NOT EXISTS admin_sessions (

);

-- Table: content_sections
CREATE TABLE IF NOT EXISTS content_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT,
  section_name TEXT,
  title TEXT,
  content TEXT,
  content_type TEXT,
  content_value TEXT,
  image_url TEXT,
  video_url TEXT,
  metadata JSONB,
  is_active BOOLEAN,
  sort_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
-- Note: These are templates based on common patterns
-- You may need to adjust based on your specific requirements

-- Enable RLS for settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access policy for settings
CREATE POLICY "Allow public read access to settings" ON settings
  FOR SELECT USING (true);

-- Authenticated users full access policy for settings
CREATE POLICY "Allow authenticated users full access to settings" ON settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access policy for categories
CREATE POLICY "Allow public read access to categories" ON categories
  FOR SELECT USING (true);

-- Authenticated users full access policy for categories
CREATE POLICY "Allow authenticated users full access to categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access policy for products
CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);

-- Authenticated users full access policy for products
CREATE POLICY "Allow authenticated users full access to products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public read access policy for orders
CREATE POLICY "Allow public read access to orders" ON orders
  FOR SELECT USING (true);

-- Authenticated users full access policy for orders
CREATE POLICY "Allow authenticated users full access to orders" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS for order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access policy for order_items
CREATE POLICY "Allow public read access to order_items" ON order_items
  FOR SELECT USING (true);

-- Authenticated users full access policy for order_items
CREATE POLICY "Allow authenticated users full access to order_items" ON order_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS for comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public read access policy for comments
CREATE POLICY "Allow public read access to comments" ON comments
  FOR SELECT USING (true);

-- Authenticated users full access policy for comments
CREATE POLICY "Allow authenticated users full access to comments" ON comments
  FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Public read access policy for user_profiles
CREATE POLICY "Allow public read access to user_profiles" ON user_profiles
  FOR SELECT USING (true);

-- Authenticated users full access policy for user_profiles
CREATE POLICY "Allow authenticated users full access to user_profiles" ON user_profiles
  FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS for admin_sessions
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Public read access policy for admin_sessions
CREATE POLICY "Allow public read access to admin_sessions" ON admin_sessions
  FOR SELECT USING (true);

-- Authenticated users full access policy for admin_sessions
CREATE POLICY "Allow authenticated users full access to admin_sessions" ON admin_sessions
  FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS for content_sections
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;

-- Public read access policy for content_sections
CREATE POLICY "Allow public read access to content_sections" ON content_sections
  FOR SELECT USING (true);

-- Authenticated users full access policy for content_sections
CREATE POLICY "Allow authenticated users full access to content_sections" ON content_sections
  FOR ALL USING (auth.role() = 'authenticated');

