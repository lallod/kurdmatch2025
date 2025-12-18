import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Trash2, Eye, EyeOff, Search, MessageSquare, Image } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  user_id: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: {
    name: string;
    profile_image: string;
  };
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    name: string;
    profile_image: string;
  };
}

const ContentModeration = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<{ type: 'post' | 'comment'; id: string } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user!.id)
      .eq('role', 'super_admin')
      .maybeSingle();

    if (!data) {
      toast({
        title: 'Access Denied',
        description: 'You do not have admin privileges',
        variant: 'destructive',
      });
      navigate('/discovery');
      return;
    }

    fetchContent();
  };

  const fetchContent = async () => {
    try {
      setLoading(true);

      const [{ data: postsData }, { data: commentsData }] = await Promise.all([
        supabase
          .from('posts')
          .select(`
            *,
            profiles!posts_user_id_fkey (name, profile_image)
          `)
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('post_comments')
          .select(`
            *,
            profiles!post_comments_user_id_fkey (name, profile_image)
          `)
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      setPosts(postsData || []);
      setComments(commentsData || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async () => {
    if (!selectedItem) return;

    try {
      if (selectedItem.type === 'post') {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', selectedItem.id);

        if (error) throw error;

        setPosts(posts.filter((p) => p.id !== selectedItem.id));
      } else {
        const { error } = await supabase
          .from('post_comments')
          .delete()
          .eq('id', selectedItem.id);

        if (error) throw error;

        setComments(comments.filter((c) => c.id !== selectedItem.id));
      }

      // Log admin activity
      await supabase.from('admin_activities').insert({
        user_id: user!.id,
        activity_type: 'content_deleted',
        description: `Deleted ${selectedItem.type}: ${selectedItem.id}`,
      });

      toast({
        title: 'Success',
        description: `${selectedItem.type === 'post' ? 'Post' : 'Comment'} deleted successfully`,
      });

      setDeleteDialog(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete content',
        variant: 'destructive',
      });
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.profiles.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredComments = comments.filter((comment) =>
    comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.profiles.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-24">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/dashboard')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Content Moderation</h1>
              <p className="text-white/70 text-sm">Review and manage platform content</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <Input
                placeholder="Search content or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="posts">
              Posts ({filteredPosts.length})
            </TabsTrigger>
            <TabsTrigger value="comments">
              Comments ({filteredComments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4 mt-4">
            {loading ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="py-12 text-center text-white">
                  Loading posts...
                </CardContent>
              </Card>
            ) : filteredPosts.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/70">No posts found</p>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post.id} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={post.profiles.profile_image}
                        alt={post.profiles.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div>
                            <p className="text-white font-semibold">{post.profiles.name}</p>
                            <p className="text-white/50 text-xs">
                              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedItem({ type: 'post', id: post.id });
                              setDeleteDialog(true);
                            }}
                            className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-white text-sm mb-2">{post.content}</p>
                        {post.media_url && (
                          <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
                            {post.media_type === 'image' ? (
                              <img
                                src={post.media_url}
                                alt="Post media"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={post.media_url}
                                className="w-full h-full object-cover"
                                controls
                              />
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-white/50 text-xs">
                          <span>{post.likes_count} likes</span>
                          <span>{post.comments_count} comments</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="comments" className="space-y-4 mt-4">
            {loading ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="py-12 text-center text-white">
                  Loading comments...
                </CardContent>
              </Card>
            ) : filteredComments.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/70">No comments found</p>
                </CardContent>
              </Card>
            ) : (
              filteredComments.map((comment) => (
                <Card key={comment.id} className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={comment.profiles.profile_image}
                        alt={comment.profiles.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div>
                            <p className="text-white font-semibold">{comment.profiles.name}</p>
                            <p className="text-white/50 text-xs">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedItem({ type: 'comment', id: comment.id });
                              setDeleteDialog(true);
                            }}
                            className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-white text-sm">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Content</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this {selectedItem?.type}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteContent} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ContentModeration;
