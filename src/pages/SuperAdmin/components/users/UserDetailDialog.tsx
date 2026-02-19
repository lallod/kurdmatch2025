
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from './types';
import { getStatusBadge, getRoleBadge } from './UserUtils';
import { useTranslations } from '@/hooks/useTranslations';

interface UserDetailDialogProps {
  user: User | null;
  mode: 'view' | 'edit';
  open: boolean;
  onClose: () => void;
  onModeChange: (mode: 'view' | 'edit') => void;
}

const UserDetailDialog: React.FC<UserDetailDialogProps> = ({
  user,
  mode,
  open,
  onClose,
  onModeChange
}) => {
  const { t } = useTranslations();
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'view' ? t('admin.user_details', 'User Details') : t('admin.edit_user', 'Edit User')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'view' 
              ? t('admin.view_user_info', 'View complete information about this user.') 
              : t('admin.edit_user_profile', 'Make changes to the user profile.')}
          </DialogDescription>
        </DialogHeader>
        
        {mode === 'view' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.basic_information', 'Basic Information')}</h3>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-sm font-medium">{t('admin.name', 'Name')}:</div>
                  <div className="col-span-2 text-sm">{user.name}</div>
                  
                  <div className="text-sm font-medium">{t('admin.email', 'Email')}:</div>
                  <div className="col-span-2 text-sm">{user.email}</div>
                  
                  <div className="text-sm font-medium">{t('admin.role', 'Role')}:</div>
                  <div className="col-span-2 text-sm">{getRoleBadge(user.role)}</div>
                  
                  <div className="text-sm font-medium">{t('common.status', 'Status')}:</div>
                  <div className="col-span-2 text-sm">{getStatusBadge(user.status)}</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.location_information', 'Location Information')}</h3>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-sm font-medium">{t('admin.location', 'Location')}:</div>
                  <div className="col-span-2 text-sm">{user.location}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.account_information', 'Account Information')}</h3>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-sm font-medium">{t('admin.join_date', 'Join Date')}:</div>
                  <div className="col-span-2 text-sm">{user.joinDate}</div>
                  
                  <div className="text-sm font-medium">{t('admin.last_active', 'Last Active')}:</div>
                  <div className="col-span-2 text-sm">{user.lastActive}</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t('admin.activity_statistics', 'Activity Statistics')}</h3>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-sm font-medium">{t('admin.photos', 'Photos')}:</div>
                  <div className="col-span-2 text-sm">{user.photoCount}</div>
                  
                  <div className="text-sm font-medium">{t('admin.messages', 'Messages')}:</div>
                  <div className="col-span-2 text-sm">{user.messageCount}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t('admin.name', 'Name')}</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('admin.email', 'Email')}</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="role">{t('admin.role', 'Role')}</Label>
                  <Select defaultValue={user.role}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder={t('admin.select_role', 'Select role')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">{t('admin.user', 'User')}</SelectItem>
                      <SelectItem value="premium">{t('admin.premium', 'Premium')}</SelectItem>
                      <SelectItem value="moderator">{t('admin.moderator', 'Moderator')}</SelectItem>
                      <SelectItem value="admin">{t('admin.admin', 'Admin')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">{t('common.status', 'Status')}</Label>
                  <Select defaultValue={user.status}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder={t('admin.select_status', 'Select status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('admin.active', 'Active')}</SelectItem>
                      <SelectItem value="inactive">{t('admin.inactive', 'Inactive')}</SelectItem>
                      <SelectItem value="suspended">{t('admin.suspended', 'Suspended')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="location">{t('admin.location', 'Location')}</Label>
                  <Input id="location" defaultValue={user.location} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          {mode === 'view' ? (
            <>
              <Button variant="outline" onClick={onClose}>{t('common.close', 'Close')}</Button>
              <Button onClick={() => onModeChange('edit')}>{t('admin.edit_user', 'Edit User')}</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onModeChange('view')}>{t('common.cancel', 'Cancel')}</Button>
              <Button>{t('admin.save_changes', 'Save Changes')}</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;
