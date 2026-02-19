
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { User } from './types';
import { useTranslations } from '@/hooks/useTranslations';

interface UserActionMenuProps {
  user: User;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UserActionMenu: React.FC<UserActionMenuProps> = ({
  user,
  onViewUser,
  onEditUser,
  onDeleteUser
}) => {
  const { t } = useTranslations();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('common.actions', 'Actions')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onViewUser(user)}>
          <Eye className="mr-2 h-4 w-4" />
          {t('admin.view_details', 'View Details')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEditUser(user)}>
          <Edit className="mr-2 h-4 w-4" />
          {t('admin.edit_user', 'Edit User')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={() => onDeleteUser(user)}>
          <Trash2 className="mr-2 h-4 w-4" />
          {t('admin.delete_user', 'Delete User')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionMenu;
