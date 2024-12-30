import { supabase } from '../supabase';
import { validateUpload } from './validation';
import type { StorageError } from './types';

export async function uploadFile(
  file: File, 
  bucket: string, 
  path: string,
  options: { maxRetries?: number } = {}
): Promise<string> {
  const { maxRetries = 3 } = options;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      // Validate file
      const validationError = await validateUpload(file, bucket);
      if (validationError) throw new Error(validationError);

      // Upload file
      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      attempts++;
      console.error(`Upload attempt ${attempts} failed:`, error);
      
      if (attempts === maxRetries) {
        if ((error as StorageError).status === 413) {
          throw new Error('File size exceeds the maximum allowed limit');
        }
        throw new Error('Failed to upload file after multiple attempts');
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }

  throw new Error('Upload failed');
}