import { supabase } from './supabase';

export async function uploadFile(file: File, bucket: string, path: string) {
  const { error, data } = await supabase.storage
    .from(bucket)
    .upload(path, file);

  if (error) throw error;

  return supabase.storage
    .from(bucket)
    .getPublicUrl(path)
    .data.publicUrl;
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
  const { error } = await supabase.from('videos').insert({
    title,
    description,
    synopsis,
    video_url: videoUrl,
    thumbnail_url: thumbnailUrl,
    category_id: categoryId,
    duration,
    release_date: releaseDate,
    status: 'published'
  });

  if (error) throw error;
}