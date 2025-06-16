import React from 'react';
import { TagSelector } from '../fields/TagSelector';
import { Palette, Music, Gamepad2 } from 'lucide-react';

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
  const interestsOptions = [
    { value: 'kurdish_music', label: 'Kurdish Music', emoji: '🎵' },
    { value: 'poetry', label: 'Poetry', emoji: '📝' },
    { value: 'literature', label: 'Literature', emoji: '📚' },
    { value: 'dance', label: 'Dance', emoji: '💃' },
    { value: 'film', label: 'Film', emoji: '🎬' },
    { value: 'history', label: 'History', emoji: '🏛️' },
    { value: 'politics', label: 'Politics', emoji: '🗳️' },
    { value: 'cultural_events', label: 'Cultural Events', emoji: '🎭' },
    { value: 'fashion', label: 'Fashion', emoji: '👗' },
    { value: 'travel', label: 'Travel', emoji: '✈️' },
    { value: 'food', label: 'Food', emoji: '🍽️' },
    { value: 'languages', label: 'Languages', emoji: '🗣️' },
    { value: 'photography', label: 'Photography', emoji: '📸' },
    { value: 'art', label: 'Art', emoji: '🎨' },
    { value: 'technology', label: 'Technology', emoji: '💻' },
    { value: 'science', label: 'Science', emoji: '🔬' },
    { value: 'nature_exploration', label: 'Nature', emoji: '🌿' },
    { value: 'activism', label: 'Activism', emoji: '✊' },
    { value: 'sports', label: 'Sports', emoji: '⚽' },
    { value: 'fitness', label: 'Fitness', emoji: '💪' }
  ];

  const hobbiesOptions = [
    { value: 'reading', label: 'Reading', emoji: '📖' },
    { value: 'writing', label: 'Writing', emoji: '✍️' },
    { value: 'dancing', label: 'Dancing', emoji: '💃' },
    { value: 'singing', label: 'Singing', emoji: '🎤' },
    { value: 'cooking', label: 'Cooking', emoji: '👨‍🍳' },
    { value: 'hiking', label: 'Hiking', emoji: '🥾' },
    { value: 'photography', label: 'Photography', emoji: '📷' },
    { value: 'painting', label: 'Painting', emoji: '🎨' },
    { value: 'gardening', label: 'Gardening', emoji: '🌱' },
    { value: 'playing_music', label: 'Playing Music', emoji: '🎹' },
    { value: 'learning_languages', label: 'Learning Languages', emoji: '🗣️' },
    { value: 'travel', label: 'Travel', emoji: '🧳' },
    { value: 'sports', label: 'Sports', emoji: '🏃‍♂️' },
    { value: 'meditation', label: 'Meditation', emoji: '🧘' },
    { value: 'yoga', label: 'Yoga', emoji: '🧘‍♀️' },
    { value: 'crafting', label: 'Crafting', emoji: '✂️' },
    { value: 'volunteering', label: 'Volunteering', emoji: '🤝' },
    { value: 'social_activism', label: 'Social Activism', emoji: '✊' }
  ];

  const creativePursuitsOptions = [
    { value: 'music_production', label: 'Music Production', emoji: '🎧' },
    { value: 'writing', label: 'Writing', emoji: '📝' },
    { value: 'visual_arts', label: 'Visual Arts', emoji: '🎨' },
    { value: 'photography', label: 'Photography', emoji: '📸' },
    { value: 'video_editing', label: 'Video Editing', emoji: '🎬' },
    { value: 'graphic_design', label: 'Graphic Design', emoji: '💻' },
    { value: 'crafts', label: 'Crafts', emoji: '✂️' },
    { value: 'fashion_design', label: 'Fashion Design', emoji: '👗' }
  ];

  const weekendActivitiesOptions = [
    { value: 'family_gatherings', label: 'Family Gatherings', emoji: '👨‍👩‍👧‍👦' },
    { value: 'cultural_events', label: 'Cultural Events', emoji: '🎭' },
    { value: 'outdoor_activities', label: 'Outdoor Activities', emoji: '🏞️' },
    { value: 'relaxing_at_home', label: 'Relaxing at Home', emoji: '🏠' },
    { value: 'exploring_new_places', label: 'Exploring New Places', emoji: '🗺️' },
    { value: 'creative_projects', label: 'Creative Projects', emoji: '🎨' },
    { value: 'sports_and_fitness', label: 'Sports & Fitness', emoji: '🏃‍♂️' },
    { value: 'social_gatherings', label: 'Social Gatherings', emoji: '🎉' }
  ];

  const musicInstrumentsOptions = [
    { value: 'tembur', label: 'Tembûr', emoji: '🎵' },
    { value: 'ney', label: 'Ney', emoji: '🎵' },
    { value: 'def', label: 'Def', emoji: '🥁' },
    { value: 'zurna', label: 'Zurna', emoji: '🎺' },
    { value: 'dohol', label: 'Dohol', emoji: '🥁' },
    { value: 'tar', label: 'Tar', emoji: '🎵' },
    { value: 'setar', label: 'Setar', emoji: '🎵' },
    { value: 'saz', label: 'Saz', emoji: '🎵' },
    { value: 'guitar', label: 'Guitar', emoji: '🎸' },
    { value: 'piano', label: 'Piano', emoji: '🎹' },
    { value: 'violin', label: 'Violin', emoji: '🎻' },
    { value: 'flute', label: 'Flute', emoji: '🪈' }
  ];

  const techSkillsOptions = [
    { value: 'web_development', label: 'Web Development', emoji: '💻' },
    { value: 'graphic_design', label: 'Graphic Design', emoji: '🎨' },
    { value: 'social_media', label: 'Social Media', emoji: '📱' },
    { value: 'video_editing', label: 'Video Editing', emoji: '🎬' },
    { value: 'photography', label: 'Photography', emoji: '📸' },
    { value: 'programming', label: 'Programming', emoji: '⌨️' },
    { value: 'data_analysis', label: 'Data Analysis', emoji: '📊' },
    { value: 'digital_marketing', label: 'Digital Marketing', emoji: '📈' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Palette className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">What do you love to do?</h2>
        <p className="text-purple-200">Share your interests and hobbies</p>
      </div>

      <div className="space-y-6">
        {/* Interests */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Your Interests</h3>
          <TagSelector
            options={interestsOptions}
            value={data.interests || []}
            onChange={(value) => onChange({ ...data, interests: value })}
            placeholder="What are you passionate about?"
            maxSelections={8}
          />
        </div>

        {/* Hobbies */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Your Hobbies</h3>
          <TagSelector
            options={hobbiesOptions}
            value={data.hobbies || []}
            onChange={(value) => onChange({ ...data, hobbies: value })}
            placeholder="What do you enjoy doing in your free time?"
            maxSelections={6}
          />
        </div>

        {/* Creative Pursuits */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Creative Pursuits</h3>
          <TagSelector
            options={creativePursuitsOptions}
            value={data.creative_pursuits || []}
            onChange={(value) => onChange({ ...data, creative_pursuits: value })}
            placeholder="Any creative activities you enjoy?"
            maxSelections={4}
          />
        </div>

        {/* Weekend Activities */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Weekend Activities</h3>
          <TagSelector
            options={weekendActivitiesOptions}
            value={data.weekend_activities || []}
            onChange={(value) => onChange({ ...data, weekend_activities: value })}
            placeholder="How do you like to spend your weekends?"
            maxSelections={4}
          />
        </div>

        {/* Music Instruments */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Musical Instruments</h3>
          <TagSelector
            options={musicInstrumentsOptions}
            value={data.music_instruments || []}
            onChange={(value) => onChange({ ...data, music_instruments: value })}
            placeholder="Do you play any instruments?"
            maxSelections={3}
          />
        </div>

        {/* Tech Skills */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Tech Skills</h3>
          <TagSelector
            options={techSkillsOptions}
            value={data.tech_skills || []}
            onChange={(value) => onChange({ ...data, tech_skills: value })}
            placeholder="Any technical skills?"
            maxSelections={4}
          />
        </div>
      </div>
    </div>
  );
};
