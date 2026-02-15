import React, { useState, useEffect } from 'react';
import { getComments, createComment, Comment } from '@/api/comments';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CommentThread from './CommentThread';
import { supabase } from '@/integrations/supabase/client';

interface CommentSectionProps {
  postId: string;
  currentUserId?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, currentUserId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();

    // Real-time updates for new comments
    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_comments',
          filter: `post_id=eq.${postId}`
        },
        () => {
          loadComments();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'post_comments',
          filter: `post_id=eq.${postId}`
        },
        () => {
          loadComments();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'post_comments',
          filter: `post_id=eq.${postId}`
        },
        () => {
          loadComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const loadComments = async () => {
    try {
      const data = await getComments(postId);
      
      // Build nested comment structure
      const commentMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      data.forEach(comment => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });

      data.forEach(comment => {
        if (comment.parent_comment_id) {
          const parent = commentMap.get(comment.parent_comment_id);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(commentMap.get(comment.id)!);
          }
        } else {
          rootComments.push(commentMap.get(comment.id)!);
        }
      });

      setComments(rootComments);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await createComment(postId, newComment, replyingTo || undefined);
      setNewComment('');
      setReplyingTo(null);
      toast({
        title: 'Success',
        description: 'Comment posted',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    await loadComments();
  };

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <div className="flex gap-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
          className="min-h-[60px] resize-none"
        />
        <Button
          onClick={handleSubmit}
          disabled={!newComment.trim() || submitting}
          size="icon"
          className="shrink-0"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {replyingTo && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setReplyingTo(null)}
        >
          Cancel Reply
        </Button>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {initialLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              onReply={setReplyingTo}
              onDelete={handleDelete}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
