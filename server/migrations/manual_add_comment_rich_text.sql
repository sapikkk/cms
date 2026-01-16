-- Migration: Add Rich Text Support to Comments
-- Date: 2026-01-15
-- Purpose: Add contentHtml field for rich text formatted comments

-- Add contentHtml column to Comment table
ALTER TABLE "Comment" 
ADD COLUMN "contentHtml" TEXT NOT NULL DEFAULT '';

-- Update existing comments to have contentHtml same as text (migration)
UPDATE "Comment" 
SET "contentHtml" = "text"
WHERE "contentHtml" = '';

-- Optional: Add comment for documentation
COMMENT ON COLUMN "Comment"."text" IS 'Plain text version for fallback and search';
COMMENT ON COLUMN "Comment"."contentHtml" IS 'Rich text HTML version for formatted display';
