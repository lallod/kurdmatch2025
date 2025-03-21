
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Pencil, Bell, Lock, Eye, ShieldAlert, KeyRound, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

const AccountSettings: React.FC = () => {
  const [visibilityEnabled, setVisibilityEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  
  const handleManageSettings = () => {
    toast.info("Opening settings management panel");
  };
  
  const handleSaveVisibility = () => {
    toast.success("Profile visibility settings saved");
  };
  
  const handleSaveNotifications = () => {
    toast.success("Notification settings saved");
  };
  
  const handleSavePrivacy = () => {
    toast.success("Privacy settings saved");
  };
  
  const handleChangePassword = () => {
    toast.info("Password change initiated");
  };
  
  const handleDeleteAccount = () => {
    toast.error("Account deletion requested", {
      description: "This action would require additional confirmation in a real app",
      duration: 5000,
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Account Settings</h2>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleManageSettings}>
          <Settings size={16} />
          Manage Settings
        </Button>
      </div>
      <p className="text-muted-foreground mb-6">
        Manage your account settings and preferences.
      </p>
      
      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-tinder-rose" />
              <h3 className="font-medium">Profile Visibility</h3>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="edit">
                  <Pencil size={16} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Profile Visibility</SheetTitle>
                  <SheetDescription>
                    Control who can see your profile and discover you
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[85vh] pr-4 mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="show-discovery" className="flex flex-col space-y-1">
                        <span>Show me in discovery</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          When enabled, people can see your profile
                        </span>
                      </Label>
                      <Switch 
                        id="show-discovery" 
                        checked={visibilityEnabled} 
                        onCheckedChange={setVisibilityEnabled} 
                      />
                    </div>
                    <Button onClick={handleSaveVisibility}>Save Changes</Button>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Control who can see your profile</p>
          <div className="flex items-center justify-between">
            <span>Show me in discovery</span>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings size={14} />
                  Edit
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Profile Visibility</SheetTitle>
                  <SheetDescription>
                    Control who can see your profile and discover you
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[85vh] pr-4 mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="show-discovery-2" className="flex flex-col space-y-1">
                        <span>Show me in discovery</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          When enabled, people can see your profile
                        </span>
                      </Label>
                      <Switch 
                        id="show-discovery-2" 
                        checked={visibilityEnabled} 
                        onCheckedChange={setVisibilityEnabled} 
                      />
                    </div>
                    <Button onClick={handleSaveVisibility}>Save Changes</Button>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-tinder-rose" />
              <h3 className="font-medium">Notification Settings</h3>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="edit">
                  <Pencil size={16} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Notification Settings</SheetTitle>
                  <SheetDescription>
                    Manage your notification preferences
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[85vh] pr-4 mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                        <span>Email Notifications</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Receive match and message notifications via email
                        </span>
                      </Label>
                      <Switch 
                        id="email-notifications" 
                        checked={emailNotifications} 
                        onCheckedChange={setEmailNotifications} 
                      />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                        <span>Push Notifications</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Receive push notifications on your device
                        </span>
                      </Label>
                      <Switch 
                        id="push-notifications" 
                        checked={pushNotifications} 
                        onCheckedChange={setPushNotifications} 
                      />
                    </div>
                    <Button onClick={handleSaveNotifications}>Save Changes</Button>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Manage your notification preferences</p>
          <div className="flex items-center justify-between">
            <span>Email and push notifications</span>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings size={14} />
                  Edit
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Notification Settings</SheetTitle>
                  <SheetDescription>
                    Manage your notification preferences
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[85vh] pr-4 mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="email-notifications-2" className="flex flex-col space-y-1">
                        <span>Email Notifications</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Receive match and message notifications via email
                        </span>
                      </Label>
                      <Switch 
                        id="email-notifications-2" 
                        checked={emailNotifications} 
                        onCheckedChange={setEmailNotifications} 
                      />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="push-notifications-2" className="flex flex-col space-y-1">
                        <span>Push Notifications</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Receive push notifications on your device
                        </span>
                      </Label>
                      <Switch 
                        id="push-notifications-2" 
                        checked={pushNotifications} 
                        onCheckedChange={setPushNotifications} 
                      />
                    </div>
                    <Button onClick={handleSaveNotifications}>Save Changes</Button>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-tinder-rose" />
              <h3 className="font-medium">Privacy</h3>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="edit">
                  <Pencil size={16} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Privacy Settings</SheetTitle>
                  <SheetDescription>
                    Control your privacy and data sharing preferences
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[85vh] pr-4 mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="location-sharing" className="flex flex-col space-y-1">
                        <span>Location Sharing</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Allow sharing your approximate location
                        </span>
                      </Label>
                      <Switch 
                        id="location-sharing" 
                        checked={locationSharing} 
                        onCheckedChange={setLocationSharing} 
                      />
                    </div>
                    <Button onClick={handleSavePrivacy}>Save Changes</Button>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Control your privacy settings</p>
          <div className="flex items-center justify-between">
            <span>Location sharing and data usage</span>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings size={14} />
                  Edit
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Privacy Settings</SheetTitle>
                  <SheetDescription>
                    Control your privacy and data sharing preferences
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[85vh] pr-4 mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="location-sharing-2" className="flex flex-col space-y-1">
                        <span>Location Sharing</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          Allow sharing your approximate location
                        </span>
                      </Label>
                      <Switch 
                        id="location-sharing-2" 
                        checked={locationSharing} 
                        onCheckedChange={setLocationSharing} 
                      />
                    </div>
                    <Button onClick={handleSavePrivacy}>Save Changes</Button>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <KeyRound size={18} className="text-tinder-rose" />
              <h3 className="font-medium">Change Password</h3>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="edit">
                  <Pencil size={16} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Change Password</SheetTitle>
                  <SheetDescription>
                    Update your account password
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <input 
                        id="current-password" 
                        type="password" 
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter current password" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <input 
                        id="new-password" 
                        type="password" 
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter new password" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <input 
                        id="confirm-password" 
                        type="password" 
                        className="w-full p-2 border rounded-md"
                        placeholder="Confirm new password" 
                      />
                    </div>
                  </div>
                  <Button onClick={handleChangePassword} className="w-full">Change Password</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Update your account password</p>
          <div className="flex items-center justify-between">
            <span>Password and security</span>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleChangePassword}>
              <Settings size={14} />
              Edit
            </Button>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 border-destructive/20 bg-destructive/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trash2 size={18} className="text-destructive" />
              <h3 className="font-medium text-destructive">Danger Zone</h3>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="edit" className="text-destructive">
                  <Pencil size={16} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="text-destructive">Danger Zone</SheetTitle>
                  <SheetDescription>
                    Permanent actions that cannot be undone
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div className="p-4 border border-destructive/30 rounded-md bg-destructive/10">
                    <h4 className="font-medium mb-2">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      This action cannot be undone. All of your data will be permanently removed.
                    </p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="delete-confirm">Type "DELETE" to confirm</Label>
                        <input 
                          id="delete-confirm" 
                          type="text" 
                          className="w-full p-2 border rounded-md"
                          placeholder="Type DELETE to confirm" 
                        />
                      </div>
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={handleDeleteAccount}
                      >
                        Permanently Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Permanent actions for your account</p>
          <div className="flex items-center justify-between">
            <span>Delete account</span>
            <Button 
              variant="destructive" 
              size="sm" 
              className="gap-2"
              onClick={handleDeleteAccount}
            >
              <Trash2 size={14} />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
