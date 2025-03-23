
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a super admin user if one doesn't exist and removes all other users
 */
export const setupSupabase = async () => {
  const superAdminEmail = 'lalo.peshawa@gmail.com';
  const superAdminPassword = 'Hanasa2011';
  
  try {
    // 1. First check if the user already exists by listing users
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return false;
    }
    
    // Fix type issue by properly checking the email property
    const existingUser = usersData?.users?.find(user => {
      if (user && typeof user === 'object' && 'email' in user) {
        // Cast to any to prevent TypeScript error and check explicitly
        const userObj = user as any;
        return userObj.email && typeof userObj.email === 'string' && 
               userObj.email.toLowerCase() === superAdminEmail.toLowerCase();
      }
      return false;
    });
    
    let userId: string | undefined;
    
    // 2. Create the user if they don't exist
    if (!existingUser) {
      console.log('Super admin does not exist, creating...');
      
      const { data: newUser, error: signUpError } = await supabase.auth.signUp({
        email: superAdminEmail,
        password: superAdminPassword,
        options: {
          data: { name: 'Super Admin' }
        }
      });
      
      if (signUpError) {
        console.error('Error creating super admin:', signUpError);
        throw signUpError;
      }
      
      userId = newUser?.user?.id;
      
      if (!userId) {
        throw new Error('Failed to get user ID after signup');
      }
      
      // Auto-confirm the email for the super admin
      try {
        const { error: confirmError } = await supabase.auth.admin.updateUserById(userId, {
          email_confirm: true
        });
        
        if (confirmError) {
          console.error('Error confirming email:', confirmError);
        }
      } catch (err) {
        console.error('Could not confirm email:', err);
      }
    } else {
      userId = existingUser.id;
      console.log('Super admin exists with ID:', userId);
    }
    
    // 3. Check and add the super_admin role if needed
    if (userId) {
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'super_admin');
      
      if (!existingRole || existingRole.length === 0) {
        console.log('Adding super_admin role to user');
        
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'super_admin'
          });
        
        if (roleError) {
          console.error('Error assigning super_admin role:', roleError);
        }
      } else {
        console.log('User already has super_admin role');
      }
    }
    
    // 4. Delete all other users except the super admin
    if (usersData?.users) {
      for (const user of usersData.users) {
        if (user && typeof user === 'object' && 'email' in user && 'id' in user) {
          const userObj = user as any;
          if (userObj.email && typeof userObj.email === 'string' && 
              userObj.email.toLowerCase() !== superAdminEmail.toLowerCase()) {
            console.log('Deleting user:', userObj.email);
            
            const { error: deleteError } = await supabase.auth.admin.deleteUser(userObj.id);
            
            if (deleteError) {
              console.error(`Error deleting user ${userObj.email}:`, deleteError);
            }
          }
        }
      }
    }
    
    // 5. Remove all profiles except our super admin
    const { error: deleteProfilesError } = await supabase
      .from('profiles')
      .delete()
      .neq('id', userId || '');
    
    if (deleteProfilesError) {
      console.error('Error removing other profiles:', deleteProfilesError);
    } else {
      console.log('Other profiles removed successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Setup error:', error);
    return false;
  }
};
