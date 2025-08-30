-- From: 20250115000000_create_category_sections.sql
ALTER TABLE category_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to active category sections" 
CREATE POLICY "Allow authenticated users full access to category sections" 

-- From: 20250115000000_create_settings_table.sql
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to settings" 
CREATE POLICY "Allow authenticated users to update settings" 
CREATE POLICY "Allow authenticated users to insert settings" 
CREATE POLICY "Allow authenticated users to delete settings" 

-- From: 20250115000000_fix_notification_rls.sql
DROP POLICY IF EXISTS "Allow public read access to order_notifications" ON order_notifications;
DROP POLICY IF EXISTS "Allow public insert access to order_notifications" ON order_notifications;
DROP POLICY IF EXISTS "Allow public update access to order_notifications" ON order_notifications;
DROP POLICY IF EXISTS "Allow public delete access to order_notifications" ON order_notifications;
ALTER TABLE order_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to order_notifications"
CREATE POLICY "Allow public insert access to order_notifications"
CREATE POLICY "Allow public update access to order_notifications"
CREATE POLICY "Allow public delete access to order_notifications"
-- Grant necessary permissions to public role
GRANT SELECT, INSERT, UPDATE, DELETE ON order_notifications TO public;
GRANT USAGE ON SEQUENCE order_notifications_id_seq TO public;

-- From: 20250115000001_create_content_sections.sql
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to active content sections" 
CREATE POLICY "Allow authenticated users full access to content sections" 

-- From: 20250115120000_create_delete_order_function.sql
-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_order_cascade(UUID) TO authenticated;

-- From: 20250115121000_fix_order_deletion_policies.sql
DROP POLICY IF EXISTS "Allow authenticated users to delete orders" ON orders;
CREATE POLICY "Allow authenticated users to delete orders" 
DROP POLICY IF EXISTS "Allow authenticated users to delete order items" ON order_items;
CREATE POLICY "Allow authenticated users to delete order items" 
DROP POLICY IF EXISTS "Allow authenticated users to delete order notifications" ON order_notifications;
CREATE POLICY "Allow authenticated users to delete order notifications" 
DROP POLICY IF EXISTS "Allow authenticated users to delete order status history" ON order_status_history;
CREATE POLICY "Allow authenticated users to delete order status history" 
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow authenticated users to read orders" 
        CREATE POLICY "Allow authenticated users to read order items" 
        CREATE POLICY "Allow authenticated users to read order notifications" 
        CREATE POLICY "Allow authenticated users to read order status history" 
        CREATE POLICY "Allow authenticated users to update orders" 
        CREATE POLICY "Allow authenticated users to update order items" 
        CREATE POLICY "Allow authenticated users to update order notifications" 
        CREATE POLICY "Allow authenticated users to update order status history" 
        CREATE POLICY "Allow authenticated users to insert orders" 
        CREATE POLICY "Allow authenticated users to insert order items" 
        CREATE POLICY "Allow authenticated users to insert order notifications" 
        CREATE POLICY "Allow authenticated users to insert order status history" 
        CREATE POLICY "Allow public to insert orders" 
        CREATE POLICY "Allow public to insert order items" 
        CREATE POLICY "Allow public to insert order notifications" 

-- From: 20250117000000_create_user_profiles_table.sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" 
CREATE POLICY "Users can insert own profile" 
CREATE POLICY "Users can update own profile" 
CREATE POLICY "Authenticated users can view all profiles" 

-- From: 20250117000001_enhance_admin_authentication.sql
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin sessions are private" 
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin activity log is private" 

-- From: 20250514151200_add_settings_rls_policy.sql
ALTER TABLE IF EXISTS settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to settings" ON settings;
CREATE POLICY "Allow public read access to settings" 
DROP POLICY IF EXISTS "Allow authenticated users to update settings" ON settings;
CREATE POLICY "Allow authenticated users to update settings" 
DROP POLICY IF EXISTS "Allow authenticated users to insert settings" ON settings;
CREATE POLICY "Allow authenticated users to insert settings" 

-- From: 20250627000000_create_storage_buckets.sql
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Read" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes" ON storage.objects;
CREATE POLICY "Allow public uploads to image buckets" ON storage.objects
CREATE POLICY "Allow public reads from image buckets" ON storage.objects
CREATE POLICY "Allow public updates to image buckets" ON storage.objects
CREATE POLICY "Allow public deletes from image buckets" ON storage.objects
DROP POLICY IF EXISTS "Public Bucket Access" ON storage.buckets;
DROP POLICY IF EXISTS "Allow public bucket access" ON storage.buckets;
CREATE POLICY "Allow public bucket access" ON storage.buckets

-- From: 20250828000001_fix_content_sections_rls.sql
DROP POLICY IF EXISTS "Allow public read access to active content sections" ON content_sections;
DROP POLICY IF EXISTS "Allow authenticated users full access to content sections" ON content_sections;
CREATE POLICY "Allow public read access to content sections" 
CREATE POLICY "Allow public insert access to content sections" 
CREATE POLICY "Allow public update access to content sections" 
CREATE POLICY "Allow public delete access to content sections" 

-- From: 20250828000002_fix_settings_rls.sql
DROP POLICY IF EXISTS "Allow public read access to settings" ON settings;
DROP POLICY IF EXISTS "Allow authenticated users to update settings" ON settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert settings" ON settings;
CREATE POLICY "Allow public read access to settings" 
CREATE POLICY "Allow public insert access to settings" 
CREATE POLICY "Allow public update access to settings" 
CREATE POLICY "Allow public delete access to settings" 

