
import { supabase } from '@/integrations/supabase/client';

interface AdminSetupResult {
  success: boolean;
  message?: string;
  shouldRetry?: boolean;
  retryAfter?: number;
}

/**
 * Direct admin setup without Edge Function
 * This is a temporary workaround for CORS issues
 */
export const setupSuperAdmin = async (): Promise<AdminSetupResult> => {
  try {
    console.log('Starting direct admin setup process...');
    
    // For now, let's just check if we can connect to the database
    // and return success to allow login attempt
    const { data, error } = await supabase.from('user_roles').select('id').limit(1);
    
    if (error) {
      console.error('Database connection error:', error);
      return {
        success: false,
        message: `Database connection failed: ${error.message}. Please ensure your Supabase project is properly configured.`,
        shouldRetry: true,
        retryAfter: 30000
      };
    }

    console.log('Database connection successful, admin setup bypassed');
    return {
      success: true,
      message: 'Admin setup bypassed - database connection verified.'
    };
  } catch (error: any) {
    console.error('Unexpected error during admin setup:', error);
    
    return {
      success: false,
      message: `Setup error: ${error.message}. Please check your Supabase configuration.`,
      shouldRetry: true,
      retryAfter: 30000
    };
  }
};

/**
 * Validates admin credentials securely with improved session management
 */
export const validateAdminCredentials = async (email: string, password: string) => {
  try {
    console.log('validateAdminCredentials: Attempting admin login with:', email);
    
    // Clear any existing session to prevent conflicts
    const { data: currentSession } = await supabase.auth.getSession();
    if (currentSession?.session) {
      console.log('validateAdminCredentials: Clearing existing session to prevent conflicts');
      await supabase.auth.signOut();
      // Wait for sign out to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('validateAdminCredentials: Sign-in error:', error);
      throw error;
    }

    if (!data.user) {
      throw new Error('Authentication failed - no user data received');
    }

    console.log('validateAdminCredentials: User signed in successfully:', data.user.id);

    // Wait for session to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify the session is still active
    const { data: sessionCheck } = await supabase.auth.getSession();
    if (!sessionCheck?.session) {
      throw new Error('Session lost after authentication');
    }

    // Check admin role
    console.log('validateAdminCredentials: Checking admin role for user:', data.user.id);
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .eq('role', 'super_admin')
      .maybeSingle();

    if (roleError) {
      console.error('validateAdminCredentials: Error checking admin role:', roleError);
      await supabase.auth.signOut();
      throw new Error('Error verifying admin privileges');
    }

    if (!roleData) {
      console.log('validateAdminCredentials: User does not have super_admin role');
      await supabase.auth.signOut();
      throw new Error('You do not have permission to access the admin dashboard.');
    }

    console.log('validateAdminCredentials: Admin role verified successfully');
    
    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('validateAdminCredentials: Admin validation error:', error);
    return { success: false, error: error.message };
  }
};
