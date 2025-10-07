
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-4 sm:p-6 lg:p-8">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
      
      <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-6 sm:space-y-8">
        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-white/80 hover:text-white hover:bg-white/10 backdrop-blur border border-white/20"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Landing Page
          </Button>
        </div>

        <div className="backdrop-blur-md bg-white/10 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm sm:text-base text-purple-200">
              Log in to continue connecting with Kurds worldwide
            </p>
          </div>
          
          {errorMessage && (
            <div className="bg-red-900/30 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-start backdrop-blur-sm" role="alert">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span className="block text-sm">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-200">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                disabled={isLoading}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-200">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transform-gpu transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging In...
                </>
              ) : (
                'Log In'
              )}
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <Link
              to="/register"
              className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
            >
              Don't have an account? <span className="font-semibold">Sign up</span>
            </Link>
          </div>

          <div className="pt-6">
            <SocialLogin isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
