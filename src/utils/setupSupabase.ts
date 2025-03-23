
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a super admin user if one doesn't exist and removes all other users
 */
export const setupSupabase = async () => {
  const superAdminEmail = 'lalo.peshawa@gmail.com';
  const superAdminPassword = 'Hanasa2011';
  
  try {
    console.log('Starting super admin setup...');
    
    // First, check if we have access to the admin API
    try {
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        // If we get an error here, it's likely because we don't have admin privileges
        console.error('Error listing users - may not have admin access:', listError);
        
        // Instead of failing, let's try to sign in with the super admin credentials
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: superAdminEmail,
          password: superAdminPassword
        });
        
        if (signInError) {
          // If we can't sign in, let's try to sign up
          console.log('Could not sign in as super admin, trying to sign up');
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: superAdminEmail,
            password: superAdminPassword,
            options: {
              data: { name: 'Super Admin' }
            }
          });
          
          if (signUpError) {
            console.error('Error creating super admin account:', signUpError);
            return false;
          }
          
          console.log('Super admin account created, checking or assigning role');
          
          // Check if the user has super_admin role
          const userId = signUpData?.user?.id;
          if (!userId) {
            console.error('No user ID received after signup');
            return false;
          }
          
          // Add super_admin role
          const { error: roleError } = await supabase
            .from('user_roles')
            .upsert({
              user_id: userId,
              role: 'super_admin'
            });
          
          if (roleError) {
            console.error('Error assigning super_admin role:', roleError);
            return false;
          }
          
          return true;
        }
        
        // Successfully signed in as super admin
        console.log('Signed in as super admin');
        
        // Check if user has the super_admin role
        const userId = signInData?.user?.id;
        if (!userId) {
          console.error('No user ID after sign in');
          return false;
        }
        
        // Check for super_admin role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .eq('role', 'super_admin');
        
        if (roleError) {
          console.error('Error checking super admin role:', roleError);
          return false;
        }
        
        // Add the role if it doesn't exist
        if (!roleData || roleData.length === 0) {
          console.log('Adding super_admin role');
          
          const { error: insertRoleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role: 'super_admin'
            });
          
          if (insertRoleError) {
            console.error('Error adding super_admin role:', insertRoleError);
            return false;
          }
        }
        
        return true;
      }
      
      // If we reach here, we have admin privileges
      // Continue with normal setup processing
      
      // Find if super admin exists
      const existingUser = usersData?.users?.find(user => {
        if (user && typeof user === 'object' && 'email' in user) {
          const userObj = user as any;
          return userObj.email && typeof userObj.email === 'string' && 
                 userObj.email.toLowerCase() === superAdminEmail.toLowerCase();
        }
        return false;
      });
      
      let userId: string | undefined;
      
      // Create the user if they don't exist
      if (!existingUser) {
        console.log('Super admin does not exist, creating...');
        
        const { data: newUser, error: signUpError } = await supabase.auth.signUp({
          email: superAdminEmail,
          password: superAdminPassword,
          options: {
            data: { name: 'Super Admin' }
          }
        });
        
        if (signUpError) {
          console.error('Error creating super admin:', signUpError);
          throw signUpError;
        }
        
        userId = newUser?.user?.id;
        
        if (!userId) {
          throw new Error('Failed to get user ID after signup');
        }
        
        // Auto-confirm the email for the super admin
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
      } else {
        userId = existingUser.id;
        console.log('Super admin exists with ID:', userId);
      }
      
      // Check and add the super_admin role if needed
      if (userId) {
        const { data: existingRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'super_admin');
        
        if (!existingRole || existingRole.length === 0) {
          console.log('Adding super_admin role to user');
          
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role: 'super_admin'
            });
          
          if (roleError) {
            console.error('Error assigning super_admin role:', roleError);
          }
        } else {
          console.log('User already has super_admin role');
        }
        
        // Sign in as the super admin
        await supabase.auth.signOut();
      }
      
      // Don't delete other users in this function - it's a sensitive operation
      // that should be done separately if needed
      
      return true;
    } catch (adminError) {
      console.error('Admin API access error:', adminError);
      
      // Try regular sign-in if admin operations fail
      try {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: superAdminEmail,
          password: superAdminPassword
        });
        
        if (signInError) {
          // If we can't sign in, let's try to sign up
          console.log('Could not sign in as super admin, trying to sign up');
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: superAdminEmail,
            password: superAdminPassword,
            options: {
              data: { name: 'Super Admin' }
            }
          });
          
          if (signUpError) {
            console.error('Error creating super admin account:', signUpError);
            return false;
          }
          
          // Sign out to avoid being logged in as super admin
          await supabase.auth.signOut();
          
          return true;
        }
        
        // Successfully signed in as super admin
        console.log('Signed in as super admin using regular auth');
        
        // Sign out to avoid being logged in
        await supabase.auth.signOut();
        
        return true;
      } catch (error) {
        console.error('Regular authentication failed:', error);
        return false;
      }
    }
  } catch (error) {
    console.error('Setup error:', error);
    return false;
  }
};
