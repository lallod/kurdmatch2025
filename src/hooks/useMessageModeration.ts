import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';

interface ModerationResult {
  safe: boolean;
  reason?: string;
  severity?: 'low' | 'medium' | 'high';
  suggestedAction?: 'warn' | 'block' | 'review';
}

export const useMessageModeration = () => {
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();

  const moderateMessage = async (
    messageText: string,
    conversationContext?: string
  ): Promise<ModerationResult> => {
    setIsChecking(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('moderate-message', {
        body: { messageText, conversationContext }
      });

      if (error) throw error;

      if (!data.safe) {
        toast({
          title: t('toast.moderation.flagged', 'Message flagged'),
          description: data.reason || t('toast.moderation.flagged_desc', 'This message may violate community guidelines'),
          variant: "destructive",
        });
      }

      return data as ModerationResult;
    } catch (error) {
      console.error('Moderation error:', error);
      toast({
        title: t('toast.moderation.failed', 'Moderation check failed'),
        description: t('toast.moderation.failed_desc', 'Unable to verify message safety. Proceeding with caution.'),
        variant: "destructive",
      });
      
      // Return safe by default if moderation fails to not block legitimate messages
      return { safe: true };
    } finally {
      setIsChecking(false);
    }
  };

  return { moderateMessage, isChecking };
};
