/*
  # Fix storage policies and permissions

  1. Updates
    - Add DELETE policy for storage objects
    - Fix bucket permissions
    - Add better RLS policies
*/

-- Ensure buckets are public
UPDATE storage.buckets
SET public = true
WHERE id IN ('videos', 'thumbnails');

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Update existing policies with better conditions
DROP POLICY IF EXISTS "Allow authenticated users to upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload thumbnails" ON storage.objects;

CREATE POLICY "Allow authenticated users to upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'videos' AND
  auth.uid()::text = (storage.foldername(name))[1] AND
  (CASE 
    WHEN RIGHT(name, 4) = '.mp4' THEN true
    WHEN RIGHT(name, 5) = '.webm' THEN true
    WHEN RIGHT(name, 4) = '.ogg' THEN true
    ELSE false
  END)
);

CREATE POLICY "Allow authenticated users to upload thumbnails"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'thumbnails' AND
  auth.uid()::text = (storage.foldername(name))[1] AND
  (CASE 
    WHEN RIGHT(name, 4) = '.jpg' THEN true
    WHEN RIGHT(name, 5) = '.jpeg' THEN true
    WHEN RIGHT(name, 4) = '.png' THEN true
    WHEN RIGHT(name, 5) = '.webp' THEN true
    ELSE false
  END)
);