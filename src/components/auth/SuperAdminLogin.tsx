
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SuperAdminLogin = () => {
  const [email, setEmail] = useState('lalo.peshawa@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn } = useSupabaseAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log(`Attempting to sign in admin with: ${email}`);
      const { error } = await signIn(email, password);

      if (error) throw error;

      // Check if user has super_admin role
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        throw new Error('Authentication failed');
      }
      
      // Query the user_roles table to check for super_admin role
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
        console.log('No super admin role found, creating one');
        // No super admin role found, create it
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userData.user.id,
            role: 'super_admin'
          });
        
        if (insertError) {
          console.error('Error creating super admin role:', insertError);
          if (insertError.code === '42501') {
            // RLS error - user doesn't have permission to insert
            throw new Error('You do not have permission to become a super admin');
          }
          throw new Error('Could not create super admin role');
        }
      }

      toast({
        title: "Admin Access Granted",
        description: "You've been logged in as a super admin.",
      });
      
      navigate('/super-admin');
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      setErrorMessage(error.message || "Something went wrong. Please try again.");
      
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
              disabled={isLoading}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-purple-800 hover:bg-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying Credentials...
              </>
            ) : (
              "Access Dashboard"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
