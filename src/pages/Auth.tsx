
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import SocialLogin from '@/components/auth/components/SocialLogin';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, signUp, user } = useSupabaseAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isSignUp) {
        // Handle sign up
        if (!name.trim()) {
          throw new Error('Name is required');
        }

        const { error } = await signUp(email, password, {
          name,
          email,
        });

        if (error) throw error;

        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account.",
        });
        
        // If using auto-confirm
        setTimeout(() => {
          setIsSignUp(false);
        }, 2000);
      } else {
        // Handle login
        const { error } = await signIn(email, password);

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        
        navigate('/');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Set a user-friendly error message
      if (error.code === 'invalid_credentials') {
        setErrorMessage('Invalid email or password. Please try again.');
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
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp 
              ? 'Sign up to start meeting new people' 
              : 'Log in to continue your journey'}
          </p>
        </div>
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required={isSignUp}
                disabled={isLoading}
              />
            </div>
          )}
          
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
                {isSignUp ? 'Creating Account...' : 'Logging In...'}
              </>
            ) : (
              isSignUp ? 'Create Account' : 'Log In'
            )}
          </Button>
        </form>

        <SocialLogin isLoading={isLoading} />
        
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage(null);
            }}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {isSignUp 
              ? 'Already have an account? Log in' 
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
