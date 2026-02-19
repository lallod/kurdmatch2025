import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Mail, SaveIcon, RefreshCw, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { useTranslations } from '@/hooks/useTranslations';

const SettingsPage = () => {
  const { t } = useTranslations();
  const { settings, isLoading, getSetting, updateSetting, updateMultipleSettings, resetToDefaults } = useAdminSettings();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    if (settings) {
      const settingsMap: Record<string, any> = {};
      settings.forEach(setting => { settingsMap[setting.setting_key] = setting.setting_value; });
      setLocalSettings(settingsMap);
    }
  }, [settings]);

  const handleSettingChange = (key: string, value: any) => { setLocalSettings(prev => ({ ...prev, [key]: value })); };

  const saveAllSettings = () => {
    const updates = Object.entries(localSettings).map(([key, value]) => ({ key, value }));
    updateMultipleSettings.mutate(updates);
  };

  const handleResetConfirm = () => { resetToDefaults.mutate(); setIsResetConfirmOpen(false); };

  if (isLoading) {
    return (<div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">{t('admin.system_settings', 'System Settings')}</h1>
        <div className="flex gap-2">
          <Dialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/5" disabled={resetToDefaults.isPending}>
                <RefreshCw size={16} className={resetToDefaults.isPending ? 'animate-spin' : ''} />
                {t('admin.reset_to_defaults', 'Reset to Defaults')}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#141414] border-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">{t('admin.reset_settings', 'Reset Settings')}</DialogTitle>
                <DialogDescription className="text-white/60">{t('admin.reset_settings_desc', 'This will reset all settings to their default values. This action cannot be undone.')}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsResetConfirmOpen(false)} className="border-white/10 text-white hover:bg-white/5">{t('admin.cancel', 'Cancel')}</Button>
                <Button variant="destructive" onClick={handleResetConfirm} disabled={resetToDefaults.isPending}>
                  {resetToDefaults.isPending ? t('admin.resetting', 'Resetting...') : t('admin.reset_all_settings', 'Reset All Settings')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button className="gap-2" onClick={saveAllSettings} disabled={updateMultipleSettings.isPending}>
            <SaveIcon size={16} />
            {updateMultipleSettings.isPending ? t('admin.saving', 'Saving...') : t('admin.save_settings', 'Save Settings')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-4 w-full max-w-[600px]">
          <TabsTrigger value="general">{t('admin.general', 'General')}</TabsTrigger>
          <TabsTrigger value="email">{t('admin.email', 'Email')}</TabsTrigger>
          <TabsTrigger value="security">{t('admin.security', 'Security')}</TabsTrigger>
          <TabsTrigger value="api">{t('admin.api', 'API')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card className="bg-[#141414] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">{t('admin.system_status', 'System Status')}</CardTitle>
                <CardDescription className="text-white/60">{t('admin.system_status_desc', 'Control the overall behavior of the application')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance-mode" className="text-white">{t('admin.maintenance_mode', 'Maintenance Mode')}</Label>
                    <p className="text-sm text-white/60">{t('admin.maintenance_mode_desc', 'When enabled, only admins can access the site')}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {localSettings.maintenance_mode?.enabled && (
                      <Badge variant="outline" className="text-yellow-400 border-yellow-500/30 bg-yellow-500/10">
                        <AlertTriangle size={12} className="mr-1" />{t('admin.enabled', 'Enabled')}
                      </Badge>
                    )}
                    <Switch id="maintenance-mode" checked={localSettings.maintenance_mode?.enabled || false} onCheckedChange={(checked) => handleSettingChange('maintenance_mode', { enabled: checked })} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="user-registration" className="text-white">{t('admin.user_registration', 'User Registration')}</Label>
                    <p className="text-sm text-white/60">{t('admin.allow_registration', 'Allow new users to register')}</p>
                  </div>
                  <Switch id="user-registration" checked={localSettings.user_registration?.enabled || false} onCheckedChange={(checked) => handleSettingChange('user_registration', { enabled: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="photo-uploads" className="text-white">{t('admin.photo_uploads', 'Photo Uploads')}</Label>
                    <p className="text-sm text-white/60">{t('admin.allow_photo_uploads', 'Allow users to upload new photos')}</p>
                  </div>
                  <Switch id="photo-uploads" checked={localSettings.photo_uploads?.enabled || false} onCheckedChange={(checked) => handleSettingChange('photo_uploads', { enabled: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="message-system" className="text-white">{t('admin.messaging_system', 'Messaging System')}</Label>
                    <p className="text-sm text-white/60">{t('admin.enable_messaging', 'Enable messaging between users')}</p>
                  </div>
                  <Switch id="message-system" checked={localSettings.message_system?.enabled || false} onCheckedChange={(checked) => handleSettingChange('message_system', { enabled: checked })} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#141414] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">{t('admin.app_configuration', 'App Configuration')}</CardTitle>
                <CardDescription className="text-white/60">{t('admin.app_config_desc', 'Basic application settings')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="app-name" className="text-white">{t('admin.application_name', 'Application Name')}</Label>
                  <Input id="app-name" value={localSettings.app_name?.value || ''} onChange={(e) => handleSettingChange('app_name', { value: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="support-email" className="text-white">{t('admin.support_email', 'Support Email')}</Label>
                  <Input id="support-email" type="email" value={localSettings.support_email?.value || ''} onChange={(e) => handleSettingChange('support_email', { value: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date-format" className="text-white">{t('admin.date_format', 'Date Format')}</Label>
                  <Select defaultValue="mm/dd/yyyy">
                    <SelectTrigger id="date-format" className="bg-white/5 border-white/10 text-white"><SelectValue placeholder={t('admin.date_format', 'Select date format')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy/mm/dd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone" className="text-white">{t('admin.default_timezone', 'Default Timezone')}</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger id="timezone" className="bg-white/5 border-white/10 text-white"><SelectValue placeholder={t('admin.default_timezone', 'Select timezone')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="email">
          <div className="grid gap-6">
            <Card className="bg-[#141414] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">{t('admin.email_configuration', 'Email Configuration')}</CardTitle>
                <CardDescription className="text-white/60">{t('admin.email_config_desc', 'Configure your email server settings')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-host" className="text-white">{t('admin.smtp_host', 'SMTP Host')}</Label>
                    <Input id="smtp-host" value={localSettings.smtp_host?.value || ''} onChange={(e) => handleSettingChange('smtp_host', { value: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-port" className="text-white">{t('admin.smtp_port', 'SMTP Port')}</Label>
                    <Input id="smtp-port" value={localSettings.smtp_port?.value || ''} onChange={(e) => handleSettingChange('smtp_port', { value: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-username" className="text-white">{t('admin.smtp_username', 'SMTP Username')}</Label>
                    <Input id="smtp-username" value={localSettings.smtp_username?.value || ''} onChange={(e) => handleSettingChange('smtp_username', { value: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-password" className="text-white">{t('admin.smtp_password', 'SMTP Password')}</Label>
                    <Input id="smtp-password" type="password" placeholder="••••••••••••" value={localSettings.smtp_password?.value || ''} onChange={(e) => handleSettingChange('smtp_password', { value: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="from-email" className="text-white">{t('admin.from_email', 'From Email Address')}</Label>
                  <Input id="from-email" value={localSettings.from_email?.value || ''} onChange={(e) => handleSettingChange('from_email', { value: e.target.value })} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="smtp-encryption" defaultChecked />
                  <Label htmlFor="smtp-encryption" className="text-white">{t('admin.use_ssl_tls', 'Use SSL/TLS Encryption')}</Label>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/5">
                    <Mail size={16} />{t('admin.test_email_config', 'Test Email Configuration')}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#141414] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">{t('admin.notification_preferences', 'Notification Preferences')}</CardTitle>
                <CardDescription className="text-white/60">{t('admin.notification_pref_desc', 'Configure what system notifications to send')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="daily-digest" className="text-white">{t('admin.daily_digest', 'Daily Digest')}</Label>
                    <p className="text-sm text-white/60">{t('admin.daily_digest_desc', 'Send daily summary of site activity')}</p>
                  </div>
                  <Switch id="daily-digest" checked={localSettings.daily_digest?.enabled || false} onCheckedChange={(checked) => handleSettingChange('daily_digest', { enabled: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-user-notifications" className="text-white">{t('admin.new_user_notifications', 'New User Notifications')}</Label>
                    <p className="text-sm text-white/60">{t('admin.new_user_notif_desc', 'Receive notifications for new registrations')}</p>
                  </div>
                  <Switch id="new-user-notifications" checked={localSettings.new_user_notifications?.enabled || false} onCheckedChange={(checked) => handleSettingChange('new_user_notifications', { enabled: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="report-alerts" className="text-white">{t('admin.report_alerts', 'Report Alerts')}</Label>
                    <p className="text-sm text-white/60">{t('admin.report_alerts_desc', 'Get notified when content is reported')}</p>
                  </div>
                  <Switch id="report-alerts" checked={localSettings.report_alerts?.enabled || false} onCheckedChange={(checked) => handleSettingChange('report_alerts', { enabled: checked })} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card className="bg-[#141414] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">{t('admin.security_controls', 'Security Controls')}</CardTitle>
                <CardDescription className="text-white/60">{t('admin.security_controls_desc', 'Configure security settings for the application')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor-auth" className="text-white">{t('admin.two_factor_auth', 'Two-Factor Authentication')}</Label>
                    <p className="text-sm text-white/60">{t('admin.two_factor_desc', 'Require 2FA for admin accounts')}</p>
                  </div>
                  <Switch id="two-factor-auth" checked={localSettings.two_factor_auth?.enabled || false} onCheckedChange={(checked) => handleSettingChange('two_factor_auth', { enabled: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ip-restriction" className="text-white">{t('admin.ip_restriction', 'IP Restriction')}</Label>
                    <p className="text-sm text-white/60">{t('admin.ip_restriction_desc', 'Limit admin access to specific IP addresses')}</p>
                  </div>
                  <Switch id="ip-restriction" checked={localSettings.ip_restriction?.enabled || false} onCheckedChange={(checked) => handleSettingChange('ip_restriction', { enabled: checked })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-expiry" className="text-white">{t('admin.password_expiry', 'Password Expiry (days)')}</Label>
                  <Input id="password-expiry" value={localSettings.password_expiry?.days || '90'} onChange={(e) => handleSettingChange('password_expiry', { days: parseInt(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="session-timeout" className="text-white">{t('admin.session_timeout', 'Session Timeout (minutes)')}</Label>
                  <Select value={localSettings.session_timeout?.minutes?.toString() || '30'} onValueChange={(value) => handleSettingChange('session_timeout', { minutes: parseInt(value) })}>
                    <SelectTrigger id="session-timeout" className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#141414] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">{t('admin.account_security', 'Account Security')}</CardTitle>
                <CardDescription className="text-white/60">{t('admin.account_security_desc', 'Additional security settings for user accounts')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">{t('admin.min_password_length', 'Minimum Password Length')}</Label>
                    <p className="text-sm text-white/60">{t('admin.min_password_desc', 'Require at least this many characters')}</p>
                  </div>
                  <Select defaultValue="8">
                    <SelectTrigger className="w-[100px] bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">{t('admin.failed_login_attempts', 'Failed Login Attempts')}</Label>
                    <p className="text-sm text-white/60">{t('admin.failed_login_desc', 'Number of attempts before account lockout')}</p>
                  </div>
                  <Select defaultValue="5">
                    <SelectTrigger className="w-[100px] bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">{t('admin.account_lockout', 'Account Lockout Duration')}</Label>
                    <p className="text-sm text-white/60">{t('admin.account_lockout_desc', 'Time before allowing login attempts again')}</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-[100px] bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="1440">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="enforce-complexity" defaultChecked />
                  <Label htmlFor="enforce-complexity" className="text-white">{t('admin.enforce_complexity', 'Enforce Password Complexity')}</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="api">
          <div className="grid gap-6">
            <Card className="bg-[#141414] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">{t('admin.api_configuration', 'API Configuration')}</CardTitle>
                <CardDescription className="text-white/60">{t('admin.api_config_desc', 'Manage API access and settings')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="rate-limiting" className="text-white">{t('admin.rate_limiting', 'Rate Limiting')}</Label>
                    <p className="text-sm text-white/60">{t('admin.rate_limiting_desc', 'Limit number of API requests per minute')}</p>
                  </div>
                  <Switch id="rate-limiting" checked={localSettings.rate_limiting?.enabled || false} onCheckedChange={(checked) => handleSettingChange('rate_limiting', { enabled: checked })} />
                </div>
                {(localSettings.rate_limiting?.enabled || false) && (
                  <div className="grid gap-2">
                    <Label htmlFor="requests-per-minute" className="text-white">{t('admin.requests_per_minute', 'Requests Per Minute')}</Label>
                    <Input id="requests-per-minute" type="number" value={localSettings.requests_per_minute?.value || '100'} onChange={(e) => handleSettingChange('requests_per_minute', { value: parseInt(e.target.value) })} className="bg-white/5 border-white/10 text-white" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
