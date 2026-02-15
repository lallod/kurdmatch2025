
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, Sparkles, Map, Headphones, Puzzle
} from 'lucide-react';
import DetailItem from './DetailItem';

interface ProfileInterestsProps {
  details: {
    interests: string[];
    hobbies?: string[] | string;
    weekendActivities?: string[] | string;
    idealDate?: string;
    careerAmbitions?: string;
    musicInstruments?: string[] | string;
    favoriteGames?: string[] | string;
  };
  tinderBadgeStyle: string;
  formatList: (value: string[] | string | undefined) => string;
  isMobile: boolean;
  onFieldEdit?: (updates: Record<string, any>) => Promise<void>;
}

const ProfileInterests: React.FC<ProfileInterestsProps> = ({ 
  details, 
  tinderBadgeStyle, 
  formatList,
  isMobile,
  onFieldEdit
}) => {
  return (
    <div className="py-4">
      <div className="flex flex-wrap gap-2 mb-6">
        {details.interests.map((interest, index) => (
          <Badge key={index} className="rounded-full bg-gradient-to-r from-primary/90 to-accent/90 text-primary-foreground hover:from-primary hover:to-accent transition-colors py-1.5 px-3">
            {interest}
          </Badge>
        ))}
        
        {details.hobbies && Array.isArray(details.hobbies) && details.hobbies.map((hobby, index) => (
          <Badge key={`hobby-${index}`} className="rounded-full bg-gradient-to-r from-accent/90 to-primary/70 text-primary-foreground hover:from-accent hover:to-primary transition-colors py-1.5 px-3">
            {hobby}
          </Badge>
        ))}
        
        {details.hobbies && !Array.isArray(details.hobbies) && 
          details.hobbies.split(", ").map((hobby, index) => (
            <Badge key={`hobby-${index}`} className="rounded-full bg-gradient-to-r from-accent/90 to-primary/70 text-primary-foreground hover:from-accent hover:to-primary transition-colors py-1.5 px-3">
              {hobby}
            </Badge>
          ))
        }
      </div>
      
      <div className="space-y-1">
        <DetailItem 
          icon={<Calendar size={18} />} label="Weekend Activities" 
          editable={!!onFieldEdit}
          fieldKey="weekendActivities"
          fieldType="multi-select"
          fieldOptions={["Hiking", "Reading", "Socializing", "Gaming", "Cooking", "Sports", "Shopping", "Traveling", "Relaxing", "Volunteering"]}
          onFieldEdit={onFieldEdit}
          value={
            <div className="flex flex-wrap gap-2 mt-1">
              {Array.isArray(details.weekendActivities) ? 
                details.weekendActivities.map((act, i) => (
                  <Badge key={i} variant="outline" className={tinderBadgeStyle}>{act}</Badge>
                )) : 
                (formatList(details.weekendActivities) || "Not specified").split(", ").filter(Boolean).map((act, i) => (
                  <Badge key={i} variant="outline" className={tinderBadgeStyle}>{act}</Badge>
                ))
              }
            </div>
          }
        />
        <Separator />
        <DetailItem 
          icon={<Sparkles size={18} />} label="Ideal Date" 
          value={details.idealDate || "Not specified"}
          editable={!!onFieldEdit}
          fieldKey="idealDate"
          fieldType="select"
          fieldOptions={["Dinner & conversation", "Outdoor adventure", "Coffee shop", "Movie night", "Cooking together", "Cultural event", "Picnic", "Surprise me"]}
          onFieldEdit={onFieldEdit}
        />
        <Separator />
        <DetailItem 
          icon={<Map size={18} />} label="Career Ambitions" 
          value={details.careerAmbitions || "Not specified"}
          editable={!!onFieldEdit}
          fieldKey="careerAmbitions"
          fieldType="select"
          fieldOptions={["Climbing the ladder", "Entrepreneurial", "Content where I am", "Career change", "Creative pursuit", "Work to live"]}
          onFieldEdit={onFieldEdit}
        />
        <Separator />
        <DetailItem 
          icon={<Headphones size={18} />} label="Music Instruments" 
          editable={!!onFieldEdit}
          fieldKey="musicInstruments"
          fieldType="multi-select"
          fieldOptions={["Guitar", "Piano", "Drums", "Violin", "Flute", "Oud", "Saz", "Daf", "None"]}
          onFieldEdit={onFieldEdit}
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
          icon={<Puzzle size={18} />} label="Favorite Games" 
          editable={!!onFieldEdit}
          fieldKey="favoriteGames"
          fieldType="multi-select"
          fieldOptions={["Chess", "Card games", "Video games", "Board games", "Puzzle games", "Sports games", "Strategy games"]}
          onFieldEdit={onFieldEdit}
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
  );
};

export default ProfileInterests;
