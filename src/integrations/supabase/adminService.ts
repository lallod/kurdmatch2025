
import { supabase } from './client';

export const ensureAdminExists = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log(`Checking if admin exists: ${email}`);
    
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return false;
    }
    
    // Find existing user with matching email
    const existingUser = users?.users?.find(u => {
      if (u && typeof u === 'object' && 'email' in u) {
        // Cast to any to prevent TypeScript error and check explicitly
        const userObj = u as any;
        return userObj.email && typeof userObj.email === 'string' && 
               userObj.email.toLowerCase() === email.toLowerCase();
      }
      return false;
    });
    
    let userId = existingUser?.id;
    
    let isAdmin = false;
    
    if (userId) {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'super_admin');
        
      isAdmin = roles && roles.length > 0;
      
      if (isAdmin) {
        console.log(`Admin user confirmed: ${email}`);
        return true;
      }
    }
    
    console.log(`Admin user doesn't exist or doesn't have admin role, creating: ${email}`);
    
    if (!userId) {
      const { data: newUser, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: 'Super Admin', email }
        }
      });
      
      if (signUpError || !newUser?.user?.id) {
        console.error('Admin signup error:', signUpError);
        return false;
      }
      
      userId = newUser.user.id;
      
      try {
        await supabase.auth.admin.updateUserById(userId, { 
          user_metadata: { name: 'Super Admin' },
          email_confirm: true 
        });
      } catch (err) {
        console.error('Could not confirm email automatically:', err);
      }
    }
    
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'super_admin'
      });
    
    if (roleError) {
      console.error('Error assigning admin role:', roleError);
      return false;
    }
    
    console.log(`Admin role assigned to: ${email}`);
    return true;
    
  } catch (error) {
    console.error('Unexpected error ensuring admin exists:', error);
    return false;
  }
};

export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'super_admin');
        
    return roleData && roleData.length > 0;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
