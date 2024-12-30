import { useState, useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { uploadFile } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  onAvatarChange: (url: string) => void;
}

export function AvatarUpload({ currentAvatarUrl, onAvatarChange }: AvatarUploadProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);
    setError('');

    try {
      const timestamp = Date.now();
      const path = `${user.id}/${timestamp}-${file.name}`;
      const avatarUrl = await uploadFile(file, 'avatars', path);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;
      onAvatarChange(avatarUrl);
    } catch (err) {
      console.error('Avatar upload error:', err);
      setError('Failed to upload avatar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        onClick={handleClick}
        className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group"
      >
        {currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt="Profile"
            className="w-full h-full object-cover transition group-hover:opacity-75"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <Camera className="w-10 h-10 text-gray-400" />
          </div>
        )}
        {!loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-8 h-8 text-white" />
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <p className="text-sm text-gray-400">
        Click to upload profile picture
      </p>
    </div>
  );
}