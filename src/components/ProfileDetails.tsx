
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-16 animate-fade-up" style={{ animationDelay: '0.2s' }}>
      <div className="mb-12">
        <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase">About</span>
        <h2 className="text-3xl font-light mt-1">Profile Details</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm">
          <h3 className="text-xl font-medium mb-4">Bio</h3>
          <p className="text-muted-foreground leading-relaxed">{details.about}</p>
          
          <Separator className="my-6" />
          
          <div className="space-y-1">
            <DetailItem 
              icon={<User size={18} />} 
              label="Basics" 
              value={
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline" className="rounded-full">{details.height}</Badge>
                  <Badge variant="outline" className="rounded-full">{details.bodyType}</Badge>
                  <Badge variant="outline" className="rounded-full">{details.ethnicity}</Badge>
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
                  <Badge variant="outline" className="rounded-full">{details.religion}</Badge>
                  <Badge variant="outline" className="rounded-full">{details.politicalViews}</Badge>
                </div>
              } 
            />
            
            <Separator />
            
            <DetailItem 
              icon={<Wine size={18} />} 
              label="Lifestyle" 
              value={
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline" className="rounded-full">Drinks: {details.drinking}</Badge>
                  <Badge variant="outline" className="rounded-full">Smokes: {details.smoking}</Badge>
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
          <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-medium mb-4">Languages</h3>
            <DetailItem 
              icon={<Languages size={18} />} 
              label="Can speak" 
              value={
                <div className="flex flex-wrap gap-2 mt-1">
                  {details.languages.map((language, index) => (
                    <Badge key={index} variant="outline" className="rounded-full">{language}</Badge>
                  ))}
                </div>
              } 
            />
          </Card>
          
          <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-medium mb-4">Interests</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {details.interests.map((interest, index) => (
                <Badge key={index} className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                  {interest}
                </Badge>
              ))}
            </div>
          </Card>
          
          <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-medium mb-4">Favorites</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Books</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {details.favoriteBooks.map((book, index) => (
                    <Badge key={index} variant="outline" className="rounded-full">{book}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Coffee size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Movies</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {details.favoriteMovies.map((movie, index) => (
                    <Badge key={index} variant="outline" className="rounded-full">{movie}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Music size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Music</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {details.favoriteMusic.map((music, index) => (
                    <Badge key={index} variant="outline" className="rounded-full">{music}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Utensils size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium">Food</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {details.favoriteFoods.map((food, index) => (
                    <Badge key={index} variant="outline" className="rounded-full">{food}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 shadow-lg rounded-xl bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-medium mb-4">Lifestyle</h3>
            
            <div className="space-y-6">
              <DetailItem 
                icon={<Dumbbell size={18} />} 
                label="Exercise" 
                value={details.exerciseHabits} 
              />
              
              <Separator />
              
              <DetailItem 
                icon={<Moon size={18} />} 
                label="Zodiac Sign" 
                value={details.zodiacSign} 
              />
              
              <Separator />
              
              <DetailItem 
                icon={<User size={18} />} 
                label="Personality" 
                value={details.personalityType} 
              />
              
              <Separator />
              
              <DetailItem 
                icon={<Clock size={18} />} 
                label="Sleep Schedule" 
                value={details.sleepSchedule} 
              />
              
              <Separator />
              
              <DetailItem 
                icon={<Plane size={18} />} 
                label="Travel" 
                value={details.travelFrequency} 
              />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProfileDetails;
