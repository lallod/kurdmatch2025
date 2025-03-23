
import { supabase } from '@/integrations/supabase/client';

/**
 * Assign a random role to a user
 * @param userId The user ID to assign a role to
 */
export const assignRole = async (userId: string): Promise<void> => {
  try {
    const role = Math.random() > 0.8 ? 'admin' : 
              Math.random() > 0.7 ? 'moderator' : 
              Math.random() > 0.6 ? 'premium' : 'user';
              
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role
      });
    
    if (roleError) {
      console.error('Error creating role for profile:', roleError);
    } else {
      console.log(`Role '${role}' assigned to user ${userId}`);
    }
  } catch (roleErr) {
    console.error('Exception adding role:', roleErr);
  }
};
