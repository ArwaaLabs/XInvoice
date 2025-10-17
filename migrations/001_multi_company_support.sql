-- Migration: Add support for multiple companies per user
-- This migration updates the company_settings and invoices tables to support multiple companies

-- Step 1: Add new columns to company_settings
ALTER TABLE company_settings
DROP CONSTRAINT IF EXISTS company_settings_user_id_unique;

ALTER TABLE company_settings
ADD COLUMN IF NOT EXISTS is_primary TEXT DEFAULT 'false',
ADD COLUMN IF NOT EXISTS is_active TEXT DEFAULT 'true',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Step 2: Set existing companies as primary and active
UPDATE company_settings
SET is_primary = 'true',
    is_active = 'true'
WHERE id IN (
  SELECT DISTINCT ON (user_id) id
  FROM company_settings
  ORDER BY user_id
);

-- Step 3: Add company_id to invoices table
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS company_id VARCHAR REFERENCES company_settings(id) ON DELETE SET NULL;

-- Step 4: Update existing invoices to link to their user's primary company
UPDATE invoices i
SET company_id = (
  SELECT cs.id
  FROM company_settings cs
  WHERE cs.user_id = i.user_id
  AND cs.is_primary = 'true'
  LIMIT 1
);

-- Note: After running this migration, you may need to restart your application
-- to ensure the new schema changes are recognized.
