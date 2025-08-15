import React from 'react';
import { Accordion } from "@/components/ui/accordion";
import { Profile } from '@/types/swipe';
import { User, Briefcase, Heart, Star, Globe, Palette, Trophy, Home } from 'lucide-react';
import AccordionSectionItem from './profile/AccordionSectionItem';
import ProfileDetailItem from './profile/ProfileDetailItem';
import ProfileQuickBadges from './profile/ProfileQuickBadges';
import ProfileInterestsBadges from './profile/ProfileInterestsBadges';
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
  // Track which sections have been opened for viewing percentage calculation
  const handleAccordionChange = (openSections: string[]) => {
    const totalSections = 8; // Total number of accordion sections
    const viewedPercentage = Math.round(openSections.length / totalSections * 100);

    // Store viewing progress in localStorage
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

      {/* Comprehensive Profile Information */}
      <div className="space-y-2">
        <Accordion type="multiple" className="w-full" onValueChange={handleAccordionChange}>
          {/* Basic Information */}
          <AccordionSectionItem value="basics" title="Basic Info" icon={<User />} color="text-purple-300">
            {profile.bio && <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-sm font-medium text-white mb-2">Bio</h4>
                <p className="text-white text-sm leading-snug">
                  {profile.bio}
                </p>
              </div>}
            <ProfileDetailItem label="Gender" value={profile.gender} />
            <ProfileDetailItem label="Body Type" value={profile.bodyType} />
            <ProfileDetailItem label="Ethnicity" value={profile.ethnicity} />
            <ProfileDetailItem label="Kurdistan Region" value={profile.kurdistanRegion} />
            <ProfileDetailItem label="Languages" value={profile.languages} />
            <ProfileDetailItem label="Zodiac Sign" value={profile.zodiacSign} />
            <ProfileDetailItem label="Personality Type" value={profile.personalityType} />
          </AccordionSectionItem>

          {/* Career & Education */}
          <AccordionSectionItem value="career" title="Career & Education" icon={<Briefcase />} color="text-purple-300">
            <ProfileDetailItem label="Education" value={profile.education} />
            <ProfileDetailItem label="Company" value={profile.company} />
            <ProfileDetailItem label="Career Ambitions" value={profile.careerAmbitions} />
            <ProfileDetailItem label="Work Environment" value={profile.workEnvironment} />
            <ProfileDetailItem label="Work-Life Balance" value={profile.workLifeBalance} />
          </AccordionSectionItem>

          {/* Lifestyle */}
          <AccordionSectionItem value="lifestyle" title="Lifestyle" icon={<Home />} color="text-purple-300">
            <ProfileDetailItem label="Exercise Habits" value={profile.exerciseHabits} />
            <ProfileDetailItem label="Dietary Preferences" value={profile.dietaryPreferences} />
            <ProfileDetailItem label="Drinking" value={profile.drinking} />
            <ProfileDetailItem label="Smoking" value={profile.smoking} />
            <ProfileDetailItem label="Have Pets" value={profile.havePets} />
            <ProfileDetailItem label="Sleep Schedule" value={profile.sleepSchedule} />
            <ProfileDetailItem label="Travel Frequency" value={profile.travelFrequency} />
            <ProfileDetailItem label="Transportation" value={profile.transportationPreference} />
          </AccordionSectionItem>

          {/* Beliefs & Values */}
          <AccordionSectionItem value="beliefs" title="Beliefs & Values" icon={<Star />} color="text-purple-300">
            <ProfileDetailItem label="Religion" value={profile.religion} />
            <ProfileDetailItem label="Political Views" value={profile.politicalViews} />
            <ProfileDetailItem label="Values" value={profile.values} />
          </AccordionSectionItem>

          {/* Relationships */}
          <AccordionSectionItem value="relationships" title="Relationships" icon={<Heart />} color="text-purple-300">
            <ProfileDetailItem label="Want Children" value={profile.wantChildren} />
            <ProfileDetailItem label="Children Status" value={profile.childrenStatus} />
            <ProfileDetailItem label="Family Closeness" value={profile.familyCloseness} />
            <ProfileDetailItem label="Love Language" value={profile.loveLanguage} />
            <ProfileDetailItem label="Communication Style" value={profile.communicationStyle} />
          </AccordionSectionItem>

          {/* Interests & Hobbies */}
          <AccordionSectionItem value="interests" title="Interests & Hobbies" icon={<Palette />} color="text-purple-300">
            <ProfileInterestsBadges interests={profile.interests || []} />
            <ProfileDetailItem label="Hobbies" value={profile.hobbies} />
            <ProfileDetailItem label="Creative Pursuits" value={profile.creativePursuits} />
            <ProfileDetailItem label="Weekend Activities" value={profile.weekendActivities} />
            <ProfileDetailItem label="Music Instruments" value={profile.musicInstruments} />
            <ProfileDetailItem label="Tech Skills" value={profile.techSkills} />
          </AccordionSectionItem>

          {/* Favorites */}
          <AccordionSectionItem value="favorites" title="Favorites" icon={<Trophy />} color="text-purple-300">
            <ProfileDetailItem label="Books" value={profile.favoriteBooks} />
            <ProfileDetailItem label="Movies" value={profile.favoriteMovies} />
            <ProfileDetailItem label="Music" value={profile.favoriteMusic} />
            <ProfileDetailItem label="Foods" value={profile.favoriteFoods} />
            <ProfileDetailItem label="Games" value={profile.favoriteGames} />
            <ProfileDetailItem label="Podcasts" value={profile.favoritePodcasts} />
            <ProfileDetailItem label="Quote" value={profile.favoriteQuote} />
            <ProfileDetailItem label="Memory" value={profile.favoriteMemory} />
            <ProfileDetailItem label="Season" value={profile.favoriteSeason} />
          </AccordionSectionItem>

          {/* Personal Growth */}
          <AccordionSectionItem value="growth" title="Personal Growth" icon={<Globe />} color="text-purple-300">
            <ProfileDetailItem label="Growth Goals" value={profile.growthGoals} />
            <ProfileDetailItem label="Morning Routine" value={profile.morningRoutine} />
            <ProfileDetailItem label="Evening Routine" value={profile.eveningRoutine} />
            <ProfileDetailItem label="Stress Relievers" value={profile.stressRelievers} />
            <ProfileDetailItem label="Financial Habits" value={profile.financialHabits} />
            <ProfileDetailItem label="Friendship Style" value={profile.friendshipStyle} />
            <ProfileDetailItem label="Decision Making" value={profile.decisionMakingStyle} />
            <ProfileDetailItem label="Charity Involvement" value={profile.charityInvolvement} />
            <ProfileDetailItem label="Hidden Talents" value={profile.hiddenTalents} />
            <ProfileDetailItem label="Pet Peeves" value={profile.petPeeves} />
            <ProfileDetailItem label="Dream Vacation" value={profile.dreamVacation} />
            <ProfileDetailItem label="Ideal Date" value={profile.idealDate} />
            <ProfileDetailItem label="Dream Home" value={profile.dreamHome} />
            <ProfileDetailItem label="Ideal Weather" value={profile.idealWeather} />
          </AccordionSectionItem>
        </Accordion>
      </div>
    </div>;
};
export default ProfileDetails;