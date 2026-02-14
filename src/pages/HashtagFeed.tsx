import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPostsByHashtag } from '@/api/hashtags';
import PostCard from '@/components/discovery/PostCard';


export const HashtagFeed = () => {
  const { hashtag } = useParams<{ hashtag: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hashtag) {
      loadPosts();
    }
  }, [hashtag]);

  const loadPosts = async () => {
    if (!hashtag) return;
    
    setLoading(true);
    try {
      const data = await getPostsByHashtag(hashtag);
      setPosts(data);
    } catch (error) {
      console.error('Error loading hashtag posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    // Implement like functionality
    console.log('Like post:', postId);
  };

  const handleComment = (postId: string) => {
    // Implement comment functionality
    console.log('Comment on post:', postId);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2 flex-1">
            <Hash className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">{hashtag}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <Hash className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No posts found</h2>
            <p className="text-muted-foreground">
              Be the first to post with #{hashtag}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-muted-foreground">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </p>
            
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </div>
        )}
      </div>

      
    </div>
  );
};
