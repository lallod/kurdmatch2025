import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { executeAdminAction } from '@/utils/admin/auditLogger';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface AdminProfileEditorProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}

const AdminProfileEditor: React.FC<AdminProfileEditorProps> = ({ userId, open, onOpenChange, onSaved }) => {
  const { t } = useTranslations();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Record<string, any>>({});
  const [details, setDetails] = useState<Record<string, any>>({});
  const [preferences, setPreferences] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!open || !userId) return;
    loadData();
  }, [open, userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, detailsRes, prefsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        (supabase as any).from('profile_details').select('*').eq('user_id', userId).maybeSingle(),
        (supabase as any).from('profile_preferences').select('*').eq('user_id', userId).maybeSingle(),
      ]);
      setProfile(profileRes.data || {});
      setDetails(detailsRes.data || {});
      setPreferences(prefsRes.data || {});
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { id, created_at, ...profileData } = profile;
      await executeAdminAction({
        action: 'update_record',
        table: 'profiles',
        recordId: userId,
        data: {
          name: profileData.name,
          bio: profileData.bio,
          gender: profileData.gender,
          location: profileData.location,
          occupation: profileData.occupation,
          age: profileData.age,
        },
      });
      toast.success(t('admin.profile_updated', 'Profile updated successfully'));
      onSaved?.();
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDetails = async () => {
    if (!details.id) return;
    setSaving(true);
    try {
      const { id, user_id, created_at, updated_at, ...detailsData } = details;
      await executeAdminAction({
        action: 'update_record',
        table: 'profile_details',
        recordId: details.id,
        data: detailsData,
      });
      toast.success(t('admin.details_updated', 'Profile details updated'));
      onSaved?.();
    } catch (error: any) {
      console.error('Error saving details:', error);
      toast.error(error.message || 'Failed to save details');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    if (!preferences.id) return;
    setSaving(true);
    try {
      const { id, user_id, created_at, updated_at, ...prefsData } = preferences;
      await executeAdminAction({
        action: 'update_record',
        table: 'profile_preferences',
        recordId: preferences.id,
        data: prefsData,
      });
      toast.success(t('admin.preferences_updated', 'Preferences updated'));
      onSaved?.();
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      toast.error(error.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = (field: string, value: any) => setProfile(p => ({ ...p, [field]: value }));
  const updateDetails = (field: string, value: any) => setDetails(d => ({ ...d, [field]: value }));
  const updatePreferences = (field: string, value: any) => setPreferences(p => ({ ...p, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('admin.edit_user_profile', 'Edit User Profile')}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-white/40" />
          </div>
        ) : (
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="bg-white/5">
              <TabsTrigger value="basic" className="data-[state=active]:bg-white/10">{t('admin.basic_info', 'Basic Info')}</TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-white/10" disabled={!details.id}>{t('admin.details', 'Details')}</TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-white/10" disabled={!preferences.id}>{t('admin.preferences', 'Preferences')}</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70">{t('common.name', 'Name')}</Label>
                  <Input value={profile.name || ''} onChange={e => updateProfile('name', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <Label className="text-white/70">{t('common.gender', 'Gender')}</Label>
                  <Select value={profile.gender || ''} onValueChange={v => updateProfile('gender', v)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white/70">{t('common.location', 'Location')}</Label>
                  <Input value={profile.location || ''} onChange={e => updateProfile('location', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <Label className="text-white/70">{t('admin.occupation', 'Occupation')}</Label>
                  <Input value={profile.occupation || ''} onChange={e => updateProfile('occupation', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div>
                  <Label className="text-white/70">{t('admin.age', 'Age')}</Label>
                  <Input type="number" value={profile.age || ''} onChange={e => updateProfile('age', parseInt(e.target.value) || null)} className="bg-white/5 border-white/10 text-white" />
                </div>
              </div>
              <div>
                <Label className="text-white/70">{t('admin.bio', 'Bio')}</Label>
                <Textarea value={profile.bio || ''} onChange={e => updateProfile('bio', e.target.value)} className="bg-white/5 border-white/10 text-white" rows={3} />
              </div>
              <Button onClick={handleSaveProfile} disabled={saving} className="bg-gradient-to-r from-red-500 to-orange-500">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {t('admin.save_profile', 'Save Profile')}
              </Button>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              {details.id ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/70">{t('admin.height', 'Height')}</Label>
                      <Input value={details.height || ''} onChange={e => updateDetails('height', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div>
                      <Label className="text-white/70">{t('admin.education', 'Education')}</Label>
                      <Input value={details.education || ''} onChange={e => updateDetails('education', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div>
                      <Label className="text-white/70">{t('admin.religion', 'Religion')}</Label>
                      <Input value={details.religion || ''} onChange={e => updateDetails('religion', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div>
                      <Label className="text-white/70">{t('admin.smoking', 'Smoking')}</Label>
                      <Input value={details.smoking || ''} onChange={e => updateDetails('smoking', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div>
                      <Label className="text-white/70">{t('admin.drinking', 'Drinking')}</Label>
                      <Input value={details.drinking || ''} onChange={e => updateDetails('drinking', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div>
                      <Label className="text-white/70">{t('admin.dialect', 'Dialect')}</Label>
                      <Input value={details.dialect || ''} onChange={e => updateDetails('dialect', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                    </div>
                  </div>
                  <Button onClick={handleSaveDetails} disabled={saving} className="bg-gradient-to-r from-red-500 to-orange-500">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {t('admin.save_details', 'Save Details')}
                  </Button>
                </>
              ) : (
                <p className="text-white/50 text-center py-4">{t('admin.no_details', 'No profile details record exists for this user.')}</p>
              )}
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              {preferences.id ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/70">{t('admin.min_age', 'Min Age')}</Label>
                      <Input type="number" value={preferences.min_age || ''} onChange={e => updatePreferences('min_age', parseInt(e.target.value) || null)} className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div>
                      <Label className="text-white/70">{t('admin.max_age', 'Max Age')}</Label>
                      <Input type="number" value={preferences.max_age || ''} onChange={e => updatePreferences('max_age', parseInt(e.target.value) || null)} className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div>
                      <Label className="text-white/70">{t('admin.preferred_gender', 'Preferred Gender')}</Label>
                      <Input value={preferences.preferred_gender || ''} onChange={e => updatePreferences('preferred_gender', e.target.value)} className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div>
                      <Label className="text-white/70">{t('admin.max_distance', 'Max Distance (km)')}</Label>
                      <Input type="number" value={preferences.max_distance || ''} onChange={e => updatePreferences('max_distance', parseInt(e.target.value) || null)} className="bg-white/5 border-white/10 text-white" />
                    </div>
                  </div>
                  <Button onClick={handleSavePreferences} disabled={saving} className="bg-gradient-to-r from-red-500 to-orange-500">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    {t('admin.save_preferences', 'Save Preferences')}
                  </Button>
                </>
              ) : (
                <p className="text-white/50 text-center py-4">{t('admin.no_preferences', 'No preferences record exists for this user.')}</p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminProfileEditor;
