import React from 'react';
import { ArrowLeft, Bell, BellOff, MessageCircle, Heart, UserPlus, AtSign, Users, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useTranslations } from '@/hooks/useTranslations';
import { PushNotificationSettings } from '@/components/settings/PushNotificationSettings';

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const { settings, loading, updateSettings } = useUserSettings();

  const togglePreference = async (field: string) => {
    if (!settings) return;
    await updateSettings({ [field]: !(settings as any)[field] } as any);
  };

  const handleClearAll = async () => {
    try {
      const { error } = await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      toast.success(t('toast.notifications.cleared', 'All notifications have been deleted'));
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast.error(t('toast.notifications.clear_failed', 'Failed to clear notifications'));
    }
  };

  const notificationTypes = [
    { key: 'notifications_likes', icon: Heart, title: 'Likes', description: 'When someone likes your posts or comments' },
    { key: 'notifications_comments', icon: MessageCircle, title: 'Comments', description: 'When someone comments on your posts' },
    { key: 'notifications_follows', icon: UserPlus, title: 'Follows', description: 'When someone follows you' },
    { key: 'notifications_mentions', icon: AtSign, title: 'Mentions', description: 'When someone mentions you in a post or comment' },
    { key: 'notifications_messages', icon: MessageCircle, title: 'Messages', description: 'New direct messages' },
    { key: 'notifications_groups', icon: Users, title: 'Groups', description: "Activity in groups you're a member of" },
    { key: 'notifications_events', icon: Bell, title: 'Events', description: "Updates about events you're attending" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-24">
        <div className="text-foreground">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/10">
        <div className="max-w-md mx-auto px-4 h-12 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-foreground hover:bg-muted"><ArrowLeft className="w-5 h-5" /></Button>
          <h1 className="text-lg font-bold text-foreground">Notification Settings</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <Card className="bg-card border-border/20">
          <CardHeader>
            <CardTitle className="text-foreground">Notification Types</CardTitle>
            <CardDescription className="text-muted-foreground">Choose which notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationTypes.map((type, index) => (
              <div key={type.key} className="contents">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <type.icon className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor={type.key} className="text-foreground cursor-pointer">{type.title}</Label>
                      <p className="text-sm text-muted-foreground mt-0.5">{type.description}</p>
                    </div>
                  </div>
                  <Switch id={type.key} checked={(settings as any)?.[type.key] ?? true} onCheckedChange={() => togglePreference(type.key)} />
                </div>
                {index < notificationTypes.length - 1 && <Separator className="bg-border/10" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border/20">
          <CardHeader>
            <CardTitle className="text-foreground">Actions</CardTitle>
            <CardDescription className="text-muted-foreground">Manage your notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={handleClearAll}>
              <Trash2 className="w-4 h-4" />Clear All Notifications
            </Button>
          </CardContent>
        </Card>

        <PushNotificationSettings />
      </div>
    </div>
  );
};

export default NotificationSettings;
