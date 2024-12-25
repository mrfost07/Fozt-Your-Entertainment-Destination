import { supabase } from './supabase';

export async function ensureBucketExists(bucketName: string): Promise<boolean> {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    return buckets?.some(b => b.name === bucketName) ?? false;
  } catch (error) {
    console.error('Error checking bucket:', error);
    return false;
  }
}

export async function validateUpload(file: File, bucket: string): Promise<string | null> {
  if (!file) return 'No file selected';
  
  const maxSize = bucket === 'videos' ? 100 * 1024 * 1024 : 5 * 1024 * 1024; // 100MB for videos, 5MB for images
  if (file.size > maxSize) {
    return `File size exceeds ${maxSize / (1024 * 1024)}MB limit`;
  }

  const bucketExists = await ensureBucketExists(bucket);
  if (!bucketExists) {
    return `Storage bucket "${bucket}" not available`;
  }

  return null;
}