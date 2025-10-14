import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import PostCard from '@/components/discovery/PostCard';
import { Post } from '@/api/posts';
import { toast } from 'sonner';

const SavedPosts = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedPosts();
  }, [user]);

  const loadSavedPosts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_posts')
        .select(`
          post_id,
          posts (
            id,
            content,
            media_url,
            media_type,
            likes_count,
            comments_count,
            created_at,
            user_id,
            profiles (
              id,
              name,
              profile_image,
              verified
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const posts = data?.map(item => ({
        ...item.posts,
        is_liked: false // We'll check this separately if needed
      })).filter(post => post !== null) as Post[];

      setSavedPosts(posts);
    } catch (error) {
      console.error('Error loading saved posts:', error);
      toast.error('Failed to load saved posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    // Handle like logic
    console.log('Like post:', postId);
  };

  const handleComment = (postId: string) => {
    // Handle comment logic
    console.log('Comment on post:', postId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-white" />
              <h1 className="text-2xl font-bold text-white">Saved Posts</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-lg font-semibold text-white mb-2">No saved posts yet</h3>
            <p className="text-white/70">
              Posts you save will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-white/70 text-sm mb-4">
              {savedPosts.length} saved post{savedPosts.length !== 1 ? 's' : ''}
            </p>
            {savedPosts.map((post) => (
              <div key={post.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                <PostCard
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;
