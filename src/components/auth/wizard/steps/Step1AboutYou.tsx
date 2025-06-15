
import React from 'react';
import { ChoiceChips } from '../fields/ChoiceChips';
import { TagSelector } from '../fields/TagSelector';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Globe } from 'lucide-react';

interface Step1Data {
  height?: string;
  body_type?: string;
  ethnicity?: string;
  kurdistan_region?: string;
  languages?: string[];
}

interface Step1AboutYouProps {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
}

export const Step1AboutYou: React.FC<Step1AboutYouProps> = ({ data, onChange }) => {
  const bodyTypeOptions = [
    { value: 'slim', label: 'Slim', icon: <User className="w-4 h-4" /> },
    { value: 'athletic', label: 'Athletic', icon: <User className="w-4 h-4" /> },
    { value: 'average', label: 'Average', icon: <User className="w-4 h-4" /> },
    { value: 'curvy', label: 'Curvy', icon: <User className="w-4 h-4" /> },
    { value: 'heavyset', label: 'Heavyset', icon: <User className="w-4 h-4" /> },
    { value: 'prefer_not_to_say', label: 'Prefer not to say', icon: <User className="w-4 h-4" /> }
  ];

  const ethnicityOptions = [
    { value: 'kurdish', label: 'Kurdish', icon: <Globe className="w-4 h-4" /> },
    { value: 'arab', label: 'Arab', icon: <Globe className="w-4 h-4" /> },
    { value: 'turkish', label: 'Turkish', icon: <Globe className="w-4 h-4" /> },
    { value: 'persian', label: 'Persian', icon: <Globe className="w-4 h-4" /> },
    { value: 'mixed', label: 'Mixed', icon: <Globe className="w-4 h-4" /> },
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
    { value: 'Norwegian', label: 'Norwegian', emoji: '🗣️' }
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
            placeholder="e.g., 175 cm or 5'8&quot;"
            className="text-lg p-4 rounded-xl"
          />
        </div>

        {/* Body Type */}
        <div className="space-y-3">
          <Label className="text-lg font-medium">Body Type</Label>
          <ChoiceChips
            options={bodyTypeOptions}
            value={data.body_type}
            onChange={(value) => onChange({ ...data, body_type: value })}
            columns={2}
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
            maxSelections={6}
          />
        </div>
      </div>
    </div>
  );
};
