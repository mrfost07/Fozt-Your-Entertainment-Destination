/*
  # Enhanced storage configuration for large video files

  1. Updates
    - Increase storage limits for video files
    - Add support for high-resolution videos
    - Add subtitle track storage
    - Improve bucket configurations
*/

-- Update video bucket with increased limits
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 10737418240, -- 10GB
  allowed_mime_types = ARRAY[
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-matroska',
    'video/x-msvideo'
  ]
WHERE id = 'videos';

-- Update thumbnail bucket
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 10485760, -- 10MB
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
WHERE id = 'thumbnails';

-- Create subtitles bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'subtitles',
  'subtitles',
  true,
  5242880, -- 5MB
  ARRAY['application/x-subrip', 'text/vtt']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Add video quality and subtitle tracking
ALTER TABLE videos
ADD COLUMN IF NOT EXISTS quality_levels jsonb DEFAULT '["HD"]'::jsonb,
ADD COLUMN IF NOT EXISTS available_subtitles jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS rating numeric(3,1) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS rating_count integer DEFAULT 0;

-- Create ratings table
CREATE TABLE IF NOT EXISTS video_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(video_id, user_id)
);

-- Enable RLS on ratings
ALTER TABLE video_ratings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ratings
CREATE POLICY "Ratings are viewable by everyone"
  ON video_ratings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own ratings"
  ON video_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON video_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update video rating
CREATE OR REPLACE FUNCTION update_video_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE videos
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM video_ratings
      WHERE video_id = NEW.video_id
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM video_ratings
      WHERE video_id = NEW.video_id
    )
  WHERE id = NEW.video_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for rating updates
CREATE TRIGGER update_video_rating_trigger
AFTER INSERT OR UPDATE ON video_ratings
FOR EACH ROW
EXECUTE FUNCTION update_video_rating();

-- Update storage policies
CREATE POLICY "Allow public read access for subtitles"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'subtitles');

CREATE POLICY "Allow authenticated users to upload subtitles"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'subtitles' AND
  auth.uid()::text = (storage.foldername(name))[1] AND
  (CASE 
    WHEN RIGHT(name, 4) = '.srt' THEN true
    WHEN RIGHT(name, 4) = '.vtt' THEN true
    ELSE false
  END)
);