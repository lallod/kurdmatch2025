
import React from 'react';
import { ChoiceChips } from '../fields/ChoiceChips';
import { TagSelector } from '../fields/TagSelector';
import { Heart, Star } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface Step3Data {
  religion?: string;
  values?: string[];
  zodiac_sign?: string;
  personality_type?: string;
}

interface Step3ValuesProps {
  data: Step3Data;
  onChange: (data: Step3Data) => void;
}

export const Step3Values: React.FC<Step3ValuesProps> = ({ data, onChange }) => {
  const { t } = useTranslations();

  const religionOptions = [
    { value: 'muslim', label: t('religion.muslim', 'Muslim'), icon: <Star className="w-4 h-4" /> },
    { value: 'christian', label: t('religion.christian', 'Christian'), icon: <Star className="w-4 h-4" /> },
    { value: 'jewish', label: t('religion.jewish', 'Jewish'), icon: <Star className="w-4 h-4" /> },
    { value: 'spiritual', label: t('religion.spiritual', 'Spiritual'), icon: <Star className="w-4 h-4" /> },
    { value: 'agnostic', label: t('religion.agnostic', 'Agnostic'), icon: <Star className="w-4 h-4" /> },
    { value: 'atheist', label: t('religion.atheist', 'Atheist'), icon: <Star className="w-4 h-4" /> },
    { value: 'other', label: t('common.other', 'Other'), icon: <Star className="w-4 h-4" /> },
    { value: 'prefer_not_to_say', label: t('lifestyle.prefer_not_to_say', 'Prefer not to say'), icon: <Star className="w-4 h-4" /> }
  ];

  const valuesOptions = [
    { value: 'family', label: t('values.family', 'Family'), emoji: '👨‍👩‍👧‍👦' },
    { value: 'honesty', label: t('values.honesty', 'Honesty'), emoji: '🤝' },
    { value: 'loyalty', label: t('values.loyalty', 'Loyalty'), emoji: '💎' },
    { value: 'kurdish_heritage', label: t('values.kurdish_heritage', 'Kurdish Heritage'), emoji: '🏛️' },
    { value: 'community', label: t('values.community', 'Community'), emoji: '🤝' },
    { value: 'education', label: t('values.education', 'Education'), emoji: '📚' },
    { value: 'independence', label: t('values.independence', 'Independence'), emoji: '🦋' },
    { value: 'tradition', label: t('values.tradition', 'Tradition'), emoji: '🕊️' },
    { value: 'progress', label: t('values.progress', 'Progress'), emoji: '🚀' },
    { value: 'equality', label: t('values.equality', 'Equality'), emoji: '⚖️' },
    { value: 'freedom', label: t('values.freedom', 'Freedom'), emoji: '🗽' },
    { value: 'peace', label: t('values.peace', 'Peace'), emoji: '☮️' }
  ];

  const zodiacOptions = [
    { value: 'aries', label: t('zodiac.aries', 'Aries'), icon: <Star className="w-4 h-4" /> },
    { value: 'taurus', label: t('zodiac.taurus', 'Taurus'), icon: <Star className="w-4 h-4" /> },
    { value: 'gemini', label: t('zodiac.gemini', 'Gemini'), icon: <Star className="w-4 h-4" /> },
    { value: 'cancer', label: t('zodiac.cancer', 'Cancer'), icon: <Star className="w-4 h-4" /> },
    { value: 'leo', label: t('zodiac.leo', 'Leo'), icon: <Star className="w-4 h-4" /> },
    { value: 'virgo', label: t('zodiac.virgo', 'Virgo'), icon: <Star className="w-4 h-4" /> },
    { value: 'libra', label: t('zodiac.libra', 'Libra'), icon: <Star className="w-4 h-4" /> },
    { value: 'scorpio', label: t('zodiac.scorpio', 'Scorpio'), icon: <Star className="w-4 h-4" /> },
    { value: 'sagittarius', label: t('zodiac.sagittarius', 'Sagittarius'), icon: <Star className="w-4 h-4" /> },
    { value: 'capricorn', label: t('zodiac.capricorn', 'Capricorn'), icon: <Star className="w-4 h-4" /> },
    { value: 'aquarius', label: t('zodiac.aquarius', 'Aquarius'), icon: <Star className="w-4 h-4" /> },
    { value: 'pisces', label: t('zodiac.pisces', 'Pisces'), icon: <Star className="w-4 h-4" /> }
  ];

  const personalityOptions = [
    { value: 'introvert', label: t('personality.introvert', 'Introvert'), icon: <Heart className="w-4 h-4" /> },
    { value: 'extrovert', label: t('personality.extrovert', 'Extrovert'), icon: <Heart className="w-4 h-4" /> },
    { value: 'ambivert', label: t('personality.ambivert', 'Ambivert'), icon: <Heart className="w-4 h-4" /> },
    { value: 'creative', label: t('personality.creative', 'Creative'), icon: <Heart className="w-4 h-4" /> },
    { value: 'analytical', label: t('personality.analytical', 'Analytical'), icon: <Heart className="w-4 h-4" /> },
    { value: 'adventurous', label: t('personality.adventurous', 'Adventurous'), icon: <Heart className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">{t('wizard.whats_important', "What's important to you?")}</h2>
        <p className="text-purple-200">{t('wizard.share_values_beliefs', 'Share your values and beliefs')}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('profile.religion', 'Religion')}</h3>
          <ChoiceChips
            options={religionOptions}
            value={data.religion}
            onChange={(value) => onChange({ ...data, religion: value })}
            columns={2}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.what_value_most', 'What do you value most?')}</h3>
          <TagSelector
            options={valuesOptions}
            value={data.values || []}
            onChange={(value) => onChange({ ...data, values: value })}
            placeholder={t('wizard.select_core_values', 'Select your core values...')}
            maxSelections={5}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('profile.zodiac_sign', 'Zodiac Sign')}</h3>
          <ChoiceChips
            options={zodiacOptions}
            value={data.zodiac_sign}
            onChange={(value) => onChange({ ...data, zodiac_sign: value })}
            columns={3}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('profile.personality_type', 'Personality Type')}</h3>
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
