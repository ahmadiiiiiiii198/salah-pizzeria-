-- Quick fix for order_notifications RLS policies
-- Run this in Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to order_notifications" ON order_notifications;
DROP POLICY IF EXISTS "Allow public insert access to order_notifications" ON order_notifications;
DROP POLICY IF EXISTS "Allow public update access to order_notifications" ON order_notifications;
DROP POLICY IF EXISTS "Allow public delete access to order_notifications" ON order_notifications;

-- Allow public read access to order_notifications
CREATE POLICY "Allow public read access to order_notifications"
ON order_notifications FOR SELECT
TO public
USING (true);

-- Allow public insert access to order_notifications
CREATE POLICY "Allow public insert access to order_notifications"
ON order_notifications FOR INSERT
TO public
WITH CHECK (true);

-- Allow public update access to order_notifications (for marking as read)
CREATE POLICY "Allow public update access to order_notifications"
ON order_notifications FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow public delete access to order_notifications (for cleanup)
CREATE POLICY "Allow public delete access to order_notifications"
ON order_notifications FOR DELETE
TO public
USING (true);

-- Enable real-time for the table
ALTER PUBLICATION supabase_realtime ADD TABLE order_notifications;

-- Test notification creation
INSERT INTO order_notifications (
    order_id,
    notification_type,
    title,
    message,
    is_read,
    is_acknowledged
) VALUES (
    null,
    'test',
    'RLS Fix Test',
    'Test notification after RLS policy fix',
    false,
    false
);

-- Verify the fix worked
SELECT * FROM order_notifications WHERE notification_type = 'test' ORDER BY created_at DESC LIMIT 1;

-- Enable real-time for order_notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE order_notifications;
