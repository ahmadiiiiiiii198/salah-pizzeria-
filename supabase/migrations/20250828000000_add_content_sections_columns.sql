-- Add missing columns to content_sections table
-- This migration adds the columns that are referenced in the TypeScript types but missing from the actual table

-- Add the missing columns
ALTER TABLE content_sections 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Create index for sort_order for better performance
CREATE INDEX IF NOT EXISTS idx_content_sections_sort_order ON content_sections(sort_order);

-- Update existing records to have a default sort_order based on their creation order
UPDATE content_sections 
SET sort_order = COALESCE(
  (SELECT COUNT(*) FROM content_sections c2 WHERE c2.created_at <= content_sections.created_at),
  0
)
WHERE sort_order IS NULL OR sort_order = 0;

-- Add comments for documentation
COMMENT ON COLUMN content_sections.title IS 'Optional title for the content section';
COMMENT ON COLUMN content_sections.content IS 'Optional text content for the section';
COMMENT ON COLUMN content_sections.image_url IS 'Optional image URL for the section';
COMMENT ON COLUMN content_sections.sort_order IS 'Sort order for displaying sections (lower numbers first)';
