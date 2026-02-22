
import React from 'react';
import { ChoiceChips } from '../fields/ChoiceChips';
import { Activity, Wine, Cigarette, Heart, Moon, Utensils } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface Step2Data {
  exercise_habits?: string;
  have_pets?: string;
  drinking?: string;
  smoking?: string;
  dietary_preferences?: string;
  sleep_schedule?: string;
}

interface Step2LifestyleProps {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
}

export const Step2Lifestyle: React.FC<Step2LifestyleProps> = ({ data, onChange }) => {
  const { t } = useTranslations();

  const exerciseOptions = [
    { value: 'never', label: t('lifestyle.never', 'Never'), icon: <Activity className="w-4 h-4" />, description: t('lifestyle.prefer_other', 'I prefer other activities') },
    { value: 'rarely', label: t('lifestyle.rarely', 'Rarely'), icon: <Activity className="w-4 h-4" />, description: t('lifestyle.once_in_while', 'Once in a while') },
    { value: 'few_times_week', label: t('lifestyle.few_times_week', 'Few times a week'), icon: <Activity className="w-4 h-4" />, description: t('lifestyle.try_stay_active', 'I try to stay active') },
    { value: 'daily', label: t('lifestyle.daily', 'Daily'), icon: <Activity className="w-4 h-4" />, description: t('lifestyle.part_of_routine', "It's part of my routine") },
    { value: 'fitness_enthusiast', label: t('lifestyle.fitness_enthusiast', 'Fitness enthusiast'), icon: <Activity className="w-4 h-4" />, description: t('lifestyle.live_for_gym', 'I live for the gym') }
  ];

  const petOptions = [
    { value: 'no_pets', label: t('lifestyle.no_pets', 'No pets'), icon: <Heart className="w-4 h-4" /> },
    { value: 'dog', label: t('lifestyle.dog', 'Dog'), icon: <Heart className="w-4 h-4" /> },
    { value: 'cat', label: t('lifestyle.cat', 'Cat'), icon: <Heart className="w-4 h-4" /> },
    { value: 'multiple_pets', label: t('lifestyle.multiple_pets', 'Multiple pets'), icon: <Heart className="w-4 h-4" /> },
    { value: 'want_pets', label: t('lifestyle.want_pets', 'Want pets'), icon: <Heart className="w-4 h-4" /> },
    { value: 'allergic_to_pets', label: t('lifestyle.allergic_to_pets', 'Allergic to pets'), icon: <Heart className="w-4 h-4" /> }
  ];

  const drinkingOptions = [
    { value: 'never', label: t('lifestyle.never', 'Never'), icon: <Wine className="w-4 h-4" /> },
    { value: 'rarely', label: t('lifestyle.rarely', 'Rarely'), icon: <Wine className="w-4 h-4" /> },
    { value: 'socially', label: t('lifestyle.socially', 'Socially'), icon: <Wine className="w-4 h-4" /> },
    { value: 'regularly', label: t('lifestyle.regularly', 'Regularly'), icon: <Wine className="w-4 h-4" /> },
    { value: 'prefer_not_to_say', label: t('lifestyle.prefer_not_to_say', 'Prefer not to say'), icon: <Wine className="w-4 h-4" /> }
  ];

  const smokingOptions = [
    { value: 'never', label: t('lifestyle.never', 'Never'), icon: <Cigarette className="w-4 h-4" /> },
    { value: 'occasionally', label: t('lifestyle.occasionally', 'Occasionally'), icon: <Cigarette className="w-4 h-4" /> },
    { value: 'socially', label: t('lifestyle.socially', 'Socially'), icon: <Cigarette className="w-4 h-4" /> },
    { value: 'regularly', label: t('lifestyle.regularly', 'Regularly'), icon: <Cigarette className="w-4 h-4" /> },
    { value: 'trying_to_quit', label: t('lifestyle.trying_to_quit', 'Trying to quit'), icon: <Cigarette className="w-4 h-4" /> }
  ];

  const dietOptions = [
    { value: 'omnivore', label: t('diet.omnivore', 'Omnivore'), icon: <Utensils className="w-4 h-4" /> },
    { value: 'vegetarian', label: t('diet.vegetarian', 'Vegetarian'), icon: <Utensils className="w-4 h-4" /> },
    { value: 'vegan', label: t('diet.vegan', 'Vegan'), icon: <Utensils className="w-4 h-4" /> },
    { value: 'pescatarian', label: t('diet.pescatarian', 'Pescatarian'), icon: <Utensils className="w-4 h-4" /> },
    { value: 'halal', label: t('diet.halal', 'Halal'), icon: <Utensils className="w-4 h-4" /> },
    { value: 'kosher', label: t('diet.kosher', 'Kosher'), icon: <Utensils className="w-4 h-4" /> }
  ];

  const sleepOptions = [
    { value: 'early_bird', label: t('lifestyle.early_bird', 'Early bird'), icon: <Moon className="w-4 h-4" />, description: t('lifestyle.early_to_bed', 'Early to bed, early to rise') },
    { value: 'night_owl', label: t('lifestyle.night_owl', 'Night owl'), icon: <Moon className="w-4 h-4" />, description: t('lifestyle.alive_after_dark', 'I come alive after dark') },
    { value: 'depends', label: t('lifestyle.it_depends', 'It depends'), icon: <Moon className="w-4 h-4" />, description: t('lifestyle.flexible_schedule', 'Flexible schedule') }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">{t('wizard.tell_us_lifestyle', 'Tell us about your lifestyle')}</h2>
        <p className="text-purple-200">{t('wizard.find_matching_people', 'Help us find people who match your way of life')}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.how_often_exercise', 'How often do you exercise?')}</h3>
          <ChoiceChips
            options={exerciseOptions}
            value={data.exercise_habits}
            onChange={(value) => onChange({ ...data, exercise_habits: value })}
            columns={1}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.have_pets', 'Do you have pets?')}</h3>
          <ChoiceChips
            options={petOptions}
            value={data.have_pets}
            onChange={(value) => onChange({ ...data, have_pets: value })}
            columns={2}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.drink_alcohol', 'Do you drink alcohol?')}</h3>
          <ChoiceChips
            options={drinkingOptions}
            value={data.drinking}
            onChange={(value) => onChange({ ...data, drinking: value })}
            columns={2}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.do_you_smoke', 'Do you smoke?')}</h3>
          <ChoiceChips
            options={smokingOptions}
            value={data.smoking}
            onChange={(value) => onChange({ ...data, smoking: value })}
            columns={2}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.dietary_preferences', 'Dietary preferences')}</h3>
          <ChoiceChips
            options={dietOptions}
            value={data.dietary_preferences}
            onChange={(value) => onChange({ ...data, dietary_preferences: value })}
            columns={2}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.morning_or_night', 'Are you a morning person or night owl?')}</h3>
          <ChoiceChips
            options={sleepOptions}
            value={data.sleep_schedule}
            onChange={(value) => onChange({ ...data, sleep_schedule: value })}
            columns={1}
          />
        </div>
      </div>
    </div>
  );
};
