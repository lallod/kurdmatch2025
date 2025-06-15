import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SocialLogin from '@/components/auth/components/SocialLogin';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, user } = useSupabaseAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.id) return;
    
    const checkUserRole = async () => {
      try {
        console.log("Checking role for user ID:", user.id);
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'super_admin')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking user role:', error);
          throw error;
        }

        if (data) {
          console.log("User has super_admin role, redirecting to super-admin");
          navigate('/super-admin');
          return;
        }

        console.log("Regular user, redirecting to app");
        navigate('/app');
      } catch (error) {
        console.error('Error checking user role:', error);
        navigate('/app');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tinder-rose/10 to-tinder-orange/10 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-tinder-rose to-tinder-orange bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Log in to continue your journey
          </p>
        </div>
        
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-600 hover:text-gray-900"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Landing Page
          </Button>
        </div>
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-start" role="alert">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span className="block">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-tinder-rose to-tinder-orange hover:from-tinder-rose/90 hover:to-tinder-orange/90 text-white"
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
        
        <div className="text-center mt-4">
          <Link
            to="/register"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Don't have an account? Sign up
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
