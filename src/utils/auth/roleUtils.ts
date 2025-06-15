
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if the current user has super-admin role
 */
export const isUserSuperAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data: roleData, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'super_admin')
      .maybeSingle();

    if (error) {
      console.error('Error checking super admin role:', error);
      return false;
    }

    return !!roleData;
  } catch (error) {
    console.error('Error in isUserSuperAdmin:', error);
    return false;
  }
};
