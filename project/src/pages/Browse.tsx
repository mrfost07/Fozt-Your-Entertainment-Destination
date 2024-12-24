import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { SearchBar } from '@/components/browse/SearchBar';
import { CategoryFilter } from '@/components/browse/CategoryFilter';
import type { Category } from '@/types/category';
import type { Video } from '@/types/video';

export function Browse() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      let query = supabase
        .from('videos')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('status', 'published');

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data } = await query;
      if (data) setVideos(data);
      setLoading(false);
    }

    fetchVideos();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg h-48 animate-pulse" />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No videos found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <Link
              key={video.id}
              to={`/video/${video.id}`}
              className="bg-gray-800 rounded-lg overflow-hidden group hover:ring-2 hover:ring-purple-500 transition-all"
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail_url || ''}
                  alt={video.title}
                  className="w-full h-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1">{video.title}</h3>
                <p className="text-sm text-gray-400">{video.category.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}