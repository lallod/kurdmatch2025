
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslations } from '@/hooks/useTranslations';

const UserTableHeader: React.FC = () => {
  const { t } = useTranslations();
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[80px]">{t('admin.id', 'ID')}</TableHead>
        <TableHead>{t('admin.name', 'Name')}</TableHead>
        <TableHead>{t('admin.email', 'Email')}</TableHead>
        <TableHead>{t('admin.role', 'Role')}</TableHead>
        <TableHead>{t('admin.status', 'Status')}</TableHead>
        <TableHead>{t('admin.location', 'Location')}</TableHead>
        <TableHead>{t('admin.join_date', 'Join Date')}</TableHead>
        <TableHead className="text-right">{t('admin.actions', 'Actions')}</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default UserTableHeader;
