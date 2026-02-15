import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Post, likePost, unlikePost } from '@/api/posts';
import PostCard from '@/components/discovery/PostCard';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslations();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;

        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:user_id (id, name, profile_image, verified)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        // Check if liked
        let isLiked = false;
        if (userId) {
          const { data: likeData } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', id)
            .eq('user_id', userId)
            .maybeSingle();
          isLiked = !!likeData;
        }

        setPost({
          ...data,
          user_name: data.profiles?.name || 'Unknown',
          user_avatar: data.profiles?.profile_image || '',
          is_liked: isLiked,
        } as Post);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLike = async (postId: string) => {
    if (!post) return;
    try {
      if (post.is_liked) {
        await unlikePost(postId);
        setPost({ ...post, is_liked: false, likes_count: post.likes_count - 1 });
      } else {
        await likePost(postId);
        setPost({ ...post, is_liked: true, likes_count: post.likes_count + 1 });
      }
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = () => {
    toast.info('Comments coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
           <h2 className="text-lg font-semibold text-foreground mb-2">{t('post.not_found', 'Post not found')}</h2>
           <button onClick={() => navigate(-1)} className="text-primary text-sm">{t('post.go_back', 'Go back')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/10">
        <div className="max-w-md mx-auto px-4 h-12 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/60 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-sm font-bold text-foreground">{t('post.title', 'Post')}</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <PostCard post={post} onLike={handleLike} onComment={handleComment} />
      </div>
    </div>
  );
};

export default PostDetail;
