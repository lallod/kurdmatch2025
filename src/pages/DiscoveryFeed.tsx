import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, getStories, likePost, unlikePost, Post, Story } from '@/api/posts';
import StoryBubbles from '@/components/discovery/StoryBubbles';
import PostCard from '@/components/discovery/PostCard';
import { Button } from '@/components/ui/button';
import { PenSquare, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BottomNavigation from '@/components/BottomNavigation';

const DiscoveryFeed = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [postsData, storiesData] = await Promise.all([
        getPosts(),
        getStories()
      ]);
      setPosts(postsData);
      setStories(storiesData);
    } catch (error) {
      console.error('Error loading feed:', error);
      toast({
        title: 'Error',
        description: 'Failed to load feed',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (post?.is_liked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: 'Error',
        description: 'Failed to like post',
        variant: 'destructive'
      });
    }
  };

  const handleComment = (postId: string) => {
    // Navigate to post detail with comments
    toast({
      title: 'Comments',
      description: 'Comment feature coming soon!'
    });
  };

  const handleStoryClick = (story: Story) => {
    toast({
      title: 'Story Viewer',
      description: 'Story viewer coming soon!'
    });
  };

  const handleAddStory = () => {
    toast({
      title: 'Add Story',
      description: 'Story creation coming soon!'
    });
  };

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Discovery</h1>
          <Button onClick={handleCreatePost} size="sm" className="gap-2">
            <PenSquare className="w-4 h-4" />
            New Post
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Stories Section */}
        {stories.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-4">
            <StoryBubbles
              stories={stories}
              onStoryClick={handleStoryClick}
              onAddStory={handleAddStory}
            />
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No posts yet</p>
              <Button onClick={handleCreatePost} className="gap-2">
                <PenSquare className="w-4 h-4" />
                Create First Post
              </Button>
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

export default DiscoveryFeed;
