import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FieldVisibility {
  [fieldName: string]: boolean;
}

// All controllable profile fields
export const PROFILE_FIELDS = [
  { key: 'age', label: 'Age', category: 'Basic Info' },
  { key: 'location', label: 'Location', category: 'Basic Info' },
  { key: 'occupation', label: 'Occupation', category: 'Basic Info' },
  { key: 'height', label: 'Height', category: 'Basic Info' },
  { key: 'body_type', label: 'Body Type', category: 'Basic Info' },
  { key: 'ethnicity', label: 'Ethnicity', category: 'Basic Info' },
  { key: 'religion', label: 'Religion', category: 'Basic Info' },
  { key: 'zodiac_sign', label: 'Zodiac Sign', category: 'Basic Info' },
  { key: 'personality_type', label: 'Personality', category: 'Basic Info' },
  { key: 'kurdistan_region', label: 'Kurdistan Region', category: 'Basic Info' },
  { key: 'education', label: 'Education', category: 'Career' },
  { key: 'company', label: 'Company', category: 'Career' },
  { key: 'career_ambitions', label: 'Career Goals', category: 'Career' },
  { key: 'work_environment', label: 'Work Style', category: 'Career' },
  { key: 'exercise_habits', label: 'Exercise', category: 'Lifestyle' },
  { key: 'dietary_preferences', label: 'Diet', category: 'Lifestyle' },
  { key: 'smoking', label: 'Smoking', category: 'Lifestyle' },
  { key: 'drinking', label: 'Drinking', category: 'Lifestyle' },
  { key: 'sleep_schedule', label: 'Sleep Schedule', category: 'Lifestyle' },
  { key: 'have_pets', label: 'Pets', category: 'Lifestyle' },
  { key: 'relationship_goals', label: 'Looking For', category: 'Relationships' },
  { key: 'want_children', label: 'Children', category: 'Relationships' },
  { key: 'love_language', label: 'Love Language', category: 'Relationships' },
  { key: 'communication_style', label: 'Communication Style', category: 'Relationships' },
  { key: 'ideal_date', label: 'Ideal Date', category: 'Relationships' },
  { key: 'family_closeness', label: 'Family', category: 'Relationships' },
  { key: 'interests', label: 'Interests', category: 'Values' },
  { key: 'hobbies', label: 'Hobbies', category: 'Values' },
  { key: 'values', label: 'Values', category: 'Values' },
  { key: 'languages', label: 'Languages', category: 'Values' },
  { key: 'political_views', label: 'Political Views', category: 'Values' },
];

export const useProfileVisibility = () => {
  const [visibility, setVisibility] = useState<FieldVisibility>({});
  const [blurPhotos, setBlurPhotosState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Load visibility settings
      const { data: settings } = await supabase
        .from('profile_visibility_settings')
        .select('field_name, is_visible')
        .eq('user_id', session.user.id);

      const vis: FieldVisibility = {};
      // Default all fields to visible
      PROFILE_FIELDS.forEach(f => { vis[f.key] = true; });
      // Override with saved settings
      settings?.forEach(s => { vis[s.field_name] = s.is_visible; });
      setVisibility(vis);

      // Load blur_photos
      const { data: profile } = await supabase
        .from('profiles')
        .select('blur_photos')
        .eq('id', session.user.id)
        .single();
      setBlurPhotosState(profile?.blur_photos || false);
    } catch (err) {
      console.error('Error loading visibility settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const toggleField = async (fieldName: string, isVisible: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      setVisibility(prev => ({ ...prev, [fieldName]: isVisible }));

      const { error } = await supabase
        .from('profile_visibility_settings')
        .upsert({
          user_id: session.user.id,
          field_name: fieldName,
          is_visible: isVisible,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,field_name' });

      if (error) throw error;
    } catch (err) {
      console.error('Error toggling field visibility:', err);
      // Revert
      setVisibility(prev => ({ ...prev, [fieldName]: !isVisible }));
    }
  };

  const setBlurPhotos = async (blur: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      setBlurPhotosState(blur);

      const { error } = await supabase
        .from('profiles')
        .update({ blur_photos: blur })
        .eq('id', session.user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating blur photos:', err);
      setBlurPhotosState(!blur);
    }
  };

  // Load visibility for a specific user (for viewing their profile)
  const getVisibilityForUser = async (userId: string): Promise<FieldVisibility> => {
    try {
      const { data: settings } = await supabase
        .from('profile_visibility_settings')
        .select('field_name, is_visible')
        .eq('user_id', userId);

      const vis: FieldVisibility = {};
      PROFILE_FIELDS.forEach(f => { vis[f.key] = true; });
      settings?.forEach(s => { vis[s.field_name] = s.is_visible; });
      return vis;
    } catch {
      const vis: FieldVisibility = {};
      PROFILE_FIELDS.forEach(f => { vis[f.key] = true; });
      return vis;
    }
  };

  // Check if current user has sharing access to another user's hidden fields
  const hasShareAccess = async (ownerId: string): Promise<{ hasAccess: boolean; shareType: string; sharedFields: string[] }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return { hasAccess: false, shareType: '', sharedFields: [] };

      const { data } = await supabase
        .from('profile_sharing')
        .select('share_type, shared_fields')
        .eq('owner_id', ownerId)
        .eq('shared_with_user_id', session.user.id)
        .maybeSingle();

      return {
        hasAccess: !!data,
        shareType: data?.share_type || '',
        sharedFields: data?.shared_fields || [],
      };
    } catch {
      return { hasAccess: false, shareType: '', sharedFields: [] };
    }
  };

  return {
    visibility,
    blurPhotos,
    loading,
    saving,
    toggleField,
    setBlurPhotos,
    getVisibilityForUser,
    hasShareAccess,
    reload: loadSettings,
  };
};
