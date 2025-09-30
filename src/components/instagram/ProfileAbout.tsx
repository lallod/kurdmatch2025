import React from 'react';
import { Profile } from '@/api/profiles';
import { Badge } from '@/components/ui/badge';
import { User, Briefcase, Heart, Sparkles, Home, Users } from 'lucide-react';

interface ProfileAboutProps {
  profile: Profile;
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({ profile }) => {
  const sections = [
    {
      title: 'Basic Info',
      icon: User,
      items: [
        { label: 'Height', value: profile.height },
        { label: 'Body Type', value: profile.body_type },
        { label: 'Ethnicity', value: profile.ethnicity },
        { label: 'Religion', value: profile.religion },
        { label: 'Zodiac', value: profile.zodiac_sign },
        { label: 'Personality', value: profile.personality_type },
      ].filter(item => item.value),
    },
    {
      title: 'Career & Education',
      icon: Briefcase,
      items: [
        { label: 'Occupation', value: profile.occupation },
        { label: 'Education', value: profile.education },
        { label: 'Company', value: profile.company },
        { label: 'Work Style', value: profile.work_environment },
        { label: 'Career Goals', value: profile.career_ambitions },
      ].filter(item => item.value),
    },
    {
      title: 'Lifestyle',
      icon: Home,
      items: [
        { label: 'Exercise', value: profile.exercise_habits },
        { label: 'Diet', value: profile.dietary_preferences },
        { label: 'Smoking', value: profile.smoking },
        { label: 'Drinking', value: profile.drinking },
        { label: 'Sleep', value: profile.sleep_schedule },
        { label: 'Pets', value: profile.have_pets },
      ].filter(item => item.value),
    },
    {
      title: 'Values & Interests',
      icon: Sparkles,
      items: [],
      arrays: [
        { label: 'Values', values: profile.values },
        { label: 'Interests', values: profile.interests },
        { label: 'Hobbies', values: profile.hobbies },
      ],
    },
    {
      title: 'Relationships',
      icon: Heart,
      items: [
        { label: 'Looking for', value: profile.relationship_goals },
        { label: 'Children', value: profile.want_children },
        { label: 'Love Language', value: profile.love_language },
        { label: 'Communication', value: profile.communication_style },
        { label: 'Ideal Date', value: profile.ideal_date },
        { label: 'Family', value: profile.family_closeness },
      ].filter(item => item.value),
      arrays: [
        { label: 'Languages', values: profile.languages },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const hasItems = section.items && section.items.length > 0;
        const hasArrays = section.arrays?.some(arr => arr.values && arr.values.length > 0);
        
        if (!hasItems && !hasArrays) return null;

        return (
          <div key={section.title} className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <section.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
            </div>

            <div className="space-y-3">
              {section.items?.map((item) => (
                <div key={item.label} className="flex justify-between items-start">
                  <span className="text-white/70 text-sm">{item.label}:</span>
                  <span className="text-white text-sm text-right flex-1 ml-4">{item.value}</span>
                </div>
              ))}

              {section.arrays?.map((arr) => {
                if (!arr.values || arr.values.length === 0) return null;
                return (
                  <div key={arr.label}>
                    <span className="text-white/70 text-sm">{arr.label}:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {arr.values.map((value, index) => (
                        <Badge
                          key={index}
                          className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border-purple-400/30"
                        >
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileAbout;
