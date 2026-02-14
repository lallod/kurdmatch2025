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
import { toast } from 'sonner';

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
    platform_name: 'KurdMatch',
    platform_description: 'Connect with Kurdish people worldwide',
    support_email: 'support@kurdmatch.com',
    max_photo_upload: 6,
    enable_stories: true,
    enable_groups: true,
    enable_events: true,
    enable_posts: true,
    max_daily_likes: 100,
    max_daily_messages: 50,
    max_post_length: 500,
    max_bio_length: 500,
    auto_moderation: false,
    require_photo_verification: false,
    min_age_requirement: 18,
    enable_email_notifications: true,
    enable_push_notifications: true,
  });

  useEffect(() => { checkAdminAccess(); }, []);

  const checkAdminAccess = async () => {
    const { data } = await supabase.from('user_roles').select('role').eq('user_id', user!.id).eq('role', 'super_admin').maybeSingle();
    if (!data) { toast.error('Access Denied'); navigate('/discovery'); return; }
    fetchSettings();
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('system_settings').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        const settingsMap: Record<string, any> = {};
        data.forEach((setting: SystemSetting) => { settingsMap[setting.setting_key] = setting.setting_value; });
        setSettings({ ...settings, ...settingsMap });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally { setLoading(false); }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const promises = Object.entries(settings).map(([key, value]) => {
        return supabase.from('system_settings').upsert({ setting_key: key, setting_value: value, category: getCategoryForKey(key), description: getDescriptionForKey(key) }, { onConflict: 'setting_key' });
      });
      await Promise.all(promises);
      await supabase.from('admin_activities').insert({ user_id: user!.id, activity_type: 'settings_updated', description: 'Updated system settings' });
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally { setSaving(false); }
  };

  const getCategoryForKey = (key: string): string => {
    if (['platform_name', 'platform_description', 'support_email', 'max_photo_upload'].includes(key)) return 'general';
    if (key.startsWith('enable_')) return 'features';
    if (key.startsWith('max_')) return 'limits';
    if (['auto_moderation', 'require_photo_verification', 'min_age_requirement'].includes(key)) return 'moderation';
    return 'notifications';
  };

  const getDescriptionForKey = (key: string): string => {
    const descriptions: Record<string, string> = {
      platform_name: 'The name of the platform', platform_description: 'Brief description', support_email: 'Support email', max_photo_upload: 'Max photos per user',
      enable_stories: 'Allow stories', enable_groups: 'Allow groups', enable_events: 'Allow events', enable_posts: 'Allow posts',
      max_daily_likes: 'Max likes/day', max_daily_messages: 'Max messages/day', max_post_length: 'Max post chars', max_bio_length: 'Max bio chars',
      auto_moderation: 'Auto content moderation', require_photo_verification: 'Require photo verification', min_age_requirement: 'Minimum age',
      enable_email_notifications: 'Email notifications', enable_push_notifications: 'Push notifications',
    };
    return descriptions[key] || '';
  };

  const updateSetting = (key: string, value: any) => { setSettings({ ...settings, [key]: value }); };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/admin/dashboard')} className="text-foreground hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
              <p className="text-muted-foreground text-sm">Configure platform-wide settings</p>
            </div>
          </div>
          <Button onClick={handleSaveSettings} disabled={saving} className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-600">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="limits">Limits</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <Card className="bg-card backdrop-blur-md border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2"><Settings className="w-5 h-5" /> General Settings</CardTitle>
                <CardDescription className="text-muted-foreground">Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="platform_name" className="text-foreground">Platform Name</Label><Input id="platform_name" value={settings.platform_name} onChange={(e) => updateSetting('platform_name', e.target.value)} className="bg-muted/50 border-border text-foreground" /></div>
                <div className="space-y-2"><Label htmlFor="platform_description" className="text-foreground">Platform Description</Label><Textarea id="platform_description" value={settings.platform_description} onChange={(e) => updateSetting('platform_description', e.target.value)} className="bg-muted/50 border-border text-foreground" /></div>
                <div className="space-y-2"><Label htmlFor="support_email" className="text-foreground">Support Email</Label><Input id="support_email" type="email" value={settings.support_email} onChange={(e) => updateSetting('support_email', e.target.value)} className="bg-muted/50 border-border text-foreground" /></div>
                <div className="space-y-2"><Label htmlFor="max_photo_upload" className="text-foreground">Max Photos per User</Label><Input id="max_photo_upload" type="number" value={settings.max_photo_upload} onChange={(e) => updateSetting('max_photo_upload', parseInt(e.target.value))} className="bg-muted/50 border-border text-foreground" /></div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4 mt-4">
            <Card className="bg-card backdrop-blur-md border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2"><Users className="w-5 h-5" /> Feature Toggles</CardTitle>
                <CardDescription className="text-muted-foreground">Enable or disable platform features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['stories', 'groups', 'events', 'posts'].map(feature => (
                  <div key={feature} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div><Label htmlFor={`enable_${feature}`} className="text-foreground capitalize">{feature}</Label><p className="text-muted-foreground text-sm">Allow users to use {feature}</p></div>
                    <Switch id={`enable_${feature}`} checked={settings[`enable_${feature}`]} onCheckedChange={(checked) => updateSetting(`enable_${feature}`, checked)} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits" className="space-y-4 mt-4">
            <Card className="bg-card backdrop-blur-md border-border">
              <CardHeader><CardTitle className="text-foreground">Usage Limits</CardTitle><CardDescription className="text-muted-foreground">Set limits for free users</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                {[{ key: 'max_daily_likes', label: 'Max Daily Likes' }, { key: 'max_daily_messages', label: 'Max Daily Messages' }, { key: 'max_post_length', label: 'Max Post Length' }, { key: 'max_bio_length', label: 'Max Bio Length' }].map(item => (
                  <div key={item.key} className="space-y-2"><Label htmlFor={item.key} className="text-foreground">{item.label}</Label><Input id={item.key} type="number" value={settings[item.key]} onChange={(e) => updateSetting(item.key, parseInt(e.target.value))} className="bg-muted/50 border-border text-foreground" /></div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-4 mt-4">
            <Card className="bg-card backdrop-blur-md border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2"><Shield className="w-5 h-5" /> Moderation Settings</CardTitle>
                <CardDescription className="text-muted-foreground">Configure content moderation and safety</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div><Label htmlFor="auto_moderation" className="text-foreground">Auto Moderation</Label><p className="text-muted-foreground text-sm">Automatically flag inappropriate content</p></div>
                  <Switch id="auto_moderation" checked={settings.auto_moderation} onCheckedChange={(checked) => updateSetting('auto_moderation', checked)} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div><Label htmlFor="require_photo_verification" className="text-foreground">Photo Verification</Label><p className="text-muted-foreground text-sm">Require users to verify their photos</p></div>
                  <Switch id="require_photo_verification" checked={settings.require_photo_verification} onCheckedChange={(checked) => updateSetting('require_photo_verification', checked)} />
                </div>
                <div className="space-y-2"><Label htmlFor="min_age_requirement" className="text-foreground">Minimum Age Requirement</Label><Input id="min_age_requirement" type="number" value={settings.min_age_requirement} onChange={(e) => updateSetting('min_age_requirement', parseInt(e.target.value))} className="bg-muted/50 border-border text-foreground" /></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemSettings;
