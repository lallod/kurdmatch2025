import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

interface DeletePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  onSuccess: () => void;
}

const DeletePostDialog: React.FC<DeletePostDialogProps> = ({
  open,
  onOpenChange,
  postId,
  onSuccess
}) => {
  
  const { t } = useTranslations();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Import dynamically to avoid circular dependencies
      const { deletePost } = await import('@/api/posts');
      await deletePost(postId);
      
      toast.success(t('toast.post.deleted', 'Post deleted successfully'));
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(t('toast.post.delete_failed', 'Failed to delete post'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">Delete Post</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Are you sure you want to delete this post? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isDeleting}
            className="bg-accent/10 border-border text-foreground hover:bg-accent/20"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePostDialog;
