import React, { useState, useEffect } from 'react';
import { Post } from '@/api/posts';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Share2, CheckCircle, MoreVertical, Flag, Ban } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getUserSubscription } from '@/api/usage';
import { createPremiumCheckout } from '@/api/payments';
import { useToast } from '@/hooks/use-toast';
import SuperLikeButton from './SuperLikeButton';
import ReactionPicker from './ReactionPicker';
import ReactionsSummary from './ReactionsSummary';
import CommentSection from './CommentSection';
import ReportDialog from './ReportDialog';
import BlockUserDialog from './BlockUserDialog';
import { addReaction, removeReaction, getUserReaction, ReactionType } from '@/api/reactions';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(null);
  const [reactions, setReactions] = useState({
    love_count: post.love_count || 0,
    haha_count: post.haha_count || 0,
    fire_count: post.fire_count || 0,
    applause_count: post.applause_count || 0,
    thoughtful_count: post.thoughtful_count || 0,
    wow_count: post.wow_count || 0,
    sad_count: post.sad_count || 0,
    total_reactions: post.total_reactions || 0,
  });
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  useEffect(() => {
    checkSubscription();
    loadUserReaction();
    getCurrentUser();
  }, []);

  const checkSubscription = async () => {
    const subscription = await getUserSubscription();
    setIsPremium(subscription?.subscriptionType !== 'free');
  };

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id);
  };

  const loadUserReaction = async () => {
    const reaction = await getUserReaction(post.id);
    setCurrentReaction(reaction);
  };

  const handleReaction = async (reactionType: ReactionType) => {
    try {
      if (currentReaction === reactionType) {
        // Remove reaction
        await removeReaction(post.id);
        setCurrentReaction(null);
        setReactions(prev => ({
          ...prev,
          [`${reactionType}_count`]: Math.max(0, prev[`${reactionType}_count` as keyof typeof prev] - 1),
          total_reactions: Math.max(0, prev.total_reactions - 1),
        }));
      } else {
        // Add or change reaction
        await addReaction(post.id, reactionType);
        
        setReactions(prev => {
          const newReactions = { ...prev };
          
          // Decrease old reaction count
          if (currentReaction) {
            newReactions[`${currentReaction}_count` as keyof typeof newReactions] = Math.max(
              0,
              prev[`${currentReaction}_count` as keyof typeof prev] - 1
            );
          }
          
          // Increase new reaction count
          newReactions[`${reactionType}_count` as keyof typeof newReactions] = 
            prev[`${reactionType}_count` as keyof typeof prev] + 1;
          
          // Update total
          if (!currentReaction) {
            newReactions.total_reactions = prev.total_reactions + 1;
          }
          
          return newReactions;
        });
        
        setCurrentReaction(reactionType);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update reaction',
        variant: 'destructive',
      });
    }
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
        <ReactionPicker
          onReactionSelect={handleReaction}
          currentReaction={currentReaction}
        />
        
        <ReactionsSummary reactions={reactions} />
        
        <button
          onClick={() => setShowComments(!showComments)}
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
        
        <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
          <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto text-white/70 hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowReportDialog(true)}>
              <Flag className="w-4 h-4 mr-2" />
              Report Post
            </DropdownMenuItem>
            {currentUserId !== post.user_id && (
              <DropdownMenuItem onClick={() => setShowBlockDialog(true)} className="text-destructive">
                <Ban className="w-4 h-4 mr-2" />
                Block User
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <CommentSection postId={post.id} currentUserId={currentUserId} />
        </div>
      )}

      {/* Dialogs */}
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

      <ReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        contentId={post.id}
        contentType="post"
        reportedUserId={post.user_id}
      />

      <BlockUserDialog
        open={showBlockDialog}
        onOpenChange={setShowBlockDialog}
        userId={post.user_id}
        userName={post.profiles.name}
        onBlocked={() => {
          toast({
            title: 'User Blocked',
            description: 'This user has been blocked successfully',
          });
        }}
      />
    </div>
  );
};

export default PostCard;
