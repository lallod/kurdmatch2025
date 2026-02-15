import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileData } from '@/types/profile';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import { SuggestionBadge } from '@/components/ui/suggestion-badge';

interface EducationCareerEditorProps {
  profileData: ProfileData;
  fieldSources?: { [key: string]: 'user' | 'random' | 'initial' };
  onUpdate: (updates: Partial<ProfileData>) => void;
  onSaveComplete?: () => void;
  onCancel?: () => void;
}

const EducationCareerEditor: React.FC<EducationCareerEditorProps> = ({ profileData, fieldSources = {}, onUpdate, onSaveComplete, onCancel }) => {
  const [formData, setFormData] = useState({
    education: profileData.education || '',
    occupation: profileData.occupation || '',
    company: profileData.company || '',
    workLifeBalance: profileData.workLifeBalance || '',
    careerAmbitions: profileData.careerAmbitions || ''
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
    toast.success('Education & career updated!');
    onSaveComplete?.();
  };

  const handleCancel = () => {
    setFormData({
      education: profileData.education || '',
      occupation: profileData.occupation || '',
      company: profileData.company || '',
      workLifeBalance: profileData.workLifeBalance || '',
      careerAmbitions: profileData.careerAmbitions || ''
    });
    setHasChanges(false);
    onCancel?.();
  };

  const educationLevels = [
    { value: 'high-school', label: 'High School' },
    { value: 'some-college', label: 'Some College' },
    { value: 'associates', label: "Associate's Degree" },
    { value: 'bachelors', label: "Bachelor's Degree" },
    { value: 'masters', label: "Master's Degree" },
    { value: 'phd', label: 'PhD' },
    { value: 'trade-school', label: 'Trade School' },
    { value: 'professional', label: 'Professional Degree' }
  ];

  const workLifeBalanceOptions = [
    { value: 'work-first', label: 'Work comes first' },
    { value: 'life-first', label: 'Life comes first' },
    { value: 'balanced', label: 'Balanced approach' },
    { value: 'situational', label: 'Depends on the situation' }
  ];

  const selectClass = "bg-muted/50 border-border text-foreground";
  const labelClass = "text-muted-foreground text-xs";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>Education Level</Label>
            <SuggestionBadge show={fieldSources.education === 'random'} />
          </div>
          <Select value={formData.education} onValueChange={(v) => handleInputChange('education', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder="Select education" /></SelectTrigger>
            <SelectContent>
              {educationLevels.map(l => (<SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Label className={labelClass}>Work-Life Balance</Label>
            <SuggestionBadge show={fieldSources.work_life_balance === 'random'} />
          </div>
          <Select value={formData.workLifeBalance} onValueChange={(v) => handleInputChange('workLifeBalance', v)}>
            <SelectTrigger className={selectClass}><SelectValue placeholder="Select balance" /></SelectTrigger>
            <SelectContent>
              {workLifeBalanceOptions.map(o => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className={labelClass}>Occupation</Label>
          <Input value={formData.occupation} onChange={(e) => handleInputChange('occupation', e.target.value)}
            className={selectClass} placeholder="Your job title" />
        </div>
        <div>
          <Label className={labelClass}>Company</Label>
          <Input value={formData.company} onChange={(e) => handleInputChange('company', e.target.value)}
            className={selectClass} placeholder="Where you work" />
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Label className={labelClass}>Career Ambitions</Label>
          <SuggestionBadge show={fieldSources.career_ambitions === 'random'} />
        </div>
        <Input value={formData.careerAmbitions} onChange={(e) => handleInputChange('careerAmbitions', e.target.value)}
          className={selectClass} placeholder="Describe your career goals" />
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

export default EducationCareerEditor;
