import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Settings } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import PostCard from '@/components/discovery/PostCard';

interface Group {
  id: string;
  name: string;
  description: string;
  cover_image: string | null;
  icon: string | null;
  category: string;
  privacy: string;
  member_count: number;
  post_count: number;
  created_by: string;
  created_at: string;
}

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchGroup();
      fetchGroupPosts();
      checkMembership();
    }
  }, [id]);

  const fetchGroup = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('groups')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setGroup(data);
    } catch (error) {
      console.error('Error fetching group:', error);
      toast({
        title: 'Error',
        description: 'Failed to load group',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupPosts = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('group_posts')
        .select(`
          post_id,
          posts (
            id,
            user_id,
            content,
            media_url,
            media_type,
            likes_count,
            comments_count,
            created_at,
            profiles (
              id,
              name,
              profile_image,
              verified
            )
          )
        `)
        .eq('group_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data?.map((item: any) => item.posts).filter(Boolean) || []);
    } catch (error) {
      console.error('Error fetching group posts:', error);
    }
  };

  const checkMembership = async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await (supabase as any)
        .from('group_members')
        .select('id')
        .eq('group_id', id)
        .eq('user_id', user.id)
        .single();

      setIsMember(!!data);
    } catch (error) {
      setIsMember(false);
    }
  };

  const handleJoinLeave = async () => {
    if (!user || !id) return;

    try {
      if (isMember) {
        const { error } = await (supabase as any)
          .from('group_members')
          .delete()
          .eq('group_id', id)
          .eq('user_id', user.id);

        if (error) throw error;
        setIsMember(false);
        toast({ description: 'Left group' });
      } else {
        const { error } = await (supabase as any)
          .from('group_members')
          .insert({
            group_id: id,
            user_id: user.id,
          });

        if (error) throw error;
        setIsMember(true);
        toast({ description: 'Joined group' });
      }
      fetchGroup();
    } catch (error) {
      console.error('Error joining/leaving group:', error);
      toast({
        title: 'Error',
        description: 'Failed to update membership',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-muted-foreground">Group not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {group.cover_image && (
        <div className="w-full h-48 bg-muted">
          <img
            src={group.cover_image}
            alt={group.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Button variant="ghost" onClick={() => navigate('/groups')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Groups
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  {group.icon && <span>{group.icon}</span>}
                  {group.name}
                </CardTitle>
                <CardDescription>{group.description}</CardDescription>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {group.member_count} members
                  </div>
                  <div>{group.post_count} posts</div>
                  <div className="capitalize">{group.category}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleJoinLeave} variant={isMember ? 'outline' : 'default'}>
                  {isMember ? 'Leave' : 'Join'}
                </Button>
                {user?.id === group.created_by && (
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="posts">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No posts in this group yet
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  onLike={() => fetchGroupPosts()}
                  onComment={() => fetchGroupPosts()}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Members list coming soon
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardContent className="py-4 space-y-2">
                <div>
                  <strong>Category:</strong> {group.category}
                </div>
                <div>
                  <strong>Privacy:</strong> {group.privacy}
                </div>
                <div>
                  <strong>Created:</strong> {new Date(group.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GroupDetail;
