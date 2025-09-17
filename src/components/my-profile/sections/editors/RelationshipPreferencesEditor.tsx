
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileData } from '@/types/profile';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import { SuggestionBadge } from '@/components/ui/suggestion-badge';

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
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-purple-200">Relationship Goals</Label>
                <SuggestionBadge show={fieldSources.relationship_goals === 'random'} />
              </div>
              <Select value={formData.relationshipGoals} onValueChange={(value) => handleInputChange('relationshipGoals', value)}>
                <SelectTrigger className={`bg-gray-700 border-gray-600 text-white ${fieldSources.relationship_goals === 'random' ? 'bg-blue-500/10 border-blue-400/30' : ''}`}>
                  <SelectValue placeholder="What are you looking for?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long-term">Long-term relationship</SelectItem>
                  <SelectItem value="marriage">Marriage</SelectItem>
                  <SelectItem value="casual">Casual dating</SelectItem>
                  <SelectItem value="serious">Something serious</SelectItem>
                  <SelectItem value="see-what-happens">Let's see what happens</SelectItem>
                  <SelectItem value="friendship-first">Friendship first</SelectItem>
                  <SelectItem value="taking-slow">Taking things slow</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-purple-200">Children</Label>
                  <SuggestionBadge show={fieldSources.want_children === 'random'} />
                </div>
                <Select value={formData.wantChildren} onValueChange={(value) => handleInputChange('wantChildren', value)}>
                  <SelectTrigger className={`bg-gray-700 border-gray-600 text-white ${fieldSources.want_children === 'random' ? 'bg-blue-500/10 border-blue-400/30' : ''}`}>
                    <SelectValue placeholder="Your thoughts on children?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="want">Want children</SelectItem>
                    <SelectItem value="dont-want">Don't want children</SelectItem>
                    <SelectItem value="open">Open to children</SelectItem>
                    <SelectItem value="have">Already have children</SelectItem>
                    <SelectItem value="undecided">Undecided</SelectItem>
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
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-purple-200">Love Language</Label>
                  <SuggestionBadge show={fieldSources.love_language === 'random'} />
                </div>
                <Select value={formData.loveLanguage} onValueChange={(value) => handleInputChange('loveLanguage', value)}>
                  <SelectTrigger className={`bg-gray-700 border-gray-600 text-white ${fieldSources.love_language === 'random' ? 'bg-blue-500/10 border-blue-400/30' : ''}`}>
                    <SelectValue placeholder="How do you feel most loved?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="words-of-affirmation">Words of Affirmation</SelectItem>
                    <SelectItem value="quality-time">Quality Time</SelectItem>
                    <SelectItem value="physical-touch">Physical Touch</SelectItem>
                    <SelectItem value="acts-of-service">Acts of Service</SelectItem>
                    <SelectItem value="receiving-gifts">Receiving Gifts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-purple-200">Communication Style</Label>
                  <SuggestionBadge show={fieldSources.communication_style === 'random'} />
                </div>
                <Select value={formData.communicationStyle} onValueChange={(value) => handleInputChange('communicationStyle', value)}>
                  <SelectTrigger className={`bg-gray-700 border-gray-600 text-white ${fieldSources.communication_style === 'random' ? 'bg-blue-500/10 border-blue-400/30' : ''}`}>
                    <SelectValue placeholder="How do you communicate?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="diplomatic">Diplomatic</SelectItem>
                    <SelectItem value="expressive">Expressive</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="analytical">Analytical</SelectItem>
                    <SelectItem value="empathetic">Empathetic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="ideal-date" className="text-purple-200">Ideal Date</Label>
              <SuggestionBadge show={fieldSources.ideal_date === 'random'} />
            </div>
            <Textarea
              id="ideal-date"
              value={formData.idealDate}
              onChange={(e) => handleInputChange('idealDate', e.target.value)}
              rows={3}
              className={`bg-gray-700 border-gray-600 text-white ${fieldSources.ideal_date === 'random' ? 'bg-blue-500/10 border-blue-400/30' : ''}`}
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
