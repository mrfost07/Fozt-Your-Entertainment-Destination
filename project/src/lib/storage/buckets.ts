import { supabase } from '../supabase';

export async function initializeBuckets() {
  try {
    // Check if buckets exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;

    const requiredBuckets = ['videos', 'thumbnails'];
    
    for (const bucketName of requiredBuckets) {
      if (!buckets?.some(b => b.name === bucketName)) {
        // Create bucket if it doesn't exist
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: bucketName === 'videos' ? 100 * 1024 * 1024 : 5 * 1024 * 1024,
          allowedMimeTypes: bucketName === 'videos' 
            ? ['video/mp4', 'video/webm', 'video/ogg']
            : ['image/jpeg', 'image/png', 'image/webp']
        });
        
        if (createError) {
          console.error(`Error creating ${bucketName} bucket:`, createError);
        }
      }
    }
  } catch (error) {
    console.error('Error initializing buckets:', error);
  }
}