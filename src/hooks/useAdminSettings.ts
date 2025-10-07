import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  category: 'general' | 'email' | 'security' | 'api';
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const useAdminSettings = (category?: string) => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['admin-settings', category],
    queryFn: async () => {
      let query = supabase
        .from('system_settings')
        .select('*')
        .order('setting_key');

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as SystemSetting[];
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { data, error } = await supabase
        .from('system_settings')
        .update({ setting_value: value, updated_at: new Date().toISOString() })
        .eq('setting_key', key)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('Setting updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update setting: ${error.message}`);
    },
  });

  const updateMultipleSettings = useMutation({
    mutationFn: async (updates: Array<{ key: string; value: any }>) => {
      const promises = updates.map(({ key, value }) =>
        supabase
          .from('system_settings')
          .update({ setting_value: value, updated_at: new Date().toISOString() })
          .eq('setting_key', key)
      );

      const results = await Promise.all(promises);
      const errors = results.filter(r => r.error);
      
      if (errors.length > 0) {
        throw new Error(`Failed to update ${errors.length} setting(s)`);
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('Settings saved successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to save settings: ${error.message}`);
    },
  });

  const resetToDefaults = useMutation({
    mutationFn: async () => {
      const defaults = [
        { key: 'maintenance_mode', value: { enabled: false } },
        { key: 'user_registration', value: { enabled: true } },
        { key: 'photo_uploads', value: { enabled: true } },
        { key: 'message_system', value: { enabled: true } },
        { key: 'two_factor_auth', value: { enabled: true } },
        { key: 'password_expiry', value: { days: 90 } },
        { key: 'session_timeout', value: { minutes: 30 } },
        { key: 'ip_restriction', value: { enabled: false } },
        { key: 'rate_limiting', value: { enabled: true } },
        { key: 'requests_per_minute', value: { value: 100 } },
      ];

      const promises = defaults.map(({ key, value }) =>
        supabase
          .from('system_settings')
          .update({ setting_value: value })
          .eq('setting_key', key)
      );

      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast.success('Settings reset to defaults');
    },
    onError: (error: any) => {
      toast.error(`Failed to reset settings: ${error.message}`);
    },
  });

  // Helper to get a specific setting value
  const getSetting = (key: string) => {
    return settings?.find(s => s.setting_key === key)?.setting_value;
  };

  return {
    settings,
    isLoading,
    error,
    updateSetting,
    updateMultipleSettings,
    resetToDefaults,
    getSetting,
  };
};
