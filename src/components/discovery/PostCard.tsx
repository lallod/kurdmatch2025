import React, { useState, useEffect } from 'react';
import { Post } from '@/api/posts';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getUserSubscription } from '@/api/usage';
import { createPremiumCheckout } from '@/api/payments';
import { useToast } from '@/hooks/use-toast';
import SuperLikeButton from './SuperLikeButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    const subscription = await getUserSubscription();
    setIsPremium(subscription?.subscriptionType !== 'free');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(post.id);
  };

  const handleUsernameClick = () => {
    navigate(`/profile/${post.user_id}`);
  };

  const handleMessageClick = () => {
    if (!isPremium) {
      setShowUpgradeDialog(true);
      return;
    }
    navigate(`/messages?userId=${post.user_id}`);
  };

  const handleUpgrade = async () => {
    try {
      await createPremiumCheckout('premium');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start checkout',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-3 animate-fade-in">
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
              className="font-semibold text-white hover:underline"
            >
              {post.profiles.name}
            </button>
            {post.profiles.verified && (
              <CheckCircle className="w-4 h-4 text-pink-400 fill-pink-400" />
            )}
          </div>
          <p className="text-xs text-white/70">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <p className="text-white whitespace-pre-wrap">{post.content}</p>
        
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
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-white/70 hover:text-pink-400 transition-colors group"
        >
          <Heart 
            className={`w-5 h-5 transition-all ${
              isLiked ? 'fill-pink-400 text-pink-400 scale-110' : 'group-hover:scale-110'
            }`}
          />
          <span className="text-sm">{likesCount}</span>
        </button>
        
        <SuperLikeButton postId={post.id} userId={post.user_id} />
        
        <button
          onClick={() => onComment(post.id)}
          className="flex items-center gap-2 text-white/70 hover:text-purple-400 transition-colors group"
        >
          <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm">{post.comments_count}</span>
        </button>
        
        <button 
          onClick={handleMessageClick}
          className="flex items-center gap-2 text-white/70 hover:text-purple-400 transition-colors group relative"
        >
          <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {!isPremium && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              PRO
            </span>
          )}
        </button>
        
        <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group ml-auto">
          <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-purple-400" />
              Messaging - Premium Feature
            </DialogTitle>
            <DialogDescription className="text-white/70 space-y-4">
              <p>Messaging is available to Premium and Gold members!</p>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 space-y-2">
                <p className="font-semibold text-white">Premium Benefits:</p>
                <ul className="space-y-1 text-sm">
                  <li>✓ Send unlimited messages</li>
                  <li>✓ 10 Super Likes per day</li>
                  <li>✓ Unlimited regular likes</li>
                  <li>✓ See who liked you</li>
                  <li>✓ 5 Rewinds per day</li>
                </ul>
              </div>
              <Button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                Upgrade to Premium
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostCard;
