
import { supabase } from '@/integrations/supabase/client';

interface AdminSetupResult {
  success: boolean;
  message?: string;
  shouldRetry?: boolean;
  retryAfter?: number;
}

/**
 * Securely checks if super admin exists and sets up if needed
 * Uses Supabase Edge Function to handle credentials securely
 */
export const setupSuperAdmin = async (): Promise<AdminSetupResult> => {
  try {
    // Call Edge Function to handle admin setup securely
    const { data, error } = await supabase.functions.invoke('setup-admin', {
      body: { action: 'setup' }
    });

    if (error) {
      console.error('Admin setup error:', error);
      return {
        success: false,
        message: 'Failed to setup admin account. Please check your Supabase configuration.',
        shouldRetry: true,
        retryAfter: 30000
      };
    }

    return {
      success: true,
      message: 'Super admin account verified successfully.'
    };
  } catch (error: any) {
    console.error('Unexpected error during admin setup:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during admin setup.',
      shouldRetry: true,
      retryAfter: 30000
    };
  }
};

/**
 * Validates admin credentials securely
 */
export const validateAdminCredentials = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Authentication failed');
    }

    // Check admin role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .eq('role', 'super_admin')
      .maybeSingle();

    if (roleError) {
      console.error('Error checking admin role:', roleError);
      await supabase.auth.signOut();
      throw new Error('Error verifying admin privileges');
    }

    if (!roleData) {
      await supabase.auth.signOut();
      throw new Error('You do not have permission to access the admin dashboard.');
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
