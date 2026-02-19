
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { validateAdminCredentials } from '@/utils/auth/adminManager';
import { validateEmail, validatePassword, globalRateLimiter } from '@/utils/security/inputValidation';
import { useTranslations } from '@/hooks/useTranslations';

export const useAdminAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslations();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // Rate limiting check
    const clientId = `admin_login_${email}`;
    if (globalRateLimiter.isRateLimited(clientId)) {
      setErrorMessage(t('admin.too_many_attempts_msg', 'Too many login attempts. Please wait 5 minutes before trying again.'));
      toast({
        title: t('admin.rate_limited', 'Rate Limited'),
        description: t('admin.rate_limited_desc', 'Too many login attempts. Please wait before trying again.'),
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Input validation
    if (!validateEmail(email)) {
      setErrorMessage(t('validation.invalid_email', 'Please enter a valid email address.'));
      setIsLoading(false);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setErrorMessage(passwordValidation.message || t('validation.invalid_password', 'Invalid password format.'));
      setIsLoading(false);
      return;
    }

    try {
      // Attempting admin sign in
      const result = await validateAdminCredentials(email, password);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: t('admin.access_granted', 'Admin Access Granted'),
        description: t('admin.logged_in_admin', "You've been logged in as a super admin."),
      });
      
      navigate('/super-admin');
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let description = error.message || t('admin.auth_generic_error', 'Something went wrong. Please try again.');
      if (error.message.toLowerCase().includes('failed to fetch')) {
        const origin = window.location.origin;
        description = t('admin.cors_error', `Authentication failed due to a CORS error. Please go to your Supabase Dashboard -> API Settings -> CORS Configuration and add this URL to the list: ${origin}`);
      }
      setErrorMessage(description);
      
      toast({
        title: t('admin.auth_failed', 'Authentication failed'),
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errorMessage,
    handleSubmit
  };
};
