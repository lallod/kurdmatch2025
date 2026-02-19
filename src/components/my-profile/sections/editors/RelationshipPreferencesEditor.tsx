
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileData } from '@/types/profile';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import { SuggestionBadge } from '@/components/ui/suggestion-badge';
import { useTranslations } from '@/hooks/useTranslations';

interface RelationshipPreferencesEditorProps {
  profileData: ProfileData;
  fieldSources?: { [key: string]: 'user' | 'random' | 'initial' };
  onUpdate: (updates: Partial<ProfileData>) => void;
  onSaveComplete?: () => void;
  onCancel?: () => void;
}

const RelationshipPreferencesEditor: React.FC<RelationshipPreferencesEditorProps> = ({ profileData, fieldSources = {}, onUpdate, onSaveComplete, onCancel }) => {
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    relationshipGoals: profileData.relationshipGoals || '',
    childrenStatus: profileData.childrenStatus || '',
    wantChildren: profileData.wantChildren || '',
    familyCloseness: profileData.familyCloseness || '',
    idealDate: profileData.idealDate || '',
    loveLanguage: profileData.loveLanguage || '',
    communicationStyle: profileData.communicationStyle || ''
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
    toast.success(t('toast.profile.relationship_updated', 'Relationship preferences updated!'));
    onSaveComplete?.();
  };

  const handleCancel = () => {
    setFormData({
      relationshipGoals: profileData.relationshipGoals || '',
      childrenStatus: profileData.childrenStatus || '',
      wantChildren: profileData.wantChildren || '',
      familyCloseness: profileData.familyCloseness || '',
      idealDate: profileData.idealDate || '',
      loveLanguage: profileData.loveLanguage || '',
      communicationStyle: profileData.communicationStyle || ''
    });
    setHasChanges(false);
    onCancel?.();
  };

  const familyClosenessOptions = [
    { value: 'Very close', label: t('profile.very_close', 'Very close') },
    { value: 'Close', label: t('profile.close', 'Close') },
    { value: 'Somewhat close', label: t('profile.somewhat_close', 'Somewhat close') },
    { value: 'Independent', label: t('profile.independent', 'Independent') },
    { value: 'Complicated', label: t('profile.complicated', 'Complicated') }
  ];
  const selectClass = "bg-muted/50 border-border text-foreground";
  const labelClass = "text-muted-foreground text-xs";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>{t('profile.relationship_goals', 'Relationship Goals')}</Label>
            <SuggestionBadge show={fieldSources.relationship_goals === 'random'} />
          </div>
          <Select value={formData.relationshipGoals} onValueChange={(v) => handleInputChange('relationshipGoals', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder={t('profile.looking_for', 'What are you looking for?')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="long-term">{t('profile.long_term', 'Long-term relationship')}</SelectItem>
              <SelectItem value="marriage">{t('profile.marriage', 'Marriage')}</SelectItem>
              <SelectItem value="casual">{t('profile.casual_dating', 'Casual dating')}</SelectItem>
              <SelectItem value="serious">{t('profile.something_serious', 'Something serious')}</SelectItem>
              <SelectItem value="see-what-happens">{t('profile.see_what_happens', "Let's see what happens")}</SelectItem>
              <SelectItem value="friendship-first">{t('profile.friendship_first', 'Friendship first')}</SelectItem>
              <SelectItem value="taking-slow">{t('profile.taking_slow', 'Taking things slow')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>{t('profile.children', 'Children')}</Label>
            <SuggestionBadge show={fieldSources.want_children === 'random'} />
          </div>
          <Select value={formData.wantChildren} onValueChange={(v) => handleInputChange('wantChildren', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder={t('profile.thoughts_children', 'Your thoughts on children?')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="want">{t('profile.want_children', 'Want children')}</SelectItem>
              <SelectItem value="dont-want">{t('profile.dont_want_children', "Don't want children")}</SelectItem>
              <SelectItem value="open">{t('profile.open_to_children', 'Open to children')}</SelectItem>
              <SelectItem value="have">{t('profile.already_have_children', 'Already have children')}</SelectItem>
              <SelectItem value="undecided">{t('profile.undecided', 'Undecided')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className={labelClass}>{t('profile.family_closeness', 'Family Closeness')}</Label>
          <Select value={formData.familyCloseness} onValueChange={(v) => handleInputChange('familyCloseness', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder={t('profile.how_close_family', 'How close to family?')} /></SelectTrigger>
            <SelectContent>
              {familyClosenessOptions.map(o => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>{t('profile.love_language', 'Love Language')}</Label>
            <SuggestionBadge show={fieldSources.love_language === 'random'} />
          </div>
          <Select value={formData.loveLanguage} onValueChange={(v) => handleInputChange('loveLanguage', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder={t('profile.how_feel_loved', 'How do you feel loved?')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="words-of-affirmation">{t('profile.words_of_affirmation', 'Words of Affirmation')}</SelectItem>
              <SelectItem value="quality-time">{t('profile.quality_time', 'Quality Time')}</SelectItem>
              <SelectItem value="physical-touch">{t('profile.physical_touch', 'Physical Touch')}</SelectItem>
              <SelectItem value="acts-of-service">{t('profile.acts_of_service', 'Acts of Service')}</SelectItem>
              <SelectItem value="receiving-gifts">{t('profile.receiving_gifts', 'Receiving Gifts')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>{t('profile.communication_style', 'Communication Style')}</Label>
            <SuggestionBadge show={fieldSources.communication_style === 'random'} />
          </div>
          <Select value={formData.communicationStyle} onValueChange={(v) => handleInputChange('communicationStyle', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder={t('profile.how_communicate', 'How do you communicate?')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="direct">{t('profile.direct', 'Direct')}</SelectItem>
              <SelectItem value="diplomatic">{t('profile.diplomatic', 'Diplomatic')}</SelectItem>
              <SelectItem value="expressive">{t('profile.expressive', 'Expressive')}</SelectItem>
              <SelectItem value="reserved">{t('profile.reserved', 'Reserved')}</SelectItem>
              <SelectItem value="analytical">{t('profile.analytical', 'Analytical')}</SelectItem>
              <SelectItem value="empathetic">{t('profile.empathetic', 'Empathetic')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Label className={labelClass}>{t('profile.ideal_date', 'Ideal Date')}</Label>
          <SuggestionBadge show={fieldSources.ideal_date === 'random'} />
        </div>
        <Textarea value={formData.idealDate} onChange={(e) => handleInputChange('idealDate', e.target.value)}
          rows={3} className={selectClass} placeholder={t('profile.describe_perfect_date', 'Describe your perfect date...')} />
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

export default RelationshipPreferencesEditor;
