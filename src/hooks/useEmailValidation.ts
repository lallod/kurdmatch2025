import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseEmailValidationReturn {
  isChecking: boolean;
  isEmailTaken: boolean;
  validationMessage: string | null;
  checkEmail: (email: string) => void;
  clearValidation: () => void;
}

export const useEmailValidation = (): UseEmailValidationReturn => {
  const [isChecking, setIsChecking] = useState(false);
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cacheRef = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const checkEmail = useCallback((email: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setValidationMessage(null);
    setIsEmailTaken(false);

    if (!email || !email.includes('@')) {
      setIsChecking(false);
      return;
    }

    setValidationMessage('Type complete email to check availability...');

    if (cacheRef.current.has(email)) {
      const isTaken = cacheRef.current.get(email)!;
      setIsEmailTaken(isTaken);
      setValidationMessage(isTaken ? 'This email is already registered' : 'Email is available');
      return;
    }

    setIsChecking(true);
    
    timeoutRef.current = setTimeout(async () => {
      setValidationMessage('Checking availability...');
      
      try {
        const { data, error } = await supabase.rpc('check_email_exists', {
          email_to_check: email.toLowerCase().trim()
        });

        if (error) {
          console.error('Error checking email:', error);
          setValidationMessage('Unable to verify email. Please try again.');
          setIsChecking(false);
          return;
        }

        cacheRef.current.set(email, data);
        setIsEmailTaken(data);
        setValidationMessage(
          data ? 'This email is already registered' : 'Email is available'
        );
      } catch (err) {
        console.error('Error checking email:', err);
        setValidationMessage('Unable to verify email. Please try again.');
      } finally {
        setIsChecking(false);
      }
    }, 300);
  }, []);

  const clearValidation = useCallback(() => {
    setIsChecking(false);
    setIsEmailTaken(false);
    setValidationMessage(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    isChecking,
    isEmailTaken,
    validationMessage,
    checkEmail,
    clearValidation
  };
};
