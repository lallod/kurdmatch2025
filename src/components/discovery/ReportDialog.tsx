import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { reportContent, ContentType, ReportReason } from '@/api/moderation';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
  contentType: ContentType;
  reportedUserId?: string;
}

const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onOpenChange,
  contentId,
  contentType,
  reportedUserId,
}) => {
  const { t } = useTranslations();
  const [reason, setReason] = useState<ReportReason>('inappropriate');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reportReasons: { value: ReportReason; label: string }[] = [
    { value: 'inappropriate', label: t('report.inappropriate', 'Inappropriate Content') },
    { value: 'spam', label: t('report.spam', 'Spam or Misleading') },
    { value: 'harassment', label: t('report.harassment', 'Harassment or Bullying') },
    { value: 'fake_profile', label: t('report.fake_profile', 'Fake Profile') },
    { value: 'violence', label: t('report.violence', 'Violence or Threats') },
    { value: 'other', label: t('report.other', 'Other') },
  ];

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await reportContent(contentId, contentType, reason, details, reportedUserId);
      toast({
        title: t('report.submitted', 'Report Submitted'),
        description: t('report.submitted_desc', 'Thank you for helping keep our community safe.'),
      });
      onOpenChange(false);
      setDetails('');
      setReason('inappropriate');
    } catch (error) {
      toast({
        title: t('common.error', 'Error'),
        description: t('report.submit_failed', 'Failed to submit report'),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('report.title', 'Report Content')}</DialogTitle>
          <DialogDescription>
            {t('report.description', "Help us understand what's wrong with this content.")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup value={reason} onValueChange={(v) => setReason(v as ReportReason)}>
            {reportReasons.map((r) => (
              <div key={r.value} className="flex items-center space-x-2">
                <RadioGroupItem value={r.value} id={r.value} />
                <Label htmlFor={r.value} className="cursor-pointer">{r.label}</Label>
              </div>
            ))}
          </RadioGroup>

          <Textarea
            placeholder={t('report.details_placeholder', 'Additional details (optional)')}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t('report.submit', 'Submit Report')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
