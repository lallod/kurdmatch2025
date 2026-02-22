
import React from 'react';
import { ChoiceChips } from '../fields/ChoiceChips';
import { TagSelector } from '../fields/TagSelector';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Globe } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

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
  const { t } = useTranslations();
  const ethnicityOptions = [
    { value: 'kurdish', label: t('ethnicity.kurdish', 'Kurdish'), icon: <Globe className="w-4 h-4" /> },
    { value: 'arab', label: t('ethnicity.arab', 'Arab'), icon: <Globe className="w-4 h-4" /> },
    { value: 'turkish', label: t('ethnicity.turkish', 'Turkish'), icon: <Globe className="w-4 h-4" /> },
    { value: 'persian', label: t('ethnicity.persian', 'Persian'), icon: <Globe className="w-4 h-4" /> },
    { value: 'assyrian', label: t('ethnicity.assyrian', 'Assyrian'), icon: <Globe className="w-4 h-4" /> },
    { value: 'armenian', label: t('ethnicity.armenian', 'Armenian'), icon: <Globe className="w-4 h-4" /> },
    { value: 'circassian', label: t('ethnicity.circassian', 'Circassian'), icon: <Globe className="w-4 h-4" /> },
    { value: 'mixed_heritage', label: t('ethnicity.mixed_heritage', 'Mixed Heritage'), icon: <Globe className="w-4 h-4" /> },
    { value: 'european', label: t('ethnicity.european', 'European'), icon: <Globe className="w-4 h-4" /> },
    { value: 'african', label: t('ethnicity.african', 'African'), icon: <Globe className="w-4 h-4" /> },
    { value: 'asian', label: t('ethnicity.asian', 'Asian'), icon: <Globe className="w-4 h-4" /> },
    { value: 'latino_hispanic', label: t('ethnicity.latino_hispanic', 'Latino/Hispanic'), icon: <Globe className="w-4 h-4" /> },
    { value: 'other', label: t('common.other', 'Other'), icon: <Globe className="w-4 h-4" /> }
  ];

  const kurdistanRegionOptions = [
    { value: 'South-Kurdistan', label: t('region.south_kurdistan', 'South Kurdistan (Iraq)'), icon: <Globe className="w-4 h-4" /> },
    { value: 'North-Kurdistan', label: t('region.north_kurdistan', 'North Kurdistan (Turkey)'), icon: <Globe className="w-4 h-4" /> },
    { value: 'West-Kurdistan', label: t('region.west_kurdistan', 'West Kurdistan (Syria)'), icon: <Globe className="w-4 h-4" /> },
    { value: 'East-Kurdistan', label: t('region.east_kurdistan', 'East Kurdistan (Iran)'), icon: <Globe className="w-4 h-4" /> }
  ];

  const languageOptions = [
    { value: 'Kurdish (Sorani)', label: t('language.kurdish_sorani', 'Kurdish (Sorani)'), emoji: '🗣️' },
    { value: 'Kurdish (Kurmanji)', label: t('language.kurdish_kurmanji', 'Kurdish (Kurmanji)'), emoji: '🗣️' },
    { value: 'Arabic', label: t('language.arabic', 'Arabic'), emoji: '🗣️' },
    { value: 'Turkish', label: t('language.turkish', 'Turkish'), emoji: '🗣️' },
    { value: 'Persian', label: t('language.persian', 'Persian'), emoji: '🗣️' },
    { value: 'English', label: t('language.english', 'English'), emoji: '🗣️' },
    { value: 'German', label: t('language.german', 'German'), emoji: '🗣️' },
    { value: 'French', label: t('language.french', 'French'), emoji: '🗣️' },
    { value: 'Spanish', label: t('language.spanish', 'Spanish'), emoji: '🗣️' },
    { value: 'Italian', label: t('language.italian', 'Italian'), emoji: '🗣️' },
    { value: 'Dutch', label: t('language.dutch', 'Dutch'), emoji: '🗣️' },
    { value: 'Swedish', label: t('language.swedish', 'Swedish'), emoji: '🗣️' },
    { value: 'Norwegian', label: t('language.norwegian', 'Norwegian'), emoji: '🗣️' },
    { value: 'Russian', label: t('language.russian', 'Russian'), emoji: '🗣️' },
    { value: 'Chinese', label: t('language.chinese', 'Chinese'), emoji: '🗣️' },
    { value: 'Japanese', label: t('language.japanese', 'Japanese'), emoji: '🗣️' },
    { value: 'Portuguese', label: t('language.portuguese', 'Portuguese'), emoji: '🗣️' },
    { value: 'Hindi', label: t('language.hindi', 'Hindi'), emoji: '🗣️' },
    { value: 'Urdu', label: t('language.urdu', 'Urdu'), emoji: '🗣️' },
    { value: 'Hebrew', label: t('language.hebrew', 'Hebrew'), emoji: '🗣️' },
    { value: 'Armenian', label: t('language.armenian', 'Armenian'), emoji: '🗣️' },
    { value: 'Azerbaijani', label: t('language.azerbaijani', 'Azerbaijani'), emoji: '🗣️' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">{t('wizard.lets_start_basics', "Let's start with the basics")}</h2>
        <p className="text-purple-200">{t('wizard.help_others_know', 'Help others get to know the real you')}</p>
      </div>

      <div className="space-y-6">
        {/* Height */}
        <div className="space-y-3">
          <Label htmlFor="height" className="text-lg font-medium text-white">{t('profile.height', 'Height')}</Label>
          <Input
            id="height"
            value={data.height || ''}
            onChange={(e) => onChange({ ...data, height: e.target.value })}
            placeholder={t('wizard.height_placeholder', 'e.g., 175 cm or 5 feet 8 inches')}
            className="text-lg p-4 rounded-xl bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-purple-300"
          />
        </div>

        {/* Ethnicity */}
        <div className="space-y-3">
          <Label className="text-lg font-medium text-white">{t('profile.ethnicity', 'Ethnicity')}</Label>
          <ChoiceChips
            options={ethnicityOptions}
            value={data.ethnicity}
            onChange={(value) => onChange({ ...data, ethnicity: value })}
            columns={2}
          />
        </div>

        {/* Kurdistan Region */}
        <div className="space-y-3">
          <Label className="text-lg font-medium text-white">{t('wizard.kurdistan_region_connection', 'Kurdistan Region Connection')}</Label>
          <ChoiceChips
            options={kurdistanRegionOptions}
            value={data.kurdistan_region}
            onChange={(value) => onChange({ ...data, kurdistan_region: value })}
            columns={1}
          />
        </div>

        {/* Languages */}
        <div className="space-y-3">
          <Label className="text-lg font-medium text-white">{t('wizard.languages_you_speak', 'Languages You Speak')}</Label>
          <TagSelector
            options={languageOptions}
            value={data.languages || []}
            onChange={(value) => onChange({ ...data, languages: value })}
            placeholder={t('wizard.select_languages', 'Select the languages you speak...')}
            maxSelections={8}
          />
        </div>
      </div>
    </div>
  );
};
