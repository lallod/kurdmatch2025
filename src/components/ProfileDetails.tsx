
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { 
  User, MapPin, Briefcase, GraduationCap, Wine, Cigarette, 
  Heart, Music, BookOpen, Pencil, Languages, Clock, Calendar,
  Utensils, Dumbbell, Baby, Plane, PawPrint, Moon, Sun,
  Users, MessageCircle, DollarSign, Sparkles, Star, Award, 
  Brain, AlarmClock, Clock4, Palmtree, Map, X, Film,
  Church, Vote, Globe, Landmark, MountainSnow, Palette, Coffee,
  ShoppingBag, Cpu, Trophy, Tv, Keyboard, Headphones, BrainCircuit,
  Flower, Home, Car, Bike, Accessibility, Gem, Puzzle, ThermometerSun
} from 'lucide-react';

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <div className="flex items-start gap-3 py-3">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-tinder-rose to-tinder-orange text-white">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-400">{label}</p>
          <div className="font-medium text-white mt-1">{value}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-primary">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="font-medium mt-1">{value}</div>
      </div>
    </div>
  );
};

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
    // New profile information fields
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

  const tinderBadgeStyle = isMobile 
    ? "rounded-full bg-gray-800 text-white border-gray-700" 
    : "rounded-full bg-gradient-to-r from-tinder-rose/10 to-tinder-orange/10 border-tinder-rose/20 text-tinder-rose";

  const formatList = (value: string[] | string | undefined) => {
    if (!value) return "";
    if (Array.isArray(value)) return value.join(", ");
    return value;
  };

  // Convert height from feet/inches to centimeters
  const heightInCm = details.height.includes("'") 
    ? `${Math.round(parseInt(details.height.split("'")[0]) * 30.48 + parseInt(details.height.split("'")[1]) * 2.54)} cm` 
    : details.height;

  if (isMobile) {
    return (
      <section className="w-full animate-fade-up px-4 py-6">
        <div className="mb-6 bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-800">
          <h2 className="text-2xl font-medium text-white mb-3 flex items-center">
            <User size={20} className="mr-2 text-tinder-rose" />
            About Me
          </h2>
          <p className="text-gray-300 leading-relaxed border-l-4 border-tinder-rose/40 pl-4 italic">{details.about}</p>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-gray-800/60 rounded-lg p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-tinder-rose/20 mb-2">
                <GraduationCap size={16} className="text-tinder-rose" />
              </div>
              <span className="text-xs text-gray-400">Education</span>
              <span className="text-sm text-white font-medium mt-1">{details.education.split(',')[0]}</span>
            </div>
            
            <div className="bg-gray-800/60 rounded-lg p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-tinder-orange/20 mb-2">
                <Briefcase size={16} className="text-tinder-orange" />
              </div>
              <span className="text-xs text-gray-400">Work</span>
              <span className="text-sm text-white font-medium mt-1">{details.occupation}</span>
            </div>
            
            <div className="bg-gray-800/60 rounded-lg p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-tinder-peach/20 mb-2">
                <Heart size={16} className="text-tinder-peach" />
              </div>
              <span className="text-xs text-gray-400">Looking for</span>
              <span className="text-sm text-white font-medium mt-1">{details.relationshipGoals.split('looking for ')[1]}</span>
            </div>
            
            <div className="bg-gray-800/60 rounded-lg p-3 flex flex-col items-center text-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-400/20 mb-2">
                <Star size={16} className="text-blue-400" />
              </div>
              <span className="text-xs text-gray-400">Zodiac</span>
              <span className="text-sm text-white font-medium mt-1">{details.zodiacSign}</span>
            </div>
          </div>
        </div>
        
        <Accordion type="multiple" defaultValue={["basics", "lifestyle", "interests", "more", "personality", "creatives"]} className="w-full space-y-4">
          <AccordionItem value="basics" className="bg-gray-900 rounded-xl overflow-hidden border-none">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline hover:bg-gray-800">
              <h3 className="text-xl font-medium flex items-center">
                <User size={20} className="mr-2 text-tinder-rose" />
                Basics
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="space-y-1">
                <DetailItem 
                  icon={<User size={18} />} 
                  label="Physical" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline" className={tinderBadgeStyle}>{heightInCm}</Badge>
                      <Badge variant="outline" className={tinderBadgeStyle}>{details.bodyType}</Badge>
                      <Badge variant="outline" className={tinderBadgeStyle}>{details.ethnicity}</Badge>
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Star size={18} />} 
                  label="Zodiac & Personality" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline" className={tinderBadgeStyle}>{details.zodiacSign}</Badge>
                      <Badge variant="outline" className={tinderBadgeStyle}>{details.personalityType}</Badge>
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<GraduationCap size={18} />} 
                  label="Education" 
                  value={details.education} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Briefcase size={18} />} 
                  label="Career" 
                  value={
                    <div>
                      <div>{details.occupation}</div>
                      <div className="text-sm text-gray-400">{details.company}</div>
                    </div>
                  } 
                />

                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Church size={18} />} 
                  label="Beliefs" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline" className={tinderBadgeStyle}>{details.religion}</Badge>
                      <Badge variant="outline" className={tinderBadgeStyle}>{details.politicalViews}</Badge>
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Award size={18} />} 
                  label="Values" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.values) ? 
                        details.values.map((value, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{value}</Badge>
                        )) : 
                        formatList(details.values).split(", ").map((value, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{value}</Badge>
                        ))
                      }
                    </div>
                  } 
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="lifestyle" className="bg-gray-900 rounded-xl overflow-hidden border-none">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline hover:bg-gray-800">
              <h3 className="text-xl font-medium flex items-center">
                <Wine size={20} className="mr-2 text-tinder-orange" />
                Lifestyle
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="space-y-3">
                <DetailItem 
                  icon={<Wine size={18} />} 
                  label="Drinking" 
                  value={details.drinking} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Cigarette size={18} />} 
                  label="Smoking" 
                  value={details.smoking} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Dumbbell size={18} />} 
                  label="Exercise" 
                  value={details.exerciseHabits} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<AlarmClock size={18} />} 
                  label="Sleep Schedule" 
                  value={details.sleepSchedule} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<DollarSign size={18} />} 
                  label="Financial Habits" 
                  value={details.financialHabits || "Not specified"} 
                />

                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Heart size={18} />} 
                  label="Relationship Goals" 
                  value={details.relationshipGoals} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Baby size={18} />} 
                  label="Children" 
                  value={
                    <div>
                      <div>Future plans: {details.wantChildren}</div>
                      <div>Current: {details.childrenStatus || "Not specified"}</div>
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<PawPrint size={18} />} 
                  label="Pets" 
                  value={details.havePets} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Users size={18} />} 
                  label="Family & Friends" 
                  value={
                    <div>
                      <div>Family: {details.familyCloseness || "Not specified"}</div>
                      <div>Friends: {details.friendshipStyle || "Not specified"}</div>
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Utensils size={18} />} 
                  label="Dietary Preferences" 
                  value={details.dietaryPreferences || "Not specified"} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Sun size={18} />} 
                  label="Morning Routine" 
                  value={details.morningRoutine || "Not specified"} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Moon size={18} />} 
                  label="Evening Routine" 
                  value={details.eveningRoutine || "Not specified"} 
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="interests" className="bg-gray-900 rounded-xl overflow-hidden border-none">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline hover:bg-gray-800">
              <h3 className="text-xl font-medium flex items-center">
                <Star size={20} className="mr-2 text-tinder-peach" />
                Interests & Hobbies
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {details.interests.map((interest, index) => (
                  <Badge key={index} className="rounded-full bg-gradient-to-r from-tinder-rose to-tinder-orange text-white">
                    {interest}
                  </Badge>
                ))}
                
                {details.hobbies && Array.isArray(details.hobbies) && details.hobbies.map((hobby, index) => (
                  <Badge key={`hobby-${index}`} className="rounded-full bg-gradient-to-r from-tinder-orange to-tinder-peach text-white">
                    {hobby}
                  </Badge>
                ))}
                
                {details.hobbies && !Array.isArray(details.hobbies) && 
                  details.hobbies.split(", ").map((hobby, index) => (
                    <Badge key={`hobby-${index}`} className="rounded-full bg-gradient-to-r from-tinder-orange to-tinder-peach text-white">
                      {hobby}
                    </Badge>
                  ))
                }
              </div>
              
              <div className="space-y-3">
                <DetailItem 
                  icon={<Calendar size={18} />} 
                  label="Weekend Activities" 
                  value={formatList(details.weekendActivities) || "Not specified"} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Sparkles size={18} />} 
                  label="Ideal Date" 
                  value={details.idealDate || "Not specified"} 
                />

                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Music size={18} />} 
                  label="Music" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {details.favoriteMusic.map((genre, index) => (
                        <Badge key={index} variant="outline" className={tinderBadgeStyle}>{genre}</Badge>
                      ))}
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<BookOpen size={18} />} 
                  label="Books" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {details.favoriteBooks.map((book, index) => (
                        <Badge key={index} variant="outline" className={tinderBadgeStyle}>{book}</Badge>
                      ))}
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Film size={18} />} 
                  label="Movies" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {details.favoriteMovies.map((movie, index) => (
                        <Badge key={index} variant="outline" className={tinderBadgeStyle}>{movie}</Badge>
                      ))}
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Utensils size={18} />} 
                  label="Food" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {details.favoriteFoods.map((food, index) => (
                        <Badge key={index} variant="outline" className={tinderBadgeStyle}>{food}</Badge>
                      ))}
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Headphones size={18} />} 
                  label="Music Instruments" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.musicInstruments) ? 
                        details.musicInstruments.map((instrument, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{instrument}</Badge>
                        )) : 
                        formatList(details.musicInstruments).split(", ").map((instrument, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{instrument}</Badge>
                        ))
                      }
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Puzzle size={18} />} 
                  label="Favorite Games" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.favoriteGames) ? 
                        details.favoriteGames.map((game, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{game}</Badge>
                        )) : 
                        formatList(details.favoriteGames).split(", ").map((game, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{game}</Badge>
                        ))
                      }
                    </div>
                  } 
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="more" className="bg-gray-900 rounded-xl overflow-hidden border-none">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline hover:bg-gray-800">
              <h3 className="text-xl font-medium flex items-center">
                <Languages size={20} className="mr-2 text-blue-400" />
                Communication
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="space-y-3 mb-4">
                <DetailItem 
                  icon={<MessageCircle size={18} />} 
                  label="Communication Style" 
                  value={details.communicationStyle || "Not specified"} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Heart size={18} />} 
                  label="Love Language" 
                  value={details.loveLanguage || "Not specified"} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<X size={18} />} 
                  label="Pet Peeves" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.petPeeves) ? 
                        details.petPeeves.map((peeve, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{peeve}</Badge>
                        )) : 
                        formatList(details.petPeeves).split(", ").map((peeve, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{peeve}</Badge>
                        ))
                      }
                    </div>
                  } 
                />

                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Brain size={18} />} 
                  label="Decision Making Style" 
                  value={details.decisionMakingStyle || "Not specified"} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Languages size={18} />} 
                  label="Languages" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {details.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className={tinderBadgeStyle}>{language}</Badge>
                      ))}
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Headphones size={18} />} 
                  label="Favorite Podcasts" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.favoritePodcasts) ? 
                        details.favoritePodcasts.map((podcast, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{podcast}</Badge>
                        )) : 
                        formatList(details.favoritePodcasts).split(", ").map((podcast, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{podcast}</Badge>
                        ))
                      }
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Pencil size={18} />} 
                  label="Favorite Quote" 
                  value={details.favoriteQuote || "Not specified"} 
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="personality" className="bg-gray-900 rounded-xl overflow-hidden border-none">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline hover:bg-gray-800">
              <h3 className="text-xl font-medium flex items-center">
                <BrainCircuit size={20} className="mr-2 text-purple-400" />
                Personality & Growth
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="space-y-3 mb-4">
                <DetailItem 
                  icon={<Trophy size={18} />} 
                  label="Growth Goals" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.growthGoals) ? 
                        details.growthGoals.map((goal, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{goal}</Badge>
                        )) : 
                        formatList(details.growthGoals).split(", ").map((goal, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{goal}</Badge>
                        ))
                      }
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Gem size={18} />} 
                  label="Hidden Talents" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.hiddenTalents) ? 
                        details.hiddenTalents.map((talent, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{talent}</Badge>
                        )) : 
                        formatList(details.hiddenTalents).split(", ").map((talent, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{talent}</Badge>
                        ))
                      }
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Star size={18} />} 
                  label="Favorite Memory" 
                  value={details.favoriteMemory || "Not specified"} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<ThermometerSun size={18} />} 
                  label="Stress Relievers" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.stressRelievers) ? 
                        details.stressRelievers.map((reliever, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{reliever}</Badge>
                        )) : 
                        formatList(details.stressRelievers).split(", ").map((reliever, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{reliever}</Badge>
                        ))
                      }
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Globe size={18} />} 
                  label="Charity Involvement" 
                  value={details.charityInvolvement || "Not specified"} 
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="creatives" className="bg-gray-900 rounded-xl overflow-hidden border-none">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline hover:bg-gray-800">
              <h3 className="text-xl font-medium flex items-center">
                <Palette size={20} className="mr-2 text-pink-400" />
                Creative & Lifestyle
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="space-y-3 mb-4">
                <DetailItem 
                  icon={<Palette size={18} />} 
                  label="Creative Pursuits" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.creativePursuits) ? 
                        details.creativePursuits.map((pursuit, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{pursuit}</Badge>
                        )) : 
                        formatList(details.creativePursuits).split(", ").map((pursuit, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{pursuit}</Badge>
                        ))
                      }
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Home size={18} />} 
                  label="Dream Home" 
                  value={details.dreamHome || "Not specified"} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Car size={18} />} 
                  label="Transportation" 
                  value={details.transportationPreference || "Not specified"} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Cpu size={18} />} 
                  label="Tech Skills" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.techSkills) ? 
                        details.techSkills.map((skill, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{skill}</Badge>
                        )) : 
                        formatList(details.techSkills).split(", ").map((skill, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{skill}</Badge>
                        ))
                      }
                    </div>
                  } 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Briefcase size={18} />} 
                  label="Work Environment" 
                  value={details.workEnvironment || "Not specified"} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<MountainSnow size={18} />} 
                  label="Favorite Season" 
                  value={details.favoriteSeason || "Not specified"} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Cloud size={18} />} 
                  label="Ideal Weather" 
                  value={details.idealWeather || "Not specified"} 
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="travel" className="bg-gray-900 rounded-xl overflow-hidden border-none">
            <AccordionTrigger className="px-4 py-3 text-white hover:no-underline hover:bg-gray-800">
              <h3 className="text-xl font-medium flex items-center">
                <Plane size={20} className="mr-2 text-teal-400" />
                Travel
              </h3>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="space-y-3 mb-4">
                <DetailItem 
                  icon={<Plane size={18} />} 
                  label="Travel Frequency" 
                  value={details.travelFrequency} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Palmtree size={18} />} 
                  label="Dream Vacation" 
                  value={details.dreamVacation || "Not specified"} 
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    );
  }

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-16 animate-fade-up" style={{ animationDelay: '0.2s' }}>
      <div className="mb-8">
        <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase">About</span>
        <h2 className="text-3xl font-light mt-1">Profile Details</h2>
      </div>

      <div className="space-y-8">
        <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm border-tinder-rose/10">
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-4 text-tinder-rose flex items-center">
              <User size={18} className="mr-2" />
              Bio
            </h3>
            <div className="bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 p-5 rounded-lg border-l-4 border-tinder-rose">
              <p className="text-muted-foreground leading-relaxed italic">{details.about}</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-tinder-rose/10 mr-3">
                  <GraduationCap size={16} className="text-tinder-rose" />
                </div>
                <h4 className="text-sm font-medium">Education</h4>
              </div>
              <p className="text-sm text-gray-600">{details.education}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-tinder-orange/10 mr-3">
                  <Briefcase size={16} className="text-tinder-orange" />
                </div>
                <h4 className="text-sm font-medium">Work</h4>
              </div>
              <p className="text-sm text-gray-600">{details.occupation} at {details.company}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-tinder-peach/10 mr-3">
                  <Heart size={16} className="text-tinder-peach" />
                </div>
                <h4 className="text-sm font-medium">Relationship Goals</h4>
              </div>
              <p className="text-sm text-gray-600">{details.relationshipGoals}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-400/10 mr-3">
                  <Star size={16} className="text-blue-400" />
                </div>
                <h4 className="text-sm font-medium">Personality</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={tinderBadgeStyle}>{details.zodiacSign}</Badge>
                <Badge variant="outline" className={tinderBadgeStyle}>{details.personalityType}</Badge>
              </div>
            </div>
          </div>
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
              <div className="space-y-1 py-4">
                <DetailItem 
                  icon={<User size={18} />} 
                  label="Basics" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline" className={tinderBadgeStyle}>{heightInCm}</Badge>
                      <Badge variant="outline" className={tinderBadgeStyle}>{details.bodyType}</Badge>
                      <Badge variant="outline" className={tinderBadgeStyle}>{details.ethnicity}</Badge>
                    </div>
                  } 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Church size={18} />} 
                  label="Beliefs" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline" className={tinderBadgeStyle}>{details.religion}</Badge>
                      <Badge variant="outline" className={tinderBadgeStyle}>{details.politicalViews}</Badge>
                    </div>
                  } 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Award size={18} />} 
                  label="Values" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.values) ? 
                        details.values.map((value, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{value}</Badge>
                        )) : 
                        formatList(details.values).split(", ").map((value, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{value}</Badge>
                        ))
                      }
                    </div>
                  } 
                />
              </div>
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
              <div className="space-y-1 py-4">
                <DetailItem 
                  icon={<Wine size={18} />} 
                  label="Drinking" 
                  value={details.drinking} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Cigarette size={18} />} 
                  label="Smoking" 
                  value={details.smoking} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Dumbbell size={18} />} 
                  label="Exercise" 
                  value={details.exerciseHabits} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<AlarmClock size={18} />} 
                  label="Sleep Schedule" 
                  value={details.sleepSchedule} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<DollarSign size={18} />} 
                  label="Financial Habits" 
                  value={details.financialHabits || "Not specified"} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Calendar size={18} />} 
                  label="Weekend Activities" 
                  value={formatList(details.weekendActivities) || "Not specified"} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Clock4 size={18} />} 
                  label="Work-Life Balance" 
                  value={details.workLifeBalance || "Not specified"} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Utensils size={18} />} 
                  label="Dietary Preferences" 
                  value={details.dietaryPreferences || "Not specified"} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Sun size={18} />} 
                  label="Morning Routine" 
                  value={details.morningRoutine || "Not specified"} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Moon size={18} />} 
                  label="Evening Routine" 
                  value={details.eveningRoutine || "Not specified"} 
                />
              </div>
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
              <div className="space-y-1 py-4">
                <DetailItem 
                  icon={<Heart size={18} />} 
                  label="Relationship Goals" 
                  value={details.relationshipGoals} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Baby size={18} />} 
                  label="Children" 
                  value={
                    <div>
                      <div>Future plans: {details.wantChildren}</div>
                      <div>Current: {details.childrenStatus || "Not specified"}</div>
                    </div>
                  } 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<PawPrint size={18} />} 
                  label="Pets" 
                  value={details.havePets} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Users size={18} />} 
                  label="Family & Friends" 
                  value={
                    <div>
                      <div>Family: {details.familyCloseness || "Not specified"}</div>
                      <div>Friends: {details.friendshipStyle || "Not specified"}</div>
                    </div>
                  } 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<MessageCircle size={18} />} 
                  label="Communication Style" 
                  value={details.communicationStyle || "Not specified"} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Sparkles size={18} />} 
                  label="Love Language" 
                  value={details.loveLanguage || "Not specified"} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<X size={18} />} 
                  label="Pet Peeves" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.petPeeves) ? 
                        details.petPeeves.map((peeve, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{peeve}</Badge>
                        )) : 
                        formatList(details.petPeeves).split(", ").map((peeve, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{peeve}</Badge>
                        ))
                      }
                    </div>
                  } 
                />
              </div>
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
              <div className="py-4">
                <div className="flex flex-wrap gap-2 mb-6">
                  {details.interests.map((interest, index) => (
                    <Badge key={index} className="rounded-full bg-gradient-to-r from-tinder-rose/90 to-tinder-orange/90 text-white hover:from-tinder-rose hover:to-tinder-orange transition-colors py-1.5 px-3">
                      {interest}
                    </Badge>
                  ))}
                  
                  {details.hobbies && Array.isArray(details.hobbies) && details.hobbies.map((hobby, index) => (
                    <Badge key={`hobby-${index}`} className="rounded-full bg-gradient-to-r from-tinder-orange/90 to-tinder-peach/90 text-white hover:from-tinder-orange hover:to-tinder-peach transition-colors py-1.5 px-3">
                      {hobby}
                    </Badge>
                  ))}
                  
                  {details.hobbies && !Array.isArray(details.hobbies) && 
                    details.hobbies.split(", ").map((hobby, index) => (
                      <Badge key={`hobby-${index}`} className="rounded-full bg-gradient-to-r from-tinder-orange/90 to-tinder-peach/90 text-white hover:from-tinder-orange hover:to-tinder-peach transition-colors py-1.5 px-3">
                        {hobby}
                      </Badge>
                    ))
                  }
                </div>
                
                <div className="space-y-1">
                  <DetailItem 
                    icon={<Calendar size={18} />} 
                    label="Weekend Activities" 
                    value={formatList(details.weekendActivities) || "Not specified"} 
                  />
                  
                  <Separator />
                  
                  <DetailItem 
                    icon={<Sparkles size={18} />} 
                    label="Ideal Date" 
                    value={details.idealDate || "Not specified"} 
                  />
                  
                  <Separator />
                  
                  <DetailItem 
                    icon={<Map size={18} />} 
                    label="Career Ambitions" 
                    value={details.careerAmbitions || "Not specified"} 
                  />
                  
                  <Separator />
                  
                  <DetailItem 
                    icon={<Headphones size={18} />} 
                    label="Music Instruments" 
                    value={
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Array.isArray(details.musicInstruments) ? 
                          details.musicInstruments.map((instrument, i) => (
                            <Badge key={i} variant="outline" className={tinderBadgeStyle}>{instrument}</Badge>
                          )) : 
                          formatList(details.musicInstruments).split(", ").map((instrument, i) => (
                            <Badge key={i} variant="outline" className={tinderBadgeStyle}>{instrument}</Badge>
                          ))
                        }
                      </div>
                    } 
                  />
                  
                  <Separator />
                  
                  <DetailItem 
                    icon={<Puzzle size={18} />} 
                    label="Favorite Games" 
                    value={
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Array.isArray(details.favoriteGames) ? 
                          details.favoriteGames.map((game, i) => (
                            <Badge key={i} variant="outline" className={tinderBadgeStyle}>{game}</Badge>
                          )) : 
                          formatList(details.favoriteGames).split(", ").map((game, i) => (
                            <Badge key={i} variant="outline" className={tinderBadgeStyle}>{game}</Badge>
                          ))
                        }
                      </div>
                    } 
                  />
                </div>
              </div>
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
              <div className="space-y-6 py-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-tinder-peach" />
                    <span className="text-sm font-medium">Books</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {details.favoriteBooks.map((book, index) => (
                      <Badge key={index} variant="outline" className={tinderBadgeStyle}>{book}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Film size={16} className="text-tinder-peach" />
                    <span className="text-sm font-medium">Movies</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {details.favoriteMovies.map((movie, index) => (
                      <Badge key={index} variant="outline" className={tinderBadgeStyle}>{movie}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Music size={16} className="text-tinder-peach" />
                    <span className="text-sm font-medium">Music</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {details.favoriteMusic.map((music, index) => (
                      <Badge key={index} variant="outline" className={tinderBadgeStyle}>{music}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Utensils size={16} className="text-tinder-peach" />
                    <span className="text-sm font-medium">Food</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {details.favoriteFoods.map((food, index) => (
                      <Badge key={index} variant="outline" className={tinderBadgeStyle}>{food}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Headphones size={16} className="text-tinder-peach" />
                    <span className="text-sm font-medium">Podcasts</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(details.favoritePodcasts) ? 
                      details.favoritePodcasts.map((podcast, i) => (
                        <Badge key={i} variant="outline" className={tinderBadgeStyle}>{podcast}</Badge>
                      )) : 
                      formatList(details.favoritePodcasts).split(", ").map((podcast, i) => (
                        <Badge key={i} variant="outline" className={tinderBadgeStyle}>{podcast}</Badge>
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Pencil size={16} className="text-tinder-peach" />
                    <span className="text-sm font-medium">Favorite Quote</span>
                  </div>
                  <p className="text-muted-foreground italic">"{details.favoriteQuote || "Not specified"}"</p>
                </div>
              </div>
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
              <div className="space-y-6 py-4">
                <div>
                  <h4 className="font-medium mb-2">Languages</h4>
                  <DetailItem 
                    icon={<Languages size={18} />} 
                    label="Can speak" 
                    value={
                      <div className="flex flex-wrap gap-2 mt-1">
                        {details.languages.map((language, index) => (
                          <Badge key={index} variant="outline" className={tinderBadgeStyle}>{language}</Badge>
                        ))}
                      </div>
                    } 
                  />
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Communication</h4>
                  <div className="space-y-1">
                    <DetailItem 
                      icon={<MessageCircle size={18} />} 
                      label="Communication Style" 
                      value={details.communicationStyle || "Not specified"} 
                    />
                    
                    <Separator />
                    
                    <DetailItem 
                      icon={<Brain size={18} />} 
                      label="Decision Making" 
                      value={details.decisionMakingStyle || "Not specified"} 
                    />
                  </div>
                </div>
              </div>
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
              <div className="space-y-6 py-4">
                <DetailItem 
                  icon={<Trophy size={18} />} 
                  label="Growth Goals" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.growthGoals) ? 
                        details.growthGoals.map((goal, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{goal}</Badge>
                        )) : 
                        formatList(details.growthGoals).split(", ").map((goal, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{goal}</Badge>
                        ))
                      }
                    </div>
                  } 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Gem size={18} />} 
                  label="Hidden Talents" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.hiddenTalents) ? 
                        details.hiddenTalents.map((talent, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{talent}</Badge>
                        )) : 
                        formatList(details.hiddenTalents).split(", ").map((talent, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{talent}</Badge>
                        ))
                      }
                    </div>
                  } 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Star size={18} />} 
                  label="Favorite Memory" 
                  value={details.favoriteMemory || "Not specified"} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<ThermometerSun size={18} />} 
                  label="Stress Relievers" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.stressRelievers) ? 
                        details.stressRelievers.map((reliever, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{reliever}</Badge>
                        )) : 
                        formatList(details.stressRelievers).split(", ").map((reliever, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{reliever}</Badge>
                        ))
                      }
                    </div>
                  } 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Globe size={18} />} 
                  label="Charity Involvement" 
                  value={details.charityInvolvement || "Not specified"} 
                />
              </div>
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
              <div className="space-y-6 py-4">
                <DetailItem 
                  icon={<Palette size={18} />} 
                  label="Creative Pursuits" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.creativePursuits) ? 
                        details.creativePursuits.map((pursuit, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{pursuit}</Badge>
                        )) : 
                        formatList(details.creativePursuits).split(", ").map((pursuit, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{pursuit}</Badge>
                        ))
                      }
                    </div>
                  } 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Home size={18} />} 
                  label="Dream Home" 
                  value={details.dreamHome || "Not specified"} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Car size={18} />} 
                  label="Transportation" 
                  value={details.transportationPreference || "Not specified"} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Cpu size={18} />} 
                  label="Tech Skills" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(details.techSkills) ? 
                        details.techSkills.map((skill, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{skill}</Badge>
                        )) : 
                        formatList(details.techSkills).split(", ").map((skill, i) => (
                          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{skill}</Badge>
                        ))
                      }
                    </div>
                  } 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Briefcase size={18} />} 
                  label="Work Environment" 
                  value={details.workEnvironment || "Not specified"} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<MountainSnow size={18} />} 
                  label="Favorite Season" 
                  value={details.favoriteSeason || "Not specified"} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Cloud size={18} />} 
                  label="Ideal Weather" 
                  value={details.idealWeather || "Not specified"} 
                />
              </div>
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
              <div className="space-y-6 py-4">
                <DetailItem 
                  icon={<Plane size={18} />} 
                  label="Travel Frequency" 
                  value={details.travelFrequency} 
                />
                
                <Separator />
                
                <DetailItem 
                  icon={<Palmtree size={18} />} 
                  label="Dream Vacation" 
                  value={details.dreamVacation || "Not specified"} 
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default ProfileDetails;
