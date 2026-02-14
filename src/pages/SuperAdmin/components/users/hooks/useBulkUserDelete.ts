
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBulkUserDelete = (onRefresh: () => void) => {
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  

  const handleDeleteAllUsers = () => {
    setIsDeleteAllDialogOpen(true);
  };

  const confirmDeleteAllUsers = async (role: string) => {
    setIsDeleting(true);
    try {
      // Get current user's session to avoid deactivating themselves
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      
      if (role === 'all') {
        // Deactivate all profiles except current user without any query limits
        const { error } = await supabase
          .from('profiles')
          .update({ 
            status: 'deactivated',
            last_active: null,
            verified: false
          })
          .neq('id', currentUserId || 'no-id-found');
        
        if (error) throw error;
        
        toast.success("All users have been deactivated");
      } else {
        // For specific roles, first get all user IDs with the selected role
        // without any pagination limits
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', role);
        
        if (rolesError) throw rolesError;
        
        if (userRoles && userRoles.length > 0) {
          // Filter out current user ID if present
          const userIds = userRoles
            .map(ur => ur.user_id)
            .filter(id => id !== currentUserId);
          
          if (userIds.length === 0) {
            toast.info(`No other users with the role "${role}" were found`);
            setIsDeleting(false);
            setIsDeleteAllDialogOpen(false);
            return;
          }
          
          // Update all profiles with the filtered IDs
          const { error } = await supabase
            .from('profiles')
            .update({ 
              status: 'deactivated',
              last_active: null,
              verified: false
            })
            .in('id', userIds);
          
          if (error) throw error;
          
          toast.success(`All users with role "${role}" have been deactivated`);
        } else {
          // If no users with this role, exit early
          toast.info(`No users with the role "${role}" were found`);
          setIsDeleting(false);
          setIsDeleteAllDialogOpen(false);
          return;
        }
      }
      
      onRefresh();
    } catch (error) {
      console.error("Error deactivating users:", error);
      toast.error("There was an error deactivating users");
    } finally {
      setIsDeleting(false);
      setIsDeleteAllDialogOpen(false);
    }
  };

  return {
    isDeleteAllDialogOpen,
    setIsDeleteAllDialogOpen,
    isDeleting,
    handleDeleteAllUsers,
    confirmDeleteAllUsers
  };
};
