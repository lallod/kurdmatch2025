
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProfileData, KurdistanRegion } from '@/types/profile';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import { SuggestionBadge } from '@/components/ui/suggestion-badge';

interface BasicInfoEditorProps {
  profileData: ProfileData;
  fieldSources?: { [key: string]: 'user' | 'random' | 'initial' };
  onUpdate: (updates: Partial<ProfileData>) => void;
  onSaveComplete?: () => void;
  onCancel?: () => void;
}

const BasicInfoEditor: React.FC<BasicInfoEditorProps> = ({ profileData, fieldSources = {}, onUpdate, onSaveComplete, onCancel }) => {
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
    onSaveComplete?.();
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
    onCancel?.();
  };

  const commonLanguages = [
    'Kurdish', 'English', 'Arabic', 'Turkish', 'Persian', 'German', 
    'French', 'Spanish', 'Italian', 'Dutch', 'Swedish'
  ];

  const kurdistanRegions: KurdistanRegion[] = [
    'South-Kurdistan', 'West-Kurdistan', 'East-Kurdistan', 'North-Kurdistan'
  ];

  const heights = Array.from({ length: 66 }, (_, i) => `${145 + i} cm`);

  const ethnicities = [
    'Kurdish', 'Middle Eastern', 'European', 'Asian', 'African', 
    'Latin American', 'Mixed', 'Other'
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-muted-foreground text-xs">Full Name</Label>
          <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)}
            className="bg-muted/50 border-border text-foreground opacity-60" disabled />
        </div>
        <div>
          <Label htmlFor="age" className="text-muted-foreground text-xs">Age</Label>
          <Input id="age" type="number" min="18" max="100" value={formData.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
            className="bg-muted/50 border-border text-foreground opacity-60" disabled />
        </div>
        <div>
          <Label className="text-muted-foreground text-xs">Height</Label>
          <Select value={formData.height} onValueChange={(value) => handleInputChange('height', value)}>
            <SelectTrigger className="bg-muted/50 border-border text-foreground">
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
          <Label className="text-muted-foreground text-xs">Ethnicity</Label>
          <Select value={formData.ethnicity} onValueChange={(value) => handleInputChange('ethnicity', value)}>
            <SelectTrigger className="bg-muted/50 border-border text-foreground">
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
          <Label className="text-muted-foreground text-xs">Location</Label>
          <Input value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)}
            className="bg-muted/50 border-border text-foreground" placeholder="City, Country" />
        </div>
        <div>
          <Label className="text-muted-foreground text-xs">Kurdistan Region</Label>
          <Select value={formData.kurdistanRegion} onValueChange={(value) => handleInputChange('kurdistanRegion', value as KurdistanRegion)}>
            <SelectTrigger className="bg-muted/50 border-border text-foreground">
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
        <Label className="text-muted-foreground text-xs">Languages</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {commonLanguages.map(language => (
            <Badge key={language}
              variant={formData.languages.includes(language) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                formData.languages.includes(language)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
              onClick={() => handleLanguageToggle(language)}
            >
              {language}
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

export default BasicInfoEditor;
