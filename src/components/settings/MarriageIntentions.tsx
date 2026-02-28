import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Heart, CircleDot, Baby, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useTranslations } from '@/hooks/useTranslations';

const MarriageIntentions: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { t } = useTranslations();

  const INTENTIONS = [
    { value: 'looking_to_marry', label: t('marriage.looking_to_marry', 'Looking to Marry') },
    { value: 'open_to_marriage', label: t('marriage.open_to_marriage', 'Open to Marriage') },
    { value: 'not_sure', label: t('marriage.not_sure', 'Not Sure Yet') },
    { value: 'prefer_not_to_say', label: t('common.prefer_not_to_say', 'Prefer Not to Say') },
  ];

  const TIMELINES = [
    { value: 'asap', label: t('marriage.asap', 'As Soon as Possible') },
    { value: 'within_1_year', label: t('marriage.within_1_year', 'Within 1 Year') },
    { value: 'within_2_years', label: t('marriage.within_2_years', 'Within 2 Years') },
    { value: 'no_rush', label: t('marriage.no_rush', 'No Rush') },
    { value: 'not_specified', label: t('common.prefer_not_to_say', 'Prefer Not to Say') },
  ];

  const FAMILY_PLANS = [
    { value: 'want_children', label: t('marriage.want_children', 'Want Children') },
    { value: 'dont_want_children', label: t('marriage.dont_want_children', "Don't Want Children") },
    { value: 'open_to_discussion', label: t('marriage.open_to_discussion', 'Open to Discussion') },
    { value: 'already_have_children', label: t('marriage.already_have_children', 'Already Have Children') },
    { value: 'prefer_not_to_say', label: t('common.prefer_not_to_say', 'Prefer Not to Say') },
  ];

  const [intention, setIntention] = useState('');
  const [timeline, setTimeline] = useState('');
  const [familyPlans, setFamilyPlans] = useState('');
  const [visibleOnProfile, setVisibleOnProfile] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('marriage_intentions')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setIntention(data.intention);
        setTimeline(data.timeline || '');
        setFamilyPlans(data.family_plans || '');
        setVisibleOnProfile(data.visible_on_profile);
      }
    } catch (error) {
      console.error('Error fetching marriage intentions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !intention) {
      toast.error(t('toast.marriage.select_intention', 'Please select your marriage intention'));
      return;
    }

    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        intention,
        timeline: timeline || null,
        family_plans: familyPlans || null,
        visible_on_profile: visibleOnProfile,
      };

      const { error } = await supabase
        .from('marriage_intentions')
        .upsert(payload, { onConflict: 'user_id' });

      if (error) throw error;
      toast.success(t('toast.marriage.saved', 'Marriage intentions saved'));
    } catch (error) {
      console.error('Error saving:', error);
      toast.error(t('toast.save.failed', 'Failed to save'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">{t('common.loading', 'Loading...')}</div>;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CircleDot className="w-5 h-5 text-primary" />
          {t('marriage.title', 'Marriage Intentions')}
        </CardTitle>
        <CardDescription>{t('marriage.description', 'Share your relationship goals with potential matches')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            {t('marriage.intention', 'Intention')}
          </Label>
          <Select value={intention} onValueChange={setIntention}>
            <SelectTrigger><SelectValue placeholder={t('marriage.select_intention', 'Select your intention')} /></SelectTrigger>
            <SelectContent>
              {INTENTIONS.map(i => (
                <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('marriage.timeline', 'Timeline')}</Label>
          <Select value={timeline} onValueChange={setTimeline}>
            <SelectTrigger><SelectValue placeholder={t('marriage.select_timeline', 'Select timeline')} /></SelectTrigger>
            <SelectContent>
              {TIMELINES.map(tl => (
                <SelectItem key={tl.value} value={tl.value}>{tl.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Baby className="w-4 h-4" />
            {t('marriage.family_plans', 'Family Plans')}
          </Label>
          <Select value={familyPlans} onValueChange={setFamilyPlans}>
            <SelectTrigger><SelectValue placeholder={t('marriage.select_family_plans', 'Select family plans')} /></SelectTrigger>
            <SelectContent>
              {FAMILY_PLANS.map(f => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <Label>{t('marriage.show_on_profile', 'Show on profile')}</Label>
          </div>
          <Switch checked={visibleOnProfile} onCheckedChange={setVisibleOnProfile} />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? t('common.saving', 'Saving...') : t('marriage.save', 'Save Intentions')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MarriageIntentions;
