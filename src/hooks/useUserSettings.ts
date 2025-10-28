import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserSettings {
  // Notification preferences
  notifications_matches: boolean;
  notifications_messages: boolean;
  notifications_likes: boolean;
  notifications_profile_views: boolean;
  notifications_marketing: boolean;
  notifications_push: boolean;
  notifications_email: boolean;
  notifications_sms: boolean;
  notifications_comments: boolean;
  notifications_follows: boolean;
  notifications_mentions: boolean;
  notifications_groups: boolean;
  notifications_events: boolean;
  
  // Privacy settings
  privacy_show_age: boolean;
  privacy_show_distance: boolean;
  privacy_show_online: boolean;
  privacy_discoverable: boolean;
  privacy_read_receipts: boolean;
  privacy_show_online_status: boolean;
  privacy_show_last_active: boolean;
  privacy_show_profile_views: boolean;
  privacy_profile_visibility: string;
  privacy_message_privacy: string;
  privacy_location_sharing: string;
}

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    
    // Set up realtime subscription for settings updates
    const channel = supabase
      .channel('user_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_settings',
        },
        async (payload) => {
          console.log('Settings changed:', payload);
          await loadSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Create default settings if they don't exist
        const { data: newSettings, error: insertError } = await supabase
          .from('user_settings')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) throw insertError;
        setSettings(newSettings as UserSettings);
      } else {
        setSettings(data as UserSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      setSettings(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
      throw error;
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    refreshSettings: loadSettings
  };
};
