
import React from 'react';
import { ChoiceChips } from '../fields/ChoiceChips';
import { TagSelector } from '../fields/TagSelector';
import { Heart, Users, Baby } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

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
  const { t } = useTranslations();

  const relationshipGoalsOptions = [
    { value: 'serious_relationship', label: t('relationship.serious', 'Serious Relationship'), icon: <Heart className="w-4 h-4" />, description: t('relationship.serious_desc', 'Looking for something long-term') },
    { value: 'marriage', label: t('relationship.marriage', 'Marriage'), icon: <Heart className="w-4 h-4" />, description: t('relationship.marriage_desc', 'Ready to settle down') },
    { value: 'dating', label: t('relationship.dating', 'Dating'), icon: <Heart className="w-4 h-4" />, description: t('relationship.dating_desc', 'Getting to know people') },
    { value: 'friendship', label: t('relationship.friendship', 'Friendship'), icon: <Users className="w-4 h-4" />, description: t('relationship.friendship_desc', 'Looking for connections') },
    { value: 'not_sure', label: t('relationship.not_sure', 'Not sure yet'), icon: <Heart className="w-4 h-4" />, description: t('relationship.not_sure_desc', 'Open to possibilities') }
  ];

  const wantChildrenOptions = [
    { value: 'yes', label: t('children.want', 'Want children'), icon: <Baby className="w-4 h-4" /> },
    { value: 'no', label: t('children.dont_want', "Don't want children"), icon: <Baby className="w-4 h-4" /> },
    { value: 'maybe', label: t('children.maybe', 'Maybe someday'), icon: <Baby className="w-4 h-4" /> },
    { value: 'not_sure', label: t('children.not_sure', 'Not sure'), icon: <Baby className="w-4 h-4" /> }
  ];

  const childrenStatusOptions = [
    { value: 'no_children', label: t('children.no_children', 'No children'), icon: <Users className="w-4 h-4" /> },
    { value: 'have_children', label: t('children.have_children', 'Have children'), icon: <Users className="w-4 h-4" /> },
    { value: 'prefer_not_to_say', label: t('lifestyle.prefer_not_to_say', 'Prefer not to say'), icon: <Users className="w-4 h-4" /> }
  ];

  const familyClosenessOptions = [
    { value: 'very_close', label: t('family.very_close', 'Very close'), icon: <Users className="w-4 h-4" />, description: t('family.very_close_desc', 'Family is everything') },
    { value: 'close', label: t('family.close', 'Close'), icon: <Users className="w-4 h-4" />, description: t('family.close_desc', 'Regular contact') },
    { value: 'somewhat_close', label: t('family.somewhat_close', 'Somewhat close'), icon: <Users className="w-4 h-4" />, description: t('family.somewhat_close_desc', 'Occasional contact') },
    { value: 'not_very_close', label: t('family.not_very_close', 'Not very close'), icon: <Users className="w-4 h-4" />, description: t('family.not_very_close_desc', 'Limited contact') }
  ];

  const loveLanguageOptions = [
    { value: 'words_of_affirmation', label: t('love_language.words', 'Words of Affirmation'), emoji: '💬' },
    { value: 'quality_time', label: t('love_language.quality_time', 'Quality Time'), emoji: '⏰' },
    { value: 'physical_touch', label: t('love_language.physical_touch', 'Physical Touch'), emoji: '🤗' },
    { value: 'acts_of_service', label: t('love_language.acts_of_service', 'Acts of Service'), emoji: '🤝' },
    { value: 'receiving_gifts', label: t('love_language.receiving_gifts', 'Receiving Gifts'), emoji: '🎁' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">{t('wizard.what_looking_for', 'What are you looking for?')}</h2>
        <p className="text-purple-200">{t('wizard.relationship_goals_family', 'Tell us about your relationship goals and family values')}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.what_looking_for', 'What are you looking for?')}</h3>
          <ChoiceChips
            options={relationshipGoalsOptions}
            value={data.relationship_goals}
            onChange={(value) => onChange({ ...data, relationship_goals: value })}
            columns={1}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.want_children', 'Do you want children?')}</h3>
          <ChoiceChips
            options={wantChildrenOptions}
            value={data.want_children}
            onChange={(value) => onChange({ ...data, want_children: value })}
            columns={2}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.have_children', 'Do you have children?')}</h3>
          <ChoiceChips
            options={childrenStatusOptions}
            value={data.children_status}
            onChange={(value) => onChange({ ...data, children_status: value })}
            columns={2}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.family_closeness', 'How close are you with your family?')}</h3>
          <ChoiceChips
            options={familyClosenessOptions}
            value={data.family_closeness}
            onChange={(value) => onChange({ ...data, family_closeness: value })}
            columns={1}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.love_languages', 'Your love languages')}</h3>
          <TagSelector
            options={loveLanguageOptions}
            value={data.love_language || []}
            onChange={(value) => onChange({ ...data, love_language: value })}
            placeholder={t('wizard.how_express_love', 'How do you express and receive love?')}
            maxSelections={3}
          />
        </div>
      </div>
    </div>
  );
};
