
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileData } from '@/types/profile';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';

interface CareerEducationEditorProps {
  profileData: ProfileData;
  fieldSources?: { [key: string]: 'user' | 'random' | 'initial' };
  onUpdate: (updates: Partial<ProfileData>) => void;
}

const CareerEducationEditor: React.FC<CareerEducationEditorProps> = ({ profileData, fieldSources = {}, onUpdate }) => {
  const [formData, setFormData] = useState({
    occupation: profileData.occupation || '',
    education: profileData.education || '',
    company: profileData.company || '',
    careerAmbitions: profileData.careerAmbitions || '',
    workLifeBalance: profileData.workLifeBalance || ''
  });
  
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
    toast.success('Career & education updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      occupation: profileData.occupation || '',
      education: profileData.education || '',
      company: profileData.company || '',
      careerAmbitions: profileData.careerAmbitions || '',
      workLifeBalance: profileData.workLifeBalance || ''
    });
    setHasChanges(false);
  };

  const educationLevels = [
    'High School', 'Some College', 'Associate Degree', 'Bachelor\'s Degree',
    'Master\'s Degree', 'PhD', 'Professional Degree', 'Trade School'
  ];

  const workLifeBalanceOptions = [
    'Work-focused', 'Balanced', 'Life-focused', 'Flexible', 'Entrepreneurial'
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Career & Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="occupation" className="text-purple-200">Occupation</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Your job title"
              />
            </div>
            
            <div>
              <Label htmlFor="company" className="text-purple-200">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Where you work"
              />
            </div>
            
            <div>
              <Label className="text-purple-200">Education Level</Label>
              <Select value={formData.education} onValueChange={(value) => handleInputChange('education', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-purple-200">Work-Life Balance</Label>
              <Select value={formData.workLifeBalance} onValueChange={(value) => handleInputChange('workLifeBalance', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="How do you approach work?" />
                </SelectTrigger>
                <SelectContent>
                  {workLifeBalanceOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="career-ambitions" className="text-purple-200">Career Ambitions</Label>
            <Textarea
              id="career-ambitions"
              value={formData.careerAmbitions}
              onChange={(e) => handleInputChange('careerAmbitions', e.target.value)}
              rows={3}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="What are your professional goals and dreams?"
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

export default CareerEducationEditor;
