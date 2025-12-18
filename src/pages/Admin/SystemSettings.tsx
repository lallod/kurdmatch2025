import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Settings, Shield, Bell, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  category: string;
  description: string;
}

const SystemSettings = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({
    // General settings
    platform_name: 'KurdMatch',
    platform_description: 'Connect with Kurdish people worldwide',
    support_email: 'support@kurdmatch.com',
    max_photo_upload: 6,
    
    // Features
    enable_stories: true,
    enable_groups: true,
    enable_events: true,
    enable_posts: true,
    
    // Limits
    max_daily_likes: 100,
    max_daily_messages: 50,
    max_post_length: 500,
    max_bio_length: 500,
    
    // Moderation
    auto_moderation: false,
    require_photo_verification: false,
    min_age_requirement: 18,
    
    // Notifications
    enable_email_notifications: true,
    enable_push_notifications: true,
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user!.id)
      .eq('role', 'super_admin')
      .maybeSingle();

    if (!data) {
      toast({
        title: 'Access Denied',
        description: 'You do not have admin privileges',
        variant: 'destructive',
      });
      navigate('/discovery');
      return;
    }

    fetchSettings();
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        const settingsMap: Record<string, any> = {};
        data.forEach((setting: SystemSetting) => {
          settingsMap[setting.setting_key] = setting.setting_value;
        });
        setSettings({ ...settings, ...settingsMap });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);

      // Save each setting
      const promises = Object.entries(settings).map(([key, value]) => {
        return supabase
          .from('system_settings')
          .upsert({
            setting_key: key,
            setting_value: value,
            category: getCategoryForKey(key),
            description: getDescriptionForKey(key),
          }, {
            onConflict: 'setting_key'
          });
      });

      await Promise.all(promises);

      // Log admin activity
      await supabase.from('admin_activities').insert({
        user_id: user!.id,
        activity_type: 'settings_updated',
        description: 'Updated system settings',
      });

      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getCategoryForKey = (key: string): string => {
    if (['platform_name', 'platform_description', 'support_email', 'max_photo_upload'].includes(key)) {
      return 'general';
    }
    if (key.startsWith('enable_')) {
      return 'features';
    }
    if (key.startsWith('max_')) {
      return 'limits';
    }
    if (['auto_moderation', 'require_photo_verification', 'min_age_requirement'].includes(key)) {
      return 'moderation';
    }
    return 'notifications';
  };

  const getDescriptionForKey = (key: string): string => {
    const descriptions: Record<string, string> = {
      platform_name: 'The name of the platform',
      platform_description: 'Brief description of the platform',
      support_email: 'Email address for user support',
      max_photo_upload: 'Maximum number of photos users can upload',
      enable_stories: 'Allow users to post stories',
      enable_groups: 'Allow users to create and join groups',
      enable_events: 'Allow users to create and join events',
      enable_posts: 'Allow users to create posts',
      max_daily_likes: 'Maximum likes per day for free users',
      max_daily_messages: 'Maximum messages per day for free users',
      max_post_length: 'Maximum character length for posts',
      max_bio_length: 'Maximum character length for user bio',
      auto_moderation: 'Enable automatic content moderation',
      require_photo_verification: 'Require users to verify their photos',
      min_age_requirement: 'Minimum age to use the platform',
      enable_email_notifications: 'Send email notifications to users',
      enable_push_notifications: 'Send push notifications to users',
    };
    return descriptions[key] || '';
  };

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-24">
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/dashboard')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">System Settings</h1>
              <p className="text-white/70 text-sm">Configure platform-wide settings</p>
            </div>
          </div>
          <Button
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="limits">Limits</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  General Settings
                </CardTitle>
                <CardDescription className="text-white/70">
                  Basic platform configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform_name" className="text-white">Platform Name</Label>
                  <Input
                    id="platform_name"
                    value={settings.platform_name}
                    onChange={(e) => updateSetting('platform_name', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform_description" className="text-white">Platform Description</Label>
                  <Textarea
                    id="platform_description"
                    value={settings.platform_description}
                    onChange={(e) => updateSetting('platform_description', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support_email" className="text-white">Support Email</Label>
                  <Input
                    id="support_email"
                    type="email"
                    value={settings.support_email}
                    onChange={(e) => updateSetting('support_email', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_photo_upload" className="text-white">Max Photos per User</Label>
                  <Input
                    id="max_photo_upload"
                    type="number"
                    value={settings.max_photo_upload}
                    onChange={(e) => updateSetting('max_photo_upload', parseInt(e.target.value))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4 mt-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Feature Toggles
                </CardTitle>
                <CardDescription className="text-white/70">
                  Enable or disable platform features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <Label htmlFor="enable_stories" className="text-white">Stories</Label>
                    <p className="text-white/50 text-sm">Allow users to post 24-hour stories</p>
                  </div>
                  <Switch
                    id="enable_stories"
                    checked={settings.enable_stories}
                    onCheckedChange={(checked) => updateSetting('enable_stories', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <Label htmlFor="enable_groups" className="text-white">Groups</Label>
                    <p className="text-white/50 text-sm">Allow users to create and join groups</p>
                  </div>
                  <Switch
                    id="enable_groups"
                    checked={settings.enable_groups}
                    onCheckedChange={(checked) => updateSetting('enable_groups', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <Label htmlFor="enable_events" className="text-white">Events</Label>
                    <p className="text-white/50 text-sm">Allow users to create and join events</p>
                  </div>
                  <Switch
                    id="enable_events"
                    checked={settings.enable_events}
                    onCheckedChange={(checked) => updateSetting('enable_events', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <Label htmlFor="enable_posts" className="text-white">Posts</Label>
                    <p className="text-white/50 text-sm">Allow users to create posts</p>
                  </div>
                  <Switch
                    id="enable_posts"
                    checked={settings.enable_posts}
                    onCheckedChange={(checked) => updateSetting('enable_posts', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits" className="space-y-4 mt-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Usage Limits</CardTitle>
                <CardDescription className="text-white/70">
                  Set limits for free users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="max_daily_likes" className="text-white">Max Daily Likes</Label>
                  <Input
                    id="max_daily_likes"
                    type="number"
                    value={settings.max_daily_likes}
                    onChange={(e) => updateSetting('max_daily_likes', parseInt(e.target.value))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_daily_messages" className="text-white">Max Daily Messages</Label>
                  <Input
                    id="max_daily_messages"
                    type="number"
                    value={settings.max_daily_messages}
                    onChange={(e) => updateSetting('max_daily_messages', parseInt(e.target.value))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_post_length" className="text-white">Max Post Length (characters)</Label>
                  <Input
                    id="max_post_length"
                    type="number"
                    value={settings.max_post_length}
                    onChange={(e) => updateSetting('max_post_length', parseInt(e.target.value))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_bio_length" className="text-white">Max Bio Length (characters)</Label>
                  <Input
                    id="max_bio_length"
                    type="number"
                    value={settings.max_bio_length}
                    onChange={(e) => updateSetting('max_bio_length', parseInt(e.target.value))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-4 mt-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Moderation Settings
                </CardTitle>
                <CardDescription className="text-white/70">
                  Configure content moderation and safety
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <Label htmlFor="auto_moderation" className="text-white">Auto Moderation</Label>
                    <p className="text-white/50 text-sm">Automatically flag inappropriate content</p>
                  </div>
                  <Switch
                    id="auto_moderation"
                    checked={settings.auto_moderation}
                    onCheckedChange={(checked) => updateSetting('auto_moderation', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <Label htmlFor="require_photo_verification" className="text-white">Photo Verification</Label>
                    <p className="text-white/50 text-sm">Require users to verify their photos</p>
                  </div>
                  <Switch
                    id="require_photo_verification"
                    checked={settings.require_photo_verification}
                    onCheckedChange={(checked) => updateSetting('require_photo_verification', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min_age_requirement" className="text-white">Minimum Age Requirement</Label>
                  <Input
                    id="min_age_requirement"
                    type="number"
                    value={settings.min_age_requirement}
                    onChange={(e) => updateSetting('min_age_requirement', parseInt(e.target.value))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemSettings;
