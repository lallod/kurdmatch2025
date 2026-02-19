
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslations } from '@/hooks/useTranslations';

interface DeleteAllUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userCount: number;
  isDeleting: boolean;
  onConfirmDelete: (role: string) => Promise<void>;
}

const DeleteAllUsersDialog: React.FC<DeleteAllUsersDialogProps> = ({
  open,
  onOpenChange,
  userCount,
  isDeleting,
  onConfirmDelete
}) => {
  const { t } = useTranslations();
  const [selectedRole, setSelectedRole] = useState<string>("all");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('admin.deactivate_users_by_role', 'Deactivate Users by Role')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('admin.deactivate_users_desc', 'Choose which users to deactivate based on their role. Their profiles will be hidden but their data will be preserved.')}
            <strong className="block mt-2 text-amber-600">
              {t('admin.deactivate_warning', 'This will deactivate ALL users with the selected role, not just the current page.')}
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <Label htmlFor="role-select" className="mb-2 block">{t('admin.select_role', 'Select Role')}</Label>
          <Select
            value={selectedRole}
            onValueChange={setSelectedRole}
            disabled={isDeleting}
          >
            <SelectTrigger className="w-full" id="role-select">
              <SelectValue placeholder={t('admin.select_role', 'Select role')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">{t('admin.all_roles', 'All Users')} ({userCount})</SelectItem>
                <SelectItem value="user">{t('admin.regular_users', 'Regular Users')}</SelectItem>
                <SelectItem value="moderator">{t('admin.moderators', 'Moderators')}</SelectItem>
                <SelectItem value="admin">{t('admin.admins', 'Admins')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              onConfirmDelete(selectedRole);
            }} 
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? t('admin.deactivating', 'Deactivating...') : t('admin.deactivate_users', 'Deactivate {{role}} Users', { role: selectedRole === 'all' ? 'All' : selectedRole })}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAllUsersDialog;
