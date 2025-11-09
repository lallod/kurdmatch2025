
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import SocialLogin from '@/components/auth/components/SocialLogin';
import { isUserSuperAdmin } from '@/utils/auth/roleUtils';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, user } = useSupabaseAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is an OAuth callback - if so, redirect to callback handler immediately
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const isOAuthCallback = urlParams.has('code') || urlParams.has('error') || hashParams.has('access_token');
    
    if (isOAuthCallback) {
      console.log('OAuth callback detected, redirecting to callback handler');
      navigate('/auth/callback', { replace: true });
      return;
    }

    // Only redirect authenticated users if this is NOT an OAuth callback
    if (!user || !user.id) return;
    
    const checkUserRole = async () => {
      try {
        console.log("Checking role for user ID:", user.id);
        const isSuperAdmin = await isUserSuperAdmin(user.id);

        if (isSuperAdmin) {
          console.log("User has super_admin role, redirecting to super-admin");
          navigate('/super-admin', { replace: true });
          return;
        }

        console.log("Regular user, redirecting to discovery");
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
      console.log(`Attempting to sign in with: ${email}`);
      const { error } = await signIn(email, password);

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      if (error.message === 'Email not confirmed') {
        setErrorMessage("Please check your email to confirm your account before logging in.");
      } else {
        setErrorMessage(error.message || "Something went wrong. Please try again.");
      }
      
      toast({
        title: "Authentication failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-3 sm:p-4 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md space-y-5 sm:space-y-6 bg-white/10 backdrop-blur-lg border border-white/20 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl">
        <div className="text-center space-y-1.5 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-purple-200">
            Log in to continue your journey
          </p>
        </div>
        
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-purple-200 hover:text-white -ml-2 sm:-ml-3 text-xs sm:text-sm h-8 sm:h-9"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Back to Landing Page
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
            <Label htmlFor="email" className="text-white font-medium text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              disabled={isLoading}
              className="bg-white/20 border-white/30 text-white placeholder:text-purple-200 h-11 sm:h-12 text-sm sm:text-base"
            />
          </div>
          
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="password" className="text-white font-medium text-sm">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="bg-white/20 border-white/30 text-white placeholder:text-purple-200 h-11 sm:h-12 text-sm sm:text-base"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white h-11 sm:h-12 text-sm sm:text-base font-medium rounded-full shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                Logging In...
              </>
            ) : (
              'Log In'
            )}
          </Button>
        </form>
        
        <div className="text-center">
          <Link
            to="/register"
            className="text-sm text-purple-200 hover:text-white"
          >
            Don't have an account? <span className="text-pink-400 font-medium">Sign up</span>
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
