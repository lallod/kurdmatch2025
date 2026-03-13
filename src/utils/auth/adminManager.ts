
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface AdminSetupResult {
  success: boolean;
  message?: string;
  shouldRetry?: boolean;
  retryAfter?: number;
}

/**
 * Direct admin setup without Edge Function
 */
export const setupSuperAdmin = async (): Promise<AdminSetupResult> => {
  try {
    logger.log('Starting direct admin setup process...');
    
    const { data, error } = await supabase.from('user_roles').select('id').limit(1);
    
    if (error) {
      logger.error('Database connection error:', error);
      return {
        success: false,
        message: `Database connection failed: ${error.message}. Please ensure your Supabase project is properly configured.`,
        shouldRetry: true,
        retryAfter: 30000
      };
    }

    logger.log('Database connection successful');
    return {
      success: true,
      message: 'Admin setup bypassed - database connection verified.'
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Unexpected error during admin setup:', message);
    
    return {
      success: false,
      message: `Setup error: ${message}. Please check your Supabase configuration.`,
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
    logger.log('validateAdminCredentials: Attempting admin login');
    
    // Clear any existing session to prevent conflicts
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      logger.log('validateAdminCredentials: Clearing existing session');
      await supabase.auth.signOut();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      logger.error('validateAdminCredentials: Sign-in error:', error.message);
      throw error;
    }

    if (!data.user) {
      throw new Error('Authentication failed - no user data received');
    }

    logger.log('validateAdminCredentials: User signed in successfully');

    // Wait for session to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify the user is still authenticated (server-side)
    const { data: { user: verifiedUser } } = await supabase.auth.getUser();
    if (!verifiedUser) {
      throw new Error('Session lost after authentication');
    }

    // Check admin role
    logger.log('validateAdminCredentials: Checking admin role');
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .eq('role', 'super_admin')
      .maybeSingle();

    if (roleError) {
      logger.error('validateAdminCredentials: Error checking admin role:', roleError.message);
      await supabase.auth.signOut();
      throw new Error('Error verifying admin privileges');
    }

    if (!roleData) {
      logger.log('validateAdminCredentials: User does not have super_admin role');
      await supabase.auth.signOut();
      throw new Error('You do not have permission to access the admin dashboard.');
    }

    logger.log('validateAdminCredentials: Admin role verified successfully');
    
    return { success: true, user: data.user };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('validateAdminCredentials: Admin validation error:', message);
    return { success: false, error: message };
  }
};
