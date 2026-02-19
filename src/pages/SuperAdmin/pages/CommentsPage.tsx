import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageCircle, Trash2, Search, Calendar, Heart, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from '@/hooks/useTranslations';

interface CommentLike {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
  user_profile?: {
    name: string;
    profile_image: string;
  };
}

const CommentsPage = () => {
  const { t } = useTranslations();
  const [commentLikes, setCommentLikes] = useState<CommentLike[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchCommentLikes = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('comment_likes')
        .select(`
          id,
          comment_id,
          user_id,
          created_at,
          user_profile:profiles(name, profile_image)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setCommentLikes(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching comment likes:', error);
      toast.error(t('admin.failed_load_comment_likes', 'Failed to load comment likes'));
    } finally {
      setLoading(false);
    }
  };

  const deleteCommentLike = async (id: string) => {
    if (!confirm(t('admin.confirm_delete_comment_like', 'Are you sure you want to delete this comment like?'))) return;

    try {
      const { error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success(t('admin.comment_like_deleted', 'Comment like deleted successfully'));
      fetchCommentLikes();
    } catch (error) {
      console.error('Error deleting comment like:', error);
      toast.error(t('admin.failed_delete_comment_like', 'Failed to delete comment like'));
    }
  };

  useEffect(() => {
    fetchCommentLikes();
  }, []);

  const filteredLikes = commentLikes.filter(like => {
    const userName = like.user_profile?.name?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return userName.includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.comments_management', 'Comments Management')}</h1>
          <p className="text-white/60 mt-1">{t('admin.comments_desc', 'View and moderate all comment interactions')}</p>
        </div>
        <Button onClick={fetchCommentLikes} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          {t('admin.refresh', 'Refresh')}
        </Button>
      </div>

      <Tabs defaultValue="likes" className="w-full">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger value="likes" className="data-[state=active]:bg-white/10">
            {t('admin.comment_likes', 'Comment Likes')} ({totalCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="likes">
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                {t('admin.all_comment_likes', 'All Comment Likes')}
              </CardTitle>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder={t('admin.search_by_user', 'Search by user name...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-white/60">{t('admin.loading_comment_likes', 'Loading comment likes...')}</div>
              ) : filteredLikes.length === 0 ? (
                <div className="text-center py-8 text-white/60">{t('admin.no_comment_likes', 'No comment likes found')}</div>
              ) : (
                <div className="space-y-3">
                  {filteredLikes.map((like) => (
                    <div
                      key={like.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={like.user_profile?.profile_image || '/placeholder.svg'}
                          alt={like.user_profile?.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">{like.user_profile?.name || t('admin.unknown', 'Unknown')}</p>
                          <p className="text-white/40 text-sm">{t('admin.liked_comment', 'Liked a comment')}</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Comment ID: {like.comment_id.substring(0, 8)}...
                          </Badge>
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(like.created_at), 'MMM d, yyyy')}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/profile/${like.user_id}`, '_blank')}
                          className="text-white/60 hover:text-white hover:bg-white/5"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCommentLike(like.id)}
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommentsPage;
