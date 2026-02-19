
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProfileData } from '@/types/profile';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import { SuggestionBadge } from '@/components/ui/suggestion-badge';
import { useTranslations } from '@/hooks/useTranslations';

interface ValuesPersonalityEditorProps {
  profileData: ProfileData;
  fieldSources?: { [key: string]: 'user' | 'random' | 'initial' };
  onUpdate: (updates: Partial<ProfileData>) => void;
  onSaveComplete?: () => void;
  onCancel?: () => void;
}

const ValuesPersonalityEditor: React.FC<ValuesPersonalityEditorProps> = ({ profileData, fieldSources = {}, onUpdate, onSaveComplete, onCancel }) => {
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    religion: profileData.religion || '',
    values: profileData.values || [],
    zodiacSign: profileData.zodiacSign || '',
    personalityType: profileData.personalityType || '',
    politicalViews: profileData.politicalViews || ''
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleValueToggle = (value: string) => {
    const updatedValues = formData.values.includes(value)
      ? formData.values.filter(v => v !== value)
      : [...formData.values, value];
    handleInputChange('values', updatedValues);
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
    toast.success(t('toast.profile.values_updated', 'Values & personality updated!'));
    onSaveComplete?.();
  };

  const handleCancel = () => {
    setFormData({
      religion: profileData.religion || '',
      values: profileData.values || [],
      zodiacSign: profileData.zodiacSign || '',
      personalityType: profileData.personalityType || '',
      politicalViews: profileData.politicalViews || ''
    });
    setHasChanges(false);
    onCancel?.();
  };

  const commonValues = [
    { value: 'Honesty', label: t('profile.value_honesty', 'Honesty') },
    { value: 'Kindness', label: t('profile.value_kindness', 'Kindness') },
    { value: 'Growth', label: t('profile.value_growth', 'Growth') },
    { value: 'Balance', label: t('profile.value_balance', 'Balance') },
    { value: 'Adventure', label: t('profile.value_adventure', 'Adventure') },
    { value: 'Family', label: t('profile.value_family', 'Family') },
    { value: 'Career', label: t('profile.value_career', 'Career') },
    { value: 'Health', label: t('profile.value_health', 'Health') },
    { value: 'Creativity', label: t('profile.value_creativity', 'Creativity') },
    { value: 'Spirituality', label: t('profile.value_spirituality', 'Spirituality') },
    { value: 'Freedom', label: t('profile.value_freedom', 'Freedom') },
    { value: 'Loyalty', label: t('profile.value_loyalty', 'Loyalty') }
  ];
  const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const personalityTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];

  const selectClass = "bg-muted/50 border-border text-foreground";
  const labelClass = "text-muted-foreground text-xs";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>{t('profile.religion', 'Religion')}</Label>
            <SuggestionBadge show={fieldSources.religion === 'random'} />
          </div>
          <Select value={formData.religion} onValueChange={(v) => handleInputChange('religion', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder={t('profile.select_religion', 'Select religion')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="muslim">{t('profile.muslim', 'Muslim')}</SelectItem>
              <SelectItem value="christian">{t('profile.christian', 'Christian')}</SelectItem>
              <SelectItem value="jewish">{t('profile.jewish', 'Jewish')}</SelectItem>
              <SelectItem value="buddhist">{t('profile.buddhist', 'Buddhist')}</SelectItem>
              <SelectItem value="hindu">{t('profile.hindu', 'Hindu')}</SelectItem>
              <SelectItem value="spiritual">{t('profile.spiritual', 'Spiritual but not religious')}</SelectItem>
              <SelectItem value="agnostic">{t('profile.agnostic', 'Agnostic')}</SelectItem>
              <SelectItem value="atheist">{t('profile.atheist', 'Atheist')}</SelectItem>
              <SelectItem value="other">{t('common.other', 'Other')}</SelectItem>
              <SelectItem value="prefer-not-say">{t('common.prefer_not_say', 'Prefer not to say')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>{t('profile.political_views', 'Political Views')}</Label>
            <SuggestionBadge show={fieldSources.political_views === 'random'} />
          </div>
          <Select value={formData.politicalViews} onValueChange={(v) => handleInputChange('politicalViews', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder={t('profile.select_political_views', 'Select political views')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="liberal">{t('profile.liberal', 'Liberal')}</SelectItem>
              <SelectItem value="moderate">{t('profile.moderate', 'Moderate')}</SelectItem>
              <SelectItem value="conservative">{t('profile.conservative', 'Conservative')}</SelectItem>
              <SelectItem value="progressive">{t('profile.progressive', 'Progressive')}</SelectItem>
              <SelectItem value="libertarian">{t('profile.libertarian', 'Libertarian')}</SelectItem>
              <SelectItem value="apolitical">{t('profile.apolitical', 'Apolitical')}</SelectItem>
              <SelectItem value="prefer-not-say">{t('common.prefer_not_say', 'Prefer not to say')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>{t('profile.zodiac_sign', 'Zodiac Sign')}</Label>
            <SuggestionBadge show={fieldSources.zodiac_sign === 'random'} />
          </div>
          <Select value={formData.zodiacSign} onValueChange={(v) => handleInputChange('zodiacSign', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder={t('profile.select_zodiac', 'Select zodiac sign')} /></SelectTrigger>
            <SelectContent>
              {zodiacSigns.map(sign => (<SelectItem key={sign} value={sign.toLowerCase()}>{sign}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>{t('profile.personality_type', 'Personality Type (MBTI)')}</Label>
            <SuggestionBadge show={fieldSources.personality_type === 'random'} />
          </div>
          <Select value={formData.personalityType} onValueChange={(v) => handleInputChange('personalityType', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder={t('profile.select_type', 'Select type')} /></SelectTrigger>
            <SelectContent>
              {personalityTypes.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Label className={labelClass}>{t('profile.core_values', 'Core Values')}</Label>
          <SuggestionBadge show={fieldSources.values === 'random'} />
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {commonValues.map(item => (
            <Badge key={item.value}
              variant={formData.values.includes(item.value) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                formData.values.includes(item.value)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
              onClick={() => handleValueToggle(item.value)}
            >
              {item.label}
            </Badge>
          ))}
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

export default ValuesPersonalityEditor;
