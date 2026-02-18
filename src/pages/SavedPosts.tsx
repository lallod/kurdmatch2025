import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark, Loader2, Trash2 } from 'lucide-react';
import { fromUntyped } from '@/integrations/supabase/untypedClient';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface SavedPost {
  id: string;
  post_id: string;
  created_at: string;
  post: {
    id: string;
    content: string;
    media_url?: string;
    media_type?: string;
    created_at: string;
    user_id: string;
    profile?: {
      name: string;
      profile_image: string;
    };
  };
}

const SavedPosts = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslations();

  useEffect(() => {
    loadSavedPosts();
  }, [user]);

  const loadSavedPosts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await fromUntyped('saved_posts')
        .select('id, post_id, created_at, posts(id, content, media_url, media_type, created_at, user_id, profiles:user_id(name, profile_image))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformed = (data || []).map((item: any) => ({
        id: item.id,
        post_id: item.post_id,
        created_at: item.created_at,
        post: {
          id: item.posts?.id,
          content: item.posts?.content || '',
          media_url: item.posts?.media_url,
          media_type: item.posts?.media_type,
          created_at: item.posts?.created_at,
          user_id: item.posts?.user_id,
          profile: item.posts?.profiles,
        },
      })).filter((item: any) => item.post.id);

      setSavedPosts(transformed);
    } catch (error) {
      console.error('Error loading saved posts:', error);
      toast.error(t('toast.saved.load_failed', 'Failed to load saved posts'));
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (savedPostId: string) => {
    try {
      const { error } = await fromUntyped('saved_posts')
        .delete()
        .eq('id', savedPostId);

      if (error) throw error;
      setSavedPosts(prev => prev.filter(p => p.id !== savedPostId));
      toast.success(t('toast.saved.unsaved', 'Post unsaved'));
    } catch (error) {
      toast.error(t('toast.saved.unsave_failed', 'Failed to unsave post'));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 h-11 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-base font-semibold text-foreground">{t('saved_posts.title', 'Saved Posts')}</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="text-base font-semibold text-foreground mb-1">
              {t('saved_posts.empty', 'No saved posts yet')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('saved_posts.empty_desc', 'Posts you save will appear here')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedPosts.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-2xl border border-border/10 overflow-hidden"
              >
                {/* Post header */}
                <div className="flex items-center gap-3 p-4 pb-2">
                  <Avatar className="h-9 w-9 cursor-pointer" onClick={() => navigate(`/profile/${item.post.user_id}`)}>
                    <AvatarImage src={item.post.profile?.profile_image} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {item.post.profile?.name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.post.profile?.name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.post.created_at ? formatDistanceToNow(new Date(item.post.created_at), { addSuffix: true }) : ''}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleUnsave(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Post content */}
                <div className="px-4 pb-3 cursor-pointer" onClick={() => navigate(`/post/${item.post.id}`)}>
                  <p className="text-sm text-foreground line-clamp-4">{item.post.content}</p>
                </div>

                {/* Post media */}
                {item.post.media_url && item.post.media_type === 'image' && (
                  <div className="cursor-pointer" onClick={() => navigate(`/post/${item.post.id}`)}>
                    <img src={item.post.media_url} alt="" className="w-full max-h-72 object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;
