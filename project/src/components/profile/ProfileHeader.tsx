import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { AvatarUpload } from './AvatarUpload';

interface UserProfile {
  username: string;
  avatar_url: string | null;
  bio: string | null;
}

export function ProfileHeader() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        const { data: existingProfile, error: fetchError } = await supabase
          .from('user_profiles')
          .select('username, avatar_url, bio')
          .eq('id', user.id)
          .single();

        if (fetchError) throw fetchError;

        setProfile(existingProfile);
        setUsername(existingProfile.username);
        setBio(existingProfile.bio || '');
      } catch (err) {
        console.error('Profile error:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user || !username.trim()) return;

    try {
      setError('');
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          username: username.trim(),
          bio: bio.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => ({
        ...prev!,
        username: username.trim(),
        bio: bio.trim() || null,
      }));
      setIsEditing(false);
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update profile');
    }
  };

  const handleAvatarChange = (avatarUrl: string) => {
    setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
  };

  if (loading) {
    return <div className="h-48 bg-gray-800 rounded-lg animate-pulse" />;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded">
          {error}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <AvatarUpload
          currentAvatarUrl={profile?.avatar_url || null}
          onAvatarChange={handleAvatarChange}
        />

        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-3 py-2 bg-gray-700 rounded-md"
                required
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Bio"
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 rounded-md"
              />
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSave}
                  disabled={!username.trim()}
                >
                  Save
                </Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{profile?.username}</h2>
                <Button variant="ghost" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </div>
              {profile?.bio && <p className="mt-2 text-gray-300">{profile.bio}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}