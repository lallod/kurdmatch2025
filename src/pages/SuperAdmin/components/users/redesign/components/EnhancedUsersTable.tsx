
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '../../types';
import { getStatusBadge, getRoleBadge } from '../../UserUtils';
import TablePagination from '../../TablePagination';
import { Eye, RefreshCw } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

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
  const { t } = useTranslations();

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
          {t('admin.showing_users', 'Showing {{count}} of {{total}} users', { count: users.length, total: totalUsers })}
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
          <RefreshCw size={14} />
          {t('common.refresh', 'Refresh')}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('common.user', 'User')}</TableHead>
              <TableHead>{t('common.status', 'Status')}</TableHead>
              <TableHead>{t('common.role', 'Role')}</TableHead>
              <TableHead>{t('admin.activity', 'Activity')}</TableHead>
              <TableHead>{t('admin.completion', 'Completion')}</TableHead>
              <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
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
                    <span>{t('admin.joined', 'Joined')}: {user.joinDate}</span>
                    <span className="text-gray-500">{t('admin.last', 'Last')}: {user.lastActive}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span>{user.photoCount} {t('common.photos', 'photos')}</span>
                    <span className="text-gray-500">{user.messageCount} {t('common.messages', 'messages')}</span>
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
                    {t('common.view', 'View')}
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
