-- Migration to align database schema with UI requirements
-- Update escrow types and add work contract attachment field

-- Update escrow_type column to support new UI types
ALTER TABLE payment_links 
DROP CONSTRAINT IF EXISTS payment_links_escrow_type_check;

ALTER TABLE payment_links 
ADD CONSTRAINT payment_links_escrow_type_check 
CHECK (escrow_type IN ('instant_transfer', 'time_locked'));

-- Add work contract attachment column
ALTER TABLE payment_links 
ADD COLUMN IF NOT EXISTS attach_work_contract BOOLEAN DEFAULT false;

-- Update existing records to use new escrow types
UPDATE payment_links 
SET escrow_type = 'instant_transfer' 
WHERE escrow_type = 'instant';

UPDATE payment_links 
SET escrow_type = 'time_locked' 
WHERE escrow_type = 'timelock';

-- Drop the old custom_contract column and use attach_work_contract
ALTER TABLE payment_links 
DROP COLUMN IF EXISTS custom_contract;

-- Update comments for clarity
COMMENT ON COLUMN payment_links.escrow_type IS 'UI escrow protection type: instant_transfer or time_locked';
COMMENT ON COLUMN payment_links.attach_work_contract IS 'Whether work contract/requirements are attached (UI checkbox)';
COMMENT ON COLUMN payment_links.dispute_resolution IS 'Whether dispute resolution is enabled (UI checkbox)';