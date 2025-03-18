
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
}

const ProfileInterests: React.FC<ProfileInterestsProps> = ({ 
  details, 
  tinderBadgeStyle, 
  formatList,
  isMobile
}) => {
  return (
    <div className="py-4">
      <div className="flex flex-wrap gap-2 mb-6">
        {details.interests.map((interest, index) => (
          <Badge key={index} className={`rounded-full bg-gradient-to-r from-tinder-rose${isMobile ? '' : '/90'} to-tinder-orange${isMobile ? '' : '/90'} text-white hover:from-tinder-rose hover:to-tinder-orange transition-colors py-1.5 px-3`}>
            {interest}
          </Badge>
        ))}
        
        {details.hobbies && Array.isArray(details.hobbies) && details.hobbies.map((hobby, index) => (
          <Badge key={`hobby-${index}`} className={`rounded-full bg-gradient-to-r from-tinder-orange${isMobile ? '' : '/90'} to-tinder-peach${isMobile ? '' : '/90'} text-white hover:from-tinder-orange hover:to-tinder-peach transition-colors py-1.5 px-3`}>
            {hobby}
          </Badge>
        ))}
        
        {details.hobbies && !Array.isArray(details.hobbies) && 
          details.hobbies.split(", ").map((hobby, index) => (
            <Badge key={`hobby-${index}`} className={`rounded-full bg-gradient-to-r from-tinder-orange${isMobile ? '' : '/90'} to-tinder-peach${isMobile ? '' : '/90'} text-white hover:from-tinder-orange hover:to-tinder-peach transition-colors py-1.5 px-3`}>
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
        
        <Separator className={isMobile ? "bg-gray-800" : ""} />
        
        <DetailItem 
          icon={<Sparkles size={18} />} 
          label="Ideal Date" 
          value={details.idealDate || "Not specified"} 
        />
        
        <Separator className={isMobile ? "bg-gray-800" : ""} />
        
        <DetailItem 
          icon={<Map size={18} />} 
          label="Career Ambitions" 
          value={details.careerAmbitions || "Not specified"} 
        />
        
        <Separator className={isMobile ? "bg-gray-800" : ""} />
        
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
        
        <Separator className={isMobile ? "bg-gray-800" : ""} />
        
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
  );
};

export default ProfileInterests;
