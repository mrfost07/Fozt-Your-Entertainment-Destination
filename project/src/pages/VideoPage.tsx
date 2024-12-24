import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { VideoPlayer } from '@/components/VideoPlayer';
import { CommentSection } from '@/components/CommentSection';
import { VideoActions } from '@/components/VideoActions';
import type { Video } from '@/types/video';

export function VideoPage() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchVideo() {
      if (!id) return;

      const { data } = await supabase
        .from('videos')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('id', id)
        .single();

      if (data) {
        setVideo(data);
        
        // Record watch history if user is authenticated
        if (user) {
          await supabase.from('watch_history').upsert({
            user_id: user.id,
            video_id: id,
            watched_at: new Date().toISOString(),
          });
        }

        // Increment view count
        await supabase
          .from('videos')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id);
      }
      setLoading(false);
    }

    fetchVideo();
  }, [id, user]);

  if (loading) {
    return <div className="animate-pulse bg-gray-800 h-96 rounded-lg" />;
  }

  if (!video) {
    return <div className="text-center py-12">Video not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <VideoPlayer url={video.video_url} />
      
      <div className="mt-6">
        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">{video.views} views</span>
          <VideoActions videoId={video.id} />
        </div>
      </div>

      <p className="mt-4 text-gray-300">{video.description}</p>

      <div className="mt-8">
        <CommentSection videoId={video.id} />
      </div>
    </div>
  );
}