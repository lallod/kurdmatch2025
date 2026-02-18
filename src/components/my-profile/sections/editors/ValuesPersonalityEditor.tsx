
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

  const commonValues = ['Honesty', 'Kindness', 'Growth', 'Balance', 'Adventure', 'Family', 'Career', 'Health', 'Creativity', 'Spirituality', 'Freedom', 'Loyalty'];
  const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const personalityTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];

  const selectClass = "bg-muted/50 border-border text-foreground";
  const labelClass = "text-muted-foreground text-xs";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>Religion</Label>
            <SuggestionBadge show={fieldSources.religion === 'random'} />
          </div>
          <Select value={formData.religion} onValueChange={(v) => handleInputChange('religion', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder="Select religion" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="muslim">Muslim</SelectItem>
              <SelectItem value="christian">Christian</SelectItem>
              <SelectItem value="jewish">Jewish</SelectItem>
              <SelectItem value="buddhist">Buddhist</SelectItem>
              <SelectItem value="hindu">Hindu</SelectItem>
              <SelectItem value="spiritual">Spiritual but not religious</SelectItem>
              <SelectItem value="agnostic">Agnostic</SelectItem>
              <SelectItem value="atheist">Atheist</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>Political Views</Label>
            <SuggestionBadge show={fieldSources.political_views === 'random'} />
          </div>
          <Select value={formData.politicalViews} onValueChange={(v) => handleInputChange('politicalViews', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder="Select political views" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="liberal">Liberal</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="conservative">Conservative</SelectItem>
              <SelectItem value="progressive">Progressive</SelectItem>
              <SelectItem value="libertarian">Libertarian</SelectItem>
              <SelectItem value="apolitical">Apolitical</SelectItem>
              <SelectItem value="prefer-not-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>Zodiac Sign</Label>
            <SuggestionBadge show={fieldSources.zodiac_sign === 'random'} />
          </div>
          <Select value={formData.zodiacSign} onValueChange={(v) => handleInputChange('zodiacSign', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder="Select zodiac sign" /></SelectTrigger>
            <SelectContent>
              {zodiacSigns.map(sign => (<SelectItem key={sign} value={sign.toLowerCase()}>{sign}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>Personality Type (MBTI)</Label>
            <SuggestionBadge show={fieldSources.personality_type === 'random'} />
          </div>
          <Select value={formData.personalityType} onValueChange={(v) => handleInputChange('personalityType', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {personalityTypes.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Label className={labelClass}>Core Values</Label>
          <SuggestionBadge show={fieldSources.values === 'random'} />
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
          {commonValues.map(value => (
            <Badge key={value}
              variant={formData.values.includes(value) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                formData.values.includes(value)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
              onClick={() => handleValueToggle(value)}
            >
              {value}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={handleCancel} className="flex-1 h-9 text-sm">
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1 h-9 text-sm bg-primary hover:bg-primary/90" disabled={!hasChanges}>
          <Save className="mr-2 h-4 w-4" /> Save
        </Button>
      </div>
    </div>
  );
};

export default ValuesPersonalityEditor;
