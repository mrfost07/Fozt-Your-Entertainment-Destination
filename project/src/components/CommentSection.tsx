import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/Button';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

interface CommentSectionProps {
  videoId: string;
}

export function CommentSection({ videoId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  async function fetchComments() {
    const { data } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_profiles(username, avatar_url)
      `)
      .eq('video_id', videoId)
      .order('created_at', { ascending: false });

    if (data) {
      setComments(data);
    }
    setLoading(false);
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    const { error } = await supabase.from('comments').insert({
      video_id: videoId,
      user_id: user.id,
      content: newComment.trim(),
    });

    if (!error) {
      setNewComment('');
      fetchComments();
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Comments</h2>

      {user && (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full px-3 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            rows={3}
          />
          <Button type="submit" disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-800 rounded w-1/4 mb-2" />
              <div className="h-4 bg-gray-800 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                  {comment.profiles.avatar_url && (
                    <img
                      src={comment.profiles.avatar_url}
                      alt={comment.profiles.username}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <span className="font-medium">{comment.profiles.username}</span>
                  <span className="text-sm text-gray-400 ml-2">
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
              <p className="text-gray-300">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}