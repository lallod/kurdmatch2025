
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export const assignAdminRole = async (userId: string) => {
  try {
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'super_admin')
      .maybeSingle();

    if (existingRole) {
      logger.log('User already has super admin role');
      return { success: true, message: 'User already has super admin role' };
    }

    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'super_admin'
      });

    if (error) {
      logger.error('Error assigning admin role:', error.message);
      return { success: false, error: error.message };
    }

    logger.log('Super admin role assigned successfully');
    return { success: true, message: 'Super admin role assigned successfully' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Unexpected error:', message);
    return { success: false, error: message };
  }
};
