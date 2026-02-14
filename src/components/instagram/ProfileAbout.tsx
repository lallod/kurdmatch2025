import React from 'react';
import { Profile } from '@/api/profiles';
import { Badge } from '@/components/ui/badge';
import { User, Briefcase, Heart, Sparkles, Home } from 'lucide-react';

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
    <div className="space-y-3">
      {sections.map((section) => {
        const hasItems = section.items && section.items.length > 0;
        const hasArrays = section.arrays?.some(arr => arr.values && arr.values.length > 0);
        if (!hasItems && !hasArrays) return null;

        return (
          <div key={section.title} className="bg-card rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <section.icon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
            </div>

            <div className="space-y-2">
              {section.items?.map((item) => (
                <div key={item.label} className="flex justify-between items-start">
                  <span className="text-muted-foreground text-xs">{item.label}</span>
                  <span className="text-foreground text-xs text-right flex-1 ml-4 font-medium">{item.value}</span>
                </div>
              ))}

              {section.arrays?.map((arr) => {
                if (!arr.values || arr.values.length === 0) return null;
                return (
                  <div key={arr.label}>
                    <span className="text-muted-foreground text-xs">{arr.label}</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {arr.values.map((value, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-[10px] bg-muted text-muted-foreground rounded-full px-2.5 py-0.5"
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
