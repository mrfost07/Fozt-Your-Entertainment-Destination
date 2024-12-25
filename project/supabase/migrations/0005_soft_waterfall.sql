/*
  # Add user_id to videos table

  1. Changes
    - Add user_id column to videos table
    - Add foreign key constraint to auth.users
    - Add RLS policy for user videos
*/

-- Add user_id column
ALTER TABLE videos 
ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Add RLS policy for users to manage their videos
CREATE POLICY "Users can manage their own videos"
  ON videos
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);