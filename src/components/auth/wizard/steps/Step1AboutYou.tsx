
import React from 'react';
import { ChoiceChips } from '../fields/ChoiceChips';
import { TagSelector } from '../fields/TagSelector';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Globe } from 'lucide-react';

interface Step1Data {
  height?: string;
  ethnicity?: string;
  kurdistan_region?: string;
  languages?: string[];
}

interface Step1AboutYouProps {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
}

export const Step1AboutYou: React.FC<Step1AboutYouProps> = ({ data, onChange }) => {
  const ethnicityOptions = [
    { value: 'kurdish', label: 'Kurdish', icon: <Globe className="w-4 h-4" /> },
    { value: 'arab', label: 'Arab', icon: <Globe className="w-4 h-4" /> },
    { value: 'turkish', label: 'Turkish', icon: <Globe className="w-4 h-4" /> },
    { value: 'persian', label: 'Persian', icon: <Globe className="w-4 h-4" /> },
    { value: 'assyrian', label: 'Assyrian', icon: <Globe className="w-4 h-4" /> },
    { value: 'armenian', label: 'Armenian', icon: <Globe className="w-4 h-4" /> },
    { value: 'circassian', label: 'Circassian', icon: <Globe className="w-4 h-4" /> },
    { value: 'mixed_heritage', label: 'Mixed Heritage', icon: <Globe className="w-4 h-4" /> },
    { value: 'european', label: 'European', icon: <Globe className="w-4 h-4" /> },
    { value: 'african', label: 'African', icon: <Globe className="w-4 h-4" /> },
    { value: 'asian', label: 'Asian', icon: <Globe className="w-4 h-4" /> },
    { value: 'latino_hispanic', label: 'Latino/Hispanic', icon: <Globe className="w-4 h-4" /> },
    { value: 'other', label: 'Other', icon: <Globe className="w-4 h-4" /> }
  ];

  const kurdistanRegionOptions = [
    { value: 'South-Kurdistan', label: 'South Kurdistan (Iraq)', icon: <Globe className="w-4 h-4" /> },
    { value: 'North-Kurdistan', label: 'North Kurdistan (Turkey)', icon: <Globe className="w-4 h-4" /> },
    { value: 'West-Kurdistan', label: 'West Kurdistan (Syria)', icon: <Globe className="w-4 h-4" /> },
    { value: 'East-Kurdistan', label: 'East Kurdistan (Iran)', icon: <Globe className="w-4 h-4" /> }
  ];

  const languageOptions = [
    { value: 'Kurdish (Sorani)', label: 'Kurdish (Sorani)', emoji: '🗣️' },
    { value: 'Kurdish (Kurmanji)', label: 'Kurdish (Kurmanji)', emoji: '🗣️' },
    { value: 'Arabic', label: 'Arabic', emoji: '🗣️' },
    { value: 'Turkish', label: 'Turkish', emoji: '🗣️' },
    { value: 'Persian', label: 'Persian', emoji: '🗣️' },
    { value: 'English', label: 'English', emoji: '🗣️' },
    { value: 'German', label: 'German', emoji: '🗣️' },
    { value: 'French', label: 'French', emoji: '🗣️' },
    { value: 'Spanish', label: 'Spanish', emoji: '🗣️' },
    { value: 'Italian', label: 'Italian', emoji: '🗣️' },
    { value: 'Dutch', label: 'Dutch', emoji: '🗣️' },
    { value: 'Swedish', label: 'Swedish', emoji: '🗣️' },
    { value: 'Norwegian', label: 'Norwegian', emoji: '🗣️' },
    { value: 'Russian', label: 'Russian', emoji: '🗣️' },
    { value: 'Chinese', label: 'Chinese', emoji: '🗣️' },
    { value: 'Japanese', label: 'Japanese', emoji: '🗣️' },
    { value: 'Portuguese', label: 'Portuguese', emoji: '🗣️' },
    { value: 'Hindi', label: 'Hindi', emoji: '🗣️' },
    { value: 'Urdu', label: 'Urdu', emoji: '🗣️' },
    { value: 'Hebrew', label: 'Hebrew', emoji: '🗣️' },
    { value: 'Armenian', label: 'Armenian', emoji: '🗣️' },
    { value: 'Azerbaijani', label: 'Azerbaijani', emoji: '🗣️' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Let's start with the basics</h2>
        <p className="text-gray-600">Help others get to know the real you</p>
      </div>

      <div className="space-y-6">
        {/* Height */}
        <div className="space-y-3">
          <Label htmlFor="height" className="text-lg font-medium">Height</Label>
          <Input
            id="height"
            value={data.height || ''}
            onChange={(e) => onChange({ ...data, height: e.target.value })}
            placeholder="e.g., 175 cm or 5 feet 8 inches"
            className="text-lg p-4 rounded-xl"
          />
        </div>

        {/* Ethnicity */}
        <div className="space-y-3">
          <Label className="text-lg font-medium">Ethnicity</Label>
          <ChoiceChips
            options={ethnicityOptions}
            value={data.ethnicity}
            onChange={(value) => onChange({ ...data, ethnicity: value })}
            columns={2}
          />
        </div>

        {/* Kurdistan Region */}
        <div className="space-y-3">
          <Label className="text-lg font-medium">Kurdistan Region Connection</Label>
          <ChoiceChips
            options={kurdistanRegionOptions}
            value={data.kurdistan_region}
            onChange={(value) => onChange({ ...data, kurdistan_region: value })}
            columns={1}
          />
        </div>

        {/* Languages */}
        <div className="space-y-3">
          <Label className="text-lg font-medium">Languages You Speak</Label>
          <TagSelector
            options={languageOptions}
            value={data.languages || []}
            onChange={(value) => onChange({ ...data, languages: value })}
            placeholder="Select the languages you speak..."
            maxSelections={8}
          />
        </div>
      </div>
    </div>
  );
};
