-- Fix real-time order tracking by adding performance index
-- This migration improves the performance of clientId-based order queries

-- Add GIN index on metadata column for efficient JSONB queries
-- This will significantly improve performance of queries like:
-- SELECT * FROM orders WHERE metadata @> '{"clientId": "some_client_id"}'
CREATE INDEX IF NOT EXISTS idx_orders_metadata_gin 
ON orders USING gin (metadata);

-- Add specific index for clientId lookups (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_orders_metadata_client_id 
ON orders USING btree ((metadata->>'clientId'));

-- Add comment for documentation
COMMENT ON INDEX idx_orders_metadata_gin IS 'GIN index for efficient JSONB queries on orders metadata';
COMMENT ON INDEX idx_orders_metadata_client_id IS 'B-tree index for efficient clientId lookups in metadata';

-- Analyze the table to update statistics after adding indexes
ANALYZE orders;
