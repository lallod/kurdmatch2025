
import React, { useState, useEffect } from 'react';
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

  // Check if super admin exists on component mount
  useEffect(() => {
    const ensureSuperAdmin = async () => {
      try {
        // Create super admin if it doesn't exist
        const superAdminEmail = 'lalo.peshawa@gmail.com';
        const superAdminPassword = 'Hanasa2011';
        
        const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
        
        if (listError) {
          console.error('Error listing users:', listError);
          return;
        }
        
        // Check if super admin exists
        const existingSuperAdmin = usersData?.users?.find(user => {
          if (user && typeof user === 'object' && 'email' in user) {
            const userObj = user as any;
            return userObj.email && typeof userObj.email === 'string' && 
                  userObj.email.toLowerCase() === superAdminEmail.toLowerCase();
          }
          return false;
        });
        
        if (!existingSuperAdmin) {
          console.log('Creating super admin account automatically...');
          try {
            // Create the super admin user
            const { data: newUser, error: signUpError } = await supabase.auth.signUp({
              email: superAdminEmail,
              password: superAdminPassword,
              options: {
                data: { name: 'Super Admin' }
              }
            });
            
            if (signUpError) {
              console.error('Error creating super admin:', signUpError);
              return;
            }
            
            const userId = newUser?.user?.id;
            
            if (!userId) {
              console.error('Failed to get user ID after signup');
              return;
            }
            
            // Auto-confirm the email
            try {
              const { error: confirmError } = await supabase.auth.admin.updateUserById(userId, {
                email_confirm: true
              });
              
              if (confirmError) {
                console.error('Error confirming email:', confirmError);
              }
            } catch (err) {
              console.error('Could not confirm email:', err);
            }
            
            // Add super_admin role
            const { error: roleError } = await supabase
              .from('user_roles')
              .insert({
                user_id: userId,
                role: 'super_admin'
              });
            
            if (roleError) {
              console.error('Error assigning super_admin role:', roleError);
            }
            
            toast({
              title: "Super Admin Created",
              description: "The Super Admin account has been created successfully.",
            });
          } catch (err) {
            console.error('Error creating super admin:', err);
          }
        } else {
          console.log('Super admin account exists');
          
          // Ensure super admin role exists
          const userId = existingSuperAdmin.id;
          
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .eq('role', 'super_admin');
          
          if (!roleData || roleData.length === 0) {
            // Add super_admin role if missing
            const { error: roleError } = await supabase
              .from('user_roles')
              .insert({
                user_id: userId,
                role: 'super_admin'
              });
            
            if (roleError) {
              console.error('Error assigning super_admin role:', roleError);
            } else {
              console.log('Super admin role assigned');
            }
          }
        }
        
        // Delete all other users except the super admin
        if (usersData?.users) {
          for (const user of usersData.users) {
            if (user && typeof user === 'object' && 'email' in user && 'id' in user) {
              const userObj = user as any;
              if (userObj.email && typeof userObj.email === 'string' && 
                  userObj.email.toLowerCase() !== superAdminEmail.toLowerCase()) {
                console.log('Deleting user:', userObj.email);
                
                const { error: deleteError } = await supabase.auth.admin.deleteUser(userObj.id);
                
                if (deleteError) {
                  console.error(`Error deleting user ${userObj.email}:`, deleteError);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error during super admin setup:', error);
      }
    };
    
    ensureSuperAdmin();
  }, [toast]);

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
      
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userData.user.id)
        .eq('role', 'super_admin')
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        throw roleError;
      }

      if (!roleData) {
        // No super admin role found for this user
        await supabase.auth.signOut();
        throw new Error('Access denied: Super admin privileges required');
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
