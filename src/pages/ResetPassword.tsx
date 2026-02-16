import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslations();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    const accessToken = hashParams.get('access_token');

    if (type === 'recovery' && accessToken) {
      setIsValidToken(true);
    } else {
      // Also check if user has an active session from recovery flow
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setIsValidToken(true);
        }
      });
    }
    setChecking(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error(t('auth.password_min', 'Password must be at least 6 characters'));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t('auth.passwords_mismatch', 'Passwords do not match'));
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setIsSuccess(true);
      toast.success(t('auth.password_updated', 'Password updated successfully!'));

      setTimeout(() => {
        navigate('/auth', { replace: true });
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || t('misc.error', 'Something went wrong'));
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isValidToken && !checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm space-y-6 bg-card/80 backdrop-blur-lg border border-border/20 p-8 rounded-3xl shadow-2xl text-center">
          <KeyRound className="h-12 w-12 text-muted-foreground mx-auto" />
          <h1 className="text-xl font-bold text-foreground">
            {t('auth.invalid_reset_link', 'Invalid or Expired Link')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('auth.reset_link_expired', 'This password reset link is invalid or has expired. Please request a new one.')}
          </p>
          <Button onClick={() => navigate('/auth')} className="w-full rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('auth.back_to_login', 'Back to Login')}
          </Button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm space-y-6 bg-card/80 backdrop-blur-lg border border-border/20 p-8 rounded-3xl shadow-2xl text-center">
          <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
          <h1 className="text-xl font-bold text-foreground">
            {t('auth.password_updated', 'Password Updated!')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('auth.redirecting_login', 'Redirecting you to login...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6 bg-card/80 backdrop-blur-lg border border-border/20 p-8 rounded-3xl shadow-2xl">
        <div className="text-center space-y-2">
          <KeyRound className="h-10 w-10 text-primary mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">
            {t('auth.set_new_password', 'Set New Password')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('auth.enter_new_password', 'Enter your new password below')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground text-sm font-medium">
              {t('auth.new_password', 'New Password')}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isLoading}
              className="bg-muted/50 border-border text-foreground h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground text-sm font-medium">
              {t('auth.confirm_password', 'Confirm Password')}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              disabled={isLoading}
              className="bg-muted/50 border-border text-foreground h-11"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-600 h-11 rounded-full font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('auth.updating', 'Updating...')}
              </>
            ) : (
              t('auth.update_password', 'Update Password')
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
