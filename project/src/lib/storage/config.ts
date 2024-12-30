import type { BucketConfig } from './types';

export const bucketConfigs: Record<string, BucketConfig> = {
  videos: {
    name: 'videos',
    maxSize: 52428800, // 50MB
    allowedTypes: [
      'video/mp4',
      'video/webm',
      'video/quicktime'
    ]
  },
  thumbnails: {
    name: 'thumbnails',
    maxSize: 1048576, // 1MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/webp'
    ]
  },
  avatars: {
    name: 'avatars',
    maxSize: 524288, // 512KB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/webp'
    ]
  }
};