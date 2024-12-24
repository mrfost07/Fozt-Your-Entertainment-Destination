import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Heart, Share2, Bookmark } from 'lucide-react';
import { Button } from './ui/Button';

interface VideoActionsProps {
  videoId: string;
}

export function VideoActions({ videoId }: VideoActionsProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function checkUserInteractions() {
      // Check if user liked the video
      const { data: likeData } = await supabase
        .from('reactions')
        .select()
        .eq('video_id', videoId)
        .eq('user_id', user.id)
        .eq('type', 'like')
        .single();

      setLiked(!!likeData);

      // Check if video is in favorites
      const { data: favoriteData } = await supabase
        .from('user_favorites')
        .select()
        .eq('video_id', videoId)
        .eq('user_id', user.id)
        .single();

      setFavorited(!!favoriteData);
    }

    checkUserInteractions();
  }, [videoId, user]);

  const handleLike = async () => {
    if (!user) return;

    if (liked) {
      await supabase
        .from('reactions')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', user.id)
        .eq('type', 'like');
    } else {
      await supabase.from('reactions').insert({
        video_id: videoId,
        user_id: user.id,
        type: 'like',
      });
    }

    setLiked(!liked);
  };

  const handleFavorite = async () => {
    if (!user) return;

    if (favorited) {
      await supabase
        .from('user_favorites')
        .delete()
        .eq('video_id', videoId)
        .eq('user_id', user.id);
    } else {
      await supabase.from('user_favorites').insert({
        video_id: videoId,
        user_id: user.id,
      });
    }

    setFavorited(!favorited);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // You could add a toast notification here
  };

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="ghost"
        onClick={handleLike}
        className={liked ? 'text-red-500' : ''}
      >
        <Heart className="w-5 h-5 mr-1" />
        Like
      </Button>
      <Button variant="ghost" onClick={handleFavorite}>
        <Bookmark className={`w-5 h-5 mr-1 ${favorited ? 'fill-current' : ''}`} />
        Save
      </Button>
      <Button variant="ghost" onClick={handleShare}>
        <Share2 className="w-5 h-5 mr-1" />
        Share
      </Button>
    </div>
  );
}