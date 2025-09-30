import React, { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Post } from '@/api/posts';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PostCard from '@/components/discovery/PostCard';
import { likePost, unlikePost } from '@/api/posts';
import { toast } from 'sonner';

interface PostsGridProps {
  posts: Post[];
  onRefresh: () => void;
}

const PostsGrid: React.FC<PostsGridProps> = ({ posts, onRefresh }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handleLike = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      if (post.is_liked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
      onRefresh();
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) setSelectedPost(post);
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
          <Heart className="w-10 h-10 text-white/30" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No posts yet</h3>
        <p className="text-white/60 text-sm">Posts will appear here</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="relative aspect-square group overflow-hidden bg-black/20"
          >
            {post.media_url ? (
              post.media_type === 'video' ? (
                <video
                  src={post.media_url}
                  className="w-full h-full object-cover"
                  muted
                />
              ) : (
                <img
                  src={post.media_url}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-2">
                <p className="text-white text-xs line-clamp-4">{post.content}</p>
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-white">
                <Heart className="w-6 h-6 fill-white" />
                <span className="font-semibold">{post.likes_count}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <MessageCircle className="w-6 h-6 fill-white" />
                <span className="font-semibold">{post.comments_count}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-4xl bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 border-white/10 p-6">
          {selectedPost && (
            <div className="max-h-[80vh] overflow-y-auto">
              <PostCard
                post={selectedPost}
                onLike={handleLike}
                onComment={handleComment}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostsGrid;
