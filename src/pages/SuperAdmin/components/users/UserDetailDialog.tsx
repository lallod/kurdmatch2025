
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
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'view' ? 'User Details' : 'Edit User'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'view' 
              ? 'View complete information about this user.' 
              : 'Make changes to the user profile.'}
          </DialogDescription>
        </DialogHeader>
        
        {mode === 'view' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-sm font-medium">Name:</div>
                  <div className="col-span-2 text-sm">{user.name}</div>
                  
                  <div className="text-sm font-medium">Email:</div>
                  <div className="col-span-2 text-sm">{user.email}</div>
                  
                  <div className="text-sm font-medium">Role:</div>
                  <div className="col-span-2 text-sm">{getRoleBadge(user.role)}</div>
                  
                  <div className="text-sm font-medium">Status:</div>
                  <div className="col-span-2 text-sm">{getStatusBadge(user.status)}</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location Information</h3>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-sm font-medium">Location:</div>
                  <div className="col-span-2 text-sm">{user.location}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Account Information</h3>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-sm font-medium">Join Date:</div>
                  <div className="col-span-2 text-sm">{user.joinDate}</div>
                  
                  <div className="text-sm font-medium">Last Active:</div>
                  <div className="col-span-2 text-sm">{user.lastActive}</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Activity Statistics</h3>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-sm font-medium">Photos:</div>
                  <div className="col-span-2 text-sm">{user.photoCount}</div>
                  
                  <div className="text-sm font-medium">Messages:</div>
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
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue={user.role}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue={user.status}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue={user.location} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          {mode === 'view' ? (
            <>
              <Button variant="outline" onClick={onClose}>Close</Button>
              <Button onClick={() => onModeChange('edit')}>Edit User</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onModeChange('view')}>Cancel</Button>
              <Button>Save Changes</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;
