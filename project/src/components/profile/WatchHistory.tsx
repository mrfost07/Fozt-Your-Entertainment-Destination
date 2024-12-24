import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import type { Video } from '@/types/video';

interface WatchHistoryItem extends Video {
  watched_at: string;
}

export function WatchHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;

      const { data } = await supabase
        .from('watch_history')
        .select(`
          watched_at,
          video:videos (
            id,
            title,
            thumbnail_url,
            category:categories(name)
          )
        `)
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false })
        .limit(10);

      if (data) {
        setHistory(
          data.map((item) => ({
            ...item.video,
            watched_at: item.watched_at,
          }))
        );
      }
      setLoading(false);
    }

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Watch History</h2>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg h-16 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Watch History</h2>
      {history.length === 0 ? (
        <p className="text-gray-400">No watch history yet</p>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <Link
              key={item.id}
              to={`/video/${item.id}`}
              className="block bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition"
            >
              <div className="flex items-center p-3">
                <img
                  src={item.thumbnail_url || ''}
                  alt={item.title}
                  className="w-20 h-12 object-cover rounded"
                />
                <div className="ml-3 flex-1">
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(item.watched_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}