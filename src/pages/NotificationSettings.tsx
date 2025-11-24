import React from 'react';
import { ArrowLeft, Bell, BellOff, MessageCircle, Heart, UserPlus, AtSign, Users, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BottomNavigation from '@/components/BottomNavigation';
import { useUserSettings } from '@/hooks/useUserSettings';
import { PushNotificationSettings } from '@/components/settings/PushNotificationSettings';

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings, loading, updateSettings } = useUserSettings();

  const togglePreference = async (field: string) => {
    if (!settings) return;
    await updateSettings({ [field]: !(settings as any)[field] } as any);
  };

  const handleClearAll = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;

      toast({
        title: 'Notifications cleared',
        description: 'All notifications have been deleted',
      });
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear notifications',
        variant: 'destructive',
      });
    }
  };

  const notificationTypes = [
    {
      key: 'notifications_likes',
      icon: Heart,
      title: 'Likes',
      description: 'When someone likes your posts or comments',
    },
    {
      key: 'notifications_comments',
      icon: MessageCircle,
      title: 'Comments',
      description: 'When someone comments on your posts',
    },
    {
      key: 'notifications_follows',
      icon: UserPlus,
      title: 'Follows',
      description: 'When someone follows you',
    },
    {
      key: 'notifications_mentions',
      icon: AtSign,
      title: 'Mentions',
      description: 'When someone mentions you in a post or comment',
    },
    {
      key: 'notifications_messages',
      icon: MessageCircle,
      title: 'Messages',
      description: 'New direct messages',
    },
    {
      key: 'notifications_groups',
      icon: Users,
      title: 'Groups',
      description: 'Activity in groups you\'re a member of',
    },
    {
      key: 'notifications_events',
      icon: Bell,
      title: 'Events',
      description: 'Updates about events you\'re attending',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center pb-24">
        <div className="text-white">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Notification Settings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Notification Types */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Notification Types</CardTitle>
            <CardDescription className="text-white/70">
              Choose which notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationTypes.map((type, index) => (
              <div key={type.key} className="contents">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <type.icon className="w-5 h-5 text-purple-300 mt-0.5" />
                    <div className="flex-1">
                      <Label htmlFor={type.key} className="text-white cursor-pointer">
                        {type.title}
                      </Label>
                      <p className="text-sm text-white/60 mt-0.5">
                        {type.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={type.key}
                    checked={(settings as any)?.[type.key] ?? true}
                    onCheckedChange={() => togglePreference(type.key)}
                  />
                </div>
                {index < notificationTypes.length - 1 && (
                  <Separator className="bg-white/10" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Actions</CardTitle>
            <CardDescription className="text-white/70">
              Manage your notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10"
              onClick={handleClearAll}
            >
              <Trash2 className="w-4 h-4" />
              Clear All Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <PushNotificationSettings />
      </div>

      <BottomNavigation />
    </div>
  );
};

export default NotificationSettings;
