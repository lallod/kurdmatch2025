
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Bell, 
  Eye, 
  Heart, 
  MessageCircle, 
  Users, 
  Lock, 
  Smartphone,
  Mail,
  Globe,
  Download,
  Trash2,
  Settings,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

const AccountSettings = () => {
  const [notifications, setNotifications] = useState({
    matches: true,
    messages: true,
    likes: false,
    profileViews: true,
    marketing: false,
    push: true,
    email: true,
    sms: false
  });

  const [privacy, setPrivacy] = useState({
    showAge: true,
    showDistance: true,
    showOnline: true,
    discoverable: true,
    readReceipts: false
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success('Notification settings updated');
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    toast.success('Privacy settings updated');
  };

  return (
    <div className="space-y-6">
      {/* Account Status */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Account Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Verified Account</p>
                <p className="text-purple-200 text-sm">Email verified</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Premium Member</p>
                <p className="text-purple-200 text-sm">Active subscription</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Photo Verification</p>
                <p className="text-purple-200 text-sm">Pending review</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-purple-400" />
            Notification Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-pink-400" />
                <div>
                  <p className="text-white">New Matches</p>
                  <p className="text-purple-200 text-sm">Get notified when someone likes you back</p>
                </div>
              </div>
              <Switch 
                checked={notifications.matches}
                onCheckedChange={(value) => handleNotificationChange('matches', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white">New Messages</p>
                  <p className="text-purple-200 text-sm">Get notified about new messages</p>
                </div>
              </div>
              <Switch 
                checked={notifications.messages}
                onCheckedChange={(value) => handleNotificationChange('messages', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-white">Likes Received</p>
                  <p className="text-purple-200 text-sm">Get notified when someone likes your profile</p>
                </div>
              </div>
              <Switch 
                checked={notifications.likes}
                onCheckedChange={(value) => handleNotificationChange('likes', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white">Profile Views</p>
                  <p className="text-purple-200 text-sm">Get notified when someone views your profile</p>
                </div>
              </div>
              <Switch 
                checked={notifications.profileViews}
                onCheckedChange={(value) => handleNotificationChange('profileViews', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-purple-400" />
            Privacy Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Show My Age</p>
                <p className="text-purple-200 text-sm">Display your age on your profile</p>
              </div>
              <Switch 
                checked={privacy.showAge}
                onCheckedChange={(value) => handlePrivacyChange('showAge', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Show Distance</p>
                <p className="text-purple-200 text-sm">Show your distance to other users</p>
              </div>
              <Switch 
                checked={privacy.showDistance}
                onCheckedChange={(value) => handlePrivacyChange('showDistance', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Show Online Status</p>
                <p className="text-purple-200 text-sm">Let others see when you're online</p>
              </div>
              <Switch 
                checked={privacy.showOnline}
                onCheckedChange={(value) => handlePrivacyChange('showOnline', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Discoverable</p>
                <p className="text-purple-200 text-sm">Allow others to find your profile</p>
              </div>
              <Switch 
                checked={privacy.discoverable}
                onCheckedChange={(value) => handlePrivacyChange('discoverable', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Preferences */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Smartphone className="w-5 h-5 mr-2 text-purple-400" />
            Communication Preferences
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white">Push Notifications</p>
                  <p className="text-purple-200 text-sm">Receive notifications on your device</p>
                </div>
              </div>
              <Switch 
                checked={notifications.push}
                onCheckedChange={(value) => handleNotificationChange('push', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white">Email Notifications</p>
                  <p className="text-purple-200 text-sm">Receive updates via email</p>
                </div>
              </div>
              <Switch 
                checked={notifications.email}
                onCheckedChange={(value) => handleNotificationChange('email', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-purple-400" />
            Account Actions
          </h3>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Download My Data
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Globe className="w-4 h-4 mr-2" />
              Connected Accounts
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full justify-start"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
