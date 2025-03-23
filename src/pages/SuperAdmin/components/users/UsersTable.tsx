import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { User } from './types';
import { getStatusBadge, getRoleBadge } from './UserUtils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DeleteUserDialog from './DeleteUserDialog';
import DeleteAllUsersDialog from './DeleteAllUsersDialog';
import UserActionMenu from './UserActionMenu';
import TableActionButtons from './TableActionButtons';

interface UsersTableProps {
  users: User[];
  loading?: boolean;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onRefresh: () => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ 
  users, 
  loading = false, 
  onViewUser, 
  onEditUser,
  onRefresh 
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
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
      toast({
        title: "Delete Failed",
        description: "There was an error removing this user.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteAllUsers = () => {
    setIsDeleteAllDialogOpen(true);
  };

  const confirmDeleteAllUsers = async () => {
    setIsDeleting(true);
    try {
      // Delete all profiles except the current user (if you want to keep it)
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      
      const { error } = await supabase
        .from('profiles')
        .delete()
        .neq('id', currentUserId || 'no-id-found');
      
      if (error) throw error;
      
      toast({
        title: "All Users Deleted",
        description: "All users have been permanently removed.",
      });
      
      onRefresh();
    } catch (error) {
      console.error("Error deleting all users:", error);
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

  if (loading) {
    return (
      <div className="space-y-4">
        <TableActionButtons
          onRefresh={onRefresh}
          onDeleteAllUsers={handleDeleteAllUsers}
          userCount={0}
        />
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((index) => (
                <TableRow key={index}>
                  <TableCell colSpan={8}>
                    <div className="h-10 bg-gray-100 animate-pulse rounded-md w-full"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TableActionButtons
        onRefresh={onRefresh}
        onDeleteAllUsers={handleDeleteAllUsers}
        userCount={users.length}
      />
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id.substring(0, 6)}...</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <UserActionMenu
                      user={user}
                      onViewUser={onViewUser}
                      onEditUser={onEditUser}
                      onDeleteUser={handleDeleteUser}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        userToDelete={userToDelete}
        isDeleting={isDeleting}
        onConfirmDelete={confirmDeleteUser}
      />

      <DeleteAllUsersDialog
        open={isDeleteAllDialogOpen}
        onOpenChange={setIsDeleteAllDialogOpen}
        userCount={users.length}
        isDeleting={isDeleting}
        onConfirmDelete={confirmDeleteAllUsers}
      />
    </div>
  );
};

export default UsersTable;
