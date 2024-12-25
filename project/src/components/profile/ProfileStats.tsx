import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Film, Heart, Clock, MessageSquare } from 'lucide-react';
import { StatCard } from './StatCard';

interface Stats {
  uploads: number;
  likes: number;
  watchTime: number;
  comments: number;
}

export function ProfileStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    uploads: 0,
    likes: 0,
    watchTime: 0,
    comments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;

      try {
        const [{ count: uploads }, { count: likes }, watchHistory, { count: comments }] = await Promise.all([
          supabase
            .from('videos')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id),
          supabase
            .from('reactions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('type', 'like'),
          supabase
            .from('watch_history')
            .select('videos(duration)')
            .eq('user_id', user.id),
          supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id),
        ]);

        const totalWatchTime = (watchHistory.data || []).reduce(
          (acc, { videos }) => acc + (videos?.duration || 0),
          0
        );

        setStats({
          uploads: uploads || 0,
          likes: likes || 0,
          watchTime: Math.round(totalWatchTime / 60), // Convert to hours
          comments: comments || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon={<Film className="w-6 h-6" />}
        label="Uploads"
        value={stats.uploads}
      />
      <StatCard
        icon={<Heart className="w-6 h-6" />}
        label="Likes"
        value={stats.likes}
      />
      <StatCard
        icon={<Clock className="w-6 h-6" />}
        label="Watch Time"
        value={`${stats.watchTime}h`}
      />
      <StatCard
        icon={<MessageSquare className="w-6 h-6" />}
        label="Comments"
        value={stats.comments}
      />
    </div>
  );
}