
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Profile } from '@/types/swipe';
import { User, Briefcase, Heart, Star, Globe, Palette, Trophy, Home } from 'lucide-react';

interface ProfileDetailsProps {
  profile: Profile;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const ProfileDetails = ({ profile, isExpanded, onToggleExpanded }: ProfileDetailsProps) => {
  const formatList = (items: string[] | undefined) => {
    if (!items || items.length === 0) return null;
    return items.join(", ");
  };

  const renderDetailItem = (label: string, value: string | string[] | undefined) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    
    const displayValue = Array.isArray(value) ? formatList(value) : value;
    if (!displayValue) return null;

    return (
      <div className="flex justify-between items-start py-1">
        <span className="text-white/70 text-xs font-medium">{label}:</span>
        <span className="text-white text-xs text-right flex-1 ml-2">{displayValue}</span>
      </div>
    );
  };

  return (
    <div className="p-1 sm:p-2 max-h-96 overflow-y-auto">
      {/* Quick Info - Full Width Usage */}
      <div className="flex flex-wrap gap-1 mb-1 sm:mb-2">
        {profile.occupation && (
          <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200 px-1.5 py-0.5">
            {profile.occupation}
          </Badge>
        )}
        {profile.height && (
          <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200 px-1.5 py-0.5">
            {profile.height}cm
          </Badge>
        )}
        {profile.languages && (
          <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200 px-1.5 py-0.5">
            {profile.languages[0]}{profile.languages.length > 1 ? ` +${profile.languages.length - 1}` : ''}
          </Badge>
        )}
      </div>

      {/* Bio - Maximum Width Usage - Show Complete Bio */}
      {profile.bio && (
        <div className="mb-2">
          <p className="text-white text-sm leading-snug">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Comprehensive Profile Information */}
      <div className="space-y-2">
        <Accordion type="multiple" defaultValue={["basics", "lifestyle", "interests", "career"]} className="w-full">
          {/* Basic Information */}
          <AccordionItem value="basics" className="border-purple-400/20">
            <AccordionTrigger className="text-white hover:text-purple-200 py-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-purple-300" />
                <span className="text-sm font-medium">Basic Info</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-1 pt-2">
              {renderDetailItem("Gender", profile.gender)}
              {renderDetailItem("Body Type", profile.bodyType)}
              {renderDetailItem("Ethnicity", profile.ethnicity)}
              {renderDetailItem("Kurdistan Region", profile.kurdistanRegion)}
              {renderDetailItem("Languages", profile.languages)}
              {renderDetailItem("Zodiac Sign", profile.zodiacSign)}
              {renderDetailItem("Personality Type", profile.personalityType)}
            </AccordionContent>
          </AccordionItem>

          {/* Career & Education */}
          <AccordionItem value="career" className="border-purple-400/20">
            <AccordionTrigger className="text-white hover:text-purple-200 py-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-purple-300" />
                <span className="text-sm font-medium">Career & Education</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-1 pt-2">
              {renderDetailItem("Education", profile.education)}
              {renderDetailItem("Company", profile.company)}
              {renderDetailItem("Career Ambitions", profile.careerAmbitions)}
              {renderDetailItem("Work Environment", profile.workEnvironment)}
              {renderDetailItem("Work-Life Balance", profile.workLifeBalance)}
            </AccordionContent>
          </AccordionItem>

          {/* Lifestyle */}
          <AccordionItem value="lifestyle" className="border-purple-400/20">
            <AccordionTrigger className="text-white hover:text-purple-200 py-2">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-purple-300" />
                <span className="text-sm font-medium">Lifestyle</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-1 pt-2">
              {renderDetailItem("Exercise Habits", profile.exerciseHabits)}
              {renderDetailItem("Dietary Preferences", profile.dietaryPreferences)}
              {renderDetailItem("Drinking", profile.drinking)}
              {renderDetailItem("Smoking", profile.smoking)}
              {renderDetailItem("Have Pets", profile.havePets)}
              {renderDetailItem("Sleep Schedule", profile.sleepSchedule)}
              {renderDetailItem("Travel Frequency", profile.travelFrequency)}
              {renderDetailItem("Transportation", profile.transportationPreference)}
            </AccordionContent>
          </AccordionItem>

          {/* Beliefs & Values */}
          <AccordionItem value="beliefs" className="border-purple-400/20">
            <AccordionTrigger className="text-white hover:text-purple-200 py-2">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-purple-300" />
                <span className="text-sm font-medium">Beliefs & Values</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-1 pt-2">
              {renderDetailItem("Religion", profile.religion)}
              {renderDetailItem("Political Views", profile.politicalViews)}
              {renderDetailItem("Values", profile.values)}
            </AccordionContent>
          </AccordionItem>

          {/* Relationships */}
          <AccordionItem value="relationships" className="border-purple-400/20">
            <AccordionTrigger className="text-white hover:text-purple-200 py-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-purple-300" />
                <span className="text-sm font-medium">Relationships</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-1 pt-2">
              {renderDetailItem("Want Children", profile.wantChildren)}
              {renderDetailItem("Children Status", profile.childrenStatus)}
              {renderDetailItem("Family Closeness", profile.familyCloseness)}
              {renderDetailItem("Love Language", profile.loveLanguage)}
              {renderDetailItem("Communication Style", profile.communicationStyle)}
            </AccordionContent>
          </AccordionItem>

          {/* Interests & Hobbies */}
          <AccordionItem value="interests" className="border-purple-400/20">
            <AccordionTrigger className="text-white hover:text-purple-200 py-2">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-300" />
                <span className="text-sm font-medium">Interests & Hobbies</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-1 pt-2">
              {profile.interests && profile.interests.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-pink-400/30 text-pink-300 px-1 py-0.5">
                      {interest}
                    </Badge>
                  ))}
                </div>
              )}
              {renderDetailItem("Hobbies", profile.hobbies)}
              {renderDetailItem("Creative Pursuits", profile.creativePursuits)}
              {renderDetailItem("Weekend Activities", profile.weekendActivities)}
              {renderDetailItem("Music Instruments", profile.musicInstruments)}
              {renderDetailItem("Tech Skills", profile.techSkills)}
            </AccordionContent>
          </AccordionItem>

          {/* Favorites */}
          <AccordionItem value="favorites" className="border-purple-400/20">
            <AccordionTrigger className="text-white hover:text-purple-200 py-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-purple-300" />
                <span className="text-sm font-medium">Favorites</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-1 pt-2">
              {renderDetailItem("Books", profile.favoriteBooks)}
              {renderDetailItem("Movies", profile.favoriteMovies)}
              {renderDetailItem("Music", profile.favoriteMusic)}
              {renderDetailItem("Foods", profile.favoriteFoods)}
              {renderDetailItem("Games", profile.favoriteGames)}
              {renderDetailItem("Podcasts", profile.favoritePodcasts)}
              {renderDetailItem("Quote", profile.favoriteQuote)}
              {renderDetailItem("Memory", profile.favoriteMemory)}
              {renderDetailItem("Season", profile.favoriteSeason)}
            </AccordionContent>
          </AccordionItem>

          {/* Personal Growth */}
          <AccordionItem value="growth" className="border-purple-400/20">
            <AccordionTrigger className="text-white hover:text-purple-200 py-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-purple-300" />
                <span className="text-sm font-medium">Personal Growth</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-1 pt-2">
              {renderDetailItem("Growth Goals", profile.growthGoals)}
              {renderDetailItem("Morning Routine", profile.morningRoutine)}
              {renderDetailItem("Evening Routine", profile.eveningRoutine)}
              {renderDetailItem("Stress Relievers", profile.stressRelievers)}
              {renderDetailItem("Financial Habits", profile.financialHabits)}
              {renderDetailItem("Friendship Style", profile.friendshipStyle)}
              {renderDetailItem("Decision Making", profile.decisionMakingStyle)}
              {renderDetailItem("Charity Involvement", profile.charityInvolvement)}
              {renderDetailItem("Hidden Talents", profile.hiddenTalents)}
              {renderDetailItem("Pet Peeves", profile.petPeeves)}
              {renderDetailItem("Dream Vacation", profile.dreamVacation)}
              {renderDetailItem("Ideal Date", profile.idealDate)}
              {renderDetailItem("Dream Home", profile.dreamHome)}
              {renderDetailItem("Ideal Weather", profile.idealWeather)}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ProfileDetails;
