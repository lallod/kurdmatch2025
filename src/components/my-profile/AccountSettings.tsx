import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Shield, Bell, Eye, Heart, MessageCircle, Users, Lock, Smartphone, Mail, Globe, Download, Trash2, Settings, CheckCircle2, AlertTriangle, LogOut, Crown, Phone, HelpCircle, FileText, Video, ShieldCheck, Clock } from 'lucide-react';
import { toast } from 'sonner';
import DownloadDataDialog from './dialogs/DownloadDataDialog';
import ChangePasswordDialog from './dialogs/ChangePasswordDialog';
import ConnectedAccountsDialog from './dialogs/ConnectedAccountsDialog';
import DeleteAccountDialog from './dialogs/DeleteAccountDialog';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useVideoVerification } from '@/hooks/useVideoVerification';
import { VideoVerificationDialog } from '@/components/verification/VideoVerificationDialog';

const AccountSettings = () => {
  const navigate = useNavigate();
  const { signOut } = useSupabaseAuth();
  const { settings, loading, updateSettings } = useUserSettings();
  const { verification, isLoading: verificationLoading, fetchVerification, getVerificationStatus } = useVideoVerification();
  const [isVideoVerificationOpen, setIsVideoVerificationOpen] = useState(false);

  // Fetch verification status on mount
  useEffect(() => {
    fetchVerification();
  }, []);

  const verificationStatus = getVerificationStatus();

  // Dialog states
  const [dialogStates, setDialogStates] = useState({
    downloadData: false,
    changePassword: false,
    connectedAccounts: false,
    deleteAccount: false
  });

  const handleNotificationChange = async (key: string, value: boolean) => {
    await updateSettings({ [key]: value } as any);
  };

  const handlePrivacyChange = async (key: string, value: boolean) => {
    await updateSettings({ [key]: value } as any);
  };
  const openDialog = (dialogName: keyof typeof dialogStates) => {
    setDialogStates(prev => ({
      ...prev,
      [dialogName]: true
    }));
  };
  const closeDialog = (dialogName: keyof typeof dialogStates) => {
    setDialogStates(prev => ({
      ...prev,
      [dialogName]: false
    }));
  };
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };
  return <div className="space-y-6">
      {/* Subscription Management */}
      <Card className="backdrop-blur-md bg-gradient-to-r from-tinder-rose/20 to-tinder-orange/20 border border-primary/20 bg-[#53073c]">
        <CardContent className="p-6 bg-[#53073c]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-tinder-rose to-tinder-orange rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Premium Subscription</p>
                <p className="text-purple-200 text-sm">Unlock all premium features</p>
              </div>
            </div>
            <Button onClick={() => navigate('/subscription')} className="bg-gradient-to-r from-tinder-rose to-tinder-orange hover:opacity-90">
              Manage Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Account Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            
            {/* Video Verification Status */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                verificationStatus.status === 'Verified' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : verificationStatus.status === 'Pending'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : 'bg-gradient-to-r from-gray-500 to-gray-600'
              }`}>
                {verificationStatus.status === 'Verified' ? (
                  <ShieldCheck className="w-5 h-5 text-white" />
                ) : verificationStatus.status === 'Pending' ? (
                  <Clock className="w-5 h-5 text-white" />
                ) : (
                  <Video className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p className="text-white font-medium">Video Verification</p>
                <p className={`text-sm ${verificationStatus.color}`}>{verificationStatus.message}</p>
              </div>
            </div>

            {/* Action Button for Video Verification */}
            <div className="flex items-center">
              {verificationStatus.status !== 'Verified' && verificationStatus.status !== 'Pending' && (
                <Button 
                  onClick={() => setIsVideoVerificationOpen(true)}
                  className="bg-gradient-to-r from-tinder-rose to-tinder-orange hover:opacity-90"
                  size="sm"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Verify Now
                </Button>
              )}
              {verificationStatus.status === 'Pending' && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                  Under Review
                </Badge>
              )}
              {verificationStatus.status === 'Verified' && (
                <Badge variant="outline" className="border-green-500 text-green-400">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-purple-400" />
            Language Settings
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">App Language</p>
              <p className="text-purple-200 text-sm">Choose your preferred language</p>
            </div>
            <LanguageSwitcher />
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
              <Switch checked={settings?.notifications_matches ?? true} onCheckedChange={value => handleNotificationChange('notifications_matches', value)} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white">New Messages</p>
                  <p className="text-purple-200 text-sm">Get notified about new messages</p>
                </div>
              </div>
              <Switch checked={settings?.notifications_messages ?? true} onCheckedChange={value => handleNotificationChange('notifications_messages', value)} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-white">Likes Received</p>
                  <p className="text-purple-200 text-sm">Get notified when someone likes your profile</p>
                </div>
              </div>
              <Switch checked={settings?.notifications_likes ?? false} onCheckedChange={value => handleNotificationChange('notifications_likes', value)} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white">Profile Views</p>
                  <p className="text-purple-200 text-sm">Get notified when someone views your profile</p>
                </div>
              </div>
              <Switch checked={settings?.notifications_profile_views ?? true} onCheckedChange={value => handleNotificationChange('notifications_profile_views', value)} />
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
              <Switch checked={settings?.privacy_show_age ?? true} onCheckedChange={value => handlePrivacyChange('privacy_show_age', value)} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Show Distance</p>
                <p className="text-purple-200 text-sm">Show your distance to other users</p>
              </div>
              <Switch checked={settings?.privacy_show_distance ?? true} onCheckedChange={value => handlePrivacyChange('privacy_show_distance', value)} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Show Online Status</p>
                <p className="text-purple-200 text-sm">Let others see when you're online</p>
              </div>
              <Switch checked={settings?.privacy_show_online ?? true} onCheckedChange={value => handlePrivacyChange('privacy_show_online', value)} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Discoverable</p>
                <p className="text-purple-200 text-sm">Allow others to find your profile</p>
              </div>
              <Switch checked={settings?.privacy_discoverable ?? true} onCheckedChange={value => handlePrivacyChange('privacy_discoverable', value)} />
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
              <Switch checked={settings?.notifications_push ?? true} onCheckedChange={value => handleNotificationChange('notifications_push', value)} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white">Email Notifications</p>
                  <p className="text-purple-200 text-sm">Receive updates via email</p>
                </div>
              </div>
              <Switch checked={settings?.notifications_email ?? true} onCheckedChange={value => handleNotificationChange('notifications_email', value)} />
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
            <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => openDialog('downloadData')}>
              <Download className="w-4 h-4 mr-2" />
              Download My Data
            </Button>
            
            <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => openDialog('changePassword')}>
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            
            <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => openDialog('connectedAccounts')}>
              <Globe className="w-4 h-4 mr-2" />
              Connected Accounts
            </Button>
            
            <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => navigate('/settings/phone-verification')}>
              <Phone className="w-4 h-4 mr-2" />
              Phone Verification
            </Button>
            
            <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => navigate('/help')}>
              <HelpCircle className="w-4 h-4 mr-2" />
              Help & Support
            </Button>
            
            <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => navigate('/community-guidelines')}>
              <FileText className="w-4 h-4 mr-2" />
              Community Guidelines
            </Button>
            
            <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            
            <Button variant="destructive" className="w-full justify-start" onClick={() => openDialog('deleteAccount')}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <DownloadDataDialog open={dialogStates.downloadData} onOpenChange={() => closeDialog('downloadData')} />
      
      <ChangePasswordDialog open={dialogStates.changePassword} onOpenChange={() => closeDialog('changePassword')} />
      
      <ConnectedAccountsDialog open={dialogStates.connectedAccounts} onOpenChange={() => closeDialog('connectedAccounts')} />
      
      <DeleteAccountDialog open={dialogStates.deleteAccount} onOpenChange={() => closeDialog('deleteAccount')} />

      {/* Video Verification Dialog */}
      <VideoVerificationDialog 
        open={isVideoVerificationOpen} 
        onOpenChange={(open) => {
          setIsVideoVerificationOpen(open);
          if (!open) {
            // Refresh verification status when dialog closes
            fetchVerification();
          }
        }} 
      />
    </div>;
};
export default AccountSettings;