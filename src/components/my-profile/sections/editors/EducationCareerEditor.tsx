import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileData } from '@/types/profile';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import { SuggestionBadge } from '@/components/ui/suggestion-badge';

interface EducationCareerEditorProps {
  profileData: ProfileData;
  fieldSources?: { [key: string]: 'user' | 'random' | 'initial' };
  onUpdate: (updates: Partial<ProfileData>) => void;
}

const EducationCareerEditor: React.FC<EducationCareerEditorProps> = ({ profileData, fieldSources = {}, onUpdate }) => {
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
    toast.success('Education & career updated successfully!');
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
  };

  const educationLevels = [
    { value: 'high-school', label: 'High School' },
    { value: 'some-college', label: 'Some College' },
    { value: 'associates', label: 'Associate\'s Degree' },
    { value: 'bachelors', label: 'Bachelor\'s Degree' },
    { value: 'masters', label: 'Master\'s Degree' },
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

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Education & Career</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-purple-200">Education Level</Label>
                <SuggestionBadge show={fieldSources.education === 'random'} />
              </div>
              <Select value={formData.education} onValueChange={(value) => handleInputChange('education', value)}>
                <SelectTrigger className={`bg-gray-700 border-gray-600 text-white ${fieldSources.education === 'random' ? 'bg-blue-500/10 border-blue-400/30' : ''}`}>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-purple-200">Work-Life Balance</Label>
                <SuggestionBadge show={fieldSources.work_life_balance === 'random'} />
              </div>
              <Select value={formData.workLifeBalance} onValueChange={(value) => handleInputChange('workLifeBalance', value)}>
                <SelectTrigger className={`bg-gray-700 border-gray-600 text-white ${fieldSources.work_life_balance === 'random' ? 'bg-blue-500/10 border-blue-400/30' : ''}`}>
                  <SelectValue placeholder="Select work-life balance" />
                </SelectTrigger>
                <SelectContent>
                  {workLifeBalanceOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-purple-200">Occupation</Label>
              <Input
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Your job title"
              />
            </div>
            
            <div>
              <Label className="text-purple-200">Company</Label>
              <Input
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Where you work"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-purple-200">Career Ambitions</Label>
              <SuggestionBadge show={fieldSources.career_ambitions === 'random'} />
            </div>
            <Input
              value={formData.careerAmbitions}
              onChange={(e) => handleInputChange('careerAmbitions', e.target.value)}
              className={`bg-gray-700 border-gray-600 text-white ${fieldSources.career_ambitions === 'random' ? 'bg-blue-500/10 border-blue-400/30' : ''}`}
              placeholder="Describe your career goals"
            />
          </div>
        </CardContent>
      </Card>

      {hasChanges && (
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default EducationCareerEditor;