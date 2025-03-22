
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
  Cloud, 
  AlertTriangle, 
  Mail, 
  Shield, 
  BellRing, 
  Percent, 
  SaveIcon, 
  Key, 
  Smartphone,
  Trash2,
  RefreshCw
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

const SettingsPage = () => {
  // States for various settings
  const [emailSettings, setEmailSettings] = useState({
    dailyDigest: true,
    newUserNotifications: true,
    reportAlerts: true,
    marketingEmails: false
  });
  
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    userRegistration: true,
    photoUploads: true,
    messageSystem: true
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordExpiry: '90',
    sessionTimeout: '30',
    ipRestriction: false
  });
  
  const [apiSettings, setApiSettings] = useState({
    rateLimiting: true,
    requestsPerMinute: '100',
    apiKey: 'sk_test_51LzMNHIuUdN4PkgVRi9JbvZnJO8LgMjA7YfZbWTBUdPwssKS2',
    webhookUrl: 'https://example.com/webhook'
  });
  
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleEmailSettingChange = (key: keyof typeof emailSettings) => {
    setEmailSettings({
      ...emailSettings,
      [key]: !emailSettings[key]
    });
  };
  
  const handleSystemSettingChange = (key: keyof typeof systemSettings) => {
    setSystemSettings({
      ...systemSettings,
      [key]: !systemSettings[key]
    });
  };
  
  const handleSecuritySettingChange = (
    key: keyof typeof securitySettings, 
    value: string | boolean
  ) => {
    setSecuritySettings({
      ...securitySettings,
      [key]: value
    });
  };
  
  const handleApiSettingChange = (
    key: keyof typeof apiSettings, 
    value: string | boolean
  ) => {
    setApiSettings({
      ...apiSettings,
      [key]: value
    });
  };
  
  const saveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      setIsSaving(false);
      // Success notification would be shown here
    }, 1000);
  };
  
  const resetSettings = () => {
    // Reset all settings to their default values
    setEmailSettings({
      dailyDigest: true,
      newUserNotifications: true,
      reportAlerts: true,
      marketingEmails: false
    });
    
    setSystemSettings({
      maintenanceMode: false,
      userRegistration: true,
      photoUploads: true,
      messageSystem: true
    });
    
    setSecuritySettings({
      twoFactorAuth: true,
      passwordExpiry: '90',
      sessionTimeout: '30',
      ipRestriction: false
    });
    
    setApiSettings({
      rateLimiting: true,
      requestsPerMinute: '100',
      apiKey: 'sk_test_51LzMNHIuUdN4PkgVRi9JbvZnJO8LgMjA7YfZbWTBUdPwssKS2',
      webhookUrl: 'https://example.com/webhook'
    });
    
    setIsResetConfirmOpen(false);
  };
  
  const regenerateApiKey = () => {
    // Generate a new random API key (in a real app, this would be done securely on the server)
    const newKey = 'sk_test_' + Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
    
    setApiSettings({
      ...apiSettings,
      apiKey: newKey
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <div className="flex gap-2">
          <Dialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <RefreshCw size={16} />
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
                <Button variant="destructive" onClick={resetSettings}>
                  Reset All Settings
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button className="gap-2" onClick={saveSettings} disabled={isSaving}>
            <SaveIcon size={16} />
            {isSaving ? 'Saving...' : 'Save Settings'}
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
                    {systemSettings.maintenanceMode && (
                      <Badge variant="outline" className="text-yellow-500 border-yellow-200 bg-yellow-50">
                        <AlertTriangle size={12} className="mr-1" />
                        Enabled
                      </Badge>
                    )}
                    <Switch
                      id="maintenance-mode"
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={() => handleSystemSettingChange('maintenanceMode')}
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
                    checked={systemSettings.userRegistration}
                    onCheckedChange={() => handleSystemSettingChange('userRegistration')}
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
                    checked={systemSettings.photoUploads}
                    onCheckedChange={() => handleSystemSettingChange('photoUploads')}
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
                    checked={systemSettings.messageSystem}
                    onCheckedChange={() => handleSystemSettingChange('messageSystem')}
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
                  <Input id="app-name" defaultValue="Dating App" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" type="email" defaultValue="support@datingapp.com" />
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
                    <Input id="smtp-host" defaultValue="smtp.example.com" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" defaultValue="587" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-username">SMTP Username</Label>
                    <Input id="smtp-username" defaultValue="notifications@example.com" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="smtp-password">SMTP Password</Label>
                    <Input id="smtp-password" type="password" defaultValue="••••••••••••" />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="from-email">From Email Address</Label>
                  <Input id="from-email" defaultValue="no-reply@datingapp.com" />
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
                    checked={emailSettings.dailyDigest}
                    onCheckedChange={() => handleEmailSettingChange('dailyDigest')}
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
                    checked={emailSettings.newUserNotifications}
                    onCheckedChange={() => handleEmailSettingChange('newUserNotifications')}
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
                    checked={emailSettings.reportAlerts}
                    onCheckedChange={() => handleEmailSettingChange('reportAlerts')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Send promotional emails to users
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={emailSettings.marketingEmails}
                    onCheckedChange={() => handleEmailSettingChange('marketingEmails')}
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
                  <div className="flex items-center space-x-2">
                    {securitySettings.twoFactorAuth && (
                      <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">
                        <Shield size={12} className="mr-1" />
                        Enabled
                      </Badge>
                    )}
                    <Switch
                      id="two-factor-auth"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={() => handleSecuritySettingChange('twoFactorAuth', !securitySettings.twoFactorAuth)}
                    />
                  </div>
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
                    checked={securitySettings.ipRestriction}
                    onCheckedChange={() => handleSecuritySettingChange('ipRestriction', !securitySettings.ipRestriction)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="password-expiry" 
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => handleSecuritySettingChange('passwordExpiry', e.target.value)}
                    />
                    <Button variant="outline" className="gap-2 whitespace-nowrap">
                      <Key size={16} />
                      Test Policy
                    </Button>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Select 
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) => handleSecuritySettingChange('sessionTimeout', value)}
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
                    checked={apiSettings.rateLimiting}
                    onCheckedChange={() => handleApiSettingChange('rateLimiting', !apiSettings.rateLimiting)}
                  />
                </div>
                
                {apiSettings.rateLimiting && (
                  <div className="grid gap-2">
                    <Label htmlFor="requests-per-minute">Requests Per Minute</Label>
                    <Input 
                      id="requests-per-minute" 
                      value={apiSettings.requestsPerMinute}
                      onChange={(e) => handleApiSettingChange('requestsPerMinute', e.target.value)}
                    />
                  </div>
                )}
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="api-key">API Key</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={regenerateApiKey}
                      className="text-xs h-8"
                    >
                      Regenerate
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      id="api-key" 
                      value={apiSettings.apiKey} 
                      readOnly 
                      className="font-mono text-xs"
                    />
                    <Button variant="outline" size="icon" className="shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </Button>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input 
                    id="webhook-url" 
                    value={apiSettings.webhookUrl}
                    onChange={(e) => handleApiSettingChange('webhookUrl', e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" className="gap-2">
                    <Cloud size={16} />
                    Test Webhook
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Mobile App</CardTitle>
                <CardDescription>
                  Settings for mobile applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable push notifications for mobile apps
                    </p>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="fcm-server-key">Firebase Cloud Messaging Server Key</Label>
                  <Input 
                    id="fcm-server-key" 
                    defaultValue="••••••••••••••••••••••••••••••••••••" 
                    type="password"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="ios-cert">iOS Certificate</Label>
                  <div className="flex gap-2">
                    <Input id="ios-cert" defaultValue="production_certificate.p12" readOnly />
                    <Button variant="outline" className="shrink-0 gap-1">
                      <Smartphone size={16} />
                      Upload
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" className="gap-2">
                    <BellRing size={16} />
                    Send Test Notification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
