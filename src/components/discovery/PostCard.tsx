import React, { useState, useEffect, useRef } from 'react';
import { Post, likePost, unlikePost } from '@/api/posts';
import { useTranslations } from '@/hooks/useTranslations';
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
  const { t } = useTranslations();
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
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false);
  const lastTapRef = useRef(0);

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
        toast({ description: t('discovery.post_unsaved', 'Post unsaved') });
      } else {
        const { error } = await (supabase as any).from('saved_posts').insert({ user_id: currentUserId, post_id: post.id });
        if (error) throw error;
        setIsSaved(true);
        toast({ description: t('discovery.post_saved', 'Post saved!') });
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast({ title: t('common.error', 'Error'), description: t('discovery.failed_save', 'Failed to save post'), variant: 'destructive' });
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) { await unlikePost(post.id); setIsLiked(false); }
      else { await likePost(post.id); setIsLiked(true); }
      onLike(post.id);
    } catch (error) {
      toast({ title: t('common.error', 'Error'), description: t('discovery.failed_like', 'Failed to update like'), variant: 'destructive' });
    }
  };

  const handleUsernameClick = () => navigate(`/profile/${post.user_id}`);

  const handleMessageClick = () => {
    if (!isPremium) { setShowUpgradeDialog(true); return; }
    navigate(`/messages?userId=${post.user_id}`);
  };

  const handleUpgrade = async () => {
    try { await createPremiumCheckout('premium'); }
    catch (error) { toast({ title: t('common.error', 'Error'), description: t('subscription.failed_checkout', 'Failed to start checkout'), variant: 'destructive' }); }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      if (!isLiked) handleLike();
      setShowDoubleTapHeart(true);
      setTimeout(() => setShowDoubleTapHeart(false), 800);
    }
    lastTapRef.current = now;
  };

  const profiles = post.profiles ?? { name: 'Unknown', profile_image: '', verified: false };
  const isOwnPost = currentUserId === post.user_id;
  const hasMedia = !!(post as any).media_url;
  const mediaType = (post as any).media_type || 'image';
  const mediaUrl = (post as any).media_url;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center px-3 py-2.5">
        <Avatar className="w-8 h-8 cursor-pointer" onClick={handleUsernameClick}>
          <AvatarImage src={profiles.profile_image} alt={profiles.name} />
          <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">{profiles.name?.[0] ?? '?'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 ml-2.5">
          <div className="flex items-center gap-1">
            <button onClick={handleUsernameClick} className="font-semibold text-sm text-foreground hover:opacity-70">
              {profiles.name}
            </button>
            {profiles.verified && <CheckCircle className="w-3 h-3 text-primary fill-primary" />}
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-muted-foreground h-8 w-8 flex items-center justify-center rounded-full" aria-label="Post options">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {isOwnPost && (
              <>
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Pencil className="mr-2 h-4 w-4" />{t('common.edit', 'Edit')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />{t('common.delete', 'Delete')}
                </DropdownMenuItem>
              </>
            )}
            {!isOwnPost && (
              <>
                <DropdownMenuItem onClick={() => setShowReportDialog(true)}>
                  <Flag className="mr-2 h-4 w-4" />{t('common.report', 'Report')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowBlockDialog(true)}>
                  <Ban className="mr-2 h-4 w-4" />{t('common.block', 'Block')}
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
              <Share2 className="mr-2 h-4 w-4" />{t('common.share', 'Share')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Media (Instagram-style full-width) */}
      {hasMedia && (
        <div className="relative w-full" onClick={handleDoubleTap}>
          {mediaType === 'video' ? (
            <video
              src={mediaUrl}
              controls
              playsInline
              preload="metadata"
              className="w-full max-h-[600px] object-cover bg-black"
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Post media"
              className="w-full max-h-[600px] object-cover bg-muted"
              loading="lazy"
            />
          )}
          {/* Double-tap heart animation */}
          {showDoubleTapHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart className="w-20 h-20 text-white fill-white drop-shadow-lg animate-scale-in" />
            </div>
          )}
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} className="flex items-center gap-1.5 group" aria-label={isLiked ? 'Unlike post' : 'Like post'}>
            <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-muted-foreground group-hover:text-red-400'}`} />
            {likesCount > 0 && <span className="text-xs text-muted-foreground">{likesCount}</span>}
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 group" aria-label="Comments">
            <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            {commentsCount > 0 && <span className="text-xs text-muted-foreground">{commentsCount}</span>}
          </button>
          <button onClick={handleMessageClick} className="flex items-center gap-1.5 group" aria-label="Send message">
            <MessageCircle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </div>
        <button onClick={handleSaveToggle} aria-label={isSaved ? 'Unsave post' : 'Save post'}>
          <Bookmark className={`w-5 h-5 transition-colors ${isSaved ? 'text-primary fill-primary' : 'text-muted-foreground hover:text-primary'}`} />
        </button>
      </div>

      {/* Caption (text content below media, Instagram-style) */}
      {post.content && (
        <div className="px-3 pb-2">
          <div className={`text-sm ${!showFullCaption && hasMedia ? 'line-clamp-2' : ''}`}>
            <span className="font-semibold text-foreground mr-1.5 text-sm">{profiles.name}</span>
            <PostContent content={post.content} />
          </div>
          {hasMedia && !showFullCaption && post.content.length > 100 && (
            <button onClick={() => setShowFullCaption(true)} className="text-xs text-muted-foreground mt-0.5">
              more
            </button>
          )}
        </div>
      )}

      {/* Text-only posts (no media) show content normally */}
      {!hasMedia && !post.content && null}

      {/* Comments section */}
      {showComments && <CommentSection postId={post.id} />}

      {/* Upgrade dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('subscription.upgrade_title', 'Upgrade to Premium')}</DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                {t('subscription.upgrade_message_feature', 'Messaging is a premium feature. Upgrade to start conversations!')}
              </p>
              <Button onClick={handleUpgrade} className="w-full">
                {t('subscription.upgrade_premium', 'Upgrade to Premium')}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <EditPostDialog open={showEditDialog} onOpenChange={setShowEditDialog} postId={post.id} initialContent={post.content} onSuccess={() => window.location.reload()} />
      <DeletePostDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} postId={post.id} onSuccess={() => window.location.reload()} />
      <ReportDialog open={showReportDialog} onOpenChange={setShowReportDialog} contentId={post.id} contentType="post" reportedUserId={post.user_id} />
      <BlockUserDialog open={showBlockDialog} onOpenChange={setShowBlockDialog} userId={post.user_id} userName={profiles.name} onBlocked={() => { toast({ title: t('common.user_blocked', 'User Blocked'), description: t('common.user_blocked_desc', 'This user has been blocked successfully') }); }} />
      <SharePostDialog open={showShareDialog} onOpenChange={setShowShareDialog} postId={post.id} postContent={post.content} />
    </div>
  );
};

export default PostCard;
