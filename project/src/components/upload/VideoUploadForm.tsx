import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { FileUploadField } from './FileUploadField';
import { MetadataFields } from './MetadataFields';
import { ContentFields } from './ContentFields';
import { uploadFile, createVideo } from '@/lib/upload';
import type { Category } from '@/types/category';

interface UploadFormProps {
  categories: Category[];
}

export function VideoUploadForm({ categories }: UploadFormProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    synopsis: '',
    categoryId: '',
    releaseDate: '',
    duration: '',
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !videoFile || !thumbnailFile) return;

    setLoading(true);
    setError('');

    try {
      // Upload files
      const videoUrl = await uploadFile(
        videoFile,
        'videos',
        `videos/${user.id}/${Date.now()}-${videoFile.name}`
      );

      const thumbnailUrl = await uploadFile(
        thumbnailFile,
        'videos',
        `thumbnails/${user.id}/${Date.now()}-${thumbnailFile.name}`
      );

      // Create video record
      await createVideo({
        ...formData,
        videoUrl,
        thumbnailUrl,
        duration: parseInt(formData.duration),
      });

      navigate('/profile');
    } catch (err) {
      setError('Failed to upload video. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FileUploadField
            type="video"
            file={videoFile}
            onChange={setVideoFile}
          />
          <FileUploadField
            type="image"
            file={thumbnailFile}
            onChange={setThumbnailFile}
          />
        </div>

        <MetadataFields
          categories={categories}
          values={formData}
          onChange={handleFormChange}
        />
      </div>

      <ContentFields
        values={formData}
        onChange={handleFormChange}
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Uploading...' : 'Upload Video'}
      </Button>
    </form>
  );
}