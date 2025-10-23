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
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark/80 to-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20 text-primary-foreground">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-dark to-primary rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <p className="text-primary-foreground/80">
            Please verify your email address to access all features
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="w-5 h-5 text-primary-light" />
              <span className="font-medium">Security First</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Email verification helps keep our community safe and ensures you receive important updates.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-primary-foreground/80">
              We sent a verification link to:
            </p>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="font-medium text-primary-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleResendVerification}
              disabled={isResending || resendCooldown > 0}
              className="w-full bg-gradient-to-r from-primary-dark to-primary hover:from-primary-dark/80 hover:to-primary/80"
            >
              {isResending ? (
                'Sending...'
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                'Resend Verification Email'
              )}
            </Button>

            <p className="text-xs text-primary-foreground/70 text-center">
              Check your spam folder if you don't see the email
            </p>
          </div>

          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success-foreground">Already verified?</span>
            </div>
            <p className="text-xs text-success-foreground/80">
              Refresh this page after clicking the verification link in your email.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationGuard;
