
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AIBanner } from '../components/payments/AIBanner';
import PageHeader from '../components/users/PageHeader';
import UserFilters from '../components/users/UserFilters';
import UsersTable from '../components/users/UsersTable';
import TablePagination from '../components/users/TablePagination';
import UserDetailDialog from '../components/users/UserDetailDialog';
import { mockUsers } from '../components/users/UserData';
import { User } from '../components/users/types';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailMode, setUserDetailMode] = useState<'view' | 'edit'>('view');
  
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      user.status === statusFilter;
    
    const matchesRole = 
      roleFilter === 'all' || 
      user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

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
    // In a real app, this would trigger a download of user data
  };

  return (
    <div className="space-y-6">
      <PageHeader onExport={exportUsers} />

      <AIBanner type="user" collapsible={true} />

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
          />

          <TablePagination />
        </CardContent>
      </Card>

      <UserDetailDialog 
        user={selectedUser}
        mode={userDetailMode}
        open={!!selectedUser}
        onClose={closeDialog}
        onModeChange={setUserDetailMode}
      />
    </div>
  );
};

export default UsersPage;
