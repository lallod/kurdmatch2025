
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { sleep } from './rateLimitManager';

interface SetupResult {
  success: boolean;
  message?: string;
  shouldRetry?: boolean;
  retryAfter?: number;
}

const MAX_RETRIES = 3;

/**
 * Attempts to sign in the super admin user
 */
export const signInSuperAdmin = async (email: string, password: string, retryCount: number): Promise<{ user: User | null, error: any }> => {
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError) {
    if (signInError.code === 'over_request_rate_limit') {
      console.log('Rate limit hit during sign in, implementing backoff...');
      const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff, max 30s
      
      if (retryCount < MAX_RETRIES - 1) {
        console.log(`Waiting ${backoffTime}ms before retry...`);
        await sleep(backoffTime);
        throw new Error('RETRY_NEEDED');
      }
    }
    return { user: null, error: signInError };
  }

  return { user: signInData.user, error: null };
};

/**
 * Attempts to sign up the super admin user
 */
export const signUpSuperAdmin = async (email: string, password: string): Promise<{ user: User | null, error: any }> => {
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { 
        name: 'Super Admin',
        isAdmin: true
      }
    }
  });

  if (signUpError) {
    return { user: null, error: signUpError };
  }

  return { user: signUpData.user, error: null };
};

/**
 * Checks and creates super admin role if needed
 */
export const ensureSuperAdminRole = async (userId: string): Promise<SetupResult> => {
  try {
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'super_admin')
      .maybeSingle();
    
    if (roleError) {
      console.error('Error checking for super admin role:', roleError);
      return {
        success: false,
        message: `Error checking admin role: ${roleError.message}. Make sure the 'user_roles' table exists and RLS is configured to allow access.`
      };
    }
    
    if (!roleData) {
      console.log(`User does not have super_admin role, adding it.`);
      
      const { error: insertRoleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'super_admin'
        });
      
      if (insertRoleError) {
        console.error('Error adding super_admin role:', insertRoleError);
        return {
          success: false,
          message: `Error adding admin role: ${insertRoleError.message}. Make sure the 'user_roles' table exists and has the correct columns (user_id, role).`
        };
      }
      
      console.log('Super admin role created successfully.');
    } else {
      console.log('User already has super_admin role.');
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: `Error managing super admin role: ${error.message}`
    };
  }
};
