import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, ArrowLeft, Mail } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Reset email sent!",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      console.error('Password reset request error:', error);
      setErrorMessage(error.message || "Failed to send reset email. Please try again.");
      
      toast({
        title: "Failed to send reset email",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
        
        <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <div className="backdrop-blur-md bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
            <p className="text-purple-200 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-purple-300 mb-6">
              If you don't see the email, check your spam folder.
            </p>
            <Button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Back to Login
            </Button>
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
              Forgot Password?
            </h1>
            <p className="mt-2 text-sm sm:text-base text-purple-200">
              Enter your email and we'll send you a reset link
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
              <Label htmlFor="email" className="text-purple-200">Email Address</Label>
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
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transform-gpu transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
