
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileData } from '@/types/profile';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import { SuggestionBadge } from '@/components/ui/suggestion-badge';
import { useTranslations } from '@/hooks/useTranslations';

interface LifestyleEditorProps {
  profileData: ProfileData;
  fieldSources?: { [key: string]: 'user' | 'random' | 'initial' };
  onUpdate: (updates: Partial<ProfileData>) => void;
  onSaveComplete?: () => void;
  onCancel?: () => void;
}

const LifestyleEditor: React.FC<LifestyleEditorProps> = ({ profileData, fieldSources = {}, onUpdate, onSaveComplete, onCancel }) => {
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    exerciseHabits: profileData.exerciseHabits || '',
    dietaryPreferences: profileData.dietaryPreferences || '',
    smoking: profileData.smoking || '',
    drinking: profileData.drinking || '',
    sleepSchedule: profileData.sleepSchedule || '',
    havePets: profileData.havePets || '',
    wantChildren: profileData.wantChildren || ''
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
    toast.success(t('toast.profile.lifestyle_updated', 'Lifestyle updated successfully!'));
    onSaveComplete?.();
  };

  const handleCancel = () => {
    setFormData({
      exerciseHabits: profileData.exerciseHabits || '',
      dietaryPreferences: profileData.dietaryPreferences || '',
      smoking: profileData.smoking || '',
      drinking: profileData.drinking || '',
      sleepSchedule: profileData.sleepSchedule || '',
      havePets: profileData.havePets || '',
      wantChildren: profileData.wantChildren || ''
    });
    setHasChanges(false);
    onCancel?.();
  };

  const selectClass = "bg-muted/50 border-border text-foreground";
  const labelClass = "text-muted-foreground text-xs";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>{t('profile.exercise_habits', 'Exercise Habits')}</Label>
            <SuggestionBadge show={fieldSources.exercise_habits === 'random'} />
          </div>
          <Select value={formData.exerciseHabits} onValueChange={(v) => handleInputChange('exerciseHabits', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder={t('profile.how_often', 'How often?')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">{t('profile.daily', 'Daily')}</SelectItem>
              <SelectItem value="few-times-week">{t('profile.few_times_week', 'Few times a week')}</SelectItem>
              <SelectItem value="weekly">{t('profile.weekly', 'Weekly')}</SelectItem>
              <SelectItem value="occasionally">{t('profile.occasionally', 'Occasionally')}</SelectItem>
              <SelectItem value="rarely">{t('profile.rarely', 'Rarely')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>{t('profile.dietary_preferences', 'Dietary Preferences')}</Label>
            <SuggestionBadge show={fieldSources.dietary_preferences === 'random'} />
          </div>
          <Select value={formData.dietaryPreferences} onValueChange={(v) => handleInputChange('dietaryPreferences', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder={t('profile.diet_type', 'Diet type?')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="omnivore">{t('profile.omnivore', 'Omnivore')}</SelectItem>
              <SelectItem value="vegetarian">{t('profile.vegetarian', 'Vegetarian')}</SelectItem>
              <SelectItem value="vegan">{t('profile.vegan', 'Vegan')}</SelectItem>
              <SelectItem value="pescatarian">{t('profile.pescatarian', 'Pescatarian')}</SelectItem>
              <SelectItem value="keto">{t('profile.keto', 'Keto')}</SelectItem>
              <SelectItem value="halal">{t('profile.halal', 'Halal')}</SelectItem>
              <SelectItem value="other">{t('common.other', 'Other')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>{t('profile.smoking', 'Smoking')}</Label>
            <SuggestionBadge show={fieldSources.smoking === 'random'} />
          </div>
          <Select value={formData.smoking} onValueChange={(v) => handleInputChange('smoking', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder={t('profile.do_you_smoke', 'Do you smoke?')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="never">{t('profile.never', 'Never')}</SelectItem>
              <SelectItem value="socially">{t('profile.socially', 'Socially')}</SelectItem>
              <SelectItem value="regularly">{t('profile.regularly', 'Regularly')}</SelectItem>
              <SelectItem value="trying-to-quit">{t('profile.trying_to_quit', 'Trying to quit')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>{t('profile.drinking', 'Drinking')}</Label>
            <SuggestionBadge show={fieldSources.drinking === 'random'} />
          </div>
          <Select value={formData.drinking} onValueChange={(v) => handleInputChange('drinking', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder={t('profile.do_you_drink', 'Do you drink?')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="never">{t('profile.never', 'Never')}</SelectItem>
              <SelectItem value="socially">{t('profile.socially', 'Socially')}</SelectItem>
              <SelectItem value="regularly">{t('profile.regularly', 'Regularly')}</SelectItem>
              <SelectItem value="occasionally">{t('profile.occasionally', 'Occasionally')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>{t('profile.sleep_schedule', 'Sleep Schedule')}</Label>
            <SuggestionBadge show={fieldSources.sleep_schedule === 'random'} />
          </div>
          <Select value={formData.sleepSchedule} onValueChange={(v) => handleInputChange('sleepSchedule', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder={t('profile.night_owl_early_bird', 'Night owl or early bird?')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="early-bird">{t('profile.early_bird', 'Early bird')}</SelectItem>
              <SelectItem value="night-owl">{t('profile.night_owl', 'Night owl')}</SelectItem>
              <SelectItem value="flexible">{t('profile.flexible', 'Flexible')}</SelectItem>
              <SelectItem value="depends">{t('profile.depends_on_day', 'Depends on the day')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>{t('profile.pets', 'Pets')}</Label>
            <SuggestionBadge show={fieldSources.have_pets === 'random'} />
          </div>
          <Select value={formData.havePets} onValueChange={(v) => handleInputChange('havePets', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder={t('profile.do_you_have_pets', 'Do you have pets?')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes-dogs">{t('profile.yes_dogs', 'Yes, dogs')}</SelectItem>
              <SelectItem value="yes-cats">{t('profile.yes_cats', 'Yes, cats')}</SelectItem>
              <SelectItem value="yes-other">{t('profile.yes_other_pets', 'Yes, other pets')}</SelectItem>
              <SelectItem value="no-but-love">{t('profile.no_but_love', 'No, but I love them')}</SelectItem>
              <SelectItem value="no-allergic">{t('profile.no_allergic', "No, I'm allergic")}</SelectItem>
              <SelectItem value="no-not-interested">{t('profile.no_not_interested', 'No, not interested')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={handleCancel} className="flex-1 h-9 text-sm">
          <X className="mr-2 h-4 w-4" /> {t('common.cancel', 'Cancel')}
        </Button>
        <Button onClick={handleSave} className="flex-1 h-9 text-sm bg-primary hover:bg-primary/90" disabled={!hasChanges}>
          <Save className="mr-2 h-4 w-4" /> {t('common.save', 'Save')}
        </Button>
      </div>
    </div>
  );
};

export default LifestyleEditor;
