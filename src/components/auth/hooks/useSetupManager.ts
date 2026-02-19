
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { setupSuperAdmin } from '@/utils/auth/adminManager';
import { useTranslations } from '@/hooks/useTranslations';

export const useSetupManager = () => {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupMessage, setSetupMessage] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const { toast } = useToast();
  const { t } = useTranslations();

  // Countdown timer for retry
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);

  // Run setup on component mount
  useEffect(() => {
    const runSetup = async () => {
      setIsSettingUp(true);
      setSetupMessage(null);
      
      try {
        const result = await setupSuperAdmin();
        
        setIsSettingUp(false);
        setSetupComplete(result.success);
        
        if (result.success) {
          toast({
            title: t('admin.account_ready', 'Admin Account Ready'),
            description: t('admin.account_verified', 'Super admin account has been verified successfully.'),
          });
        } else {
          const description = result.message || t('admin.setup_problem', 'There was a problem setting up the admin account.');
          setSetupMessage(description);
          
          if (result.shouldRetry && result.retryAfter) {
            setRetryAfter(result.retryAfter);
            setCountdown(Math.ceil(result.retryAfter / 1000));
          }
          
          toast({
            title: result.shouldRetry ? t('admin.setup_delayed', 'Setup Delayed') : t('admin.setup_issue', 'Setup Issue'),
            description: description,
            variant: result.shouldRetry ? "default" : "destructive",
          });
        }
      } catch (error: any) {
        console.error('Setup manager error:', error);
        setIsSettingUp(false);
        setSetupComplete(false);
        setSetupMessage(`${t('common.unexpected_error', 'Unexpected error')}: ${error.message}`);
        
        toast({
          title: t('admin.setup_error', 'Setup Error'),
          description: `${t('common.unexpected_error', 'An unexpected error occurred')}: ${error.message}`,
          variant: "destructive",
        });
      }
    };
    
    runSetup();
  }, [toast]);

  const handleRetrySetup = async () => {
    if (countdown > 0) return;
    
    setIsSettingUp(true);
    setSetupMessage(null);
    setRetryAfter(null);
    setCountdown(0);
    
    try {
      const result = await setupSuperAdmin();
      
      setIsSettingUp(false);
      setSetupComplete(result.success);
      
      if (result.success) {
        toast({
          title: t('admin.account_ready', 'Admin Account Ready'),
          description: t('admin.account_verified', 'Super admin account has been verified successfully.'),
        });
      } else {
        const description = result.message || t('admin.setup_problem', 'There was a problem setting up the admin account.');
        setSetupMessage(description);
        
        if (result.shouldRetry && result.retryAfter) {
          setRetryAfter(result.retryAfter);
          setCountdown(Math.ceil(result.retryAfter / 1000));
        }
        
        toast({
          title: result.shouldRetry ? t('admin.setup_delayed', 'Setup Delayed') : t('admin.setup_issue', 'Setup Issue'),
          description: description,
          variant: result.shouldRetry ? "default" : "destructive",
        });
      }
    } catch (error: any) {
      console.error('Retry setup error:', error);
      setIsSettingUp(false);
      setSetupComplete(false);
      setSetupMessage(`${t('admin.retry_failed', 'Retry failed')}: ${error.message}`);
      
      toast({
        title: t('admin.retry_failed', 'Retry Failed'),
        description: `${t('admin.retry_failed', 'Retry failed')}: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleForceClearCache = () => {
    setSetupComplete(false);
    setSetupMessage(null);
    setRetryAfter(null);
    setCountdown(0);
    
    toast({
      title: t('admin.cache_cleared', 'Cache Cleared'),
      description: t('admin.cache_cleared_desc', 'Setup cache has been cleared. You can now retry the setup.'),
    });
  };

  return {
    isSettingUp,
    setupComplete,
    setupMessage,
    retryAfter,
    countdown,
    handleRetrySetup,
    handleForceClearCache
  };
};
