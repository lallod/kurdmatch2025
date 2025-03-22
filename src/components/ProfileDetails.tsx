
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileProfileDetails from './profile/MobileProfileDetails';
import DesktopProfileDetails from './profile/DesktopProfileDetails';

interface ProfileDetailsProps {
  details: {
    about: string;
    height: string;
    bodyType: string;
    ethnicity: string;
    education: string;
    occupation: string;
    company: string;
    religion: string;
    politicalViews: string;
    drinking: string;
    smoking: string;
    relationshipGoals: string;
    wantChildren: string;
    havePets: string;
    languages: string[];
    interests: string[];
    hobbies?: string[] | string;
    favoriteBooks: string[];
    favoriteMovies: string[];
    favoriteMusic: string[];
    favoriteFoods: string[];
    exerciseHabits: string;
    zodiacSign: string;
    personalityType: string;
    sleepSchedule: string;
    travelFrequency: string;
    communicationStyle?: string;
    loveLanguage?: string;
    petPeeves?: string[] | string;
    dreamVacation?: string;
    weekendActivities?: string[] | string;
    financialHabits?: string;
    idealDate?: string;
    childrenStatus?: string;
    familyCloseness?: string;
    friendshipStyle?: string;
    workLifeBalance?: string;
    careerAmbitions?: string;
    values?: string[] | string;
    dietaryPreferences?: string;
    favoriteQuote?: string;
    morningRoutine?: string;
    eveningRoutine?: string;
    favoriteSeason?: string;
    idealWeather?: string;
    creativePursuits?: string[] | string;
    dreamHome?: string;
    transportationPreference?: string;
    techSkills?: string[] | string;
    musicInstruments?: string[] | string;
    favoriteGames?: string[] | string;
    favoritePodcasts?: string[] | string;
    charityInvolvement?: string;
    growthGoals?: string[] | string;
    hiddenTalents?: string[] | string;
    favoriteMemory?: string;
    stressRelievers?: string[] | string;
    workEnvironment?: string;
    decisionMakingStyle?: string;
    relationshipType?: string;
    livingArrangement?: string;
    petsOwned?: string[] | string;
    favoriteAuthors?: string[] | string;
    favoriteTV?: string[] | string;
    favoriteDirectors?: string[] | string;
    favoriteDishes?: string[] | string;
    coffeeOrTea?: string;
    audiobooks?: string;
    favoriteTeams?: string[] | string;
    favoriteSports?: string[] | string;
    outdoorActivities?: string[] | string;
    boardGames?: string;
    videoGames?: string;
    favoriteDestinations?: string[] | string;
    travelWishlist?: string[] | string;
    localHangouts?: string;
    concertExperience?: string;
    creativeHobbies?: string[] | string;
    sportsActivities?: string[] | string;
    idealDateActivities?: string[] | string;
    readingHabits?: string;
  };
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ details }) => {
  const isMobile = useIsMobile();
  
  // Common styles - enhanced with AI-friendly styling
  const tinderBadgeStyle = "rounded-full bg-gradient-to-r from-tinder-rose/10 to-tinder-orange/10 border border-tinder-rose/20 text-tinder-rose shadow-sm hover:shadow-md transition-all duration-300";

  // Utility function for formatting lists consistently
  const formatList = (value: string[] | string | undefined) => {
    if (!value) return "";
    if (Array.isArray(value)) return value.join(", ");
    return value;
  };

  // Render appropriate layout based on device size
  return isMobile ? (
    <MobileProfileDetails 
      details={details} 
      tinderBadgeStyle={tinderBadgeStyle} 
      formatList={formatList} 
    />
  ) : (
    <DesktopProfileDetails 
      details={details} 
      tinderBadgeStyle={tinderBadgeStyle} 
      formatList={formatList} 
    />
  );
};

export default ProfileDetails;
