
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfileData } from '@/types/profile';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import { SuggestionBadge } from '@/components/ui/suggestion-badge';
import { getFieldSourceIndicator } from '@/utils/profileEnhancement';

interface ValuesPersonalityEditorProps {
  profileData: ProfileData;
  fieldSources?: { [key: string]: 'user' | 'random' | 'initial' };
  onUpdate: (updates: Partial<ProfileData>) => void;
}

const ValuesPersonalityEditor: React.FC<ValuesPersonalityEditorProps> = ({ profileData, fieldSources = {}, onUpdate }) => {
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
    toast.success('Values & personality updated successfully!');
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
  };

  const commonValues = [
    'Honesty', 'Kindness', 'Growth', 'Balance', 'Adventure', 'Family', 
    'Career', 'Health', 'Creativity', 'Spirituality', 'Freedom', 'Loyalty'
  ];

  const zodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const personalityTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Values & Personality</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-purple-200">Religion</Label>
                <SuggestionBadge show={fieldSources.religion === 'random'} />
              </div>
              <Select value={formData.religion} onValueChange={(value) => handleInputChange('religion', value)}>
                <SelectTrigger className={`bg-gray-700 border-gray-600 text-white ${fieldSources.religion === 'random' ? 'bg-blue-500/10 border-blue-400/30' : ''}`}>
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
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
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-purple-200">Political Views</Label>
                <SuggestionBadge show={fieldSources.political_views === 'random'} />
              </div>
              <Select value={formData.politicalViews} onValueChange={(value) => handleInputChange('politicalViews', value)}>
                <SelectTrigger className={`bg-gray-700 border-gray-600 text-white ${fieldSources.political_views === 'random' ? 'bg-blue-500/10 border-blue-400/30' : ''}`}>
                  <SelectValue placeholder="Select political views" />
                </SelectTrigger>
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
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-purple-200">Zodiac Sign</Label>
                <SuggestionBadge show={fieldSources.zodiac_sign === 'random'} />
              </div>
              <Select value={formData.zodiacSign} onValueChange={(value) => handleInputChange('zodiacSign', value)}>
                <SelectTrigger className={`bg-gray-700 border-gray-600 text-white ${fieldSources.zodiac_sign === 'random' ? 'bg-blue-500/10 border-blue-400/30' : ''}`}>
                  <SelectValue placeholder="Select zodiac sign" />
                </SelectTrigger>
                <SelectContent>
                  {zodiacSigns.map(sign => (
                    <SelectItem key={sign} value={sign.toLowerCase()}>{sign}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-purple-200">Personality Type (MBTI)</Label>
                <SuggestionBadge show={fieldSources.personality_type === 'random'} />
              </div>
              <Select value={formData.personalityType} onValueChange={(value) => handleInputChange('personalityType', value)}>
                <SelectTrigger className={`bg-gray-700 border-gray-600 text-white ${fieldSources.personality_type === 'random' ? 'bg-blue-500/10 border-blue-400/30' : ''}`}>
                  <SelectValue placeholder="Select personality type" />
                </SelectTrigger>
                <SelectContent>
                  {personalityTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-purple-200">Core Values</Label>
              <SuggestionBadge show={fieldSources.values === 'random'} />
            </div>
            <div className={`flex flex-wrap gap-2 mt-2 p-3 rounded-lg ${fieldSources.values === 'random' ? 'bg-blue-500/10 border border-blue-400/30' : ''}`}>
              {commonValues.map(value => (
                <Badge
                  key={value}
                  variant={formData.values.includes(value) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    formData.values.includes(value)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => handleValueToggle(value)}
                >
                  {value}
                </Badge>
              ))}
            </div>
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

export default ValuesPersonalityEditor;
