
import React from 'react';
import { Table } from '@/components/ui/table';
import { User } from './types';
import DeleteUserDialog from './DeleteUserDialog';
import DeleteAllUsersDialog from './DeleteAllUsersDialog';
import TableActionButtons from './TableActionButtons';
import UserTableHeader from './UserTableHeader';
import UserTableBody from './UserTableBody';
import { useUserDelete } from './hooks/useUserDelete';
import { useBulkUserDelete } from './hooks/useBulkUserDelete';

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
  // Use the extracted hooks
  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    userToDelete,
    isDeleting: isUserDeleting,
    handleDeleteUser,
    confirmDeleteUser
  } = useUserDelete(onRefresh);

  const {
    isDeleteAllDialogOpen,
    setIsDeleteAllDialogOpen,
    isDeleting: isBulkDeleting,
    handleDeleteAllUsers,
    confirmDeleteAllUsers
  } = useBulkUserDelete(onRefresh);

  return (
    <div className="space-y-4">
      <TableActionButtons
        onRefresh={onRefresh}
        onDeleteAllUsers={handleDeleteAllUsers}
        userCount={users.length}
      />
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <UserTableHeader />
          <UserTableBody 
            users={users}
            loading={loading}
            onViewUser={onViewUser}
            onEditUser={onEditUser}
            onDeleteUser={handleDeleteUser}
          />
        </Table>
      </div>

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        userToDelete={userToDelete}
        isDeleting={isUserDeleting}
        onConfirmDelete={confirmDeleteUser}
      />

      <DeleteAllUsersDialog
        open={isDeleteAllDialogOpen}
        onOpenChange={setIsDeleteAllDialogOpen}
        userCount={users.length}
        isDeleting={isBulkDeleting}
        onConfirmDelete={confirmDeleteAllUsers}
      />
    </div>
  );
};

export default UsersTable;
