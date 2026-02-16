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

  useEffect(() => { fetchVerification(); }, []);

  const verificationStatus = getVerificationStatus();

  const [dialogStates, setDialogStates] = useState({
    downloadData: false, changePassword: false, connectedAccounts: false, deleteAccount: false
  });

  const handleNotificationChange = async (key: string, value: boolean) => {
    await updateSettings({ [key]: value } as any);
  };
  const handlePrivacyChange = async (key: string, value: boolean) => {
    await updateSettings({ [key]: value } as any);
  };
  const openDialog = (dialogName: keyof typeof dialogStates) => {
    setDialogStates(prev => ({ ...prev, [dialogName]: true }));
  };
  const closeDialog = (dialogName: keyof typeof dialogStates) => {
    setDialogStates(prev => ({ ...prev, [dialogName]: false }));
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
    <Card className="backdrop-blur-md bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-foreground font-medium">{t('settings.premium_subscription', 'Premium Subscription')}</p>
              <p className="text-muted-foreground text-sm">{t('settings.unlock_premium', 'Unlock all premium features')}</p>
            </div>
          </div>
          <Button onClick={() => navigate('/subscription')} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            {t('settings.manage_plan', 'Manage Plan')}
          </Button>
        </div>
      </CardContent>
    </Card>

    {/* Account Status */}
    <Card className="backdrop-blur-md bg-card border border-border">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">{t('settings.account_status', 'Account Status')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-foreground font-medium">{t('settings.verified_account', 'Verified Account')}</p>
              <p className="text-muted-foreground text-sm">{t('settings.email_verified', 'Email verified')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-foreground font-medium">{t('settings.premium_member', 'Premium Member')}</p>
              <p className="text-muted-foreground text-sm">{t('settings.active_subscription', 'Active subscription')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              verificationStatus.status === 'Verified' ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
              : verificationStatus.status === 'Pending' ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
              : 'bg-gradient-to-r from-gray-500 to-gray-600'
            }`}>
              {verificationStatus.status === 'Verified' ? <ShieldCheck className="w-5 h-5 text-primary-foreground" /> 
               : verificationStatus.status === 'Pending' ? <Clock className="w-5 h-5 text-primary-foreground" /> 
               : <Video className="w-5 h-5 text-primary-foreground" />}
            </div>
            <div>
              <p className="text-foreground font-medium">{t('settings.video_verification', 'Video Verification')}</p>
              <p className={`text-sm ${verificationStatus.color}`}>{verificationStatus.message}</p>
            </div>
          </div>
          <div className="flex items-center">
            {verificationStatus.status !== 'Verified' && verificationStatus.status !== 'Pending' && (
              <Button onClick={() => setIsVideoVerificationOpen(true)} className="bg-gradient-to-r from-primary to-accent hover:opacity-90" size="sm">
                <Video className="w-4 h-4 mr-2" />{t('settings.verify_now', 'Verify Now')}
              </Button>
            )}
            {verificationStatus.status === 'Pending' && (
              <Badge variant="outline" className="border-yellow-500 text-yellow-400">{t('settings.under_review', 'Under Review')}</Badge>
            )}
            {verificationStatus.status === 'Verified' && (
              <Badge variant="outline" className="border-green-500 text-green-400"><ShieldCheck className="w-3 h-3 mr-1" />{t('settings.verified', 'Verified')}</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Language Settings */}
    <Card className="backdrop-blur-md bg-card border border-border">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-primary" />{t('settings.language_settings', 'Language Settings')}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-foreground">{t('settings.app_language', 'App Language')}</p>
            <p className="text-muted-foreground text-sm">{t('settings.choose_language', 'Choose your preferred language')}</p>
          </div>
          <LanguageSwitcher />
        </div>
      </CardContent>
    </Card>

    {/* Notification Settings */}
    <Card className="backdrop-blur-md bg-card border border-border">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-primary" />{t('settings.notification_settings', 'Notification Settings')}
        </h3>
        <div className="space-y-4">
          {[
            { icon: Heart, color: 'text-pink-400', key: 'notifications_matches', label: t('settings.new_matches', 'New Matches'), desc: t('settings.new_matches_desc', 'Get notified when someone likes you back'), default: true },
            { icon: MessageCircle, color: 'text-blue-400', key: 'notifications_messages', label: t('settings.new_messages', 'New Messages'), desc: t('settings.new_messages_desc', 'Get notified about new messages'), default: true },
            { icon: Heart, color: 'text-red-400', key: 'notifications_likes', label: t('settings.likes_received', 'Likes Received'), desc: t('settings.likes_received_desc', 'Get notified when someone likes your profile'), default: false },
            { icon: Eye, color: 'text-green-400', key: 'notifications_profile_views', label: t('settings.profile_views', 'Profile Views'), desc: t('settings.profile_views_desc', 'Get notified when someone views your profile'), default: true },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <div>
                  <p className="text-foreground">{item.label}</p>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </div>
              <Switch checked={settings?.[item.key] ?? item.default} onCheckedChange={value => handleNotificationChange(item.key, value)} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <TravelModeSettings />

    {/* Privacy Settings */}
    <Card className="backdrop-blur-md bg-card border border-border">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-primary" />{t('settings.privacy_settings', 'Privacy Settings')}
        </h3>
        <div className="space-y-4">
          {[
            { key: 'privacy_show_age', label: t('settings.show_age', 'Show My Age'), desc: t('settings.show_age_desc', 'Display your age on your profile'), default: true },
            { key: 'privacy_show_distance', label: t('settings.show_distance', 'Show Distance'), desc: t('settings.show_distance_desc', 'Show your distance to other users'), default: true },
            { key: 'privacy_show_online', label: t('settings.show_online', 'Show Online Status'), desc: t('settings.show_online_desc', "Let others see when you're online"), default: true },
            { key: 'privacy_discoverable', label: t('settings.discoverable', 'Discoverable'), desc: t('settings.discoverable_desc', 'Allow others to find your profile'), default: true },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-foreground">{item.label}</p>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
              <Switch checked={settings?.[item.key] ?? item.default} onCheckedChange={value => handlePrivacyChange(item.key, value)} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Communication Preferences */}
    <Card className="backdrop-blur-md bg-card border border-border">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Smartphone className="w-5 h-5 mr-2 text-primary" />{t('settings.communication', 'Communication Preferences')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-foreground">{t('settings.push_notifications', 'Push Notifications')}</p>
                <p className="text-muted-foreground text-sm">{t('settings.push_desc', 'Receive notifications on your device')}</p>
              </div>
            </div>
            <Switch checked={settings?.notifications_push ?? true} onCheckedChange={value => handleNotificationChange('notifications_push', value)} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-foreground">{t('settings.email_notifications', 'Email Notifications')}</p>
                <p className="text-muted-foreground text-sm">{t('settings.email_desc', 'Receive updates via email')}</p>
              </div>
            </div>
            <Switch checked={settings?.notifications_email ?? true} onCheckedChange={value => handleNotificationChange('notifications_email', value)} />
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Account Actions */}
    <Card className="backdrop-blur-md bg-card border border-border">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-primary" />{t('settings.account_actions', 'Account Actions')}
        </h3>
        <div className="space-y-3">
          {[
            { icon: Download, label: t('settings.download_data', 'Download My Data'), action: () => openDialog('downloadData') },
            { icon: Lock, label: t('settings.change_password', 'Change Password'), action: () => openDialog('changePassword') },
            { icon: Globe, label: t('settings.connected_accounts', 'Connected Accounts'), action: () => openDialog('connectedAccounts') },
            { icon: Phone, label: t('settings.phone_verification', 'Phone Verification'), action: () => navigate('/settings/phone-verification') },
            { icon: HelpCircle, label: t('settings.help_support', 'Help & Support'), action: () => navigate('/help') },
            { icon: FileText, label: t('settings.community_guidelines', 'Community Guidelines'), action: () => navigate('/community-guidelines') },
          ].map(item => (
            <Button key={item.label} variant="outline" className="w-full justify-start border-border text-foreground hover:bg-muted" onClick={item.action}>
              <item.icon className="w-4 h-4 mr-2" />{item.label}
            </Button>
          ))}
          <Button variant="outline" className="w-full justify-start border-border text-foreground hover:bg-muted" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />{t('settings.logout', 'Logout')}
          </Button>
          <Button variant="destructive" className="w-full justify-start" onClick={() => openDialog('deleteAccount')}>
            <Trash2 className="w-4 h-4 mr-2" />{t('settings.delete_account', 'Delete Account')}
          </Button>
        </div>
      </CardContent>
    </Card>

    <DownloadDataDialog open={dialogStates.downloadData} onOpenChange={() => closeDialog('downloadData')} />
    <ChangePasswordDialog open={dialogStates.changePassword} onOpenChange={() => closeDialog('changePassword')} />
    <ConnectedAccountsDialog open={dialogStates.connectedAccounts} onOpenChange={() => closeDialog('connectedAccounts')} />
    <DeleteAccountDialog open={dialogStates.deleteAccount} onOpenChange={() => closeDialog('deleteAccount')} />
    <VideoVerificationDialog open={isVideoVerificationOpen} onOpenChange={(open) => { setIsVideoVerificationOpen(open); if (!open) fetchVerification(); }} />
  </div>;
};

export default AccountSettings;
