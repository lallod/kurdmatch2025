
import React from 'react';
import { ChoiceChips } from '../fields/ChoiceChips';
import { Activity, Wine, Cigarette, Heart, Moon, Utensils } from 'lucide-react';

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
  const exerciseOptions = [
    { value: 'never', label: 'Never', icon: <Activity className="w-4 h-4" />, description: 'I prefer other activities' },
    { value: 'rarely', label: 'Rarely', icon: <Activity className="w-4 h-4" />, description: 'Once in a while' },
    { value: 'few_times_week', label: 'Few times a week', icon: <Activity className="w-4 h-4" />, description: 'I try to stay active' },
    { value: 'daily', label: 'Daily', icon: <Activity className="w-4 h-4" />, description: 'It\'s part of my routine' },
    { value: 'fitness_enthusiast', label: 'Fitness enthusiast', icon: <Activity className="w-4 h-4" />, description: 'I live for the gym' }
  ];

  const petOptions = [
    { value: 'no_pets', label: 'No pets', icon: <Heart className="w-4 h-4" /> },
    { value: 'dog', label: 'Dog', icon: <Heart className="w-4 h-4" /> },
    { value: 'cat', label: 'Cat', icon: <Heart className="w-4 h-4" /> },
    { value: 'multiple_pets', label: 'Multiple pets', icon: <Heart className="w-4 h-4" /> },
    { value: 'want_pets', label: 'Want pets', icon: <Heart className="w-4 h-4" /> },
    { value: 'allergic_to_pets', label: 'Allergic to pets', icon: <Heart className="w-4 h-4" /> }
  ];

  const drinkingOptions = [
    { value: 'never', label: 'Never', icon: <Wine className="w-4 h-4" /> },
    { value: 'rarely', label: 'Rarely', icon: <Wine className="w-4 h-4" /> },
    { value: 'socially', label: 'Socially', icon: <Wine className="w-4 h-4" /> },
    { value: 'regularly', label: 'Regularly', icon: <Wine className="w-4 h-4" /> },
    { value: 'prefer_not_to_say', label: 'Prefer not to say', icon: <Wine className="w-4 h-4" /> }
  ];

  const smokingOptions = [
    { value: 'never', label: 'Never', icon: <Cigarette className="w-4 h-4" /> },
    { value: 'occasionally', label: 'Occasionally', icon: <Cigarette className="w-4 h-4" /> },
    { value: 'socially', label: 'Socially', icon: <Cigarette className="w-4 h-4" /> },
    { value: 'regularly', label: 'Regularly', icon: <Cigarette className="w-4 h-4" /> },
    { value: 'trying_to_quit', label: 'Trying to quit', icon: <Cigarette className="w-4 h-4" /> }
  ];

  const dietOptions = [
    { value: 'omnivore', label: 'Omnivore', icon: <Utensils className="w-4 h-4" /> },
    { value: 'vegetarian', label: 'Vegetarian', icon: <Utensils className="w-4 h-4" /> },
    { value: 'vegan', label: 'Vegan', icon: <Utensils className="w-4 h-4" /> },
    { value: 'pescatarian', label: 'Pescatarian', icon: <Utensils className="w-4 h-4" /> },
    { value: 'halal', label: 'Halal', icon: <Utensils className="w-4 h-4" /> },
    { value: 'kosher', label: 'Kosher', icon: <Utensils className="w-4 h-4" /> }
  ];

  const sleepOptions = [
    { value: 'early_bird', label: 'Early bird', icon: <Moon className="w-4 h-4" />, description: 'Early to bed, early to rise' },
    { value: 'night_owl', label: 'Night owl', icon: <Moon className="w-4 h-4" />, description: 'I come alive after dark' },
    { value: 'depends', label: 'It depends', icon: <Moon className="w-4 h-4" />, description: 'Flexible schedule' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Tell us about your lifestyle</h2>
        <p className="text-gray-600">Help us find people who match your way of life</p>
      </div>

      <div className="space-y-6">
        {/* Exercise Habits */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">How often do you exercise?</h3>
          <ChoiceChips
            options={exerciseOptions}
            value={data.exercise_habits}
            onChange={(value) => onChange({ ...data, exercise_habits: value })}
            columns={1}
          />
        </div>

        {/* Pets */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Do you have pets?</h3>
          <ChoiceChips
            options={petOptions}
            value={data.have_pets}
            onChange={(value) => onChange({ ...data, have_pets: value })}
            columns={2}
          />
        </div>

        {/* Drinking */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Do you drink alcohol?</h3>
          <ChoiceChips
            options={drinkingOptions}
            value={data.drinking}
            onChange={(value) => onChange({ ...data, drinking: value })}
            columns={2}
          />
        </div>

        {/* Smoking */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Do you smoke?</h3>
          <ChoiceChips
            options={smokingOptions}
            value={data.smoking}
            onChange={(value) => onChange({ ...data, smoking: value })}
            columns={2}
          />
        </div>

        {/* Diet */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Dietary preferences</h3>
          <ChoiceChips
            options={dietOptions}
            value={data.dietary_preferences}
            onChange={(value) => onChange({ ...data, dietary_preferences: value })}
            columns={2}
          />
        </div>

        {/* Sleep Schedule */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Are you a morning person or night owl?</h3>
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
