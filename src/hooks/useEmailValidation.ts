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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const checkEmail = useCallback((email: string) => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset states
    setValidationMessage(null);
    setIsEmailTaken(false);

    // Don't check if email is empty or invalid format
    if (!email || !email.includes('@')) {
      setIsChecking(false);
      return;
    }

    // Check cache first
    if (cacheRef.current.has(email)) {
      const isTaken = cacheRef.current.get(email)!;
      setIsEmailTaken(isTaken);
      setValidationMessage(isTaken ? 'This email is already registered' : 'Email is available');
      return;
    }

    // Debounce the API call
    setIsChecking(true);
    timeoutRef.current = setTimeout(async () => {
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

        // Cache the result
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
    }, 500); // 500ms debounce
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
