import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if this is a valid password reset link
    const accessToken = searchParams.get('access_token');
    const type = searchParams.get('type');
    
    if (!accessToken || type !== 'recovery') {
      setErrorMessage('Invalid or expired password reset link. Please request a new one.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Password reset successful!",
        description: "You can now log in with your new password.",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      setErrorMessage(error.message || "Failed to reset password. Please try again.");
      
      toast({
        title: "Password reset failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
        
        <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <div className="backdrop-blur-md bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h2>
            <p className="text-purple-200 mb-4">Redirecting you to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
      
      <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-6 sm:space-y-8">
        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-white/80 hover:text-white hover:bg-white/10 backdrop-blur border border-white/20"
            onClick={() => navigate('/auth')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </div>

        <div className="backdrop-blur-md bg-white/10 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl border border-white/20 relative overflow-hidden">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Reset Password
            </h1>
            <p className="mt-2 text-sm sm:text-base text-purple-200">
              Enter your new password below
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
              <Label htmlFor="password" className="text-purple-200">New Password</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-purple-200">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
