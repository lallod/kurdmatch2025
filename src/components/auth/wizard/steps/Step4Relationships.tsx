
import React from 'react';
import { ChoiceChips } from '../fields/ChoiceChips';
import { TagSelector } from '../fields/TagSelector';
import { Heart, Users, Baby } from 'lucide-react';

interface Step4Data {
  relationship_goals?: string;
  want_children?: string;
  children_status?: string;
  family_closeness?: string;
  love_language?: string[];
}

interface Step4RelationshipsProps {
  data: Step4Data;
  onChange: (data: Step4Data) => void;
}

export const Step4Relationships: React.FC<Step4RelationshipsProps> = ({ data, onChange }) => {
  const relationshipGoalsOptions = [
    { value: 'serious_relationship', label: 'Serious Relationship', icon: <Heart className="w-4 h-4" />, description: 'Looking for something long-term' },
    { value: 'marriage', label: 'Marriage', icon: <Heart className="w-4 h-4" />, description: 'Ready to settle down' },
    { value: 'dating', label: 'Dating', icon: <Heart className="w-4 h-4" />, description: 'Getting to know people' },
    { value: 'friendship', label: 'Friendship', icon: <Users className="w-4 h-4" />, description: 'Looking for connections' },
    { value: 'not_sure', label: 'Not sure yet', icon: <Heart className="w-4 h-4" />, description: 'Open to possibilities' }
  ];

  const wantChildrenOptions = [
    { value: 'yes', label: 'Want children', icon: <Baby className="w-4 h-4" /> },
    { value: 'no', label: "Don't want children", icon: <Baby className="w-4 h-4" /> },
    { value: 'maybe', label: 'Maybe someday', icon: <Baby className="w-4 h-4" /> },
    { value: 'not_sure', label: 'Not sure', icon: <Baby className="w-4 h-4" /> }
  ];

  const childrenStatusOptions = [
    { value: 'no_children', label: 'No children', icon: <Users className="w-4 h-4" /> },
    { value: 'have_children', label: 'Have children', icon: <Users className="w-4 h-4" /> },
    { value: 'prefer_not_to_say', label: 'Prefer not to say', icon: <Users className="w-4 h-4" /> }
  ];

  const familyClosenessOptions = [
    { value: 'very_close', label: 'Very close', icon: <Users className="w-4 h-4" />, description: 'Family is everything' },
    { value: 'close', label: 'Close', icon: <Users className="w-4 h-4" />, description: 'Regular contact' },
    { value: 'somewhat_close', label: 'Somewhat close', icon: <Users className="w-4 h-4" />, description: 'Occasional contact' },
    { value: 'not_very_close', label: 'Not very close', icon: <Users className="w-4 h-4" />, description: 'Limited contact' }
  ];

  const loveLanguageOptions = [
    { value: 'words_of_affirmation', label: 'Words of Affirmation', emoji: '💬' },
    { value: 'quality_time', label: 'Quality Time', emoji: '⏰' },
    { value: 'physical_touch', label: 'Physical Touch', emoji: '🤗' },
    { value: 'acts_of_service', label: 'Acts of Service', emoji: '🤝' },
    { value: 'receiving_gifts', label: 'Receiving Gifts', emoji: '🎁' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">What are you looking for?</h2>
        <p className="text-gray-600">Tell us about your relationship goals and family values</p>
      </div>

      <div className="space-y-6">
        {/* Relationship Goals */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">What are you looking for?</h3>
          <ChoiceChips
            options={relationshipGoalsOptions}
            value={data.relationship_goals}
            onChange={(value) => onChange({ ...data, relationship_goals: value })}
            columns={1}
          />
        </div>

        {/* Want Children */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Do you want children?</h3>
          <ChoiceChips
            options={wantChildrenOptions}
            value={data.want_children}
            onChange={(value) => onChange({ ...data, want_children: value })}
            columns={2}
          />
        </div>

        {/* Children Status */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Do you have children?</h3>
          <ChoiceChips
            options={childrenStatusOptions}
            value={data.children_status}
            onChange={(value) => onChange({ ...data, children_status: value })}
            columns={2}
          />
        </div>

        {/* Family Closeness */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">How close are you with your family?</h3>
          <ChoiceChips
            options={familyClosenessOptions}
            value={data.family_closeness}
            onChange={(value) => onChange({ ...data, family_closeness: value })}
            columns={1}
          />
        </div>

        {/* Love Language */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Your love languages</h3>
          <TagSelector
            options={loveLanguageOptions}
            value={data.love_language || []}
            onChange={(value) => onChange({ ...data, love_language: value })}
            placeholder="How do you express and receive love?"
            maxSelections={3}
          />
        </div>
      </div>
    </div>
  );
};
