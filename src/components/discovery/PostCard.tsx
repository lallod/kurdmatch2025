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
      {/* Header */}
      <div className="flex items-center px-3 py-2.5">
        <Avatar 
          className="w-8 h-8 cursor-pointer"
          onClick={handleUsernameClick}
        >
          <AvatarImage src={post.profiles.profile_image} alt={post.profiles.name} />
          <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">{post.profiles.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 ml-2.5">
          <div className="flex items-center gap-1">
            <button onClick={handleUsernameClick} className="font-semibold text-sm text-foreground hover:opacity-70">
              {post.profiles.name}
            </button>
            {post.profiles.verified && (
              <CheckCircle className="w-3 h-3 text-primary fill-primary" />
            )}
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-muted-foreground h-8 w-8 flex items-center justify-center rounded-full">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border rounded-xl">
            {currentUserId === post.user_id ? (
              <>
                <DropdownMenuItem onClick={() => setShowEditDialog(true)} className="text-xs">
                  <Pencil className="w-3.5 h-3.5 mr-2" />Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive focus:text-destructive text-xs">
                  <Trash2 className="w-3.5 h-3.5 mr-2" />Delete
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => setShowReportDialog(true)} className="text-xs">
                  <Flag className="w-3.5 h-3.5 mr-2" />Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowBlockDialog(true)} className="text-destructive focus:text-destructive text-xs">
                  <Ban className="w-3.5 h-3.5 mr-2" />Block
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Media */}
      {post.media_url && (
        <div className="w-full">
          {post.media_type === 'image' ? (
            <img src={post.media_url} alt="Post media" className="w-full h-auto max-h-[420px] object-cover" />
          ) : (
            <video src={post.media_url} controls className="w-full h-auto max-h-[420px]" />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-3 pt-2 pb-1">
        <div className="flex items-center">
          <div className="flex items-center gap-0">
            <button onClick={handleLike} className="h-10 w-10 flex items-center justify-center rounded-full active:scale-90 transition-transform">
              <Heart className={`w-5 h-5 transition-all ${isLiked ? 'fill-primary text-primary scale-110' : 'text-foreground'}`} />
            </button>
            <button onClick={() => setShowComments(!showComments)} className="h-10 w-10 flex items-center justify-center rounded-full active:scale-90 transition-transform">
              <MessageCircle className="w-5 h-5 text-foreground" />
            </button>
            <button onClick={() => setShowShareDialog(true)} className="h-10 w-10 flex items-center justify-center rounded-full active:scale-90 transition-transform">
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
          </div>
          <div className="ml-auto">
            <button onClick={handleSaveToggle} className="h-10 w-10 flex items-center justify-center rounded-full active:scale-90 transition-transform">
              <Bookmark className={`w-5 h-5 transition-all ${isSaved ? 'fill-foreground text-foreground' : 'text-foreground'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Likes */}
      <div className="px-3 pb-0.5">
        <span className="text-xs font-bold text-foreground">{likesCount} likes</span>
      </div>

      {/* Caption */}
      <div className="px-3 pb-1">
        <PostContent content={post.content} />
      </div>

      {/* Comments count */}
      {commentsCount > 0 && !showComments && (
        <button onClick={() => setShowComments(true)} className="px-3 pb-1">
          <span className="text-xs text-muted-foreground">View all {commentsCount} comments</span>
        </button>
      )}

      <div className="h-2" />

      {showComments && (
        <div className="px-3 pb-3 border-t border-border/10 pt-2">
          <CommentSection postId={post.id} currentUserId={currentUserId} />
        </div>
      )}

      {/* Dialogs */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="bg-card border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground text-lg flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              Premium Feature
            </DialogTitle>
            <DialogDescription className="text-muted-foreground space-y-3">
              <p className="text-sm">Messaging is available to Premium members!</p>
              <div className="bg-muted rounded-xl p-3 space-y-1.5">
                <p className="font-semibold text-foreground text-sm">Benefits:</p>
                <ul className="space-y-0.5 text-xs">
                  <li>✓ Unlimited messages</li>
                  <li>✓ 10 Super Likes per day</li>
                  <li>✓ See who liked you</li>
                </ul>
              </div>
              <Button onClick={handleUpgrade} className="w-full rounded-xl h-10 text-sm">
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
