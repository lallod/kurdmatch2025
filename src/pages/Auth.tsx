
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import SocialLogin from '@/components/auth/components/SocialLogin';
import { isUserSuperAdmin } from '@/utils/auth/roleUtils';
import { useTranslations } from '@/hooks/useTranslations';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, user } = useSupabaseAuth();
  const navigate = useNavigate();
  const { t } = useTranslations();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const isOAuthCallback = urlParams.has('code') || urlParams.has('error') || hashParams.has('access_token');
    
    if (isOAuthCallback) {
      navigate('/auth/callback', { replace: true });
      return;
    }

    if (!user || !user.id) return;
    
    const checkUserRole = async () => {
      try {
        const isSuperAdmin = await isUserSuperAdmin(user.id);
        if (isSuperAdmin) { navigate('/super-admin', { replace: true }); return; }
        navigate('/discovery', { replace: true });
      } catch (error) {
        console.error('Error checking user role:', error);
        navigate('/discovery', { replace: true });
      }
    };

    checkUserRole();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      toast.success(t('auth.welcome_success', 'Welcome back!'), { description: t('auth.login_success', "You've successfully logged in.") });
    } catch (error: any) {
      if (error.message === 'Email not confirmed') {
        setErrorMessage(t('auth.confirm_email', 'Please check your email to confirm your account before logging in.'));
      } else {
        setErrorMessage(error.message || t('misc.error', 'Something went wrong. Please try again.'));
      }
      toast.error(t('auth.auth_failed', 'Authentication failed'), {
        description: error.message || t('misc.error', 'Something went wrong. Please try again.'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-3 sm:p-4 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-5 sm:space-y-6 bg-card/80 backdrop-blur-lg border border-border/20 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl">
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            {t('auth.welcome_back', 'Welcome Back')}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('auth.login_subtitle', 'Log in to continue your journey')}
          </p>
        </div>
        
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-muted-foreground hover:text-foreground -ml-2 sm:-ml-3 text-xs sm:text-sm h-8 sm:h-9"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {t('auth.back_to_landing', 'Back to Landing Page')}
          </Button>
        </div>
        
        {errorMessage && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded relative flex items-start" role="alert">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span className="block">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium text-sm">{t('auth.email', 'Email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              disabled={isLoading}
              className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground h-11 sm:h-12 text-sm sm:text-base"
            />
          </div>
          
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium text-sm">{t('auth.password', 'Password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground h-11 sm:h-12 text-sm sm:text-base"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-600 text-primary-foreground h-11 sm:h-12 text-sm sm:text-base font-medium rounded-full shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                {t('auth.logging_in', 'Logging In...')}
              </>
            ) : (
              t('auth.log_in', 'Log In')
            )}
          </Button>
        </form>
        
        <div className="text-center">
          <Link
            to="/register"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t('auth.no_account', "Don't have an account?")} <span className="text-primary font-medium">{t('auth.sign_up', 'Sign up')}</span>
          </Link>
        </div>

        <div className="pt-4">
          <SocialLogin isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
