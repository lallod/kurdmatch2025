import React, { useState } from 'react';
import { Comment } from '@/api/comments';
import { Heart, MessageCircle, MoreVertical, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { likeComment, unlikeComment, deleteComment } from '@/api/comments';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/useTranslations';

interface CommentThreadProps {
  comment: Comment;
  onReply: (parentId: string) => void;
  onDelete: (commentId: string) => void;
  currentUserId?: string;
}

const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  onReply,
  onDelete,
  currentUserId,
}) => {
  const { t } = useTranslations();
  const [isLiked, setIsLiked] = useState(comment.is_liked || false);
  const [likesCount, setLikesCount] = useState(comment.likes_count);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLike = async () => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      
      if (isLiked) {
        await unlikeComment(comment.id);
      } else {
        await likeComment(comment.id);
      }
    } catch (error) {
      setIsLiked(comment.is_liked || false);
      setLikesCount(comment.likes_count);
      
      toast({
        title: t('common.error', 'Error'),
        description: t('comments.like_failed', 'Failed to update like'),
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment(comment.id);
      onDelete(comment.id);
      toast({
        title: t('common.success', 'Success'),
        description: t('comments.deleted', 'Comment deleted'),
      });
    } catch (error) {
      toast({
        title: t('common.error', 'Error'),
        description: t('comments.delete_failed', 'Failed to delete comment'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={cn('flex gap-2', comment.depth > 0 && 'ml-8')}>
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.profiles.profile_image} alt={comment.profiles.name} />
        <AvatarFallback>{comment.profiles.name[0]}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="bg-accent/50 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{comment.profiles.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>

        <div className="flex items-center gap-4 mt-1 px-2">
          <button
            onClick={handleLike}
            disabled={isUpdating}
            className={cn(
              'flex items-center gap-1 text-xs hover:text-primary transition-colors disabled:opacity-50',
              isLiked && 'text-pink-500'
            )}
          >
            <Heart className={cn('w-3 h-3', isLiked && 'fill-current')} />
            {likesCount > 0 && <span>{likesCount}</span>}
          </button>

          {comment.depth < 2 && (
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              {t('comments.reply', 'Reply')}
            </button>
          )}

          {currentUserId === comment.user_id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('common.delete', 'Delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => (
              <CommentThread key={reply.id} comment={reply} onReply={onReply} onDelete={onDelete} currentUserId={currentUserId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentThread;
