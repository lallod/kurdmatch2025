
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Pencil } from 'lucide-react';

const AccountSettings: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Account Settings</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings size={16} />
          Manage
        </Button>
      </div>
      <p className="text-muted-foreground mb-6">
        Manage your account settings and preferences.
      </p>
      
      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Profile Visibility</h3>
            <Button variant="edit">
              <Pencil size={16} />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Control who can see your profile</p>
          <div className="flex items-center justify-between">
            <span>Show me in discovery</span>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Notification Settings</h3>
            <Button variant="edit">
              <Pencil size={16} />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Manage your notification preferences</p>
          <div className="flex items-center justify-between">
            <span>Email and push notifications</span>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Privacy</h3>
            <Button variant="edit">
              <Pencil size={16} />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Control your privacy settings</p>
          <div className="flex items-center justify-between">
            <span>Location sharing and data usage</span>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Change Password</h3>
            <Button variant="edit">
              <Pencil size={16} />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Update your account password</p>
          <div className="flex items-center justify-between">
            <span>Password and security</span>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 border-destructive/20 bg-destructive/5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-destructive">Danger Zone</h3>
            <Button variant="edit" className="text-destructive">
              <Pencil size={16} />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Permanent actions for your account</p>
          <div className="flex items-center justify-between">
            <span>Delete account</span>
            <Button variant="destructive" size="sm">Delete</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
