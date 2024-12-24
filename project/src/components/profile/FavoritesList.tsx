import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Video } from '@/types/video';

export function FavoritesList() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      if (!user) return;

      const { data } = await supabase
        .from('user_favorites')
        .select(`
          video:videos (
            id,
            title,
            thumbnail_url,
            category:categories(name)
          )
        `)
        .eq('user_id', user.id);

      if (data) {
        setFavorites(data.map((f) => f.video));
      }
      setLoading(false);
    }

    fetchFavorites();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Favorites</h2>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg h-32 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Favorites</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-400">No favorites yet</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {favorites.map((video) => (
            <Link
              key={video.id}
              to={`/video/${video.id}`}
              className="group relative rounded-lg overflow-hidden"
            >
              <img
                src={video.thumbnail_url || ''}
                alt={video.title}
                className="w-full h-32 object-cover transition group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent p-3 flex flex-col justify-end">
                <h3 className="font-medium text-sm">{video.title}</h3>
                <p className="text-xs text-gray-300">{video.category.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}