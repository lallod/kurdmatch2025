import React, { useState, useEffect } from 'react';
import { Post, likePost, unlikePost } from '@/api/posts';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, CheckCircle, MoreVertical, Flag, Ban, Heart, Pencil, Trash2, Share2, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import PostContent from './PostContent';
import { useNavigate } from 'react-router-dom';
import { getUserSubscription } from '@/api/usage';
import { createPremiumCheckout } from '@/api/payments';
import { useToast } from '@/hooks/use-toast';
import CommentSection from './CommentSection';
import ReportDialog from './ReportDialog';
import BlockUserDialog from './BlockUserDialog';
import EditPostDialog from './EditPostDialog';
import DeletePostDialog from './DeletePostDialog';
import { SharePostDialog } from './SharePostDialog';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
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
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  useEffect(() => {
    checkSubscription();
    getCurrentUser();
    checkIfSaved();

    const channel = supabase
      .channel('post-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts', filter: `id=eq.${post.id}` },
        (payload: any) => {
          setLikesCount(payload.new.likes_count || 0);
          setCommentsCount(payload.new.comments_count || 0);
        }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [post.id]);

  const checkSubscription = async () => {
    const subscription = await getUserSubscription();
    setIsPremium(subscription?.subscriptionType !== 'free');
  };

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id);
  };

  const checkIfSaved = async () => {
    if (!currentUserId) return;
    try {
      const { data, error } = await (supabase as any)
        .from('saved_posts').select('id').eq('user_id', currentUserId).eq('post_id', post.id).maybeSingle();
      if (!error && data) setIsSaved(true);
    } catch (error) { console.error('Error checking saved status:', error); }
  };

  const handleSaveToggle = async () => {
    if (!currentUserId) return;
    try {
      if (isSaved) {
        const { error } = await (supabase as any).from('saved_posts').delete().eq('user_id', currentUserId).eq('post_id', post.id);
        if (error) throw error;
        setIsSaved(false);
        toast({ description: 'Post unsaved' });
      } else {
        const { error } = await (supabase as any).from('saved_posts').insert({ user_id: currentUserId, post_id: post.id });
        if (error) throw error;
        setIsSaved(true);
        toast({ description: 'Post saved!' });
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast({ title: 'Error', description: 'Failed to save post', variant: 'destructive' });
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) { await unlikePost(post.id); setIsLiked(false); }
      else { await likePost(post.id); setIsLiked(true); }
      onLike(post.id);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update like', variant: 'destructive' });
    }
  };

  const handleUsernameClick = () => navigate(`/profile/${post.user_id}`);

  const handleMessageClick = () => {
    if (!isPremium) { setShowUpgradeDialog(true); return; }
    navigate(`/messages?userId=${post.user_id}`);
  };

  const handleUpgrade = async () => {
    try { await createPremiumCheckout('premium'); }
    catch (error) { toast({ title: 'Error', description: 'Failed to start checkout', variant: 'destructive' }); }
  };

  return (
    <div className="animate-fade-in">
      {/* Header: avatar + name + more menu */}
      <div className="flex items-center px-4 py-3">
        <Avatar 
          className="w-9 h-9 cursor-pointer ring-1 ring-border/50"
          onClick={handleUsernameClick}
        >
          <AvatarImage src={post.profiles.profile_image} alt={post.profiles.name} />
          <AvatarFallback className="text-xs bg-muted text-muted-foreground">{post.profiles.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 ml-3">
          <button onClick={handleUsernameClick} className="font-semibold text-sm text-foreground hover:opacity-70">
            {post.profiles.name}
          </button>
          {post.profiles.verified && (
            <CheckCircle className="w-3.5 h-3.5 text-primary fill-primary inline ml-1" />
          )}
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground h-10 w-10 rounded-full">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border rounded-2xl">
            {currentUserId === post.user_id ? (
              <>
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Pencil className="w-4 h-4 mr-2" />Edit Post
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive focus:text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />Delete Post
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => setShowReportDialog(true)}>
                  <Flag className="w-4 h-4 mr-2" />Report Post
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowBlockDialog(true)} className="text-destructive focus:text-destructive">
                  <Ban className="w-4 h-4 mr-2" />Block User
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Edge-to-edge media within card */}
      {post.media_url && (
        <div className="w-full">
          {post.media_type === 'image' ? (
            <img src={post.media_url} alt="Post media" className="w-full h-auto max-h-[480px] object-cover" />
          ) : (
            <video src={post.media_url} controls className="w-full h-auto max-h-[480px]" />
          )}
        </div>
      )}

      {/* Action row — 28px icons, 48px touch targets */}
      <div className="px-4 pt-3 pb-1.5">
        <div className="flex items-center">
          <div className="flex items-center gap-1">
            <button onClick={handleLike} className="h-12 w-12 flex items-center justify-center rounded-full active:scale-90 transition-transform">
              <Heart className={`w-7 h-7 transition-all ${isLiked ? 'fill-primary text-primary scale-110' : 'text-foreground'}`} />
            </button>
            <button onClick={() => setShowComments(!showComments)} className="h-12 w-12 flex items-center justify-center rounded-full active:scale-90 transition-transform">
              <MessageCircle className="w-7 h-7 text-foreground" />
            </button>
            <button onClick={() => setShowShareDialog(true)} className="h-12 w-12 flex items-center justify-center rounded-full active:scale-90 transition-transform">
              <Share2 className="w-7 h-7 text-foreground" />
            </button>
          </div>
          <div className="ml-auto">
            <button onClick={handleSaveToggle} className="h-12 w-12 flex items-center justify-center rounded-full active:scale-90 transition-transform">
              <Bookmark className={`w-7 h-7 transition-all ${isSaved ? 'fill-foreground text-foreground' : 'text-foreground'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Likes count */}
      <div className="px-4 pb-1">
        <span className="text-sm font-bold text-foreground">{likesCount} likes</span>
      </div>

      {/* Caption */}
      <div className="px-4 pb-1.5">
        <PostContent content={post.content} />
      </div>

      {/* Comments count */}
      {commentsCount > 0 && !showComments && (
        <button onClick={() => setShowComments(true)} className="px-4 pb-1.5">
          <span className="text-sm text-muted-foreground">View all {commentsCount} comments</span>
        </button>
      )}

      {/* Bottom padding */}
      <div className="h-3" />

      {/* Comment Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-border/10 pt-3">
          <CommentSection postId={post.id} currentUserId={currentUserId} />
        </div>
      )}

      {/* Dialogs */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="bg-card border-border rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-foreground text-xl flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Messaging - Premium Feature
            </DialogTitle>
            <DialogDescription className="text-muted-foreground space-y-4">
              <p>Messaging is available to Premium and Gold members!</p>
              <div className="bg-muted rounded-2xl p-4 space-y-2">
                <p className="font-semibold text-foreground">Premium Benefits:</p>
                <ul className="space-y-1 text-sm">
                  <li>✓ Send unlimited messages</li>
                  <li>✓ 10 Super Likes per day</li>
                  <li>✓ Unlimited regular likes</li>
                  <li>✓ See who liked you</li>
                  <li>✓ 5 Rewinds per day</li>
                </ul>
              </div>
              <Button onClick={handleUpgrade} className="w-full rounded-2xl h-11">
                Upgrade to Premium
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <EditPostDialog open={showEditDialog} onOpenChange={setShowEditDialog} postId={post.id} initialContent={post.content} onSuccess={() => window.location.reload()} />
      <DeletePostDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} postId={post.id} onSuccess={() => window.location.reload()} />
      <ReportDialog open={showReportDialog} onOpenChange={setShowReportDialog} contentId={post.id} contentType="post" reportedUserId={post.user_id} />
      <BlockUserDialog open={showBlockDialog} onOpenChange={setShowBlockDialog} userId={post.user_id} userName={post.profiles.name} onBlocked={() => { toast({ title: 'User Blocked', description: 'This user has been blocked successfully' }); }} />
      <SharePostDialog open={showShareDialog} onOpenChange={setShowShareDialog} postId={post.id} postContent={post.content} />
    </div>
  );
};

export default PostCard;
