import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Post content cannot be empty',
        variant: 'destructive'
      });
      return;
    }

    if (content.length > 5000) {
      toast({
        title: 'Error',
        description: 'Post is too long (max 5000 characters)',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Import dynamically to avoid circular dependencies
      const { updatePost } = await import('@/api/posts');
      await updatePost(postId, content);
      
      toast({
        title: 'Success',
        description: 'Post updated successfully'
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to update post',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Post</DialogTitle>
          <DialogDescription className="text-white/70">
            Make changes to your post content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="min-h-[150px] bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
            maxLength={5000}
          />
          
          <div className="flex items-center justify-between text-sm text-white/60">
            <span>{content.length}/5000 characters</span>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
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
