import React, { useState, useEffect } from 'react';
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

interface NotificationPreferences {
  likes: boolean;
  comments: boolean;
  follows: boolean;
  mentions: boolean;
  messages: boolean;
  groups: boolean;
  events: boolean;
}

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    messages: true,
    groups: true,
    events: true,
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load from localStorage for now (can be moved to database later)
      const saved = localStorage.getItem(`notification_prefs_${user.id}`);
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      localStorage.setItem(`notification_prefs_${user.id}`, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
      
      toast({
        title: 'Settings saved',
        description: 'Your notification preferences have been updated',
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save preferences',
        variant: 'destructive',
      });
    }
  };

  const togglePreference = (key: keyof NotificationPreferences) => {
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    savePreferences(newPreferences);
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
      key: 'likes' as keyof NotificationPreferences,
      icon: Heart,
      title: 'Likes',
      description: 'When someone likes your posts or comments',
    },
    {
      key: 'comments' as keyof NotificationPreferences,
      icon: MessageCircle,
      title: 'Comments',
      description: 'When someone comments on your posts',
    },
    {
      key: 'follows' as keyof NotificationPreferences,
      icon: UserPlus,
      title: 'Follows',
      description: 'When someone follows you',
    },
    {
      key: 'mentions' as keyof NotificationPreferences,
      icon: AtSign,
      title: 'Mentions',
      description: 'When someone mentions you in a post or comment',
    },
    {
      key: 'messages' as keyof NotificationPreferences,
      icon: MessageCircle,
      title: 'Messages',
      description: 'New direct messages',
    },
    {
      key: 'groups' as keyof NotificationPreferences,
      icon: Users,
      title: 'Groups',
      description: 'Activity in groups you\'re a member of',
    },
    {
      key: 'events' as keyof NotificationPreferences,
      icon: Bell,
      title: 'Events',
      description: 'Updates about events you\'re attending',
    },
  ];

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
              <React.Fragment key={type.key}>
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
                    checked={preferences[type.key]}
                    onCheckedChange={() => togglePreference(type.key)}
                  />
                </div>
                {index < notificationTypes.length - 1 && (
                  <Separator className="bg-white/10" />
                )}
              </React.Fragment>
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

        {/* Info Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <BellOff className="w-5 h-5 text-purple-300 mt-0.5" />
              <div>
                <p className="text-sm text-white/90 font-medium mb-1">
                  Push Notifications
                </p>
                <p className="text-sm text-white/60">
                  Browser push notifications are not yet supported. You'll still receive in-app notifications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default NotificationSettings;
