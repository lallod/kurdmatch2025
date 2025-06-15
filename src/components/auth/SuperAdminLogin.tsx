
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Loader2, AlertCircle, ArrowLeft, Shield, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { setupSupabase, clearSetupCache } from '@/utils/setupSupabase';

const SuperAdminLogin = () => {
  const [email, setEmail] = useState('lalo.peshawa@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupMessage, setSetupMessage] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const { signIn } = useSupabaseAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Countdown timer for retry
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);

  // Run setup on component mount
  useEffect(() => {
    const runSetup = async () => {
      setIsSettingUp(true);
      setSetupMessage(null);
      setErrorMessage(null);
      
      const result = await setupSupabase();
      setIsSettingUp(false);
      setSetupComplete(result.success);
      
      if (result.success) {
        toast({
          title: "Admin Account Ready",
          description: "Super admin account has been verified successfully.",
        });
      } else {
        const description = result.message || "There was a problem setting up the admin account.";
        setSetupMessage(description);
        
        if (result.shouldRetry && result.retryAfter) {
          setRetryAfter(result.retryAfter);
          setCountdown(Math.ceil(result.retryAfter / 1000));
        }
        
        toast({
          title: result.shouldRetry ? "Setup Delayed" : "Setup Issue",
          description: description,
          variant: result.shouldRetry ? "default" : "destructive",
        });
      }
    };
    
    runSetup();
  }, [toast]);

  const handleRetrySetup = async () => {
    if (countdown > 0) return;
    
    setIsSettingUp(true);
    setSetupMessage(null);
    setErrorMessage(null);
    setRetryAfter(null);
    setCountdown(0);
    
    const result = await setupSupabase();
    setIsSettingUp(false);
    setSetupComplete(result.success);
    
    if (result.success) {
      toast({
        title: "Admin Account Ready",
        description: "Super admin account has been verified successfully.",
      });
    } else {
      const description = result.message || "There was a problem setting up the admin account.";
      setSetupMessage(description);
      
      if (result.shouldRetry && result.retryAfter) {
        setRetryAfter(result.retryAfter);
        setCountdown(Math.ceil(result.retryAfter / 1000));
      }
      
      toast({
        title: result.shouldRetry ? "Setup Delayed" : "Setup Issue",
        description: description,
        variant: result.shouldRetry ? "default" : "destructive",
      });
    }
  };

  const handleForceClearCache = () => {
    clearSetupCache();
    setSetupComplete(false);
    setSetupMessage(null);
    setErrorMessage(null);
    setRetryAfter(null);
    setCountdown(0);
    
    toast({
      title: "Cache Cleared",
      description: "Setup cache has been cleared. You can now retry the setup.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log(`Attempting to sign in admin with: ${email}`);
      const { error, data } = await signIn(email, password);

      if (error) throw error;

      // Check if user has super_admin role
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user?.id) {
        throw new Error('Authentication failed');
      }
      
      // Query the user_roles table to check for super_admin role
      console.log("Checking role for user ID:", userData.user.id);
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('role', 'super_admin')
        .maybeSingle();

      if (roleError) {
        console.error('Error checking super admin role:', roleError);
        throw new Error('Error verifying admin privileges');
      }

      if (!roleData) {
        // No super admin role found
        await supabase.auth.signOut();
        throw new Error('You do not have permission to access the admin dashboard.');
      }

      toast({
        title: "Admin Access Granted",
        description: "You've been logged in as a super admin.",
      });
      
      navigate('/super-admin');
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      let description = error.message || "Something went wrong. Please try again.";
      if (error.message.toLowerCase().includes('failed to fetch')) {
        const origin = window.location.origin;
        description = `Authentication failed due to a CORS error. Please go to your Supabase Dashboard -> API Settings -> CORS Configuration and add this URL to the list: ${origin}`;
      }
      setErrorMessage(description);
      
      toast({
        title: "Authentication failed",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            Super Admin Access
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Restricted area - Authorized personnel only
          </p>
        </div>
        
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-400 hover:text-white"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Landing Page
          </Button>
        </div>

        {isSettingUp && (
          <div className="bg-blue-900/50 border border-blue-700 text-blue-200 px-4 py-3 rounded relative flex items-center" role="alert">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            <span>Verifying admin account setup...</span>
          </div>
        )}

        {!isSettingUp && setupMessage && !setupComplete && (
          <div className="space-y-3">
            <div className={`border px-4 py-3 rounded relative flex items-start ${
              retryAfter ? 'bg-yellow-900/50 border-yellow-700 text-yellow-200' : 'bg-red-900/50 border-red-700 text-red-200'
            }`} role="alert">
              {retryAfter ? (
                <Clock className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              )}
              <span className="block">{setupMessage}</span>
            </div>
            
            {retryAfter && (
              <div className="flex items-center justify-between bg-gray-700 p-3 rounded">
                <span className="text-gray-300 text-sm">
                  {countdown > 0 ? `Retry available in ${countdown}s` : 'Ready to retry'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetrySetup}
                  disabled={countdown > 0}
                  className="text-gray-300 border-gray-600 hover:bg-gray-600"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Setup
                </Button>
              </div>
            )}
            
            {!retryAfter && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleForceClearCache}
                className="w-full text-gray-300 border-gray-600 hover:bg-gray-600"
              >
                Clear Cache & Retry
              </Button>
            )}
          </div>
        )}
        
        {setupComplete && !isSettingUp && (
          <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded relative flex items-center" role="alert">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Admin account is ready! You can now log in.</span>
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded relative flex items-start" role="alert">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span className="block">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly
              className="bg-gray-700 border-gray-600 text-white opacity-75"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading || isSettingUp || !setupComplete}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-purple-800 hover:bg-purple-700 text-white"
            disabled={isLoading || isSettingUp || !setupComplete}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying Credentials...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Access Dashboard
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
