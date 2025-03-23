
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import UsersTable from './UsersTable';
import TablePagination from './TablePagination';
import UserFilters from './UserFilters';
import { User } from './types';

interface UserListingAreaProps {
  users: User[];
  loading: boolean;
  currentPage: number;
  totalUsers: number;
  usersPerPage: number;
  searchTerm: string;
  statusFilter: string;
  roleFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
}

const UserListingArea: React.FC<UserListingAreaProps> = ({
  users,
  loading,
  currentPage,
  totalUsers,
  usersPerPage,
  searchTerm,
  statusFilter,
  roleFilter,
  onSearchChange,
  onStatusChange,
  onRoleChange,
  onPageChange,
  onRefresh,
  onViewUser,
  onEditUser
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <UserFilters 
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          roleFilter={roleFilter}
          onSearchChange={onSearchChange}
          onStatusChange={onStatusChange}
          onRoleChange={onRoleChange}
        />

        <UsersTable 
          users={users}
          onViewUser={onViewUser}
          onEditUser={onEditUser}
          onRefresh={onRefresh}
          loading={loading}
        />

        <TablePagination 
          currentPage={currentPage}
          totalPages={Math.ceil(totalUsers / usersPerPage)}
          onPageChange={onPageChange}
        />
      </CardContent>
    </Card>
  );
};

export default UserListingArea;
