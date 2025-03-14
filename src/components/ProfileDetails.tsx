
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  User, MapPin, Briefcase, GraduationCap, Wine, Cigarette, 
  Heart, Music, BookOpen, Pencil, Languages, Clock, Calendar,
  Utensils, Dumbbell, Baby, Plane, PawPrint, Moon, Sun,
  Users, MessageCircle, DollarSign, Sparkles, Star, Award, 
  Brain, AlarmClock, Clock4, Palmtree, Map
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
    // Extended info fields
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
  };
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ details }) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("about");

  const tinderBadgeStyle = isMobile 
    ? "rounded-full bg-gray-800 text-white border-gray-700" 
    : "rounded-full bg-gradient-to-r from-tinder-rose/10 to-tinder-orange/10 border-tinder-rose/20 text-tinder-rose";

  // Helper function to format arrays or strings for display
  const formatList = (value: string[] | string | undefined) => {
    if (!value) return "";
    if (Array.isArray(value)) return value.join(", ");
    return value;
  };

  if (isMobile) {
    return (
      <section className="w-full animate-fade-up">
        <div className="mb-6">
          <h2 className="text-2xl font-medium text-white mb-3">About Me</h2>
          <p className="text-gray-300 leading-relaxed">{details.about}</p>
        </div>
        
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-12 mb-4 bg-gray-800 text-white">
            <TabsTrigger value="basics" className="data-[state=active]:bg-gray-700">Basics</TabsTrigger>
            <TabsTrigger value="lifestyle" className="data-[state=active]:bg-gray-700">Lifestyle</TabsTrigger>
            <TabsTrigger value="interests" className="data-[state=active]:bg-gray-700">Interests</TabsTrigger>
            <TabsTrigger value="more" className="data-[state=active]:bg-gray-700">More</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basics" className="mt-0">
            <div className="bg-gray-900 rounded-xl p-4 mb-4">
              <h3 className="text-xl font-medium text-white mb-4">Personal</h3>
              
              <div className="space-y-1">
                <DetailItem 
                  icon={<User size={18} />} 
                  label="Physical" 
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline" className={tinderBadgeStyle}>{details.height}</Badge>
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
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-4">
              <h3 className="text-xl font-medium text-white mb-4">Beliefs</h3>
              
              <div className="space-y-3">
                <DetailItem 
                  icon={<Pencil size={18} />} 
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
            </div>
          </TabsContent>
          
          <TabsContent value="lifestyle" className="mt-0">
            <div className="bg-gray-900 rounded-xl p-4 mb-4">
              <h3 className="text-xl font-medium text-white mb-4">Habits</h3>
              
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
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-4">
              <h3 className="text-xl font-medium text-white mb-4">Relationships</h3>
              
              <div className="space-y-3">
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
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="interests" className="mt-0">
            <div className="bg-gray-900 rounded-xl p-4 mb-4">
              <h3 className="text-xl font-medium text-white mb-4">Interests & Hobbies</h3>
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
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-4">
              <h3 className="text-xl font-medium text-white mb-4">Favorites</h3>
              
              <div className="space-y-3">
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
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="more" className="mt-0">
            <div className="bg-gray-900 rounded-xl p-4 mb-4">
              <h3 className="text-xl font-medium text-white mb-4">Communication</h3>
              
              <div className="space-y-3">
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
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-4 mb-4">
              <h3 className="text-xl font-medium text-white mb-4">Travel</h3>
              
              <div className="space-y-3">
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
            </div>
            
            <div className="bg-gray-900 rounded-xl p-4">
              <h3 className="text-xl font-medium text-white mb-4">Work</h3>
              
              <div className="space-y-3">
                <DetailItem 
                  icon={<Clock4 size={18} />} 
                  label="Work-Life Balance" 
                  value={details.workLifeBalance || "Not specified"} 
                />
                
                <Separator className="bg-gray-800" />
                
                <DetailItem 
                  icon={<Map size={18} />} 
                  label="Career Ambitions" 
                  value={details.careerAmbitions || "Not specified"} 
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    );
  }

  // Desktop view
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-16 animate-fade-up" style={{ animationDelay: '0.2s' }}>
      <div className="mb-12">
        <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase">About</span>
        <h2 className="text-3xl font-light mt-1">Profile Details</h2>
      </div>

      <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-5 mb-8">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger value="interests">Interests</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="more">More</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about" className="space-y-8 animate-fade-up">
          <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm border-tinder-rose/10">
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-4 text-tinder-rose">Bio</h3>
              <p className="text-muted-foreground leading-relaxed">{details.about}</p>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-1">
              <DetailItem 
                icon={<User size={18} />} 
                label="Basics" 
                value={
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline" className={tinderBadgeStyle}>{details.height}</Badge>
                    <Badge variant="outline" className={tinderBadgeStyle}>{details.bodyType}</Badge>
                    <Badge variant="outline" className={tinderBadgeStyle}>{details.ethnicity}</Badge>
                  </div>
                } 
              />
              
              <Separator />
              
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
              
              <Separator />
              
              <DetailItem 
                icon={<GraduationCap size={18} />} 
                label="Education" 
                value={details.education} 
              />
              
              <Separator />
              
              <DetailItem 
                icon={<Briefcase size={18} />} 
                label="Work" 
                value={
                  <div>
                    <div>{details.occupation}</div>
                    <div className="text-sm text-muted-foreground">{details.company}</div>
                  </div>
                } 
              />
              
              <Separator />
              
              <DetailItem 
                icon={<Pencil size={18} />} 
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
          </Card>
        </TabsContent>
        
        <TabsContent value="lifestyle" className="space-y-8 animate-fade-up">
          <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm border-tinder-rose/10">
            <h3 className="text-xl font-medium mb-4 text-tinder-rose">Habits & Lifestyle</h3>
            
            <div className="space-y-1">
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
            </div>
          </Card>
          
          <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm border-tinder-orange/10">
            <h3 className="text-xl font-medium mb-4 text-tinder-orange">Relationships</h3>
            
            <div className="space-y-1">
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
          </Card>
        </TabsContent>
        
        <TabsContent value="interests" className="animate-fade-up">
          <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm border-tinder-orange/10">
            <h3 className="text-xl font-medium mb-4 text-tinder-orange">Interests & Hobbies</h3>
            
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
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="favorites" className="animate-fade-up">
          <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm border-tinder-peach/10">
            <h3 className="text-xl font-medium mb-4 text-tinder-peach">Favorites</h3>
            
            <div className="space-y-4">
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
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="more" className="space-y-8 animate-fade-up">
          <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm border-tinder-orange/10">
            <h3 className="text-xl font-medium mb-4 text-tinder-orange">Languages</h3>
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
          </Card>
          
          <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm border-tinder-rose/10">
            <h3 className="text-xl font-medium mb-4 text-tinder-rose">Travel</h3>
            
            <div className="space-y-1">
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
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ProfileDetails;
