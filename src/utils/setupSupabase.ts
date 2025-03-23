
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a super admin user if one doesn't exist
 */
export const setupSupabase = async () => {
  const superAdminEmail = 'lalo.peshawa@gmail.com';
  const superAdminPassword = 'Hanasa2011';
  
  try {
    console.log('Starting super admin setup...');
    
    // Try to sign in with the super admin credentials
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: superAdminEmail,
      password: superAdminPassword
    });
    
    if (signInError) {
      // If we can't sign in, try to sign up
      console.log('Could not sign in as super admin, trying to sign up');
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: superAdminEmail,
        password: superAdminPassword,
        options: {
          data: { 
            name: 'Super Admin',
            isAdmin: true
          }
        }
      });
      
      if (signUpError) {
        console.error('Error creating super admin account:', signUpError);
        return false;
      }
      
      console.log('Super admin account created successfully');
      
      // We need to manually confirm the email for the new user since we're in development
      try {
        const userId = signUpData?.user?.id;
        if (userId) {
          const { error: confirmError } = await supabase.auth.admin.updateUserById(userId, {
            email_confirm: true
          });
          
          if (confirmError) {
            console.log('Could not auto-confirm email (requires service role):', confirmError);
          } else {
            console.log('Email auto-confirmed for super admin');
          }
        }
      } catch (error) {
        console.log('Email confirmation requires service role, skipping.');
      }
    } else {
      console.log('Successfully signed in as super admin');
    }
    
    // After successful sign in or sign up, get the current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) {
      console.error('Could not get current user');
      return false;
    }
    
    // Check if the role exists
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('role', 'super_admin')
      .maybeSingle();
    
    if (roleError) {
      console.error('Error checking super admin role:', roleError);
    }
    
    // If role doesn't exist, create it
    if (!roleData) {
      console.log('Adding super_admin role');
      
      const { error: insertRoleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userData.user.id,
          role: 'super_admin'
        });
      
      if (insertRoleError) {
        console.error('Error adding super_admin role:', insertRoleError);
      } else {
        console.log('Super admin role created successfully');
      }
    } else {
      console.log('User already has super_admin role');
    }
    
    // Sign out after setup so the user can log in properly through the UI
    await supabase.auth.signOut();
    
    return true;
  } catch (error) {
    console.error('Setup error:', error);
    return false;
  }
};
