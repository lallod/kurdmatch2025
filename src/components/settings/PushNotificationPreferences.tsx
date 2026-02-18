import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, Heart, MessageCircle, Users, Eye, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

interface NotificationPreferences {
  push_new_messages: boolean;
  push_new_matches: boolean;
  push_new_likes: boolean;
  push_profile_views: boolean;
  push_compatibility_updates: boolean;
}

export const PushNotificationPreferences: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { t } = useTranslations();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    push_new_messages: true,
    push_new_matches: true,
    push_new_likes: true,
    push_profile_views: false,
    push_compatibility_updates: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // Use type assertion since the column is newly added
        const profileData = data as Record<string, unknown>;
        if (profileData?.notification_preferences) {
          const prefs = profileData.notification_preferences as Record<string, boolean>;
          setPreferences({
            push_new_messages: prefs.push_new_messages ?? true,
            push_new_matches: prefs.push_new_matches ?? true,
            push_new_likes: prefs.push_new_likes ?? true,
            push_profile_views: prefs.push_profile_views ?? false,
            push_compatibility_updates: prefs.push_compatibility_updates ?? true,
          });
        }
      } catch (error) {
        console.error('Failed to load notification preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user?.id]);

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    if (!user?.id) return;

    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    try {
      // Use raw update with type assertion for newly added column
      const { error } = await supabase
        .from('profiles')
        .update({ notification_preferences: newPreferences } as Record<string, unknown>)
        .eq('id', user.id);

      if (error) throw error;
      toast.success(t('toast.settings.updated', 'Settings updated'));
    } catch (error) {
      console.error('Failed to update preferences:', error);
      toast.error(t('toast.settings.save_failed', 'Could not save settings'));
      // Revert on error
      setPreferences(preferences);
    }
  };

  const notificationOptions = [
    {
      key: 'push_new_messages' as const,
      label: 'Nye meldinger',
      description: 'Bli varslet når du mottar nye meldinger',
      icon: MessageCircle,
    },
    {
      key: 'push_new_matches' as const,
      label: 'Nye matcher',
      description: 'Bli varslet når du får en ny match',
      icon: Users,
    },
    {
      key: 'push_new_likes' as const,
      label: 'Nye likes',
      description: 'Bli varslet når noen liker profilen din',
      icon: Heart,
    },
    {
      key: 'push_profile_views' as const,
      label: 'Profilvisninger',
      description: 'Bli varslet når noen ser på profilen din',
      icon: Eye,
    },
    {
      key: 'push_compatibility_updates' as const,
      label: 'Kompatibilitetsoppdateringer',
      description: 'Bli varslet når kompatibilitetsscoren din øker',
      icon: Sparkles,
    },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Varslingsinnstillinger
        </CardTitle>
        <CardDescription>
          Velg hvilke push-varsler du ønsker å motta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationOptions.map((option, index) => (
          <React.Fragment key={option.key}>
            {index > 0 && <Separator />}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <option.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label htmlFor={option.key} className="cursor-pointer">
                    {option.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
              <Switch
                id={option.key}
                checked={preferences[option.key]}
                onCheckedChange={(checked) => updatePreference(option.key, checked)}
              />
            </div>
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
