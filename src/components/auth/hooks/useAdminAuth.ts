
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = () => {
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

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errorMessage,
    handleSubmit
  };
};
