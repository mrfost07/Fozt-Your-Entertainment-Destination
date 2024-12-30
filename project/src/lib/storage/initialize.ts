import { supabase } from '../supabase';
import { bucketConfigs } from './config';

export async function initializeStorage() {
  try {
    // Get existing buckets
    const { data: existingBuckets } = await supabase.storage.listBuckets();
    const existingBucketIds = new Set(existingBuckets?.map(b => b.id) || []);

    // Initialize each bucket if it doesn't exist
    for (const [bucketId, config] of Object.entries(bucketConfigs)) {
      if (!existingBucketIds.has(bucketId)) {
        await supabase.storage.createBucket(bucketId, {
          public: true,
          fileSizeLimit: config.maxSize,
          allowedMimeTypes: config.allowedTypes
        });
      }
    }

    return true;
  } catch (error) {
    console.error('Storage initialization error:', error);
    return false;
  }
}