/*
  # Add business_type and city to business_profiles

  1. Modified Tables
    - `business_profiles`
      - ADD `business_type` (text) - 'local', 'online', 'service'
      - ADD `city` (text) - city where business is located

  2. Notes
    - These columns are added with default values to handle existing records
    - business_type defaults to 'local'
    - city defaults to empty string
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'business_profiles' AND column_name = 'business_type'
  ) THEN
    ALTER TABLE business_profiles ADD COLUMN business_type text DEFAULT 'local';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'business_profiles' AND column_name = 'city'
  ) THEN
    ALTER TABLE business_profiles ADD COLUMN city text DEFAULT '';
  END IF;
END $$;