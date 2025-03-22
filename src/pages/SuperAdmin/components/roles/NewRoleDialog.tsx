
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

interface NewRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewRoleDialog: React.FC<NewRoleDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Define a new role with custom permissions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="role-name" className="text-sm font-medium">Role Name</label>
            <Input id="role-name" placeholder="e.g., Content Manager" />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="role-description" className="text-sm font-medium">Description</label>
            <Input id="role-description" placeholder="Describe the purpose of this role" />
          </div>
          
          <div className="grid gap-2">
            <h3 className="text-sm font-medium mb-2">Base Permissions On</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center p-3 border rounded-md">
                <input type="radio" id="start-fresh" name="permission-base" className="mr-2" />
                <label htmlFor="start-fresh">Start from scratch</label>
              </div>
              <div className="flex items-center p-3 border rounded-md">
                <input type="radio" id="clone-existing" name="permission-base" className="mr-2" defaultChecked />
                <label htmlFor="clone-existing">Clone existing role</label>
              </div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Select Role to Clone</label>
            <select className="w-full border rounded-md p-2">
              <option>Moderator</option>
              <option>Support Agent</option>
              <option>Marketing</option>
            </select>
          </div>
          
          <div className="grid gap-2">
            <h3 className="text-sm font-medium mb-2">Permission Sets</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-2" />
                  <span>User Management</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Content Management</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Role Management</span>
                </div>
                <Switch />
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <Button variant="outline" size="sm">Configure Detailed Permissions</Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button>Create Role</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewRoleDialog;
