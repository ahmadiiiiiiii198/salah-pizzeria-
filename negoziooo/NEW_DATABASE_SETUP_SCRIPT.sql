-- =====================================================
-- PIZZERIA REGINA 2000 - NEW DATABASE SETUP SCRIPT
-- =====================================================
-- This script creates the complete database structure
-- for a new Supabase database instance
-- =====================================================

-- =====================================================
-- 1. CORE TABLES CREATION
-- =====================================================

-- Settings table (CRITICAL - App depends on this)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
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

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  ingredients TEXT[],
  allergens TEXT[],
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
  labels TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
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
  user_id UUID,
  order_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
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
  toppings TEXT[],
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  default_address TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery images table
CREATE TABLE IF NOT EXISTS gallery_images (
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

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
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

-- YouTube videos table
CREATE TABLE IF NOT EXISTS youtube_videos (
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

-- Popups table
CREATE TABLE IF NOT EXISTS popups (
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

-- Admin sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
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

-- Admin activity log table
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order notifications table
CREATE TABLE IF NOT EXISTS order_notifications (
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

-- Order status history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  old_status TEXT,
  new_status TEXT NOT NULL,
  notes TEXT,
  changed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery zones table
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  max_distance NUMERIC(5,2),
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  estimated_time TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification sounds table
CREATE TABLE IF NOT EXISTS notification_sounds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  file_path TEXT,
  file_url TEXT,
  sound_type TEXT DEFAULT 'built-in',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content sections table
CREATE TABLE IF NOT EXISTS content_sections (
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

-- =====================================================
-- 2. INDEXES FOR PERFORMANCE
-- =====================================================

-- Settings indexes
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_updated_at ON settings(updated_at);

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_active_sort ON categories(is_active, sort_order) WHERE (is_active = true);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_active_name ON products(is_active, name) WHERE (is_active = true);
CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(category_id, is_active) WHERE (is_active = true);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status) WHERE (user_id IS NOT NULL);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_updated_at ON user_profiles(updated_at);

-- Admin indexes
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_username ON admin_sessions(username);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_active ON admin_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_activity_username ON admin_activity_log(username);
CREATE INDEX IF NOT EXISTS idx_admin_activity_action ON admin_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created ON admin_activity_log(created_at);

-- =====================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE popups ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_sounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. RLS POLICIES
-- =====================================================

-- Settings policies
CREATE POLICY "Allow public read access to settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to update settings" ON settings FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert settings" ON settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete settings" ON settings FOR DELETE USING (auth.role() = 'authenticated');

-- Categories policies
CREATE POLICY "Allow public read access to active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated users full access to categories" ON categories FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Products policies
CREATE POLICY "Allow public read access to active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated users full access to products" ON products FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Orders policies
CREATE POLICY "Users can read their own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'authenticated');
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Order items policies
CREATE POLICY "Users can read order items for their orders" ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR auth.role() = 'authenticated')));
CREATE POLICY "Users can insert order items for their orders" ON order_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR auth.role() = 'authenticated')));
CREATE POLICY "Allow authenticated users to manage order items" ON order_items FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- User profiles policies
CREATE POLICY "Users can read their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admin can read all profiles" ON user_profiles FOR SELECT USING (auth.role() = 'authenticated');

-- Gallery images policies
CREATE POLICY "Allow public read access to active gallery images" ON gallery_images FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated users full access to gallery images" ON gallery_images FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Comments policies
CREATE POLICY "Allow public read access to approved comments" ON comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Allow public insert of comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users full access to comments" ON comments FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- YouTube videos policies
CREATE POLICY "Allow public read access to active videos" ON youtube_videos FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated users full access to videos" ON youtube_videos FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Popups policies
CREATE POLICY "Allow public read access to active popups" ON popups FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated users full access to popups" ON popups FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Admin sessions policies
CREATE POLICY "Allow authenticated users to manage admin sessions" ON admin_sessions FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Admin activity log policies
CREATE POLICY "Allow authenticated users to read admin activity log" ON admin_activity_log FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert admin activity log" ON admin_activity_log FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Order notifications policies
CREATE POLICY "Allow authenticated users full access to order notifications" ON order_notifications FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Order status history policies
CREATE POLICY "Allow authenticated users full access to order status history" ON order_status_history FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Delivery zones policies
CREATE POLICY "Allow public read access to active delivery zones" ON delivery_zones FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated users full access to delivery zones" ON delivery_zones FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Notification sounds policies
CREATE POLICY "Allow public read access to active notification sounds" ON notification_sounds FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated users full access to notification sounds" ON notification_sounds FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Content sections policies
CREATE POLICY "Allow public read access to active content sections" ON content_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Allow authenticated users full access to content sections" ON content_sections FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- 5. FUNCTIONS AND TRIGGERS
-- =====================================================

-- Generic function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at column
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_youtube_videos_updated_at BEFORE UPDATE ON youtube_videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_sections_updated_at BEFORE UPDATE ON content_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to safely delete orders and related data
CREATE OR REPLACE FUNCTION delete_order_cascade(order_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  DELETE FROM order_items WHERE order_id = order_uuid;
  DELETE FROM order_notifications WHERE order_id = order_uuid;
  DELETE FROM order_status_history WHERE order_id = order_uuid;
  DELETE FROM orders WHERE id = order_uuid;
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin authentication functions
CREATE OR REPLACE FUNCTION create_admin_session(
  p_username TEXT,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
  session_token TEXT;
BEGIN
  session_token := encode(gen_random_bytes(32), 'base64');
  INSERT INTO admin_sessions (session_token, username, ip_address, user_agent)
  VALUES (session_token, p_username, p_ip_address, p_user_agent);
  INSERT INTO admin_activity_log (username, action, details, ip_address, user_agent)
  VALUES (p_username, 'LOGIN', jsonb_build_object('success', true), p_ip_address, p_user_agent);
  RETURN session_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION validate_admin_session(p_session_token TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  session_valid BOOLEAN := false;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM admin_sessions
    WHERE session_token = p_session_token AND is_active = true AND expires_at > NOW()
  ) INTO session_valid;
  IF session_valid THEN
    UPDATE admin_sessions SET last_activity = NOW() WHERE session_token = p_session_token;
  END IF;
  RETURN session_valid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION invalidate_admin_session(p_session_token TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  session_username TEXT;
BEGIN
  SELECT username INTO session_username FROM admin_sessions WHERE session_token = p_session_token;
  UPDATE admin_sessions SET is_active = false WHERE session_token = p_session_token;
  IF session_username IS NOT NULL THEN
    INSERT INTO admin_activity_log (username, action, details)
    VALUES (session_username, 'LOGOUT', jsonb_build_object('session_token', p_session_token));
  END IF;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION log_admin_activity(
  p_username TEXT,
  p_action TEXT,
  p_resource TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO admin_activity_log (username, action, resource, details, ip_address, user_agent)
  VALUES (p_username, p_action, p_resource, p_details, p_ip_address, p_user_agent);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. ESSENTIAL DEFAULT DATA
-- =====================================================

-- Insert critical settings data
INSERT INTO settings (key, value) VALUES
  ('heroContent', '{"heading": "Pizzeria Regina 2000", "subheading": "Autentica pizza italiana nel cuore di Torino", "backgroundImage": "/hero-pizza-bg.jpg", "heroImage": ""}'),
  ('logoSettings', '{"logoUrl": "/pizzeria-regina-logo.png", "altText": "Pizzeria Regina 2000 Torino Logo"}'),
  ('contactContent', '{"address": "C.so Giulio Cesare, 36, 10152 Torino TO", "phone": "+393479190907", "email": "anilamyzyri@gmail.com", "mapUrl": "https://maps.google.com", "hours": "Lun-Dom: 18:30 - 22:30"}'),
  ('restaurantSettings', '{"totalSeats": 50, "reservationDuration": 120, "openingTime": "11:30", "closingTime": "22:00", "languages": ["it", "en", "ar", "fa"], "defaultLanguage": "it"}'),
  ('businessHours', '{"monday": {"isOpen": true, "openTime": "14:30", "closeTime": "22:30"}, "tuesday": {"isOpen": true, "openTime": "14:30", "closeTime": "22:30"}, "wednesday": {"isOpen": true, "openTime": "18:30", "closeTime": "22:30"}, "thursday": {"isOpen": true, "openTime": "18:30", "closeTime": "22:30"}, "friday": {"isOpen": true, "openTime": "18:30", "closeTime": "22:30"}, "saturday": {"isOpen": true, "openTime": "18:30", "closeTime": "22:30"}, "sunday": {"isOpen": true, "openTime": "18:30", "closeTime": "22:30"}}'),
  ('pizzeriaDisplayHours', '{"monday": {"isOpen": true, "periods": [{"openTime": "12:00", "closeTime": "14:30"}, {"openTime": "18:00", "closeTime": "00:00"}]}, "tuesday": {"isOpen": true, "periods": [{"openTime": "12:00", "closeTime": "14:30"}, {"openTime": "18:00", "closeTime": "00:00"}]}, "wednesday": {"isOpen": true, "periods": [{"openTime": "12:00", "closeTime": "14:30"}, {"openTime": "18:00", "closeTime": "00:00"}]}, "thursday": {"isOpen": true, "periods": [{"openTime": "12:00", "closeTime": "14:30"}, {"openTime": "18:00", "closeTime": "00:00"}]}, "friday": {"isOpen": true, "periods": [{"openTime": "12:00", "closeTime": "14:30"}, {"openTime": "18:30", "closeTime": "02:00"}]}, "saturday": {"isOpen": true, "periods": [{"openTime": "18:30", "closeTime": "02:00"}]}, "sunday": {"isOpen": true, "periods": [{"openTime": "12:00", "closeTime": "14:30"}, {"openTime": "18:00", "closeTime": "00:00"}]}}'),
  ('galleryContent', '{"heading": "La Nostra Galleria", "subheading": ""}'),
  ('galleryImages', '[]'),
  ('popups', '[]'),
  ('reservations', '[]'),
  ('adminCredentials', '{"username": "admin", "password": "persian123"}'),
  ('notificationSettings', '{"soundEnabled": true, "emailEnabled": true, "emailAddress": "orders@pizzeriaregina2000.it", "soundType": "bell", "soundVolume": 80, "continuousSound": true, "browserNotifications": true, "newOrderSound": true, "orderUpdateSound": true, "paymentConfirmationSound": true, "popupEnabled": true, "smsEnabled": false, "phoneNumber": "", "emailSubject": "Nuovo Ordine - Pizzeria Regina 2000"}'),
  ('shippingZoneSettings', '{"enabled": true, "deliveryFee": 5, "maxDeliveryDistance": 15, "freeDeliveryThreshold": 50, "restaurantLat": 45.0703, "restaurantLng": 7.6869, "googleMapsApiKey": "AIzaSyBkHCjFa0GKD7lJThAyFnSaeCXFDsBtJhs", "restaurantAddress": "Piazza della Repubblica, 10100 Torino TO"}'),
  ('deliveryZones', '[{"id": "1", "name": "Zone 1 (0-5km)", "isActive": true, "deliveryFee": 3, "maxDistance": 5, "estimatedTime": "20-30 minutes"}, {"id": "2", "name": "Zone 2 (5-10km)", "isActive": true, "deliveryFee": 5, "maxDistance": 10, "estimatedTime": "30-45 minutes"}, {"id": "3", "name": "Zone 3 (10-15km)", "isActive": true, "deliveryFee": 7, "maxDistance": 15, "estimatedTime": "45-60 minutes"}]'),
  ('weOfferContent', '{"heading": "Offriamo", "subheading": "Scopri le nostre autentiche specialità italiane", "offers": [{"id": 1, "title": "Pizza Metro Fino a 5 Gusti", "description": "", "image": "", "badge": "Specialità"}, {"id": 2, "title": "Usiamo la farina Le 5 stagioni, Alta qualità", "description": "", "image": "", "badge": "Qualità"}, {"id": 3, "title": "Creiamo Tutti i Tipi di Pizza Italiana", "description": "", "image": "", "badge": "Autentica"}]}'),
  ('chiSiamoContent', '{"it": {"title": "Chi Siamo - Pizzeria Regina 2000", "paragraph1": "Pizzeria Regina 2000 nasce dalla passione per l\'autentica tradizione italiana e dall\'esperienza culinaria tramandata nel tempo. Dal 2000, offriamo pizza italiana preparata con amore, ingredienti freschi e il nostro forno a legna tradizionale.", "paragraph2": "Le nostre pizze nascono da una profonda passione per la tradizione culinaria italiana. Solo ingredienti selezionati, solo autenticità made in Torino. 🍕 Situati nel cuore di Torino, offriamo esperienza artigianale e passione per la vera pizza italiana.", "storyTitle": "La Nostra Storia", "servicesTitle": "Nella nostra pizzeria puoi trovare:", "services": ["Pizza italiana cotta nel forno a legna", "Ingredienti freschi e di prima qualità", "Impasto preparato quotidianamente con lievitazione naturale", "Servizio per eventi e feste personalizzato"], "stats": {"years": "Anni di Esperienza", "customers": "Clienti Soddisfatti", "varieties": "Varietà di Pizze"}, "closingMessage": "Vieni a trovarci alla Pizzeria Regina 2000 e scopri il vero sapore della tradizione italiana.", "tagline": "", "quote": "", "quoteAuthor": "Un viaggio tra sapori, tradizione e autenticità"}, "en": {"title": "About Pizzeria Regina 2000", "paragraph1": "Pizzeria Regina 2000 was born from a passion for authentic Italian tradition and culinary experience passed down through time. Since 2000, we offer Italian pizza prepared with love, fresh ingredients and our traditional wood-fired oven.", "paragraph2": "Our pizzas are born from a deep passion for Italian culinary tradition. Only selected ingredients, only authenticity made in Turin. 🍕 Located in the heart of Turin, we offer artisanal experience and passion for authentic Italian pizza.", "storyTitle": "Our Story", "servicesTitle": "In our pizzeria you can find:", "services": ["Italian pizza cooked in a wood-fired oven", "Fresh and top quality ingredients", "Dough prepared daily with natural leavening", "Service for events and personalized parties"], "stats": {"years": "Years of Experience", "customers": "Satisfied Customers", "varieties": "Pizza Varieties"}, "closingMessage": "Come visit us at Pizzeria Regina 2000 and discover the true taste of Italian tradition.", "tagline": "Creating authentic flavors, one pizza at a time", "quote": "📍 Find us in the center of Turin – where Italian tradition meets Piedmontese hospitality.", "quoteAuthor": "A journey through flavors, tradition and authenticity"}}'),
  ('aboutSections', '{"section1": {"image": "/images/storia.jpg", "title": "La Nostra Storia", "description": "Dal 2000 portiamo a Torino la vera tradizione della pizza napoletana. La nostra famiglia ha tramandato di generazione in generazione i segreti di un impasto perfetto e di ingredienti selezionati."}, "section2": {"image": "/images/ingredienti.jpg", "title": "Ingredienti di Qualità", "description": "Utilizziamo solo ingredienti freschi e di prima qualità: mozzarella di bufala DOP, pomodori San Marzano, olio extravergine di oliva e farina tipo 00. Ogni pizza è un capolavoro di sapore."}}'),
  ('youtubeVideo', '{"title": "Scopri la Nostra Pizzeria", "videoId": "dQw4w9WgXcQ", "isActive": true, "description": "Guarda come prepariamo le nostre pizze con passione e tradizione"}'),
  ('adminUISettings', '{"theme": "dark", "autoSave": true, "compactMode": false, "notificationSound": true, "showAdvancedFeatures": true}'),
  ('adminSecuritySettings', '{"sessionTimeout": 86400, "lockoutDuration": 900, "maxLoginAttempts": 5, "enableActivityLogging": true, "requireStrongPassword": true}'),
  ('restaurantInfo', '{"name": "Pizzeria Regina 2000 Torino", "email": "info@pizzeriaregina2000.it", "phone": "+39 011 123 4567", "address": "Via Roma 123, 10123 Torino, Italia", "website": "www.pizzeriaregina2000.it", "description": "Autentica pizzeria napoletana nel cuore di Torino dal 2000"}'),
  ('meta_title', '"Pizzeria Regina 2000 Torino - Autentica Pizza Italiana"'),
  ('meta_description', '"Pizzeria Regina 2000 a Torino offre autentica pizza italiana dal 2000. Ordina online per consegna a domicilio o ritiro."'),
  ('meta_keywords', '"pizza, pizzeria, torino, consegna, italiana, regina 2000"'),
  ('minimum_order', '15'),
  ('delivery_fee', '3.5'),
  ('delivery_radius', '5'),
  ('default_stock_quantity', '100'),
  ('stock_management_enabled', 'false'),
  ('stripe_enabled', 'true'),
  ('cash_on_delivery', 'true'),
  ('notification_sound', 'true'),
  ('notification_email', '"orders@pizzeriaregina2000.it"'),
  ('opening_hours', '{"monday": {"open": "18:00", "close": "23:00", "closed": false}, "tuesday": {"open": "18:00", "close": "23:00", "closed": false}, "wednesday": {"open": "18:00", "close": "23:00", "closed": false}, "thursday": {"open": "18:00", "close": "23:00", "closed": false}, "friday": {"open": "18:00", "close": "24:00", "closed": false}, "saturday": {"open": "18:00", "close": "24:00", "closed": false}, "sunday": {"open": "18:00", "close": "23:00", "closed": false}}'),
  ('restaurant_name', '"Pizzeria Regina 2000 Torino"'),
  ('address', '"Via Roma 123, 10100 Torino, Italia"'),
  ('phone', '"+393479190907"'),
  ('email', '"info@pizzeriaregina2000.it"'),
  ('website', '"https://pizzeriaregina2000.it"'),
  ('chiSiamoImage', '{"image": "", "alt": "Pizzeria Regina 2000 - La nostra storia"}'),
  ('weOfferImage', '{"image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", "alt": "Pizza Regina 2000 - Autentica Pizza Italiana"}')
ON CONFLICT (key) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('SEMPLICI', 'semplici', 'Pizze classiche e tradizionali', 1),
  ('SPECIALI', 'speciali', 'Pizze speciali e gourmet', 2),
  ('Pizze al metro per 4-5 persone', 'pizze-al-metro-per-4-5-persone', 'Pizze al metro ideali per gruppi', 3),
  ('BEVANDE', 'bevande', 'Bevande e bibite', 4),
  ('DOLCI', 'dolci', 'Dolci e dessert', 5),
  ('FARINATE', 'farinate', 'Farinate tradizionali', 6),
  ('SCHIACCIATE', 'schiacciate', 'Schiacciate e focacce', 7),
  ('EXTRA', 'extra', 'Aggiunte e condimenti extra', 8)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 7. STORAGE BUCKETS SETUP
-- =====================================================

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

-- Enable RLS on storage tables
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create storage policies
CREATE POLICY "Allow public uploads to image buckets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));

CREATE POLICY "Allow public reads from image buckets" ON storage.objects
  FOR SELECT USING (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));

CREATE POLICY "Allow public updates to image buckets" ON storage.objects
  FOR UPDATE USING (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'))
  WITH CHECK (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));

CREATE POLICY "Allow public deletes from image buckets" ON storage.objects
  FOR DELETE USING (bucket_id IN ('uploads', 'admin-uploads', 'gallery', 'specialties'));

CREATE POLICY "Allow public bucket access" ON storage.buckets
  FOR SELECT USING (true);

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
--
-- After running this script:
-- 1. Create storage buckets in Supabase Dashboard
-- 2. Set up environment variables in your application
-- 3. Configure Stripe webhooks if using payments
-- 4. Upload default images for logo, hero, etc.
--
-- The database is now ready for the Pizzeria Regina 2000 application!
-- =====================================================
