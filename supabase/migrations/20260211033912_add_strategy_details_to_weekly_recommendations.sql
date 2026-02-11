/*
  # Add strategy details to weekly_recommendations

  1. Modified Tables
    - `weekly_recommendations`
      - `step_by_step_actions` (text array, JSON array of action strings)
      - `copy_templates` (text, template copy for users)

  These fields allow storing detailed action steps and copy templates for weekly recommendations.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'weekly_recommendations' AND column_name = 'step_by_step_actions'
  ) THEN
    ALTER TABLE weekly_recommendations ADD COLUMN step_by_step_actions jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'weekly_recommendations' AND column_name = 'copy_templates'
  ) THEN
    ALTER TABLE weekly_recommendations ADD COLUMN copy_templates text DEFAULT '';
  END IF;
END $$;
