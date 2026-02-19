
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { User, FileText, Shield } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface NewRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewRoleDialog: React.FC<NewRoleDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslations();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('admin.create_new_role', 'Create New Role')}</DialogTitle>
          <DialogDescription>
            {t('admin.define_new_role', 'Define a new role with custom permissions.')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="role-name" className="text-sm font-medium">{t('admin.role_name', 'Role Name')}</label>
            <Input id="role-name" placeholder={t('admin.role_name_placeholder', 'e.g., Content Manager')} />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="role-description" className="text-sm font-medium">{t('admin.description', 'Description')}</label>
            <Input id="role-description" placeholder={t('admin.role_desc_placeholder', 'Describe the purpose of this role')} />
          </div>
          
          <div className="grid gap-2">
            <h3 className="text-sm font-medium mb-2">{t('admin.base_permissions_on', 'Base Permissions On')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center p-3 border rounded-md">
                <input type="radio" id="start-fresh" name="permission-base" className="mr-2" />
                <label htmlFor="start-fresh">{t('admin.start_from_scratch', 'Start from scratch')}</label>
              </div>
              <div className="flex items-center p-3 border rounded-md">
                <input type="radio" id="clone-existing" name="permission-base" className="mr-2" defaultChecked />
                <label htmlFor="clone-existing">{t('admin.clone_existing_role', 'Clone existing role')}</label>
              </div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">{t('admin.select_role_to_clone', 'Select Role to Clone')}</label>
            <select className="w-full border rounded-md p-2">
              <option>{t('admin.moderator', 'Moderator')}</option>
              <option>{t('admin.support_agent', 'Support Agent')}</option>
              <option>{t('admin.marketing', 'Marketing')}</option>
            </select>
          </div>
          
          <div className="grid gap-2">
            <h3 className="text-sm font-medium mb-2">{t('admin.permission_sets', 'Permission Sets')}</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{t('admin.user_management', 'User Management')}</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{t('admin.content_management', 'Content Management')}</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{t('admin.role_management', 'Role Management')}</span>
                </div>
                <Switch />
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <Button variant="outline" size="sm">{t('admin.configure_detailed_permissions', 'Configure Detailed Permissions')}</Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel', 'Cancel')}</Button>
          <Button>{t('admin.create_role', 'Create Role')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewRoleDialog;
