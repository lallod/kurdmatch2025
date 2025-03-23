
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
      
      // Start a query to delete profiles
      let query = supabase
        .from('profiles')
        .delete()
        .neq('id', currentUserId || 'no-id-found');
      
      // Apply role filter if not "all"
      if (role !== 'all') {
        // First get the user IDs with the selected role
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', role);
        
        if (rolesError) throw rolesError;
        
        if (userRoles && userRoles.length > 0) {
          const userIds = userRoles.map(ur => ur.user_id);
          query = query.in('id', userIds);
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
      
      // Execute the delete operation
      const { error } = await query;
      
      if (error) throw error;
      
      toast({
        title: "Users Deleted",
        description: role === 'all' ? 
          "All users have been permanently removed." : 
          `All users with role "${role}" have been permanently removed.`,
      });
      
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
