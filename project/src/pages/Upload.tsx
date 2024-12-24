import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { VideoUploadForm } from '@/components/upload/VideoUploadForm';
import type { Category } from '@/types/category';

export function Upload() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (data) {
        setCategories(data);
      }
      setLoading(false);
    }

    fetchCategories();
  }, []);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return <div className="animate-pulse bg-gray-800 h-96 rounded-lg" />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Upload Video</h1>
      <div className="bg-gray-800 rounded-lg p-6">
        <VideoUploadForm categories={categories} />
      </div>
    </div>
  );
}