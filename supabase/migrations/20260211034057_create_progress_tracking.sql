/*
  # Create progress_tracking table

  1. New Tables
    - `progress_tracking`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `recommendation_id` (uuid, foreign key to weekly_recommendations)
      - `step_index` (integer, index of the step)
      - `completed` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `progress_tracking` table
    - Add policy for users to read their own progress
    - Add policy for users to update their own progress
    - Add policy for service role to manage progress

  3. Constraints
    - Unique constraint on (user_id, recommendation_id, step_index) to prevent duplicates
*/

CREATE TABLE IF NOT EXISTS progress_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_id uuid NOT NULL REFERENCES weekly_recommendations(id) ON DELETE CASCADE,
  step_index integer NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, recommendation_id, step_index)
);

ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON progress_tracking
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON progress_tracking
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON progress_tracking
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON progress_tracking
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage progress"
  ON progress_tracking
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
