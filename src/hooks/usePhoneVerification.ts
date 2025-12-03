import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePhoneVerification = () => {
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const { toast } = useToast();

  const sendVerificationCode = async (phoneNumber: string) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('send-sms-verification', {
        body: { phoneNumber },
      });

      if (error) throw error;

      if (data.success) {
        setCodeSent(true);
        // Store dev code for testing (only available in dev mode)
        if (data.devCode) {
          setDevCode(data.devCode);
        }
        toast({
          title: "Code Sent",
          description: "Verification code has been sent to your phone",
        });
        return true;
      } else {
        throw new Error(data.error || 'Failed to send code');
      }
    } catch (error: any) {
      console.error('Error sending verification code:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (code: string) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('verify-phone-code', {
        body: { code },
      });

      if (error) throw error;

      if (data.success) {
        setVerified(true);
        toast({
          title: "Verified!",
          description: "Your phone number has been verified successfully",
        });
        return true;
      } else {
        throw new Error(data.error || 'Failed to verify code');
      }
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast({
        title: "Error",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setCodeSent(false);
    setVerified(false);
    setDevCode(null);
  };

  return {
    loading,
    codeSent,
    verified,
    devCode,
    sendVerificationCode,
    verifyCode,
    reset,
  };
};
