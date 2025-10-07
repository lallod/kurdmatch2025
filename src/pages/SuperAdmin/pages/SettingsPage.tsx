import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  AlertTriangle, 
  Mail, 
  SaveIcon, 
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useAdminSettings } from '@/hooks/useAdminSettings';

const SettingsPage = () => {
  const { settings, isLoading, getSetting, updateSetting, updateMultipleSettings, resetToDefaults } = useAdminSettings();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<Record<string, any>>({});

  // Initialize local settings from database
  useEffect(() => {
    if (settings) {
      const settingsMap: Record<string, any> = {};
      settings.forEach(setting => {
        settingsMap[setting.setting_key] = setting.setting_value;
      });
      setLocalSettings(settingsMap);
    }
  }, [settings]);

  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveAllSettings = () => {
    const updates = Object.entries(localSettings).map(([key, value]) => ({
      key,
      value
    }));
    updateMultipleSettings.mutate(updates);
  };

  const handleResetConfirm = () => {
    resetToDefaults.mutate();
    setIsResetConfirmOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <div className="flex gap-2">
          <Dialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2" disabled={resetToDefaults.isPending}>
                <RefreshCw size={16} className={resetToDefaults.isPending ? 'animate-spin' : ''} />
                Reset to Defaults
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset Settings</DialogTitle>
                <DialogDescription>
                  This will reset all settings to their default values. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsResetConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleResetConfirm} disabled={resetToDefaults.isPending}>
                  {resetToDefaults.isPending ? 'Resetting...' : 'Reset All Settings'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button className="gap-2" onClick={saveAllSettings} disabled={updateMultipleSettings.isPending}>
            <SaveIcon size={16} />
            {updateMultipleSettings.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-4 w-[600px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  Control the overall behavior of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      When enabled, only admins can access the site
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {localSettings.maintenance_mode?.enabled && (
                      <Badge variant="outline" className="text-yellow-500 border-yellow-200 bg-yellow-50">
                        <AlertTriangle size={12} className="mr-1" />
                        Enabled
                      </Badge>
                    )}
                    <Switch
                      id="maintenance-mode"
                      checked={localSettings.maintenance_mode?.enabled || false}
                      onCheckedChange={(checked) => handleSettingChange('maintenance_mode', { enabled: checked })}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="user-registration">User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register
                    </p>
                  </div>
                  <Switch
                    id="user-registration"
                    checked={localSettings.user_registration?.enabled || false}
                    onCheckedChange={(checked) => handleSettingChange('user_registration', { enabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="photo-uploads">Photo Uploads</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to upload new photos
                    </p>
                  </div>
                  <Switch
                    id="photo-uploads"
                    checked={localSettings.photo_uploads?.enabled || false}
                    onCheckedChange={(checked) => handleSettingChange('photo_uploads', { enabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="message-system">Messaging System</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable messaging between users
                    </p>
                  </div>
                  <Switch
                    id="message-system"
                    checked={localSettings.message_system?.enabled || false}
                    onCheckedChange={(checked) => handleSettingChange('message_system', { enabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>App Configuration</CardTitle>
                <CardDescription>
                  Basic application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="app-name">Application Name</Label>
                  <Input 
                    id="app-name" 
                    value={localSettings.app_name?.value || ''} 
                    onChange={(e) => handleSettingChange('app_name', { value: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input 
                    id="support-email" 
                    type="email" 
                    value={localSettings.support_email?.value || ''} 
                    onChange={(e) => handleSettingChange('support_email', { value: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="mm/dd/yyyy">
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy/mm/dd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
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
        
        {/* Email Settings Tab */}
        <TabsContent value="email">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>
                  Configure your email server settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input 
                      id="smtp-host" 
                      value={localSettings.smtp_host?.value || ''} 
                      onChange={(e) => handleSettingChange('smtp_host', { value: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input 
                      id="smtp-port" 
                      value={localSettings.smtp_port?.value || ''} 
                      onChange={(e) => handleSettingChange('smtp_port', { value: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-username">SMTP Username</Label>
                    <Input 
                      id="smtp-username" 
                      value={localSettings.smtp_username?.value || ''} 
                      onChange={(e) => handleSettingChange('smtp_username', { value: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-password">SMTP Password</Label>
                    <Input 
                      id="smtp-password" 
                      type="password" 
                      placeholder="••••••••••••"
                      value={localSettings.smtp_password?.value || ''} 
                      onChange={(e) => handleSettingChange('smtp_password', { value: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="from-email">From Email Address</Label>
                  <Input 
                    id="from-email" 
                    value={localSettings.from_email?.value || ''} 
                    onChange={(e) => handleSettingChange('from_email', { value: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="smtp-encryption"
                    defaultChecked
                  />
                  <Label htmlFor="smtp-encryption">Use SSL/TLS Encryption</Label>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" className="gap-2">
                    <Mail size={16} />
                    Test Email Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure what system notifications to send
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="daily-digest">Daily Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Send daily summary of site activity
                    </p>
                  </div>
                  <Switch
                    id="daily-digest"
                    checked={localSettings.daily_digest?.enabled || false}
                    onCheckedChange={(checked) => handleSettingChange('daily_digest', { enabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-user-notifications">New User Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for new registrations
                    </p>
                  </div>
                  <Switch
                    id="new-user-notifications"
                    checked={localSettings.new_user_notifications?.enabled || false}
                    onCheckedChange={(checked) => handleSettingChange('new_user_notifications', { enabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="report-alerts">Report Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when content is reported
                    </p>
                  </div>
                  <Switch
                    id="report-alerts"
                    checked={localSettings.report_alerts?.enabled || false}
                    onCheckedChange={(checked) => handleSettingChange('report_alerts', { enabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Security Settings Tab */}
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Controls</CardTitle>
                <CardDescription>
                  Configure security settings for the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Switch
                    id="two-factor-auth"
                    checked={localSettings.two_factor_auth?.enabled || false}
                    onCheckedChange={(checked) => handleSettingChange('two_factor_auth', { enabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="ip-restriction">IP Restriction</Label>
                    <p className="text-sm text-muted-foreground">
                      Limit admin access to specific IP addresses
                    </p>
                  </div>
                  <Switch
                    id="ip-restriction"
                    checked={localSettings.ip_restriction?.enabled || false}
                    onCheckedChange={(checked) => handleSettingChange('ip_restriction', { enabled: checked })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                  <Input 
                    id="password-expiry" 
                    value={localSettings.password_expiry?.days || '90'}
                    onChange={(e) => handleSettingChange('password_expiry', { days: parseInt(e.target.value) })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Select 
                    value={localSettings.session_timeout?.minutes?.toString() || '30'}
                    onValueChange={(value) => handleSettingChange('session_timeout', { minutes: parseInt(value) })}
                  >
                    <SelectTrigger id="session-timeout">
                      <SelectValue placeholder="Select timeout period" />
                    </SelectTrigger>
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
            
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Additional security settings for user accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Minimum Password Length</Label>
                    <p className="text-sm text-muted-foreground">
                      Require at least this many characters
                    </p>
                  </div>
                  <Select defaultValue="8">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
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
                    <Label>Failed Login Attempts</Label>
                    <p className="text-sm text-muted-foreground">
                      Number of attempts before account lockout
                    </p>
                  </div>
                  <Select defaultValue="5">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Account Lockout Duration</Label>
                    <p className="text-sm text-muted-foreground">
                      Time before allowing login attempts again
                    </p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
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
                  <Label htmlFor="enforce-complexity">Enforce Password Complexity</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* API Settings Tab */}
        <TabsContent value="api">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>
                  Manage API access and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="rate-limiting">Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">
                      Limit number of API requests per minute
                    </p>
                  </div>
                  <Switch
                    id="rate-limiting"
                    checked={localSettings.rate_limiting?.enabled || false}
                    onCheckedChange={(checked) => handleSettingChange('rate_limiting', { enabled: checked })}
                  />
                </div>
                
                {(localSettings.rate_limiting?.enabled || false) && (
                  <div className="grid gap-2">
                    <Label htmlFor="requests-per-minute">Requests Per Minute</Label>
                    <Input 
                      id="requests-per-minute" 
                      type="number"
                      value={localSettings.requests_per_minute?.value || '100'}
                      onChange={(e) => handleSettingChange('requests_per_minute', { value: parseInt(e.target.value) })}
                    />
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
