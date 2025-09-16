
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfileData, KurdistanRegion } from '@/types/profile';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import { SuggestionBadge } from '@/components/ui/suggestion-badge';

interface BasicInfoEditorProps {
  profileData: ProfileData;
  fieldSources?: { [key: string]: 'user' | 'random' | 'initial' };
  onUpdate: (updates: Partial<ProfileData>) => void;
}

const BasicInfoEditor: React.FC<BasicInfoEditorProps> = ({ profileData, fieldSources = {}, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: profileData.name || '',
    age: profileData.age || 18,
    height: profileData.height || '',
    ethnicity: profileData.ethnicity || '',
    location: profileData.location || '',
    kurdistanRegion: profileData.kurdistanRegion || 'South-Kurdistan' as KurdistanRegion,
    languages: profileData.languages || []
  });
  
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleLanguageToggle = (language: string) => {
    const updatedLanguages = formData.languages.includes(language)
      ? formData.languages.filter(l => l !== language)
      : [...formData.languages, language];
    
    handleInputChange('languages', updatedLanguages);
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
    toast.success('Basic info updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: profileData.name || '',
      age: profileData.age || 18,
      height: profileData.height || '',
      ethnicity: profileData.ethnicity || '',
      location: profileData.location || '',
      kurdistanRegion: profileData.kurdistanRegion || 'South-Kurdistan' as KurdistanRegion,
      languages: profileData.languages || []
    });
    setHasChanges(false);
  };

  const commonLanguages = [
    'Kurdish', 'English', 'Arabic', 'Turkish', 'Persian', 'German', 
    'French', 'Spanish', 'Italian', 'Dutch', 'Swedish'
  ];

  const kurdistanRegions: KurdistanRegion[] = [
    'South-Kurdistan', 'West-Kurdistan', 'East-Kurdistan', 'North-Kurdistan'
  ];

  const heights = [
    "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", 
    "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\""
  ];

  const ethnicities = [
    'Kurdish', 'Middle Eastern', 'European', 'Asian', 'African', 
    'Latin American', 'Mixed', 'Other'
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-purple-200">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white opacity-60"
                disabled
              />
            </div>
            
            <div>
              <Label htmlFor="age" className="text-purple-200">Age</Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="100"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                className="bg-gray-700 border-gray-600 text-white opacity-60"
                disabled
              />
            </div>
            
            <div>
              <Label htmlFor="height" className="text-purple-200">Height</Label>
              <Select value={formData.height} onValueChange={(value) => handleInputChange('height', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select height" />
                </SelectTrigger>
                <SelectContent>
                  {heights.map(height => (
                    <SelectItem key={height} value={height}>{height}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="ethnicity" className="text-purple-200">Ethnicity</Label>
              <Select value={formData.ethnicity} onValueChange={(value) => handleInputChange('ethnicity', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  {ethnicities.map(ethnicity => (
                    <SelectItem key={ethnicity} value={ethnicity}>{ethnicity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="location" className="text-purple-200">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="City, Country"
              />
            </div>
            
            <div>
              <Label htmlFor="kurdistan-region" className="text-purple-200">Kurdistan Region</Label>
              <Select value={formData.kurdistanRegion} onValueChange={(value) => handleInputChange('kurdistanRegion', value as KurdistanRegion)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {kurdistanRegions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label className="text-purple-200">Languages</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonLanguages.map(language => (
                <Badge
                  key={language}
                  variant={formData.languages.includes(language) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    formData.languages.includes(language)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => handleLanguageToggle(language)}
                >
                  {language}
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

export default BasicInfoEditor;
