/*
  # Create weekly_recommendations table

  1. New Tables
    - `weekly_recommendations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `why_this_works` (text)
      - `estimated_time` (text)
      - `expected_result` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `weekly_recommendations` table
    - Add policy for users to read their own recommendations
    - Add policy for service role to manage recommendations
*/

CREATE TABLE IF NOT EXISTS weekly_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  why_this_works text NOT NULL,
  estimated_time text NOT NULL,
  expected_result text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE weekly_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own recommendations"
  ON weekly_recommendations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON weekly_recommendations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage recommendations"
  ON weekly_recommendations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
