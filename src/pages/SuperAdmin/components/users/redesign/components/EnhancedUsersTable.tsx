
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '../../types';
import { getStatusBadge, getRoleBadge } from '../../UserUtils';
import TablePagination from '../../TablePagination';
import { Eye, RefreshCw } from 'lucide-react';

interface EnhancedUsersTableProps {
  users: User[];
  loading: boolean;
  onSelectUser: (user: User) => void;
  onRefresh: () => void;
  currentPage: number;
  totalUsers: number;
  usersPerPage: number;
  onPageChange: (page: number) => void;
}

const EnhancedUsersTable: React.FC<EnhancedUsersTableProps> = ({
  users,
  loading,
  onSelectUser,
  onRefresh,
  currentPage,
  totalUsers,
  usersPerPage,
  onPageChange
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="h-16 bg-gray-100 animate-pulse rounded-md"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {users.length} of {totalUsers} users
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
          <RefreshCw size={14} />
          Refresh
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                    <span className="text-xs text-gray-400">{user.location}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>Joined: {user.joinDate}</span>
                    <span className="text-gray-500">Last: {user.lastActive}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{user.photoCount} photos</span>
                    <span className="text-gray-500">{user.messageCount} messages</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectUser(user)}
                    className="gap-2"
                  >
                    <Eye size={14} />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination 
        currentPage={currentPage}
        totalPages={Math.ceil(totalUsers / usersPerPage)}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default EnhancedUsersTable;
