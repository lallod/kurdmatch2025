import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';

export const usePhoneVerification = () => {
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslations();

  const sendVerificationCode = async (phoneNumber: string) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { throw new Error('Not authenticated'); }

      const { data, error } = await supabase.functions.invoke('send-sms-verification', { body: { phoneNumber } });
      if (error) throw error;

      if (data.success) {
        setCodeSent(true);
        if (data.devCode) { setDevCode(data.devCode); }
        toast({ title: t('phone.code_sent', 'Code Sent'), description: t('phone.code_sent_desc', 'Verification code has been sent to your phone') });
        return true;
      } else {
        throw new Error(data.error || 'Failed to send code');
      }
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      toast({ title: t('common.error', 'Error'), description: error.message || t('phone.send_failed', 'Failed to send verification code'), variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (code: string) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { throw new Error('Not authenticated'); }

      const { data, error } = await supabase.functions.invoke('verify-phone-code', { body: { code } });
      if (error) throw error;

      if (data.success) {
        setVerified(true);
        toast({ title: t('phone.verified', 'Verified!'), description: t('phone.verified_desc', 'Your phone number has been verified successfully') });
        return true;
      } else {
        throw new Error(data.error || 'Failed to verify code');
      }
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast({ title: t('common.error', 'Error'), description: error.message || t('phone.verify_failed', 'Invalid verification code'), variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setCodeSent(false); setVerified(false); setDevCode(null); };

  return { loading, codeSent, verified, devCode, sendVerificationCode, verifyCode, reset };
};
