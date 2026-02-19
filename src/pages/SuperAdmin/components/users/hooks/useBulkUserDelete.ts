
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

export const useBulkUserDelete = (onRefresh: () => void) => {
  const { t } = useTranslations();
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAllUsers = () => {
    setIsDeleteAllDialogOpen(true);
  };

  const confirmDeleteAllUsers = async (role: string) => {
    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      
      if (role === 'all') {
        const { error } = await supabase
          .from('profiles')
          .update({ status: 'deactivated', last_active: null, verified: false })
          .neq('id', currentUserId || 'no-id-found');
        
        if (error) throw error;
        toast.success(t('admin.all_users_deactivated', 'All users have been deactivated'));
      } else {
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', role);
        
        if (rolesError) throw rolesError;
        
        if (userRoles && userRoles.length > 0) {
          const userIds = userRoles
            .map(ur => ur.user_id)
            .filter(id => id !== currentUserId);
          
          if (userIds.length === 0) {
            toast.info(t('admin.no_other_users_role', `No other users with the role "${role}" were found`, { role }));
            setIsDeleting(false);
            setIsDeleteAllDialogOpen(false);
            return;
          }
          
          const { error } = await supabase
            .from('profiles')
            .update({ status: 'deactivated', last_active: null, verified: false })
            .in('id', userIds);
          
          if (error) throw error;
          toast.success(t('admin.role_users_deactivated', `All users with role "${role}" have been deactivated`, { role }));
        } else {
          toast.info(t('admin.no_users_role', `No users with the role "${role}" were found`, { role }));
          setIsDeleting(false);
          setIsDeleteAllDialogOpen(false);
          return;
        }
      }
      
      onRefresh();
    } catch (error) {
      console.error("Error deactivating users:", error);
      toast.error(t('admin.error_deactivating_users', 'There was an error deactivating users'));
    } finally {
      setIsDeleting(false);
      setIsDeleteAllDialogOpen(false);
    }
  };

  return {
    isDeleteAllDialogOpen, setIsDeleteAllDialogOpen,
    isDeleting, handleDeleteAllUsers, confirmDeleteAllUsers
  };
};
