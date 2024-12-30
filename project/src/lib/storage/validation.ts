import { supabase } from '../supabase';
import { bucketConfigs } from './config';
import type { StorageError } from './types';

export function validateFileType(file: File, bucket: string): string | null {
  const config = bucketConfigs[bucket];
  if (!config) return 'Invalid bucket';
  if (!config.allowedTypes.includes(file.type)) {
    return `Invalid file type. Allowed types: ${config.allowedTypes.join(', ')}`;
  }
  return null;
}

export function validateFileSize(file: File, bucket: string): string | null {
  const config = bucketConfigs[bucket];
  if (!config) return 'Invalid bucket';
  if (file.size > config.maxSize) {
    const maxSizeMB = config.maxSize / (1024 * 1024);
    return `File size exceeds ${maxSizeMB}MB limit`;
  }
  return null;
}

export async function validateUpload(file: File, bucket: string): Promise<string | null> {
  if (!file) return 'No file selected';
  
  // Validate file type
  const typeError = validateFileType(file, bucket);
  if (typeError) return typeError;
  
  // Validate file size
  const sizeError = validateFileSize(file, bucket);
  if (sizeError) return sizeError;
  
  // Ensure bucket exists
  try {
    const { error } = await supabase.storage.getBucket(bucket);
    if (error) throw error;
  } catch (err) {
    console.error('Bucket validation error:', err);
    return `Storage bucket "${bucket}" not available`;
  }

  return null;
}

export function handleStorageError(error: StorageError): string {
  switch (error.status) {
    case 403:
      return 'Permission denied. Please sign in again.';
    case 413:
      return 'File size is too large.';
    case 400:
      return 'Invalid request. Please check file requirements.';
    default:
      return 'Storage error occurred. Please try again.';
  }
}