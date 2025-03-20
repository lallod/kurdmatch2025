
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { 
  User, MapPin, Briefcase, GraduationCap, Wine, Cigarette, 
  Heart, Music, BookOpen, Pencil, Languages, Calendar,
  Utensils, Dumbbell, Baby, Plane, PawPrint, Moon, Sun,
  Users, MessageCircle, DollarSign, Sparkles, Star, Award, 
  Brain, AlarmClock, Clock4, Palmtree, Map, X, Film,
  Church, Vote, Globe, Landmark, MountainSnow, Palette, Coffee,
  ShoppingBag, Cpu, Trophy, Tv, Keyboard, Headphones, BrainCircuit,
  Flower, Home, Car, Bike, Accessibility, Gem, Puzzle, ThermometerSun,
  CloudSun
} from 'lucide-react';

import DetailItem from './profile/DetailItem';
import ProfileBio from './profile/ProfileBio';
import ProfileQuickStats from './profile/ProfileQuickStats';
import ProfileBasics from './profile/ProfileBasics';
import ProfileLifestyle from './profile/ProfileLifestyle';
import ProfileRelationships from './profile/ProfileRelationships';
import ProfileInterests from './profile/ProfileInterests';
import ProfileFavorites from './profile/ProfileFavorites';
import ProfileCommunication from './profile/ProfileCommunication';
import ProfilePersonality from './profile/ProfilePersonality';
import ProfileCreative from './profile/ProfileCreative';
import ProfileTravel from './profile/ProfileTravel';

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
    hobbies?: string[] | string;
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
  };
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ details }) => {
  const isMobile = useIsMobile();

  const tinderBadgeStyle = "rounded-full bg-gradient-to-r from-tinder-rose/10 to-tinder-orange/10 border-tinder-rose/20 text-tinder-rose";

  const formatList = (value: string[] | string | undefined) => {
    if (!value) return "";
    if (Array.isArray(value)) return value.join(", ");
    return value;
  };

  if (isMobile) {
    return (
      <section className="w-full animate-fade-up px-4 pb-20">
        <ProfileBio about={details.about} isMobile={isMobile} />
        
        <ProfileQuickStats 
          education={details.education}
          occupation={details.occupation}
          company={details.company}
          relationshipGoals={details.relationshipGoals}
          zodiacSign={details.zodiacSign}
          personalityType={details.personalityType}
          tinderBadgeStyle={tinderBadgeStyle}
          isMobile={isMobile}
        />
        
        <Accordion type="multiple" defaultValue={["basics", "lifestyle", "interests", "more", "personality", "creatives", "travel"]} className="w-full space-y-4">
          <AccordionItem value="basics" className="rounded-xl overflow-hidden border border-tinder-rose/10 shadow-md">
            <AccordionTrigger className="px-4 py-3 hover:no-underline bg-gradient-to-r from-tinder-rose/5 to-transparent">
              <h3 className="text-xl font-medium flex items-center text-tinder-rose">
                <User size={20} className="mr-2" />
                Basics
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <ProfileBasics 
                details={details} 
                tinderBadgeStyle={tinderBadgeStyle} 
                formatList={formatList}
                isMobile={isMobile}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="lifestyle" className="rounded-xl overflow-hidden border border-tinder-orange/10 shadow-md">
            <AccordionTrigger className="px-4 py-3 hover:no-underline bg-gradient-to-r from-tinder-orange/5 to-transparent">
              <h3 className="text-xl font-medium flex items-center text-tinder-orange">
                <Wine size={20} className="mr-2" />
                Lifestyle
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <ProfileLifestyle 
                details={details}
                formatList={formatList}
                isMobile={isMobile}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="interests" className="rounded-xl overflow-hidden border border-tinder-orange/10 shadow-md">
            <AccordionTrigger className="px-4 py-3 hover:no-underline bg-gradient-to-r from-tinder-orange/5 to-transparent">
              <h3 className="text-xl font-medium flex items-center text-tinder-orange">
                <Star size={20} className="mr-2" />
                Interests & Hobbies
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <ProfileInterests 
                details={details}
                tinderBadgeStyle={tinderBadgeStyle}
                formatList={formatList}
                isMobile={isMobile}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="more" className="rounded-xl overflow-hidden border border-tinder-rose/10 shadow-md">
            <AccordionTrigger className="px-4 py-3 hover:no-underline bg-gradient-to-r from-tinder-rose/5 to-transparent">
              <h3 className="text-xl font-medium flex items-center text-tinder-rose">
                <Languages size={20} className="mr-2" />
                Communication
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <ProfileCommunication 
                details={details}
                tinderBadgeStyle={tinderBadgeStyle}
                isMobile={isMobile}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="personality" className="rounded-xl overflow-hidden border border-purple-200 shadow-md">
            <AccordionTrigger className="px-4 py-3 hover:no-underline bg-gradient-to-r from-purple-100 to-transparent">
              <h3 className="text-xl font-medium flex items-center text-purple-500">
                <BrainCircuit size={20} className="mr-2" />
                Personality & Growth
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <ProfilePersonality 
                details={details}
                tinderBadgeStyle={tinderBadgeStyle}
                formatList={formatList}
                isMobile={isMobile}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="creatives" className="rounded-xl overflow-hidden border border-pink-200 shadow-md">
            <AccordionTrigger className="px-4 py-3 hover:no-underline bg-gradient-to-r from-pink-100 to-transparent">
              <h3 className="text-xl font-medium flex items-center text-pink-500">
                <Palette size={20} className="mr-2" />
                Creative & Lifestyle
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <ProfileCreative 
                details={details}
                tinderBadgeStyle={tinderBadgeStyle}
                formatList={formatList}
                isMobile={isMobile}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="travel" className="rounded-xl overflow-hidden border border-teal-200 shadow-md">
            <AccordionTrigger className="px-4 py-3 hover:no-underline bg-gradient-to-r from-teal-100 to-transparent">
              <h3 className="text-xl font-medium flex items-center text-teal-600">
                <Plane size={20} className="mr-2" />
                Travel
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <ProfileTravel 
                details={details}
                isMobile={isMobile}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    );
  }

  return (
    <section className="w-full max-w-5xl mx-auto px-4 pb-20 animate-fade-up" style={{ animationDelay: '0.2s' }}>
      <div className="mb-8">
        <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase">About</span>
        <h2 className="text-3xl font-light mt-1">Profile Details</h2>
      </div>

      <div className="space-y-8">
        <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm border-tinder-rose/10">
          <ProfileBio about={details.about} isMobile={isMobile} />
          
          <Separator className="my-6" />
          
          <ProfileQuickStats 
            education={details.education}
            occupation={details.occupation}
            company={details.company}
            relationshipGoals={details.relationshipGoals}
            zodiacSign={details.zodiacSign}
            personalityType={details.personalityType}
            tinderBadgeStyle={tinderBadgeStyle}
            isMobile={isMobile}
          />
        </Card>
        
        <Accordion type="multiple" defaultValue={["basics", "lifestyle", "relationships", "interests", "favorites", "more", "personality", "creative", "travel"]} className="space-y-6">
          <AccordionItem value="basics" className="rounded-xl border border-tinder-rose/10 shadow-md overflow-hidden">
            <AccordionTrigger className="px-6 py-4 bg-gradient-to-r from-tinder-rose/5 to-transparent hover:no-underline">
              <h3 className="text-xl font-medium text-tinder-rose flex items-center">
                <User size={18} className="mr-2" />
                Basics
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <ProfileBasics 
                details={details} 
                tinderBadgeStyle={tinderBadgeStyle} 
                formatList={formatList}
                isMobile={isMobile}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="lifestyle" className="rounded-xl border border-tinder-orange/10 shadow-md overflow-hidden">
            <AccordionTrigger className="px-6 py-4 bg-gradient-to-r from-tinder-orange/5 to-transparent hover:no-underline">
              <h3 className="text-xl font-medium text-tinder-orange flex items-center">
                <Wine size={18} className="mr-2" />
                Lifestyle
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <ProfileLifestyle 
                details={details}
                formatList={formatList}
                isMobile={isMobile}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="relationships" className="rounded-xl border border-tinder-peach/10 shadow-md overflow-hidden">
            <AccordionTrigger className="px-6 py-4 bg-gradient-to-r from-tinder-peach/5 to-transparent hover:no-underline">
              <h3 className="text-xl font-medium text-tinder-peach flex items-center">
                <Heart size={18} className="mr-2" />
                Relationships
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <ProfileRelationships 
                details={details}
                tinderBadgeStyle={tinderBadgeStyle}
                formatList={formatList}
                isMobile={isMobile}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="interests" className="rounded-xl border border-tinder-orange/10 shadow-md overflow-hidden">
            <AccordionTrigger className="px-6 py-4 bg-gradient-to-r from-tinder-orange/5 to-transparent hover:no-underline">
              <h3 className="text-xl font-medium text-tinder-orange flex items-center">
                <Star size={18} className="mr-2" />
                Interests & Hobbies
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <ProfileInterests 
                details={details}
                tinderBadgeStyle={tinderBadgeStyle}
                formatList={formatList}
                isMobile={isMobile}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="favorites" className="rounded-xl border border-tinder-peach/10 shadow-md overflow-hidden">
            <AccordionTrigger className="px-6 py-4 bg-gradient-to-r from-tinder-peach/5 to-transparent hover:no-underline">
              <h3 className="text-xl font-medium text-tinder-peach flex items-center">
                <BookOpen size={18} className="mr-2" />
                Favorites
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <ProfileFavorites 
                details={details}
                tinderBadgeStyle={tinderBadgeStyle}
                formatList={formatList}
                isMobile={isMobile}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="more" className="rounded-xl border border-tinder-rose/10 shadow-md overflow-hidden">
            <AccordionTrigger className="px-6 py-4 bg-gradient-to-r from-tinder-rose/5 to-transparent hover:no-underline">
              <h3 className="text-xl font-medium text-tinder-rose flex items-center">
                <Languages size={18} className="mr-2" />
                Communication
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <ProfileCommunication 
                details={details}
                tinderBadgeStyle={tinderBadgeStyle}
                isMobile={isMobile}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="personality" className="rounded-xl border border-purple-200 shadow-md overflow-hidden">
            <AccordionTrigger className="px-6 py-4 bg-gradient-to-r from-purple-100 to-transparent hover:no-underline">
              <h3 className="text-xl font-medium text-purple-500 flex items-center">
                <BrainCircuit size={18} className="mr-2" />
                Personality & Growth
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <ProfilePersonality 
                details={details}
                tinderBadgeStyle={tinderBadgeStyle}
                formatList={formatList}
                isMobile={isMobile}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="creative" className="rounded-xl border border-pink-200 shadow-md overflow-hidden">
            <AccordionTrigger className="px-6 py-4 bg-gradient-to-r from-pink-100 to-transparent hover:no-underline">
              <h3 className="text-xl font-medium text-pink-500 flex items-center">
                <Palette size={18} className="mr-2" />
                Creative & Lifestyle
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <ProfileCreative 
                details={details}
                tinderBadgeStyle={tinderBadgeStyle}
                formatList={formatList}
                isMobile={isMobile}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="travel" className="rounded-xl border border-teal-200 shadow-md overflow-hidden">
            <AccordionTrigger className="px-6 py-4 bg-gradient-to-r from-teal-100 to-transparent hover:no-underline">
              <h3 className="text-xl font-medium text-teal-600 flex items-center">
                <Plane size={18} className="mr-2" />
                Travel
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <ProfileTravel 
                details={details}
                isMobile={isMobile}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default ProfileDetails;
