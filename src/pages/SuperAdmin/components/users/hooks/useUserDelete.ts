
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '../types';

export const useUserDelete = (onRefresh: () => void) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      // First get the session to make sure we don't delete ourselves
      const { data: { session } } = await supabase.auth.getSession();
      if (userToDelete.id === session?.user?.id) {
        throw new Error("You cannot delete your own account");
      }
      
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);
      
      if (error) throw error;
      
      toast({
        title: "User Deleted",
        description: `${userToDelete.name} has been permanently removed.`,
      });
      
      onRefresh();
    } catch (error) {
      console.error("Error deleting user:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      toast({
        title: "Delete Failed",
        description: errorMessage || "There was an error removing this user.",
        variant: "destructive",
      });
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
