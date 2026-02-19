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
import { useTranslations } from '@/hooks/useTranslations';

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
  const { t } = useTranslations();
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleBlock = async () => {
    try {
      setSubmitting(true);
      await blockUser(userId, reason);
      toast({
        title: t('block.user_blocked', 'User Blocked'),
        description: t('block.user_blocked_desc', `You will no longer see content from ${userName}`, { name: userName }),
      });
      onOpenChange(false);
      onBlocked?.();
    } catch (error) {
      toast({
        title: t('common.error', 'Error'),
        description: t('block.block_failed', 'Failed to block user'),
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
          <AlertDialogTitle>{t('block.confirm_title', `Block ${userName}?`, { name: userName })}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('block.confirm_desc', "You will no longer see posts, comments, or stories from this user, and they won't be able to contact you.")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Textarea
          placeholder={t('block.reason_placeholder', 'Reason for blocking (optional)')}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="min-h-[80px]"
        />

        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleBlock} disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t('block.block_user', 'Block User')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlockUserDialog;
