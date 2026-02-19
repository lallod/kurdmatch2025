
import React from 'react';
import { Role } from './types';
import { getRoleIcon } from './RoleUtils';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface RolesTableProps {
  roles: Role[];
  onViewRole: (role: Role) => void;
  onDeleteRole: (roleId: string) => void;
}

const RolesTable: React.FC<RolesTableProps> = ({ roles, onViewRole, onDeleteRole }) => {
  const { t } = useTranslations();
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('admin.role_name_header', 'Role Name')}</TableHead>
            <TableHead>{t('admin.description', 'Description')}</TableHead>
            <TableHead>{t('admin.users', 'Users')}</TableHead>
            <TableHead>{t('admin.type', 'Type')}</TableHead>
            <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.length > 0 ? (
            roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <div className="flex items-center">
                    {getRoleIcon(role.name)}
                    <span className="ml-2 font-medium">{role.name}</span>
                  </div>
                </TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>{role.userCount}</TableCell>
                <TableCell>
                  <Badge variant={role.isSystem ? "outline" : "default"}>
                    {role.isSystem ? t('admin.system', 'System') : t('admin.custom', 'Custom')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="gap-2"
                      onClick={() => onViewRole(role)}
                    >
                      <Eye size={16} />
                      {t('admin.view', 'View')}
                    </Button>
                    {!role.isSystem && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        onClick={() => onDeleteRole(role.id)}
                      >
                        <Trash size={16} />
                        {t('admin.delete', 'Delete')}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                {t('admin.no_roles_found', 'No roles found')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RolesTable;
