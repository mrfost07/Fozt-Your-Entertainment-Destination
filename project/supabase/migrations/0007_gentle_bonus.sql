/*
  # Add storage buckets for videos and thumbnails

  1. New Storage Buckets
    - `videos` bucket for video files
    - `thumbnails` bucket for video thumbnails
  
  2. Security
    - Enable public access for viewing
    - Restrict uploads to authenticated users
*/

-- Create videos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create thumbnails bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for videos bucket
CREATE POLICY "Videos are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Set up storage policies for thumbnails bucket
CREATE POLICY "Thumbnails are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'thumbnails' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );