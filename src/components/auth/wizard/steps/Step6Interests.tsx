import React from 'react';
import { TagSelector } from '../fields/TagSelector';
import { Palette } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface Step6Data {
  interests?: string[];
  hobbies?: string[];
  creative_pursuits?: string[];
  weekend_activities?: string[];
  music_instruments?: string[];
  tech_skills?: string[];
}

interface Step6InterestsProps {
  data: Step6Data;
  onChange: (data: Step6Data) => void;
}

export const Step6Interests: React.FC<Step6InterestsProps> = ({ data, onChange }) => {
  const { t } = useTranslations();

  const interestsOptions = [
    { value: 'kurdish_music', label: t('interests.kurdish_music', 'Kurdish Music'), emoji: '🎵' },
    { value: 'poetry', label: t('interests.poetry', 'Poetry'), emoji: '📝' },
    { value: 'literature', label: t('interests.literature', 'Literature'), emoji: '📚' },
    { value: 'dance', label: t('interests.dance', 'Dance'), emoji: '💃' },
    { value: 'film', label: t('interests.film', 'Film'), emoji: '🎬' },
    { value: 'history', label: t('interests.history', 'History'), emoji: '🏛️' },
    { value: 'politics', label: t('interests.politics', 'Politics'), emoji: '🗳️' },
    { value: 'cultural_events', label: t('interests.cultural_events', 'Cultural Events'), emoji: '🎭' },
    { value: 'fashion', label: t('interests.fashion', 'Fashion'), emoji: '👗' },
    { value: 'travel', label: t('interests.travel', 'Travel'), emoji: '✈️' },
    { value: 'food', label: t('interests.food', 'Food'), emoji: '🍽️' },
    { value: 'languages', label: t('interests.languages', 'Languages'), emoji: '🗣️' },
    { value: 'photography', label: t('interests.photography', 'Photography'), emoji: '📸' },
    { value: 'art', label: t('interests.art', 'Art'), emoji: '🎨' },
    { value: 'technology', label: t('interests.technology', 'Technology'), emoji: '💻' },
    { value: 'science', label: t('interests.science', 'Science'), emoji: '🔬' },
    { value: 'nature_exploration', label: t('interests.nature', 'Nature'), emoji: '🌿' },
    { value: 'activism', label: t('interests.activism', 'Activism'), emoji: '✊' },
    { value: 'sports', label: t('interests.sports', 'Sports'), emoji: '⚽' },
    { value: 'fitness', label: t('interests.fitness', 'Fitness'), emoji: '💪' }
  ];

  const hobbiesOptions = [
    { value: 'reading', label: t('hobbies.reading', 'Reading'), emoji: '📖' },
    { value: 'writing', label: t('hobbies.writing', 'Writing'), emoji: '✍️' },
    { value: 'dancing', label: t('hobbies.dancing', 'Dancing'), emoji: '💃' },
    { value: 'singing', label: t('hobbies.singing', 'Singing'), emoji: '🎤' },
    { value: 'cooking', label: t('hobbies.cooking', 'Cooking'), emoji: '👨‍🍳' },
    { value: 'hiking', label: t('hobbies.hiking', 'Hiking'), emoji: '🥾' },
    { value: 'photography', label: t('hobbies.photography', 'Photography'), emoji: '📷' },
    { value: 'painting', label: t('hobbies.painting', 'Painting'), emoji: '🎨' },
    { value: 'gardening', label: t('hobbies.gardening', 'Gardening'), emoji: '🌱' },
    { value: 'playing_music', label: t('hobbies.playing_music', 'Playing Music'), emoji: '🎹' },
    { value: 'learning_languages', label: t('hobbies.learning_languages', 'Learning Languages'), emoji: '🗣️' },
    { value: 'travel', label: t('hobbies.travel', 'Travel'), emoji: '🧳' },
    { value: 'sports', label: t('hobbies.sports', 'Sports'), emoji: '🏃‍♂️' },
    { value: 'meditation', label: t('hobbies.meditation', 'Meditation'), emoji: '🧘' },
    { value: 'yoga', label: t('hobbies.yoga', 'Yoga'), emoji: '🧘‍♀️' },
    { value: 'crafting', label: t('hobbies.crafting', 'Crafting'), emoji: '✂️' },
    { value: 'volunteering', label: t('hobbies.volunteering', 'Volunteering'), emoji: '🤝' },
    { value: 'social_activism', label: t('hobbies.social_activism', 'Social Activism'), emoji: '✊' }
  ];

  const creativePursuitsOptions = [
    { value: 'music_production', label: t('creative.music_production', 'Music Production'), emoji: '🎧' },
    { value: 'writing', label: t('creative.writing', 'Writing'), emoji: '📝' },
    { value: 'visual_arts', label: t('creative.visual_arts', 'Visual Arts'), emoji: '🎨' },
    { value: 'photography', label: t('creative.photography', 'Photography'), emoji: '📸' },
    { value: 'video_editing', label: t('creative.video_editing', 'Video Editing'), emoji: '🎬' },
    { value: 'graphic_design', label: t('creative.graphic_design', 'Graphic Design'), emoji: '💻' },
    { value: 'crafts', label: t('creative.crafts', 'Crafts'), emoji: '✂️' },
    { value: 'fashion_design', label: t('creative.fashion_design', 'Fashion Design'), emoji: '👗' }
  ];

  const weekendActivitiesOptions = [
    { value: 'family_gatherings', label: t('weekend.family_gatherings', 'Family Gatherings'), emoji: '👨‍👩‍👧‍👦' },
    { value: 'cultural_events', label: t('weekend.cultural_events', 'Cultural Events'), emoji: '🎭' },
    { value: 'outdoor_activities', label: t('weekend.outdoor_activities', 'Outdoor Activities'), emoji: '🏞️' },
    { value: 'relaxing_at_home', label: t('weekend.relaxing_at_home', 'Relaxing at Home'), emoji: '🏠' },
    { value: 'exploring_new_places', label: t('weekend.exploring_new_places', 'Exploring New Places'), emoji: '🗺️' },
    { value: 'creative_projects', label: t('weekend.creative_projects', 'Creative Projects'), emoji: '🎨' },
    { value: 'sports_and_fitness', label: t('weekend.sports_fitness', 'Sports & Fitness'), emoji: '🏃‍♂️' },
    { value: 'social_gatherings', label: t('weekend.social_gatherings', 'Social Gatherings'), emoji: '🎉' }
  ];

  const musicInstrumentsOptions = [
    { value: 'tembur', label: t('instruments.tembur', 'Tembûr'), emoji: '🎵' },
    { value: 'ney', label: t('instruments.ney', 'Ney'), emoji: '🎵' },
    { value: 'def', label: t('instruments.def', 'Def'), emoji: '🥁' },
    { value: 'zurna', label: t('instruments.zurna', 'Zurna'), emoji: '🎺' },
    { value: 'dohol', label: t('instruments.dohol', 'Dohol'), emoji: '🥁' },
    { value: 'tar', label: t('instruments.tar', 'Tar'), emoji: '🎵' },
    { value: 'setar', label: t('instruments.setar', 'Setar'), emoji: '🎵' },
    { value: 'saz', label: t('instruments.saz', 'Saz'), emoji: '🎵' },
    { value: 'guitar', label: t('instruments.guitar', 'Guitar'), emoji: '🎸' },
    { value: 'piano', label: t('instruments.piano', 'Piano'), emoji: '🎹' },
    { value: 'violin', label: t('instruments.violin', 'Violin'), emoji: '🎻' },
    { value: 'flute', label: t('instruments.flute', 'Flute'), emoji: '🪈' }
  ];

  const techSkillsOptions = [
    { value: 'web_development', label: t('tech.web_development', 'Web Development'), emoji: '💻' },
    { value: 'graphic_design', label: t('tech.graphic_design', 'Graphic Design'), emoji: '🎨' },
    { value: 'social_media', label: t('tech.social_media', 'Social Media'), emoji: '📱' },
    { value: 'video_editing', label: t('tech.video_editing', 'Video Editing'), emoji: '🎬' },
    { value: 'photography', label: t('tech.photography', 'Photography'), emoji: '📸' },
    { value: 'programming', label: t('tech.programming', 'Programming'), emoji: '⌨️' },
    { value: 'data_analysis', label: t('tech.data_analysis', 'Data Analysis'), emoji: '📊' },
    { value: 'digital_marketing', label: t('tech.digital_marketing', 'Digital Marketing'), emoji: '📈' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Palette className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">{t('wizard.what_you_love', 'What do you love to do?')}</h2>
        <p className="text-purple-200">{t('wizard.share_interests', 'Share your interests and hobbies')}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.your_interests', 'Your Interests')}</h3>
          <TagSelector
            options={interestsOptions}
            value={data.interests || []}
            onChange={(value) => onChange({ ...data, interests: value })}
            placeholder={t('wizard.interests_placeholder', 'What are you passionate about?')}
            maxSelections={8}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.your_hobbies', 'Your Hobbies')}</h3>
          <TagSelector
            options={hobbiesOptions}
            value={data.hobbies || []}
            onChange={(value) => onChange({ ...data, hobbies: value })}
            placeholder={t('wizard.hobbies_placeholder', 'What do you enjoy doing in your free time?')}
            maxSelections={6}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.creative_pursuits', 'Creative Pursuits')}</h3>
          <TagSelector
            options={creativePursuitsOptions}
            value={data.creative_pursuits || []}
            onChange={(value) => onChange({ ...data, creative_pursuits: value })}
            placeholder={t('wizard.creative_placeholder', 'Any creative activities you enjoy?')}
            maxSelections={4}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.weekend_activities', 'Weekend Activities')}</h3>
          <TagSelector
            options={weekendActivitiesOptions}
            value={data.weekend_activities || []}
            onChange={(value) => onChange({ ...data, weekend_activities: value })}
            placeholder={t('wizard.weekend_placeholder', 'How do you like to spend your weekends?')}
            maxSelections={4}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.musical_instruments', 'Musical Instruments')}</h3>
          <TagSelector
            options={musicInstrumentsOptions}
            value={data.music_instruments || []}
            onChange={(value) => onChange({ ...data, music_instruments: value })}
            placeholder={t('wizard.instruments_placeholder', 'Do you play any instruments?')}
            maxSelections={3}
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">{t('wizard.tech_skills', 'Tech Skills')}</h3>
          <TagSelector
            options={techSkillsOptions}
            value={data.tech_skills || []}
            onChange={(value) => onChange({ ...data, tech_skills: value })}
            placeholder={t('wizard.tech_placeholder', 'Any technical skills?')}
            maxSelections={4}
          />
        </div>
      </div>
    </div>
  );
};