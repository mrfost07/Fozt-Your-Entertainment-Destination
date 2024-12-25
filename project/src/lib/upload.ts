import { supabase } from './supabase';
import { validateUpload } from './storage';

export async function uploadFile(file: File, bucket: string, path: string) {
  const validationError = await validateUpload(file, bucket);
  if (validationError) {
    throw new Error(validationError);
  }

  try {
    const { error, data } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error: any) {
    console.error('Upload error:', error);
    throw new Error(error.message || 'Failed to upload file');
  }
}

export async function createVideo({
  title,
  description,
  synopsis,
  videoUrl,
  thumbnailUrl,
  categoryId,
  duration,
  releaseDate,
}: {
  title: string;
  description: string;
  synopsis: string;
  videoUrl: string;
  thumbnailUrl: string;
  categoryId: string;
  duration: number;
  releaseDate: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  try {
    const { error } = await supabase.from('videos').insert({
      title,
      description,
      synopsis,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      category_id: categoryId,
      duration,
      release_date: releaseDate,
      status: 'published',
      user_id: user.id
    });

    if (error) throw error;
  } catch (error: any) {
    console.error('Video creation error:', error);
    throw new Error(error.message || 'Failed to create video');
  }
}