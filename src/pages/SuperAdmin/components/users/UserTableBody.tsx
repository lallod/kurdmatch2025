
import React from 'react';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { User } from './types';
import { getStatusBadge, getRoleBadge } from './UserUtils';
import UserActionMenu from './UserActionMenu';

interface UserTableBodyProps {
  users: User[];
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  loading: boolean;
}

const UserTableBody: React.FC<UserTableBodyProps> = ({ 
  users,
  onViewUser,
  onEditUser,
  onDeleteUser,
  loading
}) => {
  if (loading) {
    return (
      <TableBody>
        {[1, 2, 3, 4, 5].map((index) => (
          <TableRow key={index}>
            <TableCell colSpan={8}>
              <div className="h-10 bg-gray-100 animate-pulse rounded-md w-full"></div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  if (users.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={8} className="text-center py-6">
            No users found
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {users.map((user) => (
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
              onDeleteUser={onDeleteUser}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default UserTableBody;
