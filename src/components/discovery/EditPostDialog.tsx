import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EditPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  initialContent: string;
  onSuccess: () => void;
}

const EditPostDialog: React.FC<EditPostDialogProps> = ({
  open,
  onOpenChange,
  postId,
  initialContent,
  onSuccess
}) => {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    if (content.length > 5000) {
      toast.error('Post is too long (max 5000 characters)');
      return;
    }

    try {
      setIsSubmitting(true);
      const { updatePost } = await import('@/api/posts');
      await updatePost(postId, content);
      toast.success('Post updated successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Post</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Make changes to your post content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="min-h-[150px] bg-muted/50 border-border text-foreground placeholder:text-muted-foreground resize-none"
            maxLength={5000}
          />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{content.length}/5000 characters</span>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="bg-muted/50 border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
              className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-600 text-primary-foreground"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostDialog;
