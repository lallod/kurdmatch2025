
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

/**
 * Creates a super admin user if one doesn't exist.
 * This function should be idempotent.
 */
export const setupSupabase = async () => {
  const superAdminEmail = 'lalo.peshawa@gmail.com';
  const superAdminPassword = 'Hanasa2011';
  
  try {
    console.log('Starting super admin setup...');
    
    let user: User | null = null;

    // Try to sign in with the super admin credentials
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: superAdminEmail,
      password: superAdminPassword
    });

    if (signInError) {
      // If user doesn't exist, sign them up.
      if (signInError.message.includes('Invalid login credentials')) {
        console.log('Super admin does not exist, attempting to sign up.');
        
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
          // This can happen if user exists but is unconfirmed, or other issues.
          console.error('Error creating super admin account during setup:', signUpError);
          return false;
        }

        if (!signUpData.user) {
          console.error('Signup successful but no user object returned.');
          return false;
        }
        
        console.log('Super admin account created successfully.');
        user = signUpData.user;

        // Note: For this to work without email verification, "Confirm email" must be disabled in Supabase Auth settings.
        // We cannot confirm the email from client-side code without a service_role key.
      } else {
        // Any other sign-in error is a problem.
        console.error('An unexpected error occurred during super admin sign-in:', signInError);
        return false;
      }
    } else {
      console.log('Successfully signed in as super admin.');
      user = signInData.user;
    }
    
    if (!user || !user.id) {
      console.error('Could not get super admin user details after sign in/up.');
      await supabase.auth.signOut().catch(() => {});
      return false;
    }
    
    // With a valid user, check if their role is set.
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'super_admin')
      .maybeSingle();
    
    if (roleError) {
      console.error('Error checking for super admin role:', roleError);
      await supabase.auth.signOut().catch(() => {});
      return false;
    }
    
    if (!roleData) {
      console.log(`User ${user.email} does not have super_admin role, adding it.`);
      
      const { error: insertRoleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'super_admin'
        });
      
      if (insertRoleError) {
        console.error('Error adding super_admin role:', insertRoleError);
        await supabase.auth.signOut().catch(() => {});
        return false;
      }
      
      console.log('Super admin role created successfully.');
    } else {
      console.log('User already has super_admin role.');
    }
    
    // Sign out to clean up the session. The user will log in through the form.
    await supabase.auth.signOut();
    console.log('Super admin setup check complete. Signed out.');
    
    return true;
  } catch (error) {
    console.error('A critical error occurred during Supabase setup:', error);
    // Try to sign out to prevent being stuck in a bad state
    await supabase.auth.signOut().catch(e => console.error("Error signing out in catch block:", e));
    return false;
  }
};
