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
import { TravelModeSettings } from '@/components/settings/TravelModeSettings';
import ChangePasswordDialog from './dialogs/ChangePasswordDialog';
import ConnectedAccountsDialog from './dialogs/ConnectedAccountsDialog';
import DeleteAccountDialog from './dialogs/DeleteAccountDialog';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useVideoVerification } from '@/hooks/useVideoVerification';
import { VideoVerificationDialog } from '@/components/verification/VideoVerificationDialog';
import { useTranslations } from '@/hooks/useTranslations';

const AccountSettings = () => {
  const navigate = useNavigate();
  const { signOut } = useSupabaseAuth();
  const { settings, loading, updateSettings } = useUserSettings();
  const { verification, isLoading: verificationLoading, fetchVerification, getVerificationStatus } = useVideoVerification();
  const [isVideoVerificationOpen, setIsVideoVerificationOpen] = useState(false);
  const { t } = useTranslations();

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
      toast.success(t('settings.logged_out', 'Logged out successfully'));
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(t('settings.logout_failed', 'Failed to log out. Please try again.'));
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
                <p className="text-white font-medium">{t('settings.premium_subscription', 'Premium Subscription')}</p>
                <p className="text-purple-200 text-sm">{t('settings.unlock_premium', 'Unlock all premium features')}</p>
              </div>
            </div>
            <Button onClick={() => navigate('/subscription')} className="bg-gradient-to-r from-tinder-rose to-tinder-orange hover:opacity-90">
              {t('settings.manage_plan', 'Manage Plan')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">{t('settings.account_status', 'Account Status')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{t('settings.verified_account', 'Verified Account')}</p>
                <p className="text-purple-200 text-sm">{t('settings.email_verified', 'Email verified')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{t('settings.premium_member', 'Premium Member')}</p>
                <p className="text-purple-200 text-sm">{t('settings.active_subscription', 'Active subscription')}</p>
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
                <p className="text-white font-medium">{t('settings.video_verification', 'Video Verification')}</p>
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
                  {t('settings.verify_now', 'Verify Now')}
                </Button>
              )}
              {verificationStatus.status === 'Pending' && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                  {t('settings.under_review', 'Under Review')}
                </Badge>
              )}
              {verificationStatus.status === 'Verified' && (
                <Badge variant="outline" className="border-green-500 text-green-400">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  {t('settings.verified', 'Verified')}
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
            {t('settings.language_settings', 'Language Settings')}
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">{t('settings.app_language', 'App Language')}</p>
              <p className="text-purple-200 text-sm">{t('settings.choose_language', 'Choose your preferred language')}</p>
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
            {t('settings.notification_settings', 'Notification Settings')}
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-pink-400" />
                <div>
                  <p className="text-white">{t('settings.new_matches', 'New Matches')}</p>
                  <p className="text-purple-200 text-sm">{t('settings.new_matches_desc', 'Get notified when someone likes you back')}</p>
                </div>
              </div>
              <Switch checked={settings?.notifications_matches ?? true} onCheckedChange={value => handleNotificationChange('notifications_matches', value)} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white">{t('settings.new_messages', 'New Messages')}</p>
                  <p className="text-purple-200 text-sm">{t('settings.new_messages_desc', 'Get notified about new messages')}</p>
                </div>
              </div>
              <Switch checked={settings?.notifications_messages ?? true} onCheckedChange={value => handleNotificationChange('notifications_messages', value)} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-white">{t('settings.likes_received', 'Likes Received')}</p>
                  <p className="text-purple-200 text-sm">{t('settings.likes_received_desc', 'Get notified when someone likes your profile')}</p>
                </div>
              </div>
              <Switch checked={settings?.notifications_likes ?? false} onCheckedChange={value => handleNotificationChange('notifications_likes', value)} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white">{t('settings.profile_views', 'Profile Views')}</p>
                  <p className="text-purple-200 text-sm">{t('settings.profile_views_desc', 'Get notified when someone views your profile')}</p>
                </div>
              </div>
              <Switch checked={settings?.notifications_profile_views ?? true} onCheckedChange={value => handleNotificationChange('notifications_profile_views', value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travel Mode */}
      <TravelModeSettings />

      {/* Privacy Settings */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2 text-purple-400" />
            {t('settings.privacy_settings', 'Privacy Settings')}
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">{t('settings.show_age', 'Show My Age')}</p>
                <p className="text-purple-200 text-sm">{t('settings.show_age_desc', 'Display your age on your profile')}</p>
              </div>
              <Switch checked={settings?.privacy_show_age ?? true} onCheckedChange={value => handlePrivacyChange('privacy_show_age', value)} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">{t('settings.show_distance', 'Show Distance')}</p>
                <p className="text-purple-200 text-sm">{t('settings.show_distance_desc', 'Show your distance to other users')}</p>
              </div>
              <Switch checked={settings?.privacy_show_distance ?? true} onCheckedChange={value => handlePrivacyChange('privacy_show_distance', value)} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">{t('settings.show_online', 'Show Online Status')}</p>
                <p className="text-purple-200 text-sm">{t('settings.show_online_desc', 'Let others see when you\'re online')}</p>
              </div>
              <Switch checked={settings?.privacy_show_online ?? true} onCheckedChange={value => handlePrivacyChange('privacy_show_online', value)} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">{t('settings.discoverable', 'Discoverable')}</p>
                <p className="text-purple-200 text-sm">{t('settings.discoverable_desc', 'Allow others to find your profile')}</p>
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
            {t('settings.communication', 'Communication Preferences')}
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white">{t('settings.push_notifications', 'Push Notifications')}</p>
                  <p className="text-purple-200 text-sm">{t('settings.push_desc', 'Receive notifications on your device')}</p>
                </div>
              </div>
              <Switch checked={settings?.notifications_push ?? true} onCheckedChange={value => handleNotificationChange('notifications_push', value)} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white">{t('settings.email_notifications', 'Email Notifications')}</p>
                  <p className="text-purple-200 text-sm">{t('settings.email_desc', 'Receive updates via email')}</p>
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
            {t('settings.account_actions', 'Account Actions')}
          </h3>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => openDialog('downloadData')}>
              <Download className="w-4 h-4 mr-2" />
              {t('settings.download_data', 'Download My Data')}
            </Button>
            
            <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => openDialog('changePassword')}>
              <Lock className="w-4 h-4 mr-2" />
              {t('settings.change_password', 'Change Password')}
            </Button>
            
            <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => openDialog('connectedAccounts')}>
              <Globe className="w-4 h-4 mr-2" />
              {t('settings.connected_accounts', 'Connected Accounts')}
            </Button>
            
            <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => navigate('/settings/phone-verification')}>
              <Phone className="w-4 h-4 mr-2" />
              {t('settings.phone_verification', 'Phone Verification')}
            </Button>
            
            <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => navigate('/help')}>
              <HelpCircle className="w-4 h-4 mr-2" />
              {t('settings.help_support', 'Help & Support')}
            </Button>
            
            <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => navigate('/community-guidelines')}>
              <FileText className="w-4 h-4 mr-2" />
              {t('settings.community_guidelines', 'Community Guidelines')}
            </Button>
            
            <Button variant="outline" className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              {t('settings.logout', 'Logout')}
            </Button>
            
            <Button variant="destructive" className="w-full justify-start" onClick={() => openDialog('deleteAccount')}>
              <Trash2 className="w-4 h-4 mr-2" />
              {t('settings.delete_account', 'Delete Account')}
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
          if (!open) fetchVerification();
        }}
      />
    </div>;
};

export default AccountSettings;
