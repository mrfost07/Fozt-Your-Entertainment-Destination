import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import type { Video } from '@/types/video';

export function Home() {
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedVideos() {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          category:categories(name)
        `)
        .limit(6);

      if (!error) {
        setFeaturedVideos(data);
      }
      setLoading(false);
    }

    fetchFeaturedVideos();
  }, []);

  return (
    <div className="space-y-8">
      <section className="relative h-[60vh] rounded-xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=2000"
          alt="Featured banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent">
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-4xl font-bold mb-2">Welcome to Fozt</h1>
            <p className="text-xl text-gray-200 mb-4">Your entertainment destination</p>
            <Link
              to="/browse"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition"
            >
              Start Watching
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Content</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVideos.map((video) => (
              <Link
                key={video.id}
                to={`/video/${video.id}`}
                className="group relative rounded-lg overflow-hidden"
              >
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-48 object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent p-4 flex flex-col justify-end">
                  <h3 className="font-medium text-lg">{video.title}</h3>
                  <p className="text-sm text-gray-300">{video.category.name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}