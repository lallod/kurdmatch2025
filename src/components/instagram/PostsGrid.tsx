import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Post } from '@/api/posts';
import { useNavigate } from 'react-router-dom';

interface PostsGridProps {
  posts: Post[];
  onRefresh: () => void;
}

const PostsGrid: React.FC<PostsGridProps> = ({ posts, onRefresh }) => {
  const navigate = useNavigate();

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
          <Heart className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-semibold text-foreground mb-1">No posts yet</h3>
        <p className="text-muted-foreground text-xs">Posts will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-0.5">
      {posts.map((post) => (
        <button
          key={post.id}
          onClick={() => navigate(`/post/${post.id}`)}
          className="relative aspect-square group overflow-hidden bg-muted active:opacity-80 transition-opacity"
        >
          {post.media_url ? (
            post.media_type === 'video' ? (
              <video src={post.media_url} className="w-full h-full object-cover" muted />
            ) : (
              <img src={post.media_url} alt="Post" className="w-full h-full object-cover" />
            )
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center p-2">
              <p className="text-primary-foreground text-[10px] line-clamp-4 text-center">{post.content}</p>
            </div>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <div className="flex items-center gap-1 text-white text-xs font-semibold">
              <Heart className="w-4 h-4 fill-white" />
              {post.likes_count}
            </div>
            <div className="flex items-center gap-1 text-white text-xs font-semibold">
              <MessageCircle className="w-4 h-4 fill-white" />
              {post.comments_count}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default PostsGrid;
