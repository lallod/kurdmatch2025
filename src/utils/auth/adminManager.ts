
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
    console.log('Starting admin setup process...');
    
    // Call Edge Function to handle admin setup securely
    const { data, error } = await supabase.functions.invoke('setup-admin', {
      body: { action: 'setup' }
    });

    console.log('Edge function response:', { data, error });

    if (error) {
      console.error('Admin setup error:', error);
      
      // Handle CORS-specific errors
      if (error.message?.includes('CORS') || error.message?.includes('Failed to send a request')) {
        const origin = window.location.origin;
        return {
          success: false,
          message: `CORS Error: Your Edge Function is not allowing requests from this domain (${origin}). Please check your Supabase Edge Function deployment and ensure CORS headers are properly configured. You may need to redeploy the function or check the function logs in your Supabase dashboard.`,
          shouldRetry: false
        };
      }
      
      // Handle network connectivity issues
      if (error.message?.includes('Failed to fetch')) {
        return {
          success: false,
          message: 'Network connectivity issue. Please check your internet connection and ensure the Edge Function is properly deployed and accessible.',
          shouldRetry: true,
          retryAfter: 30000
        };
      }
      
      if (error.message?.includes('404')) {
        return {
          success: false,
          message: 'Edge Function not found. Please ensure the "setup-admin" Edge Function is deployed to your Supabase project. Check your Supabase Dashboard → Edge Functions to verify deployment.',
          shouldRetry: false
        };
      }
      
      return {
        success: false,
        message: `Setup failed: ${error.message}. Please check your Supabase Edge Function deployment and configuration.`,
        shouldRetry: true,
        retryAfter: 30000
      };
    }

    if (!data) {
      return {
        success: false,
        message: 'No response from setup function. Please check your Supabase Edge Function deployment and ensure it\'s responding correctly.',
        shouldRetry: true,
        retryAfter: 30000
      };
    }

    if (data.error) {
      console.error('Setup function returned error:', data.error);
      
      if (data.error.includes('Admin credentials not configured')) {
        return {
          success: false,
          message: 'Admin credentials are not configured in Supabase secrets. Please add SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD to your Edge Function secrets in the Supabase Dashboard.',
          shouldRetry: false
        };
      }
      
      return {
        success: false,
        message: `Setup error: ${data.error}`,
        shouldRetry: true,
        retryAfter: 30000
      };
    }

    console.log('Admin setup completed successfully');
    return {
      success: true,
      message: 'Super admin account verified successfully.'
    };
  } catch (error: any) {
    console.error('Unexpected error during admin setup:', error);
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const origin = window.location.origin;
      return {
        success: false,
        message: `Network error: Unable to connect to the Edge Function. This might be a CORS issue. Please ensure your Edge Function allows requests from ${origin} and is properly deployed.`,
        shouldRetry: true,
        retryAfter: 30000
      };
    }
    
    return {
      success: false,
      message: `An unexpected error occurred: ${error.message}. Please check your Supabase Edge Function deployment and configuration.`,
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
