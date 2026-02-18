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

const INTENTIONS = [
  { value: 'looking_to_marry', label: 'Looking to Marry' },
  { value: 'open_to_marriage', label: 'Open to Marriage' },
  { value: 'not_sure', label: 'Not Sure Yet' },
  { value: 'prefer_not_to_say', label: 'Prefer Not to Say' },
];

const TIMELINES = [
  { value: 'asap', label: 'As Soon as Possible' },
  { value: 'within_1_year', label: 'Within 1 Year' },
  { value: 'within_2_years', label: 'Within 2 Years' },
  { value: 'no_rush', label: 'No Rush' },
  { value: 'not_specified', label: 'Prefer Not to Say' },
];

const FAMILY_PLANS = [
  { value: 'want_children', label: 'Want Children' },
  { value: 'dont_want_children', label: "Don't Want Children" },
  { value: 'open_to_discussion', label: 'Open to Discussion' },
  { value: 'already_have_children', label: 'Already Have Children' },
  { value: 'prefer_not_to_say', label: 'Prefer Not to Say' },
];

const MarriageIntentions: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { t } = useTranslations();
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

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CircleDot className="w-5 h-5 text-primary" />
          Marriage Intentions
        </CardTitle>
        <CardDescription>Share your relationship goals with potential matches</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            Intention
          </Label>
          <Select value={intention} onValueChange={setIntention}>
            <SelectTrigger><SelectValue placeholder="Select your intention" /></SelectTrigger>
            <SelectContent>
              {INTENTIONS.map(i => (
                <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Timeline</Label>
          <Select value={timeline} onValueChange={setTimeline}>
            <SelectTrigger><SelectValue placeholder="Select timeline" /></SelectTrigger>
            <SelectContent>
              {TIMELINES.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Baby className="w-4 h-4" />
            Family Plans
          </Label>
          <Select value={familyPlans} onValueChange={setFamilyPlans}>
            <SelectTrigger><SelectValue placeholder="Select family plans" /></SelectTrigger>
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
            <Label>Show on profile</Label>
          </div>
          <Switch checked={visibleOnProfile} onCheckedChange={setVisibleOnProfile} />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? 'Saving...' : 'Save Intentions'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MarriageIntentions;
