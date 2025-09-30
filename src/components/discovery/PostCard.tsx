import React, { useState } from 'react';
import { Post } from '@/api/posts';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(post.id);
  };

  const handleUsernameClick = () => {
    navigate(`/profile/${post.user_id}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-3 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Avatar 
          className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
          onClick={handleUsernameClick}
        >
          <AvatarImage src={post.profiles.profile_image} alt={post.profiles.name} />
          <AvatarFallback>{post.profiles.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <button
              onClick={handleUsernameClick}
              className="font-semibold text-foreground hover:underline"
            >
              {post.profiles.name}
            </button>
            {post.profiles.verified && (
              <CheckCircle className="w-4 h-4 text-primary fill-primary" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
        
        {/* Media */}
        {post.media_url && (
          <div className="rounded-lg overflow-hidden">
            {post.media_type === 'image' ? (
              <img 
                src={post.media_url} 
                alt="Post media" 
                className="w-full h-auto max-h-[500px] object-cover"
              />
            ) : (
              <video 
                src={post.media_url} 
                controls 
                className="w-full h-auto max-h-[500px]"
              />
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 pt-2">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >
          <Heart 
            className={`w-5 h-5 transition-all ${
              isLiked ? 'fill-primary text-primary scale-110' : 'group-hover:scale-110'
            }`}
          />
          <span className="text-sm">{likesCount}</span>
        </button>
        
        <button
          onClick={() => onComment(post.id)}
          className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors group"
        >
          <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm">{post.comments_count}</span>
        </button>
        
        <button className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors group ml-auto">
          <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
