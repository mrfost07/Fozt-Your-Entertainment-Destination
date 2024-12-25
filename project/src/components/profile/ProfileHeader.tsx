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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        // First try to get existing profile
        const { data: existingProfile, error: fetchError } = await supabase
          .from('user_profiles')
          .select('username, avatar_url, bio')
          .eq('id', user.id)
          .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        if (!existingProfile) {
          // Create profile if it doesn't exist
          const defaultUsername = user.email?.split('@')[0] || 'user';
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              username: defaultUsername,
              bio: null,
              avatar_url: null
            })
            .select()
            .single();

          if (createError) {
            if (createError.code === '23505') { // Duplicate key error
              // Profile might have been created by trigger, try fetching again
              const { data: retriedProfile, error: retryError } = await supabase
                .from('user_profiles')
                .select('username, avatar_url, bio')
                .eq('id', user.id)
                .single();

              if (retryError) throw retryError;
              setProfile(retriedProfile);
              setUsername(retriedProfile.username);
              setBio(retriedProfile.bio || '');
            } else {
              throw createError;
            }
          } else {
            setProfile(newProfile);
            setUsername(newProfile.username);
            setBio(newProfile.bio || '');
          }
        } else {
          setProfile(existingProfile);
          setUsername(existingProfile.username);
          setBio(existingProfile.bio || '');
        }
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
      
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
          {profile?.avatar_url ? (
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