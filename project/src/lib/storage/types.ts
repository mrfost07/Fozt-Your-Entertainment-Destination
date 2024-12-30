export interface StorageError extends Error {
  __isStorageError: boolean;
  name: string;
  status: number;
}

export interface BucketConfig {
  name: string;
  maxSize: number;
  allowedTypes: string[];
}