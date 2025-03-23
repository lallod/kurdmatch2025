
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AIBanner } from '../components/payments/AIBanner';
import PageHeader from '../components/users/PageHeader';
import UserFilters from '../components/users/UserFilters';
import UsersTable from '../components/users/UsersTable';
import TablePagination from '../components/users/TablePagination';
import UserDetailDialog from '../components/users/UserDetailDialog';
import AddUserDialog from '../components/users/AddUserDialog';
import UserStatsBanner from '../components/users/UserStatsBanner';
import { User } from '../components/users/types';
import { useUsers } from '../components/users/hooks/useUsers';

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailMode, setUserDetailMode] = useState<'view' | 'edit'>('view');
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const usersPerPage = 10;
  
  const {
    filteredUsers,
    loading,
    currentPage,
    totalUsers,
    userStats,
    searchTerm,
    statusFilter,
    roleFilter,
    setSearchTerm,
    setStatusFilter,
    setRoleFilter,
    handlePageChange,
    handleRefresh,
    fetchUsers
  } = useUsers(usersPerPage);

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

      <AIBanner type="user" collapsible={true} />
      
      <UserStatsBanner 
        totalUsers={userStats.totalUsers}
        databaseVerified={userStats.databaseVerified}
        activeUsers={userStats.activeUsers}
        pendingUsers={userStats.pendingUsers}
        inactiveUsers={userStats.inactiveUsers}
      />

      <Card>
        <CardContent className="pt-6">
          <UserFilters 
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            roleFilter={roleFilter}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
            onRoleChange={setRoleFilter}
          />

          <UsersTable 
            users={filteredUsers}
            onViewUser={viewUser}
            onEditUser={editUser}
            onRefresh={handleRefresh}
            loading={loading}
          />

          <TablePagination 
            currentPage={currentPage}
            totalPages={Math.ceil(totalUsers / usersPerPage)}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>

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
