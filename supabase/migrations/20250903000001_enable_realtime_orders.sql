-- Enable real-time replication for orders and related tables
-- This was the missing piece causing real-time updates to fail

-- Enable real-time for orders table (CRITICAL FIX)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Enable real-time for order_items table
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;

-- Enable real-time for order_notifications table (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_notifications') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE order_notifications;
    END IF;
END $$;

-- Create the missing update_order_status function with SECURITY DEFINER
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

    -- DON'T create notifications for admin status updates to prevent sound restart
    -- Notifications should only be created for new orders, not status changes
    -- This prevents the notification sound from playing again when admin changes order status
END;
$$;

-- Grant execute permission to anonymous users (for admin operations)
GRANT EXECUTE ON FUNCTION update_order_status(UUID, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION update_order_status(UUID, TEXT, TEXT, TEXT) TO authenticated;

-- Add comment for documentation
COMMENT ON PUBLICATION supabase_realtime IS 'Supabase real-time publication including orders, order_items, and order_notifications tables';

-- Verify the publication includes our tables
SELECT 'Real-time enabled for: ' || string_agg(tablename, ', ') as enabled_tables
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename IN ('orders', 'order_items', 'order_notifications');
