
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from '@/hooks/useTranslations';

interface UserFiltersProps {
  searchTerm: string;
  statusFilter: string;
  roleFilter: string;
  usersPerPage: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onUsersPerPageChange: (value: number) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  statusFilter,
  roleFilter,
  usersPerPage,
  onSearchChange,
  onStatusChange,
  onRoleChange,
  onUsersPerPageChange
}) => {
  const { t } = useTranslations();
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder={t('admin.search_users_placeholder', 'Search by name, email, or location...')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t('common.status', 'Status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('admin.all_status', 'All Status')}</SelectItem>
            <SelectItem value="active">{t('admin.active', 'Active')}</SelectItem>
            <SelectItem value="inactive">{t('admin.inactive', 'Inactive')}</SelectItem>
            <SelectItem value="suspended">{t('admin.suspended', 'Suspended')}</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={roleFilter} onValueChange={onRoleChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t('admin.role', 'Role')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('admin.all_roles', 'All Roles')}</SelectItem>
            <SelectItem value="user">{t('admin.user', 'User')}</SelectItem>
            <SelectItem value="premium">{t('admin.premium', 'Premium')}</SelectItem>
            <SelectItem value="moderator">{t('admin.moderator', 'Moderator')}</SelectItem>
            <SelectItem value="admin">{t('admin.admin', 'Admin')}</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={usersPerPage.toString()} 
          onValueChange={(value) => onUsersPerPageChange(parseInt(value))}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t('admin.users_per_page', 'Users per page')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">{t('admin.per_page', '{{count}} per page', { count: 10 })}</SelectItem>
            <SelectItem value="25">{t('admin.per_page', '{{count}} per page', { count: 25 })}</SelectItem>
            <SelectItem value="50">{t('admin.per_page', '{{count}} per page', { count: 50 })}</SelectItem>
            <SelectItem value="100">{t('admin.per_page', '{{count}} per page', { count: 100 })}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UserFilters;
