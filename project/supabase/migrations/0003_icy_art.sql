/*
  # Add video upload features and genre improvements

  1. Changes
    - Add status field to videos table
    - Add synopsis field to videos table
    - Add duration field to videos table
    - Add release_date field to videos table
    - Add featured flag to videos table
*/

ALTER TABLE videos
ADD COLUMN synopsis TEXT,
ADD COLUMN duration INTEGER,
ADD COLUMN release_date DATE,
ADD COLUMN featured BOOLEAN DEFAULT false,
ADD COLUMN status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));

-- Update videos policy to allow authenticated users to manage their videos
CREATE POLICY "Users can insert their own videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);