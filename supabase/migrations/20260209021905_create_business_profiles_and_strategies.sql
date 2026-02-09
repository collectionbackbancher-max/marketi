/*
  # Business Marketing Strategy App Schema

  1. New Tables
    - `business_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `business_name` (text)
      - `industry` (text)
      - `description` (text)
      - `target_audience` (text)
      - `goals` (text)
      - `budget_range` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `marketing_strategies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `business_profile_id` (uuid, references business_profiles)
      - `title` (text)
      - `content` (text)
      - `week_of` (date)
      - `status` (text) - 'draft', 'published'
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own business profiles
    - Users can only view their own marketing strategies
*/

CREATE TABLE IF NOT EXISTS business_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name text NOT NULL,
  industry text NOT NULL,
  description text NOT NULL,
  target_audience text DEFAULT '',
  goals text DEFAULT '',
  budget_range text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS marketing_strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_profile_id uuid REFERENCES business_profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  week_of date NOT NULL,
  status text DEFAULT 'published',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own business profile"
  ON business_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own business profile"
  ON business_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business profile"
  ON business_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own marketing strategies"
  ON marketing_strategies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_marketing_strategies_user_id ON marketing_strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_marketing_strategies_week_of ON marketing_strategies(week_of);