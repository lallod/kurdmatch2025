import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';

interface ReportMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageId: string;
  reportedUserId: string;
  conversationId?: string;
}

export const ReportMessageDialog = ({
  open,
  onOpenChange,
  messageId,
  reportedUserId,
  conversationId
}: ReportMessageDialogProps) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();

  const REPORT_REASONS = [
    { value: 'harassment', label: t('report.harassment', 'Harassment or bullying') },
    { value: 'spam', label: t('report.spam', 'Spam or scam') },
    { value: 'inappropriate', label: t('report.inappropriate', 'Inappropriate content') },
    { value: 'safety', label: t('report.safety', 'Safety concern') },
    { value: 'other', label: t('report.other', 'Other') },
  ];

  const handleSubmit = async () => {
    if (!reason) {
      toast({
        title: t('report.select_reason', 'Please select a reason'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('reported_messages')
        .insert({
          reporter_id: user.id,
          reported_user_id: reportedUserId,
          message_id: messageId,
          conversation_id: conversationId,
          reason,
          description: description || null,
        });

      if (error) throw error;

      toast({
        title: t('report.submitted', 'Report submitted'),
        description: t('report.thank_you', 'Thank you for helping keep our community safe'),
      });

      onOpenChange(false);
      setReason('');
      setDescription('');
    } catch (error) {
      console.error('Error reporting message:', error);
      toast({
        title: t('report.failed', 'Failed to submit report'),
        description: t('report.try_again', 'Please try again'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('report.title', 'Report Message')}</DialogTitle>
          <DialogDescription>
            {t('report.description', "Help us understand what's wrong with this message")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup value={reason} onValueChange={setReason}>
            {REPORT_REASONS.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="description">{t('report.additional_details', 'Additional details (optional)')}</Label>
            <Textarea
              id="description"
              placeholder={t('report.provide_context', "Provide more context about why you're reporting this...")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t('report.cancel', 'Cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? t('report.submitting', 'Submitting...') : t('report.submit', 'Submit Report')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};