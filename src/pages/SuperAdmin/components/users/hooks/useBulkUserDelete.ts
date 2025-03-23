
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBulkUserDelete = (onRefresh: () => void) => {
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteAllUsers = () => {
    setIsDeleteAllDialogOpen(true);
  };

  const confirmDeleteAllUsers = async (role: string) => {
    setIsDeleting(true);
    try {
      // Get current user's session to avoid deleting themselves
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      
      if (role === 'all') {
        // Delete all profiles except current user without any query limits
        const { error } = await supabase
          .from('profiles')
          .delete()
          .neq('id', currentUserId || 'no-id-found');
        
        if (error) throw error;
        
        toast({
          title: "Users Deleted",
          description: "All users have been permanently removed.",
        });
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
            toast({
              title: "No Users Deleted",
              description: `No other users with the role "${role}" were found.`,
            });
            setIsDeleting(false);
            setIsDeleteAllDialogOpen(false);
            return;
          }
          
          // Delete all profiles with the filtered IDs
          const { error } = await supabase
            .from('profiles')
            .delete()
            .in('id', userIds);
          
          if (error) throw error;
          
          toast({
            title: "Users Deleted",
            description: `All users with role "${role}" have been permanently removed.`,
          });
        } else {
          // If no users with this role, exit early
          toast({
            title: "No Users Deleted",
            description: `No users with the role "${role}" were found.`,
          });
          setIsDeleting(false);
          setIsDeleteAllDialogOpen(false);
          return;
        }
      }
      
      onRefresh();
    } catch (error) {
      console.error("Error deleting users:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error removing users.",
        variant: "destructive",
      });
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
