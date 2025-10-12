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
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="relative">
        {group.cover_image && (
          <img
            src={group.cover_image}
            alt={group.name}
            className="w-full h-48 object-cover"
          />
        )}
        
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="bg-black/50 hover:bg-black/70 text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Group Info */}
      <div className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex items-start gap-3">
          {group.icon && <span className="text-4xl">{group.icon}</span>}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{group.name}</h1>
            <p className="text-muted-foreground">{group.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {group.member_count} members
          </span>
          <span>·</span>
          <span>{group.post_count} posts</span>
          <span>·</span>
          <span className="capitalize">{group.category}</span>
        </div>

        <Button
          onClick={handleJoinLeave}
          variant={isMember ? 'outline' : 'default'}
          className="w-full"
        >
          {isMember ? 'Leave Group' : 'Join Group'}
        </Button>

        {/* Posts */}
        <div className="pt-6 space-y-6">
          <h2 className="text-xl font-semibold">Recent Posts</h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">No posts yet</p>
              {isMember && (
                <Button className="mt-4" onClick={() => navigate('/create-post')}>
                  Create First Post
                </Button>
              )}
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};
