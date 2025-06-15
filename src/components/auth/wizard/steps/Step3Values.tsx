
import React from 'react';
import { ChoiceChips } from '../fields/ChoiceChips';
import { TagSelector } from '../fields/TagSelector';
import { Heart, Star, Globe2 } from 'lucide-react';

interface Step3Data {
  religion?: string;
  political_views?: string;
  values?: string[];
  zodiac_sign?: string;
  personality_type?: string;
}

interface Step3ValuesProps {
  data: Step3Data;
  onChange: (data: Step3Data) => void;
}

export const Step3Values: React.FC<Step3ValuesProps> = ({ data, onChange }) => {
  const religionOptions = [
    { value: 'muslim', label: 'Muslim', icon: <Star className="w-4 h-4" /> },
    { value: 'christian', label: 'Christian', icon: <Star className="w-4 h-4" /> },
    { value: 'jewish', label: 'Jewish', icon: <Star className="w-4 h-4" /> },
    { value: 'spiritual', label: 'Spiritual', icon: <Star className="w-4 h-4" /> },
    { value: 'agnostic', label: 'Agnostic', icon: <Star className="w-4 h-4" /> },
    { value: 'atheist', label: 'Atheist', icon: <Star className="w-4 h-4" /> },
    { value: 'other', label: 'Other', icon: <Star className="w-4 h-4" /> },
    { value: 'prefer_not_to_say', label: 'Prefer not to say', icon: <Star className="w-4 h-4" /> }
  ];

  const politicalViewsOptions = [
    { value: 'liberal', label: 'Liberal', icon: <Globe2 className="w-4 h-4" /> },
    { value: 'moderate', label: 'Moderate', icon: <Globe2 className="w-4 h-4" /> },
    { value: 'conservative', label: 'Conservative', icon: <Globe2 className="w-4 h-4" /> },
    { value: 'progressive', label: 'Progressive', icon: <Globe2 className="w-4 h-4" /> },
    { value: 'independent', label: 'Independent', icon: <Globe2 className="w-4 h-4" /> },
    { value: 'not_political', label: 'Not political', icon: <Globe2 className="w-4 h-4" /> },
    { value: 'prefer_not_to_say', label: 'Prefer not to say', icon: <Globe2 className="w-4 h-4" /> }
  ];

  const valuesOptions = [
    { value: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
    { value: 'honesty', label: 'Honesty', emoji: '🤝' },
    { value: 'loyalty', label: 'Loyalty', emoji: '💎' },
    { value: 'kurdish_heritage', label: 'Kurdish Heritage', emoji: '🏛️' },
    { value: 'community', label: 'Community', emoji: '🤝' },
    { value: 'education', label: 'Education', emoji: '📚' },
    { value: 'independence', label: 'Independence', emoji: '🦋' },
    { value: 'tradition', label: 'Tradition', emoji: '🕊️' },
    { value: 'progress', label: 'Progress', emoji: '🚀' },
    { value: 'equality', label: 'Equality', emoji: '⚖️' },
    { value: 'freedom', label: 'Freedom', emoji: '🗽' },
    { value: 'peace', label: 'Peace', emoji: '☮️' }
  ];

  const zodiacOptions = [
    { value: 'aries', label: 'Aries', icon: <Star className="w-4 h-4" /> },
    { value: 'taurus', label: 'Taurus', icon: <Star className="w-4 h-4" /> },
    { value: 'gemini', label: 'Gemini', icon: <Star className="w-4 h-4" /> },
    { value: 'cancer', label: 'Cancer', icon: <Star className="w-4 h-4" /> },
    { value: 'leo', label: 'Leo', icon: <Star className="w-4 h-4" /> },
    { value: 'virgo', label: 'Virgo', icon: <Star className="w-4 h-4" /> },
    { value: 'libra', label: 'Libra', icon: <Star className="w-4 h-4" /> },
    { value: 'scorpio', label: 'Scorpio', icon: <Star className="w-4 h-4" /> },
    { value: 'sagittarius', label: 'Sagittarius', icon: <Star className="w-4 h-4" /> },
    { value: 'capricorn', label: 'Capricorn', icon: <Star className="w-4 h-4" /> },
    { value: 'aquarius', label: 'Aquarius', icon: <Star className="w-4 h-4" /> },
    { value: 'pisces', label: 'Pisces', icon: <Star className="w-4 h-4" /> }
  ];

  const personalityOptions = [
    { value: 'introvert', label: 'Introvert', icon: <Heart className="w-4 h-4" /> },
    { value: 'extrovert', label: 'Extrovert', icon: <Heart className="w-4 h-4" /> },
    { value: 'ambivert', label: 'Ambivert', icon: <Heart className="w-4 h-4" /> },
    { value: 'creative', label: 'Creative', icon: <Heart className="w-4 h-4" /> },
    { value: 'analytical', label: 'Analytical', icon: <Heart className="w-4 h-4" /> },
    { value: 'adventurous', label: 'Adventurous', icon: <Heart className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">What's important to you?</h2>
        <p className="text-gray-600">Share your values and beliefs</p>
      </div>

      <div className="space-y-6">
        {/* Religion */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Religion</h3>
          <ChoiceChips
            options={religionOptions}
            value={data.religion}
            onChange={(value) => onChange({ ...data, religion: value })}
            columns={2}
          />
        </div>

        {/* Political Views */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Political Views</h3>
          <ChoiceChips
            options={politicalViewsOptions}
            value={data.political_views}
            onChange={(value) => onChange({ ...data, political_views: value })}
            columns={2}
          />
        </div>

        {/* Values */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">What do you value most?</h3>
          <TagSelector
            options={valuesOptions}
            value={data.values || []}
            onChange={(value) => onChange({ ...data, values: value })}
            placeholder="Select your core values..."
            maxSelections={5}
          />
        </div>

        {/* Zodiac Sign */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Zodiac Sign</h3>
          <ChoiceChips
            options={zodiacOptions}
            value={data.zodiac_sign}
            onChange={(value) => onChange({ ...data, zodiac_sign: value })}
            columns={3}
          />
        </div>

        {/* Personality Type */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Personality Type</h3>
          <ChoiceChips
            options={personalityOptions}
            value={data.personality_type}
            onChange={(value) => onChange({ ...data, personality_type: value })}
            columns={2}
          />
        </div>
      </div>
    </div>
  );
};
