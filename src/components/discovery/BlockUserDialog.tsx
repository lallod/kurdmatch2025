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
import { Textarea } from '@/components/ui/textarea';
import { blockUser } from '@/api/moderation';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface BlockUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  onBlocked?: () => void;
}

const BlockUserDialog: React.FC<BlockUserDialogProps> = ({
  open,
  onOpenChange,
  userId,
  userName,
  onBlocked,
}) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleBlock = async () => {
    try {
      setSubmitting(true);
      await blockUser(userId, reason);
      toast({
        title: 'User Blocked',
        description: `You will no longer see content from ${userName}`,
      });
      onOpenChange(false);
      onBlocked?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to block user',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Block {userName}?</AlertDialogTitle>
          <AlertDialogDescription>
            You will no longer see posts, comments, or stories from this user, and they won't be able to contact you.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Textarea
          placeholder="Reason for blocking (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="min-h-[80px]"
        />

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleBlock} disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Block User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlockUserDialog;
