import React, { useEffect, useState } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Shield, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EmailVerificationGuardProps {
  children: React.ReactNode;
}

const EmailVerificationGuard: React.FC<EmailVerificationGuardProps> = ({ children }) => {
  const { user } = useSupabaseAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    if (!user?.email || isResending || resendCooldown > 0) return;
    
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });

      if (error) throw error;

      toast.success('Verification email sent! Please check your inbox.');
      setResendCooldown(60); // 60 second cooldown
    } catch (error) {
      toast.error('Failed to send verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  // Allow access if user is verified or if no user (will be handled by auth)
  if (!user || user.email_confirmed_at) {
    return <>{children}</>;
  }

  // Show verification required screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20 text-white">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <p className="text-purple-200">
            Please verify your email address to access all features
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="font-medium">Security First</span>
            </div>
            <p className="text-sm text-purple-200">
              Email verification helps keep our community safe and ensures you receive important updates.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-purple-200">
              We sent a verification link to:
            </p>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="font-medium text-white">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleResendVerification}
              disabled={isResending || resendCooldown > 0}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isResending ? (
                'Sending...'
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                'Resend Verification Email'
              )}
            </Button>

            <p className="text-xs text-purple-300 text-center">
              Check your spam folder if you don't see the email
            </p>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-300">Already verified?</span>
            </div>
            <p className="text-xs text-green-200">
              Refresh this page after clicking the verification link in your email.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationGuard;