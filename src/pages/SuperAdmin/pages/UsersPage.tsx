
import React, { useState } from 'react';
import PageHeader from '../components/users/PageHeader';
import UserDetailDialog from '../components/users/UserDetailDialog';
import AddUserDialog from '../components/users/AddUserDialog';
import { User } from '../components/users/types';
import { useUsers } from '../components/users/hooks/useUsers';
import UsersBannerArea from '../components/users/UsersBannerArea';
import UserListingArea from '../components/users/UserListingArea';

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
