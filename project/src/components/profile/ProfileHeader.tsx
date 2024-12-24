import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { UserCircle } from 'lucide-react';

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

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('username, avatar_url, bio')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one with default values
          const username = user.email?.split('@')[0] || 'user';
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert({ id: user.id, username })
            .select()
            .single();

          if (!createError && newProfile) {
            setProfile(newProfile);
            setUsername(newProfile.username);
            setBio(newProfile.bio || '');
          }
        } else {
          setError('Failed to load profile');
        }
        return;
      }

      if (data) {
        setProfile(data);
        setUsername(data.username);
        setBio(data.bio || '');
      }
    }

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user || !username.trim()) return;

    setError('');
    const { error: updateError } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        username: username.trim(),
        bio: bio.trim(),
        updated_at: new Date().toISOString(),
      });

    if (updateError) {
      setError('Failed to update profile');
      return;
    }

    setProfile((prev) => ({
      ...prev!,
      username: username.trim(),
      bio: bio.trim(),
    }));
    setIsEditing(false);
  };

  if (!profile) {
    return <div className="h-48 bg-gray-800 rounded-lg animate-pulse" />;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded">
          {error}
        </div>
      )}
      
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <UserCircle className="w-16 h-16 text-gray-500" />
          )}
        </div>

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
                <h2 className="text-2xl font-bold">{profile.username}</h2>
                <Button variant="ghost" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </div>
              {profile.bio && <p className="mt-2 text-gray-300">{profile.bio}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}