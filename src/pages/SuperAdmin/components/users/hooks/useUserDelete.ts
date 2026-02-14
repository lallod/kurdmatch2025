import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '../types';

export const useUserDelete = (onRefresh: () => void) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async (permanent = false) => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (userToDelete.id === session?.user?.id) {
        throw new Error("You cannot delete your own account");
      }

      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: {
          userId: userToDelete.id,
          action: permanent ? 'permanent_delete' : 'deactivate',
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(
        permanent
          ? `${userToDelete.name} has been permanently deleted.`
          : `${userToDelete.name} has been deactivated.`
      );
      
      onRefresh();
    } catch (error) {
      console.error("Error deleting user:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage || "There was an error processing this request.");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    isDeleting,
    handleDeleteUser,
    confirmDeleteUser
  };
};
