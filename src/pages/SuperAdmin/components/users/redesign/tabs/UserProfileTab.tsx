
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUsers } from '../../hooks/useUsers';
import UsersBannerArea from '../../UsersBannerArea';
import UserFilters from '../../UserFilters';
import EnhancedUsersTable from '../components/EnhancedUsersTable';
import UserDetailPanel from '../components/UserDetailPanel';
import { User } from '../../types';

const UserProfileTab: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
  } = useUsers(10);

  return (
    <div className="space-y-6">
      <UsersBannerArea 
        totalUsers={userStats.totalUsers}
        databaseVerified={userStats.databaseVerified}
        activeUsers={userStats.activeUsers}
        pendingUsers={userStats.pendingUsers}
        inactiveUsers={userStats.inactiveUsers}
      />

      <div className="grid grid-cols-1 gap-6">
        <div className="lg:hidden">
          <UserDetailPanel 
            user={selectedUser}
            onUserUpdate={handleRefresh}
          />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <UserFilters 
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                roleFilter={roleFilter}
                usersPerPage={usersPerPage}
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
                onRoleChange={setRoleFilter}
                onUsersPerPageChange={setUsersPerPage}
              />

              <EnhancedUsersTable 
                users={filteredUsers}
                loading={loading}
                onSelectUser={setSelectedUser}
                onRefresh={handleRefresh}
                currentPage={currentPage}
                totalUsers={totalUsers}
                usersPerPage={usersPerPage}
                onPageChange={handlePageChange}
              />
            </CardContent>
          </Card>
        </div>

        <div className="hidden lg:block">
          <UserDetailPanel 
            user={selectedUser}
            onUserUpdate={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfileTab;
