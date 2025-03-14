
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  User, MapPin, Briefcase, GraduationCap, Wine, Coffee, 
  Heart, Music, BookOpen, Pencil, Languages, Clock, Calendar,
  Utensils, Dumbbell, Baby, Plane, PawPrint, Cigarette, Moon, Sun
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
  };
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ details }) => {
  const isMobile = useIsMobile();

  const tinderBadgeStyle = isMobile 
    ? "rounded-full bg-gray-800 text-white border-gray-700" 
    : "rounded-full bg-gradient-to-r from-tinder-rose/10 to-tinder-orange/10 border-tinder-rose/20 text-tinder-rose";

  if (isMobile) {
    return (
      <section className="w-full px-4 py-6 animate-fade-up">
        <div className="mb-6">
          <h2 className="text-2xl font-medium text-white mb-3">About Me</h2>
          <p className="text-gray-300 leading-relaxed">{details.about}</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-xl font-medium text-white mb-4">Basics</h3>
            
            <div className="space-y-3">
              <DetailItem 
                icon={<User size={18} />} 
                label="Physical" 
                value={
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline" className="rounded-full bg-gray-800 text-white border-gray-700">{details.height}</Badge>
                    <Badge variant="outline" className="rounded-full bg-gray-800 text-white border-gray-700">{details.bodyType}</Badge>
                    <Badge variant="outline" className="rounded-full bg-gray-800 text-white border-gray-700">{details.ethnicity}</Badge>
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
            <h3 className="text-xl font-medium text-white mb-4">Lifestyle</h3>
            
            <div className="space-y-3">
              <DetailItem 
                icon={<Heart size={18} />} 
                label="Relationship" 
                value={details.relationshipGoals} 
              />
              
              <Separator className="bg-gray-800" />
              
              <DetailItem 
                icon={<Wine size={18} />} 
                label="Habits" 
                value={
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline" className="rounded-full bg-gray-800 text-white border-gray-700">Drinks: {details.drinking}</Badge>
                    <Badge variant="outline" className="rounded-full bg-gray-800 text-white border-gray-700">Smokes: {details.smoking}</Badge>
                  </div>
                } 
              />
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-xl font-medium text-white mb-4">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {details.interests.map((interest, index) => (
                <Badge key={index} className="rounded-full bg-gradient-to-r from-tinder-rose to-tinder-orange text-white">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-16 animate-fade-up" style={{ animationDelay: '0.2s' }}>
      <div className="mb-12">
        <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase">About</span>
        <h2 className="text-3xl font-light mt-1">Profile Details</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm border-tinder-rose/10">
          <h3 className="text-xl font-medium mb-4 text-tinder-rose">Bio</h3>
          <p className="text-muted-foreground leading-relaxed">{details.about}</p>
          
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
              icon={<Wine size={18} />} 
              label="Lifestyle" 
              value={
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline" className={tinderBadgeStyle}>Drinks: {details.drinking}</Badge>
                  <Badge variant="outline" className={tinderBadgeStyle}>Smokes: {details.smoking}</Badge>
                </div>
              } 
            />
            
            <Separator />
            
            <DetailItem 
              icon={<Heart size={18} />} 
              label="Relationship" 
              value={details.relationshipGoals} 
            />
            
            <Separator />
            
            <DetailItem 
              icon={<Baby size={18} />} 
              label="Family" 
              value={`Children: ${details.wantChildren}`} 
            />
            
            <Separator />
            
            <DetailItem 
              icon={<PawPrint size={18} />} 
              label="Pets" 
              value={details.havePets} 
            />
          </div>
        </Card>
        
        <div className="space-y-8">
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
          
          <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm border-tinder-orange/10">
            <h3 className="text-xl font-medium mb-4 text-tinder-orange">Interests</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {details.interests.map((interest, index) => (
                <Badge key={index} className="rounded-full bg-gradient-to-r from-tinder-rose/90 to-tinder-orange/90 text-white hover:from-tinder-rose hover:to-tinder-orange transition-colors">
                  {interest}
                </Badge>
              ))}
            </div>
          </Card>
          
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
                  <Coffee size={16} className="text-tinder-peach" />
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
        </div>
      </div>
    </section>
  );
};

export default ProfileDetails;
