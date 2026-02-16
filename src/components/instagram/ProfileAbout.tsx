import React, { useState } from 'react';
import { Profile } from '@/api/profiles';
import { Badge } from '@/components/ui/badge';
import { User, Briefcase, Heart, Sparkles, Home, Lock, Globe, Trophy, Palette, Star, Book, ChevronDown, ChevronUp } from 'lucide-react';
import { useProfileAccess } from '@/hooks/useProfileAccess';
import { languageCategories } from '@/data/languages';
import { Separator } from '@/components/ui/separator';

interface ProfileAboutProps {
  profile: Profile;
  context?: 'social' | 'dating' | 'swipe';
}

const formatArrayField = (value: string[] | string | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
};

const MAX_VISIBLE_BADGES = 3;

const ProfileAbout: React.FC<ProfileAboutProps> = ({ profile, context = 'social' }) => {
  const { canSeeDatingDetails, isPremium } = useProfileAccess(context, profile.id);
  const [expandedArrays, setExpandedArrays] = useState<Record<string, boolean>>({});
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleArray = (label: string) => {
    setExpandedArrays(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const toggleSection = (title: string) => {
    setCollapsedSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const gatedSections = !canSeeDatingDetails;
  const sections = [
    {
      title: 'Beliefs & Values',
      icon: Sparkles,
      items: [],
      arrays: [
        { label: 'Values', values: profile.values },
        { label: 'Interests', values: profile.interests },
        { label: 'Hobbies', values: profile.hobbies },
      ],
      gated: false,
    },
    {
      title: 'Basic Info',
      icon: User,
      items: [
        { label: 'Height', value: profile.height },
        { label: 'Body Type', value: profile.body_type },
        { label: 'Ethnicity', value: profile.ethnicity },
        { label: 'Religion', value: profile.religion },
        { label: 'Kurdistan Region', value: profile.kurdistan_region },
        { label: 'Zodiac', value: profile.zodiac_sign },
        { label: 'Personality', value: profile.personality_type },
      ].filter(item => item.value),
      gated: true,
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
        { label: 'Work-Life Balance', value: profile.work_life_balance },
      ].filter(item => item.value),
      gated: true,
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
        { label: 'Travel Frequency', value: profile.travel_frequency },
        { label: 'Transportation', value: profile.transportation_preference },
      ].filter(item => item.value),
      arrays: [
        { label: 'Hobbies', values: profile.hobbies },
      ],
      gated: true,
    },
    {
      title: 'Relationships',
      icon: Heart,
      items: [
        { label: 'Looking for', value: profile.relationship_goals },
        { label: 'Children', value: profile.want_children },
        { label: 'Children Status', value: profile.children_status },
        { label: 'Love Language', value: profile.love_language },
        { label: 'Communication', value: profile.communication_style },
        { label: 'Ideal Date', value: profile.ideal_date },
        { label: 'Family', value: profile.family_closeness },
      ].filter(item => item.value),
      arrays: [
        { label: 'Kurdish Dialects', values: profile.languages?.filter(l => languageCategories.kurdish.includes(l)) },
        { label: 'Languages', values: profile.languages?.filter(l => !languageCategories.kurdish.includes(l)) },
      ],
      gated: true,
    },
    {
      title: 'Interests & Hobbies',
      icon: Palette,
      items: [],
      arrays: [
        { label: 'Creative Pursuits', values: formatArrayField(profile.creative_pursuits) },
        { label: 'Weekend Activities', values: formatArrayField(profile.weekend_activities) },
        { label: 'Music Instruments', values: formatArrayField(profile.music_instruments) },
        { label: 'Tech Skills', values: formatArrayField(profile.tech_skills) },
      ],
      gated: true,
    },
    {
      title: 'Favorites',
      icon: Star,
      items: [
        { label: 'Quote', value: profile.favorite_quote },
        { label: 'Memory', value: profile.favorite_memory },
        { label: 'Season', value: profile.favorite_season },
      ].filter(item => item.value),
      arrays: [
        { label: 'Books', values: formatArrayField(profile.favorite_books) },
        { label: 'Movies', values: formatArrayField(profile.favorite_movies) },
        { label: 'Music', values: formatArrayField(profile.favorite_music) },
        { label: 'Foods', values: formatArrayField(profile.favorite_foods) },
        { label: 'Games', values: formatArrayField(profile.favorite_games) },
        { label: 'Podcasts', values: formatArrayField(profile.favorite_podcasts) },
      ],
      gated: true,
    },
    {
      title: 'Personal Growth',
      icon: Trophy,
      items: [
        { label: 'Morning Routine', value: profile.morning_routine },
        { label: 'Evening Routine', value: profile.evening_routine },
        { label: 'Financial Habits', value: profile.financial_habits },
        { label: 'Friendship Style', value: profile.friendship_style },
        { label: 'Decision Making', value: profile.decision_making_style },
        { label: 'Charity', value: profile.charity_involvement },
        { label: 'Dream Vacation', value: profile.dream_vacation },
        { label: 'Dream Home', value: profile.dream_home },
        { label: 'Ideal Weather', value: profile.ideal_weather },
      ].filter(item => item.value),
      arrays: [
        { label: 'Growth Goals', values: formatArrayField(profile.growth_goals) },
        { label: 'Stress Relievers', values: formatArrayField(profile.stress_relievers) },
        { label: 'Hidden Talents', values: formatArrayField(profile.hidden_talents) },
        { label: 'Pet Peeves', values: formatArrayField(profile.pet_peeves) },
      ],
      gated: true,
    },
  ];

  return (
    <div className="space-y-2 px-1">
      {sections.map((section) => {
        const hasItems = section.items && section.items.length > 0;
        const hasArrays = section.arrays?.some(arr => arr.values && arr.values.length > 0);
        if (!hasItems && !hasArrays) return null;

        const isCollapsed = collapsedSections[section.title] ?? false;

        // Gated locked card
        if (section.gated && gatedSections) {
          return (
            <div key={section.title} className="bg-card/60 backdrop-blur-sm rounded-2xl p-4 border border-border/10 relative overflow-hidden">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-muted/50 rounded-lg flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-muted-foreground">{section.title}</h3>
              </div>
              <div className="blur-sm select-none pointer-events-none mt-3 space-y-2">
                {section.items?.slice(0, 2).map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-muted-foreground text-xs">{item.label}</span>
                    <span className="text-foreground text-xs">••••••</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 text-center opacity-60">
                Available on Dating Profile
              </p>
            </div>
          );
        }

        return (
          <div key={section.title} className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/10 overflow-hidden">
            {/* Collapsible Header */}
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between p-4 active:bg-card/80 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                  <section.icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground">{section.title}</h3>
              </div>
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {/* Content */}
            {!isCollapsed && (
              <div className="px-4 pb-4 space-y-0">
                {/* Detail Items */}
                {section.items?.map((item, idx) => (
                  <React.Fragment key={item.label}>
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-muted-foreground text-xs font-medium">{item.label}</span>
                      <span className="text-foreground text-xs font-semibold">{item.value}</span>
                    </div>
                    {idx < (section.items?.length || 0) - 1 && (
                      <Separator className="bg-border/10" />
                    )}
                  </React.Fragment>
                ))}

                {/* Separator between items and arrays */}
                {hasItems && hasArrays && <Separator className="bg-border/10 my-1" />}

                {/* Badge Arrays */}
                {section.arrays?.map((arr) => {
                  if (!arr.values || arr.values.length === 0) return null;
                  const isExpanded = expandedArrays[arr.label] || false;
                  const hasMore = arr.values.length > MAX_VISIBLE_BADGES;
                  const visible = isExpanded ? arr.values : arr.values.slice(0, MAX_VISIBLE_BADGES);
                  return (
                    <div key={arr.label} className="py-2">
                      <span className="text-muted-foreground text-[11px] font-medium">{arr.label}</span>
                      <div className="flex flex-wrap gap-1.5 mt-2 items-center">
                        {visible.map((value, index) => (
                          <Badge
                            key={index}
                            className="text-[11px] bg-primary/15 text-primary border-0 rounded-full px-3 py-1 font-medium hover:bg-primary/25 transition-colors"
                          >
                            {value}
                          </Badge>
                        ))}
                        {hasMore && (
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleArray(arr.label); }}
                            className="text-[11px] text-primary/70 font-medium hover:text-primary transition-colors px-1"
                          >
                            {isExpanded ? 'See less' : `+${arr.values.length - MAX_VISIBLE_BADGES} more`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProfileAbout;
