
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import SocialLogin from '@/components/auth/components/SocialLogin';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Loader2, AlertCircle } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminSetup, setIsAdminSetup] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, signUp, user, ensureAdminExists } = useSupabaseAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/');
    }

    // Check if we're setting up admin account
    const adminSetup = async () => {
      // This is the admin email we want to ensure exists
      const adminEmail = 'lalo.peshawa@gmail.com';
      const adminPassword = 'Hanasa2011';
      
      if (email === adminEmail || !email) {
        setEmail(adminEmail);
        setPassword(adminPassword);
        setIsAdminSetup(true);
      }
    };
    
    adminSetup();
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
        // For admin setup, ensure admin exists first
        if (isAdminSetup) {
          const adminCreated = await ensureAdminExists(email, password);
          console.log('Admin account setup status:', adminCreated);
        }

        // Handle login
        console.log(`Attempting to sign in with: ${email} / ${password.replace(/./g, '*')}`);
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
      setErrorMessage(error.message || "Something went wrong. Please try again.");
      
      // Only show toast for non-credential errors to avoid duplicate messages
      if (error.code !== 'invalid_credentials') {
        toast({
          title: "Authentication failed",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-start" role="alert">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span className="block">{errorMessage}</span>
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
              disabled={isLoading || isAdminSetup}
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
              disabled={isLoading || isAdminSetup}
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
        
        {!isAdminSetup && (
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
        )}

        {isAdminSetup && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Attempting to log in with super admin credentials
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
