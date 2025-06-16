
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { setupSuperAdmin } from '@/utils/auth/adminManager';

export const useSetupManager = () => {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupMessage, setSetupMessage] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const { toast } = useToast();

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
      console.log('Starting admin setup manager...');
      setIsSettingUp(true);
      setSetupMessage(null);
      
      try {
        const result = await setupSuperAdmin();
        console.log('Setup result:', result);
        
        setIsSettingUp(false);
        setSetupComplete(result.success);
        
        if (result.success) {
          console.log('Setup successful');
          toast({
            title: "Admin Account Ready",
            description: "Super admin account has been verified successfully.",
          });
        } else {
          console.log('Setup failed:', result.message);
          const description = result.message || "There was a problem setting up the admin account.";
          setSetupMessage(description);
          
          if (result.shouldRetry && result.retryAfter) {
            setRetryAfter(result.retryAfter);
            setCountdown(Math.ceil(result.retryAfter / 1000));
          }
          
          toast({
            title: result.shouldRetry ? "Setup Delayed" : "Setup Issue",
            description: description,
            variant: result.shouldRetry ? "default" : "destructive",
          });
        }
      } catch (error: any) {
        console.error('Setup manager error:', error);
        setIsSettingUp(false);
        setSetupComplete(false);
        setSetupMessage(`Unexpected error: ${error.message}`);
        
        toast({
          title: "Setup Error",
          description: `An unexpected error occurred: ${error.message}`,
          variant: "destructive",
        });
      }
    };
    
    runSetup();
  }, [toast]);

  const handleRetrySetup = async () => {
    if (countdown > 0) return;
    
    console.log('Retrying admin setup...');
    setIsSettingUp(true);
    setSetupMessage(null);
    setRetryAfter(null);
    setCountdown(0);
    
    try {
      const result = await setupSuperAdmin();
      console.log('Retry setup result:', result);
      
      setIsSettingUp(false);
      setSetupComplete(result.success);
      
      if (result.success) {
        toast({
          title: "Admin Account Ready",
          description: "Super admin account has been verified successfully.",
        });
      } else {
        const description = result.message || "There was a problem setting up the admin account.";
        setSetupMessage(description);
        
        if (result.shouldRetry && result.retryAfter) {
          setRetryAfter(result.retryAfter);
          setCountdown(Math.ceil(result.retryAfter / 1000));
        }
        
        toast({
          title: result.shouldRetry ? "Setup Delayed" : "Setup Issue",
          description: description,
          variant: result.shouldRetry ? "default" : "destructive",
        });
      }
    } catch (error: any) {
      console.error('Retry setup error:', error);
      setIsSettingUp(false);
      setSetupComplete(false);
      setSetupMessage(`Retry failed: ${error.message}`);
      
      toast({
        title: "Retry Failed",
        description: `Retry failed: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleForceClearCache = () => {
    console.log('Clearing setup cache...');
    setSetupComplete(false);
    setSetupMessage(null);
    setRetryAfter(null);
    setCountdown(0);
    
    toast({
      title: "Cache Cleared",
      description: "Setup cache has been cleared. You can now retry the setup.",
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
