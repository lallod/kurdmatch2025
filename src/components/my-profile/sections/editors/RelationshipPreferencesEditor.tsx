
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileData } from '@/types/profile';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';

interface RelationshipPreferencesEditorProps {
  profileData: ProfileData;
  fieldSources?: { [key: string]: 'user' | 'random' | 'initial' };
  onUpdate: (updates: Partial<ProfileData>) => void;
}

const RelationshipPreferencesEditor: React.FC<RelationshipPreferencesEditorProps> = ({ profileData, fieldSources = {}, onUpdate }) => {
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
    toast.success('Relationship preferences updated successfully!');
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
  };

  const relationshipGoalsOptions = [
    'Looking for marriage', 'Long-term relationship', 'Casual dating', 
    'Friendship first', 'Open to see what happens', 'Something serious'
  ];

  const childrenOptions = [
    'Want children', 'Don\'t want children', 'Have children', 
    'Open to children', 'Undecided', 'Already have kids'
  ];

  const familyClosenessOptions = [
    'Very close', 'Close', 'Somewhat close', 'Independent', 'Complicated'
  ];

  const loveLanguageOptions = [
    'Words of affirmation', 'Physical touch', 'Quality time', 
    'Acts of service', 'Receiving gifts'
  ];

  const communicationStyleOptions = [
    'Direct', 'Gentle', 'Thoughtful', 'Spontaneous', 'Reserved', 'Expressive'
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Relationship Goals & Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-purple-200">Relationship Goals</Label>
              <Select value={formData.relationshipGoals} onValueChange={(value) => handleInputChange('relationshipGoals', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="What are you looking for?" />
                </SelectTrigger>
                <SelectContent>
                  {relationshipGoalsOptions.map(goal => (
                    <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-purple-200">Children</Label>
              <Select value={formData.wantChildren} onValueChange={(value) => handleInputChange('wantChildren', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Your thoughts on children?" />
                </SelectTrigger>
                <SelectContent>
                  {childrenOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-purple-200">Family Closeness</Label>
              <Select value={formData.familyCloseness} onValueChange={(value) => handleInputChange('familyCloseness', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="How close are you to family?" />
                </SelectTrigger>
                <SelectContent>
                  {familyClosenessOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-purple-200">Love Language</Label>
              <Select value={formData.loveLanguage} onValueChange={(value) => handleInputChange('loveLanguage', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="How do you feel most loved?" />
                </SelectTrigger>
                <SelectContent>
                  {loveLanguageOptions.map(language => (
                    <SelectItem key={language} value={language}>{language}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <Label className="text-purple-200">Communication Style</Label>
              <Select value={formData.communicationStyle} onValueChange={(value) => handleInputChange('communicationStyle', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="How do you communicate?" />
                </SelectTrigger>
                <SelectContent>
                  {communicationStyleOptions.map(style => (
                    <SelectItem key={style} value={style}>{style}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="ideal-date" className="text-purple-200">Ideal Date</Label>
            <Textarea
              id="ideal-date"
              value={formData.idealDate}
              onChange={(e) => handleInputChange('idealDate', e.target.value)}
              rows={3}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Describe your perfect date..."
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

export default RelationshipPreferencesEditor;
