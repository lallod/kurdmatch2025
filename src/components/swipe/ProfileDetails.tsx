import React from 'react';
import { Accordion } from "@/components/ui/accordion";
import { Profile } from '@/types/swipe';
import { User, Briefcase, Heart, Star, Globe, Palette, Trophy, Home } from 'lucide-react';
import AccordionSectionItem from './profile/AccordionSectionItem';
import ProfileDetailItem from './profile/ProfileDetailItem';
import ProfileQuickBadges from './profile/ProfileQuickBadges';
import ProfileInterestsBadges from './profile/ProfileInterestsBadges';
import { useProfileSectionTracking } from '@/hooks/useProfileSectionTracking';
import { useTranslations } from '@/hooks/useTranslations';

interface ProfileDetailsProps {
  profile: Profile;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}
const ProfileDetails = ({
  profile,
  isExpanded,
  onToggleExpanded
}: ProfileDetailsProps) => {
  const { t } = useTranslations();
  const { trackSectionView } = useProfileSectionTracking(profile.id);

  const handleAccordionChange = (openSections: string[]) => {
    openSections.forEach(sectionId => trackSectionView(sectionId));
    const totalSections = 8;
    const viewedPercentage = Math.round(openSections.length / totalSections * 100);
    const viewingData = JSON.parse(localStorage.getItem('profileViewing') || '{}');
    viewingData[profile.id] = {
      viewedSections: openSections,
      percentage: viewedPercentage,
      lastViewed: new Date().toISOString()
    };
    localStorage.setItem('profileViewing', JSON.stringify(viewingData));
  };

  return <div className="p-1 sm:p-2 px-0 py-0">
      <ProfileQuickBadges profile={profile} />

      <div className="space-y-2">
        <Accordion type="multiple" className="w-full" onValueChange={handleAccordionChange}>
          <AccordionSectionItem value="basics" title={t('profile.section.basic_info', 'Basic Info')} icon={<User />} color="text-purple-300">
            {profile.bio && <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-sm font-medium text-white mb-2">{t('profile.bio', 'Bio')}</h4>
                <p className="text-white text-sm leading-snug">{profile.bio}</p>
              </div>}
            <ProfileDetailItem label={t('profile.gender', 'Gender')} value={profile.gender} />
            <ProfileDetailItem label={t('profile.body_type', 'Body Type')} value={profile.bodyType} />
            <ProfileDetailItem label={t('profile.ethnicity', 'Ethnicity')} value={profile.ethnicity} />
            <ProfileDetailItem label={t('profile.kurdistan_region', 'Kurdistan Region')} value={profile.kurdistanRegion} />
            <ProfileDetailItem label={t('profile.languages', 'Languages')} value={profile.languages} />
            <ProfileDetailItem label={t('profile.zodiac_sign', 'Zodiac Sign')} value={profile.zodiacSign} />
            <ProfileDetailItem label={t('profile.personality_type', 'Personality Type')} value={profile.personalityType} />
          </AccordionSectionItem>

          <AccordionSectionItem value="career" title={t('profile.section.career_education', 'Career & Education')} icon={<Briefcase />} color="text-purple-300">
            <ProfileDetailItem label={t('profile.education', 'Education')} value={profile.education} />
            <ProfileDetailItem label={t('profile.company', 'Company')} value={profile.company} />
            <ProfileDetailItem label={t('profile.career_ambitions', 'Career Ambitions')} value={profile.careerAmbitions} />
            <ProfileDetailItem label={t('profile.work_environment', 'Work Environment')} value={profile.workEnvironment} />
            <ProfileDetailItem label={t('profile.work_life_balance', 'Work-Life Balance')} value={profile.workLifeBalance} />
          </AccordionSectionItem>

          <AccordionSectionItem value="lifestyle" title={t('profile.section.lifestyle', 'Lifestyle')} icon={<Home />} color="text-purple-300">
            <ProfileDetailItem label={t('profile.exercise_habits', 'Exercise Habits')} value={profile.exerciseHabits} />
            <ProfileDetailItem label={t('profile.dietary_preferences', 'Dietary Preferences')} value={profile.dietaryPreferences} />
            <ProfileDetailItem label={t('profile.drinking', 'Drinking')} value={profile.drinking} />
            <ProfileDetailItem label={t('profile.smoking', 'Smoking')} value={profile.smoking} />
            <ProfileDetailItem label={t('profile.have_pets', 'Have Pets')} value={profile.havePets} />
            <ProfileDetailItem label={t('profile.sleep_schedule', 'Sleep Schedule')} value={profile.sleepSchedule} />
            <ProfileDetailItem label={t('profile.travel_frequency', 'Travel Frequency')} value={profile.travelFrequency} />
            <ProfileDetailItem label={t('profile.transportation', 'Transportation')} value={profile.transportationPreference} />
          </AccordionSectionItem>

          <AccordionSectionItem value="beliefs" title={t('profile.section.beliefs_values', 'Beliefs & Values')} icon={<Star />} color="text-purple-300">
            <ProfileDetailItem label={t('profile.religion', 'Religion')} value={profile.religion} />
            <ProfileDetailItem label={t('profile.political_views', 'Political Views')} value={profile.politicalViews} />
            <ProfileDetailItem label={t('profile.values', 'Values')} value={profile.values} />
          </AccordionSectionItem>

          <AccordionSectionItem value="relationships" title={t('profile.section.relationships', 'Relationships')} icon={<Heart />} color="text-purple-300">
            <ProfileDetailItem label={t('profile.want_children', 'Want Children')} value={profile.wantChildren} />
            <ProfileDetailItem label={t('profile.children_status', 'Children Status')} value={profile.childrenStatus} />
            <ProfileDetailItem label={t('profile.family_closeness', 'Family Closeness')} value={profile.familyCloseness} />
            <ProfileDetailItem label={t('profile.love_language', 'Love Language')} value={profile.loveLanguage} />
            <ProfileDetailItem label={t('profile.communication_style', 'Communication Style')} value={profile.communicationStyle} />
          </AccordionSectionItem>

          <AccordionSectionItem value="interests" title={t('profile.section.interests_hobbies', 'Interests & Hobbies')} icon={<Palette />} color="text-purple-300">
            <ProfileInterestsBadges interests={profile.interests || []} />
            <ProfileDetailItem label={t('profile.hobbies', 'Hobbies')} value={profile.hobbies} />
            <ProfileDetailItem label={t('profile.creative_pursuits', 'Creative Pursuits')} value={profile.creativePursuits} />
            <ProfileDetailItem label={t('profile.weekend_activities', 'Weekend Activities')} value={profile.weekendActivities} />
            <ProfileDetailItem label={t('profile.music_instruments', 'Music Instruments')} value={profile.musicInstruments} />
            <ProfileDetailItem label={t('profile.tech_skills', 'Tech Skills')} value={profile.techSkills} />
          </AccordionSectionItem>

          <AccordionSectionItem value="favorites" title={t('profile.section.favorites', 'Favorites')} icon={<Trophy />} color="text-purple-300">
            <ProfileDetailItem label={t('profile.books', 'Books')} value={profile.favoriteBooks} />
            <ProfileDetailItem label={t('profile.movies', 'Movies')} value={profile.favoriteMovies} />
            <ProfileDetailItem label={t('profile.music', 'Music')} value={profile.favoriteMusic} />
            <ProfileDetailItem label={t('profile.foods', 'Foods')} value={profile.favoriteFoods} />
            <ProfileDetailItem label={t('profile.games', 'Games')} value={profile.favoriteGames} />
            <ProfileDetailItem label={t('profile.podcasts', 'Podcasts')} value={profile.favoritePodcasts} />
            <ProfileDetailItem label={t('profile.quote', 'Quote')} value={profile.favoriteQuote} />
            <ProfileDetailItem label={t('profile.memory', 'Memory')} value={profile.favoriteMemory} />
            <ProfileDetailItem label={t('profile.season', 'Season')} value={profile.favoriteSeason} />
          </AccordionSectionItem>

          <AccordionSectionItem value="growth" title={t('profile.section.personal_growth', 'Personal Growth')} icon={<Globe />} color="text-purple-300">
            <ProfileDetailItem label={t('profile.growth_goals', 'Growth Goals')} value={profile.growthGoals} />
            <ProfileDetailItem label={t('profile.morning_routine', 'Morning Routine')} value={profile.morningRoutine} />
            <ProfileDetailItem label={t('profile.evening_routine', 'Evening Routine')} value={profile.eveningRoutine} />
            <ProfileDetailItem label={t('profile.stress_relievers', 'Stress Relievers')} value={profile.stressRelievers} />
            <ProfileDetailItem label={t('profile.financial_habits', 'Financial Habits')} value={profile.financialHabits} />
            <ProfileDetailItem label={t('profile.friendship_style', 'Friendship Style')} value={profile.friendshipStyle} />
            <ProfileDetailItem label={t('profile.decision_making', 'Decision Making')} value={profile.decisionMakingStyle} />
            <ProfileDetailItem label={t('profile.charity_involvement', 'Charity Involvement')} value={profile.charityInvolvement} />
            <ProfileDetailItem label={t('profile.hidden_talents', 'Hidden Talents')} value={profile.hiddenTalents} />
            <ProfileDetailItem label={t('profile.pet_peeves', 'Pet Peeves')} value={profile.petPeeves} />
            <ProfileDetailItem label={t('profile.dream_vacation', 'Dream Vacation')} value={profile.dreamVacation} />
            <ProfileDetailItem label={t('profile.ideal_date', 'Ideal Date')} value={profile.idealDate} />
            <ProfileDetailItem label={t('profile.dream_home', 'Dream Home')} value={profile.dreamHome} />
            <ProfileDetailItem label={t('profile.ideal_weather', 'Ideal Weather')} value={profile.idealWeather} />
          </AccordionSectionItem>
        </Accordion>
      </div>
    </div>;
};
export default ProfileDetails;
