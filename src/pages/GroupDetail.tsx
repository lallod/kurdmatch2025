import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getGroupById, getGroupPosts, joinGroup, leaveGroup, isGroupMember } from '@/api/groups';
import PostCard from '@/components/discovery/PostCard';
import BottomNavigation from '@/components/BottomNavigation';
import { toast } from 'sonner';
import type { Group } from '@/api/groups';

export const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadGroupData();
    }
  }, [id]);

  const loadGroupData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [groupData, postsData, memberStatus] = await Promise.all([
        getGroupById(id),
        getGroupPosts(id),
        isGroupMember(id)
      ]);
      
      setGroup(groupData);
      setPosts(postsData.map((gp: any) => gp.posts));
      setIsMember(memberStatus);
    } catch (error) {
      console.error('Error loading group:', error);
      toast.error('Failed to load group');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeave = async () => {
    if (!id) return;

    try {
      if (isMember) {
        await leaveGroup(id);
        setIsMember(false);
        toast.success('Left group');
      } else {
        await joinGroup(id);
        setIsMember(true);
        toast.success('Joined group!');
      }
      loadGroupData(); // Reload to update member count
    } catch (error) {
      console.error('Error joining/leaving group:', error);
      toast.error('Action failed');
    }
  };

  const handleLike = (postId: string) => {
    console.log('Like post:', postId);
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Group not found</h2>
          <Button onClick={() => navigate('/groups')}>Back to Groups</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20">
      {/* Header with Cover */}
      <div className="relative h-64 overflow-hidden">
        {group.cover_image ? (
          <>
            <img
              src={group.cover_image}
              alt={group.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-background"></div>
        )}
        
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="glass backdrop-blur-lg hover:bg-background/80 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="glass backdrop-blur-lg hover:bg-background/80 rounded-full"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Group Icon */}
        <div className="absolute bottom-6 left-6 z-10">
          {group.icon && (
            <div className="glass backdrop-blur-lg rounded-2xl p-4 border border-border/50 shadow-xl">
              <span className="text-5xl">{group.icon}</span>
            </div>
          )}
        </div>
      </div>

      {/* Group Info */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="glass backdrop-blur-lg rounded-2xl border border-border/50 p-6 mb-6 shadow-xl">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text">
              {group.name}
            </h1>
            <p className="text-muted-foreground">{group.description}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">{group.member_count}</span>
              <span>members</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{group.post_count}</span>
              <span>posts</span>
            </div>
            <span>·</span>
            <span className="capitalize px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {group.category}
            </span>
          </div>

          <Button
            onClick={handleJoinLeave}
            variant={isMember ? 'outline' : 'default'}
            size="lg"
            className="w-full rounded-full shadow-lg"
          >
            {isMember ? 'Leave Group' : 'Join Group'}
          </Button>
        </div>

        {/* Posts Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recent Posts</h2>
            {isMember && (
              <Button 
                onClick={() => navigate('/create-post')}
                size="sm"
                className="rounded-full"
              >
                Create Post
              </Button>
            )}
          </div>
          
          {posts.length === 0 ? (
            <div className="glass rounded-2xl border border-border/50 p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to share something with this community
              </p>
              {isMember && (
                <Button 
                  onClick={() => navigate('/create-post')}
                  size="lg"
                  className="rounded-full shadow-lg"
                >
                  Create First Post
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="glass rounded-xl border border-border/50 overflow-hidden hover:border-primary/50 transition-all">
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

      <BottomNavigation />
    </div>
  );
};
