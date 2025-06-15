
import React, { useState } from 'react';
import PageHeader from '../components/users/PageHeader';
import UserDetailDialog from '../components/users/UserDetailDialog';
import AddUserDialog from '../components/users/AddUserDialog';
import { User } from '../components/users/types';
import { useUsers } from '../components/users/hooks/useUsers';
import UsersBannerArea from '../components/users/UsersBannerArea';
import UserListingArea from '../components/users/UserListingArea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailMode, setUserDetailMode] = useState<'view' | 'edit'>('view');
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const initialUsersPerPage = 10;
  
  const {
    filteredUsers,
    loading,
    currentPage,
    totalUsers,
    userStats,
    searchTerm,
    statusFilter,
    roleFilter,
    usersPerPage,
    setSearchTerm,
    setStatusFilter,
    setRoleFilter,
    setUsersPerPage,
    handlePageChange,
    handleRefresh,
    fetchUsers
  } = useUsers(initialUsersPerPage);

  const viewUser = (user: User) => {
    setSelectedUser(user);
    setUserDetailMode('view');
  };

  const editUser = (user: User) => {
    setSelectedUser(user);
    setUserDetailMode('edit');
  };

  const closeDialog = () => {
    setSelectedUser(null);
  };

  const exportUsers = () => {
    console.log('Exporting users...');
  };

  const handleAddUser = () => {
    setAddUserDialogOpen(true);
  };

  const handleUserAdded = () => {
    console.log('User added, refreshing...');
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-800">
        <ShieldAlert className="h-4 w-4 !text-yellow-600" />
        <AlertTitle className="font-semibold">Administratoransvar</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Du ser på sensitive brukerdata. Håndter denne informasjonen med den største forsiktighet og respekt for brukernes personvern. Alle handlinger logges.
        </AlertDescription>
      </Alert>

      <PageHeader onExport={exportUsers} onAddUser={handleAddUser} />

      <UsersBannerArea 
        totalUsers={userStats.totalUsers}
        databaseVerified={userStats.databaseVerified}
        activeUsers={userStats.activeUsers}
        pendingUsers={userStats.pendingUsers}
        inactiveUsers={userStats.inactiveUsers}
      />

      <UserListingArea 
        users={filteredUsers}
        loading={loading}
        currentPage={currentPage}
        totalUsers={totalUsers}
        usersPerPage={usersPerPage}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        roleFilter={roleFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onRoleChange={setRoleFilter}
        onUsersPerPageChange={setUsersPerPage}
        onPageChange={handlePageChange}
        onRefresh={handleRefresh}
        onViewUser={viewUser}
        onEditUser={editUser}
      />

      <UserDetailDialog 
        user={selectedUser}
        mode={userDetailMode}
        open={!!selectedUser}
        onClose={closeDialog}
        onModeChange={setUserDetailMode}
      />

      <AddUserDialog
        open={addUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default UsersPage;
