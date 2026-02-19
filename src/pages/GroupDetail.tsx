import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Settings } from 'lucide-react';
import { toast } from 'sonner';
import PostCard from '@/components/discovery/PostCard';
import { LoadingState } from '@/components/LoadingState';
import { getGroupById, getGroupPosts, isGroupMember, joinGroup, leaveGroup } from '@/api/groups';

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
  const { t } = useTranslations();
  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadAllData();
    }
  }, [id, user]);

  const loadAllData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Load all data in parallel for faster loading
      const [groupData, postsData, membershipStatus] = await Promise.all([
        getGroupById(id),
        getGroupPosts(id),
        user ? isGroupMember(id) : Promise.resolve(false)
      ]);

      setGroup(groupData);
      setPosts(postsData?.map((item: any) => item.posts).filter(Boolean) || []);
      setIsMember(membershipStatus);
    } catch (error) {
      console.error('Error loading group data:', error);
      toast.error(t('groups.load_failed', 'Failed to load group'));
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupPosts = async () => {
    if (!id) return;
    try {
      const data = await getGroupPosts(id);
      setPosts(data?.map((item: any) => item.posts).filter(Boolean) || []);
    } catch (error) {
      console.error('Error fetching group posts:', error);
    }
  };

  const handleJoinLeave = async () => {
    if (!user || !id) return;

    try {
      if (isMember) {
        await leaveGroup(id);
        setIsMember(false);
        toast('Left group');
      } else {
        await joinGroup(id);
        setIsMember(true);
        toast('Joined group');
      }
      // Refresh group data to update member count
      const updatedGroup = await getGroupById(id);
      setGroup(updatedGroup);
    } catch (error) {
      console.error('Error joining/leaving group:', error);
      toast.error(t('groups.membership_failed', 'Failed to update membership'));
    }
  };

  if (loading) {
    return <LoadingState message="Loading group..." fullScreen />;
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-muted-foreground">{t('groups.not_found', 'Group not found')}</div>
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
          {t('groups.back_to_groups', 'Back to Groups')}
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
                    {group.member_count} {t('groups.members', 'members')}
                  </div>
                  <div>{group.post_count} {t('groups.posts', 'posts')}</div>
                  <div className="capitalize">{group.category}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleJoinLeave} variant={isMember ? 'outline' : 'default'}>
                  {isMember ? t('groups.leave', 'Leave') : t('groups.join', 'Join')}
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
            <TabsTrigger value="posts">{t('groups.posts', 'Posts')}</TabsTrigger>
            <TabsTrigger value="members">{t('groups.members', 'Members')}</TabsTrigger>
            <TabsTrigger value="about">{t('groups.about', 'About')}</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  {t('groups.no_posts', 'No posts in this group yet')}
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
                {t('groups.members_coming_soon', 'Members list coming soon')}
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
