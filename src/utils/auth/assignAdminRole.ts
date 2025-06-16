
import { supabase } from '@/integrations/supabase/client';

export const assignAdminRole = async (userId: string) => {
  try {
    // Check if role already exists
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'super_admin')
      .maybeSingle();

    if (existingRole) {
      console.log('User already has super admin role');
      return { success: true, message: 'User already has super admin role' };
    }

    // Insert the super admin role
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'super_admin'
      });

    if (error) {
      console.error('Error assigning admin role:', error);
      return { success: false, error: error.message };
    }

    console.log('Super admin role assigned successfully');
    return { success: true, message: 'Super admin role assigned successfully' };
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return { success: false, error: error.message };
  }
};

// Auto-assign admin role for the specified user
assignAdminRole('ebd61474-e0a3-44e2-b6b2-76003985ec9d').then(result => {
  console.log('Admin role assignment result:', result);
});
