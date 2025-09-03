-- Fix Admin Authentication Cross-Browser Issue
-- This script creates the missing update_order_status function and fixes RLS policies
-- Run this in Supabase SQL Editor to fix the admin authentication issue

-- 1. Create the missing update_order_status function with SECURITY DEFINER
-- This allows admin operations to bypass RLS policies
CREATE OR REPLACE FUNCTION update_order_status(
    order_uuid UUID,
    new_status TEXT,
    status_notes TEXT DEFAULT NULL,
    tracking_num TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update the order with new status and optional fields
    UPDATE orders 
    SET 
        status = new_status,
        order_status = new_status,
        updated_at = NOW(),
        -- Add tracking number if provided
        tracking_number = COALESCE(tracking_num, tracking_number),
        -- Add status notes to metadata if provided
        metadata = CASE 
            WHEN status_notes IS NOT NULL THEN 
                COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('status_notes', status_notes)
            ELSE 
                metadata
        END,
        -- Mark as done if status is delivered
        admin_done_at = CASE 
            WHEN new_status = 'delivered' THEN NOW()
            ELSE admin_done_at
        END
    WHERE id = order_uuid;
    
    -- Insert status history record if the table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_status_history') THEN
        INSERT INTO order_status_history (
            order_id,
            status,
            notes,
            created_at
        ) VALUES (
            order_uuid,
            new_status,
            status_notes,
            NOW()
        );
    END IF;
    
    -- Create notification if the table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_notifications') THEN
        INSERT INTO order_notifications (
            order_id,
            notification_type,
            title,
            message,
            is_read,
            created_at
        ) VALUES (
            order_uuid,
            'order_update',
            'Stato Ordine Aggiornato',
            'Ordine aggiornato a: ' || new_status,
            false,
            NOW()
        );
    END IF;
END;
$$;

-- Grant execute permission to anonymous users (for admin operations)
GRANT EXECUTE ON FUNCTION update_order_status(UUID, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION update_order_status(UUID, TEXT, TEXT, TEXT) TO authenticated;

-- 2. Fix RLS policies to allow admin operations from any browser
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow authenticated users to delete orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to update orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to read orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users full access to orders" ON orders;

-- Create permissive policies for admin operations
CREATE POLICY "Allow admin operations on orders" 
  ON orders 
  FOR ALL 
  USING (true);

-- Fix order_items policies
DROP POLICY IF EXISTS "Allow authenticated users to delete order items" ON order_items;
DROP POLICY IF EXISTS "Allow authenticated users to update order items" ON order_items;
DROP POLICY IF EXISTS "Allow authenticated users to read order items" ON order_items;
DROP POLICY IF EXISTS "Allow authenticated users full access to order items" ON order_items;

CREATE POLICY "Allow admin operations on order items" 
  ON order_items 
  FOR ALL 
  USING (true);

-- Fix order_notifications policies (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_notifications') THEN
        DROP POLICY IF EXISTS "Allow authenticated users to delete order notifications" ON order_notifications;
        DROP POLICY IF EXISTS "Allow authenticated users to update order notifications" ON order_notifications;
        DROP POLICY IF EXISTS "Allow authenticated users to read order notifications" ON order_notifications;
        DROP POLICY IF EXISTS "Allow authenticated users full access to order notifications" ON order_notifications;
        
        CREATE POLICY "Allow admin operations on order notifications" 
          ON order_notifications 
          FOR ALL 
          USING (true);
    END IF;
END $$;

-- Fix order_status_history policies (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_status_history') THEN
        DROP POLICY IF EXISTS "Allow authenticated users to delete order status history" ON order_status_history;
        DROP POLICY IF EXISTS "Allow authenticated users to update order status history" ON order_status_history;
        DROP POLICY IF EXISTS "Allow authenticated users to read order status history" ON order_status_history;
        DROP POLICY IF EXISTS "Allow authenticated users full access to order status history" ON order_status_history;
        
        CREATE POLICY "Allow admin operations on order status history" 
          ON order_status_history 
          FOR ALL 
          USING (true);
    END IF;
END $$;

-- 3. Ensure real-time is enabled for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Verification query - run this to test the fix
-- SELECT 'Fix applied successfully' as status;
