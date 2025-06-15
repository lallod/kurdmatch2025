import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

/**
 * Checks and sets up the super admin user and role.
 * This function should be idempotent.
 * @returns An object with success status and an optional message.
 */
export const setupSupabase = async (): Promise<{ success: boolean; message?: string }> => {
  const superAdminEmail = 'lalo.peshawa@gmail.com';
  const superAdminPassword = 'Hanasa2011';

  try {
    console.log('Starting super admin setup verification...');
    
    let user: User | null = null;

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: superAdminEmail,
      password: superAdminPassword
    });

    if (signInError) {
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
          console.error('Error creating super admin account during setup:', signUpError);
          let message = `Error creating super admin: ${signUpError.message}.`;
          if (signUpError.message.includes('rate limit')) {
            message += ' Please wait a moment before trying again.';
          } else {
             message += ' This might be due to email confirmation being enabled in your Supabase project. Please disable it for the setup to complete automatically.';
          }
          return { success: false, message };
        }

        if (!signUpData.user) {
          const message = 'Signup successful but no user object returned. This may be because email confirmation is required in your Supabase project. Please disable it to proceed.';
          console.error(message);
          return { success: false, message };
        }
        
        console.log('Super admin account created successfully.');
        user = signUpData.user;

      } else {
        console.error('An unexpected error occurred during super admin sign-in:', signInError);
        let message = `Super admin sign-in failed: ${signInError.message}`;
        if (signInError.message.toLowerCase().includes('failed to fetch')) {
            const origin = window.location.origin;
            message = `CORS Error: Your Supabase project is not configured to accept requests from this domain. Please add the following URL to your Supabase project's "CORS origins" list in the API settings: ${origin}`;
        }
        return { success: false, message: message };
      }
    } else {
      console.log('Successfully signed in as super admin.');
      user = signInData.user;
    }
    
    if (!user || !user.id) {
      const message = 'Could not get super admin user details after sign in/up.';
      console.error(message);
      await supabase.auth.signOut().catch(() => {});
      return { success: false, message };
    }
    
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'super_admin')
      .maybeSingle();
    
    if (roleError) {
      console.error('Error checking for super admin role:', roleError);
      const message = `Error checking admin role: ${roleError.message}. Make sure the 'user_roles' table exists and RLS is configured to allow access.`;
      await supabase.auth.signOut().catch(() => {});
      return { success: false, message };
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
        const message = `Error adding admin role: ${insertRoleError.message}. Make sure the 'user_roles' table exists and has the correct columns (user_id, role).`;
        await supabase.auth.signOut().catch(() => {});
        return { success: false, message };
      }
      
      console.log('Super admin role created successfully.');
    } else {
      console.log('User already has super_admin role.');
    }
    
    await supabase.auth.signOut();
    console.log('Super admin setup check complete. Signed out.');
    
    return { success: true, message: 'Super admin account is ready.' };
  } catch (error: any) {
    console.error('A critical error occurred during Supabase setup:', error);
    let message = `A critical error occurred: ${error.message}.`;
    if (error.message.toLowerCase().includes('failed to fetch')) {
        const origin = window.location.origin;
        message = `Critical CORS Error: Supabase setup failed. Please go to your Supabase Dashboard -> API Settings -> CORS Configuration and add this URL to the list: ${origin}`
    }
    await supabase.auth.signOut().catch(e => console.error("Error signing out in catch block:", e));
    return { success: false, message };
  }
};
