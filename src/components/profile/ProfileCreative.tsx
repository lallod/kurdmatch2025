
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, Home, Car, Cpu, Briefcase, MountainSnow, CloudSun
} from 'lucide-react';
import DetailItem from './DetailItem';

interface ProfileCreativeProps {
  details: {
    creativePursuits?: string[] | string;
    dreamHome?: string;
    transportationPreference?: string;
    techSkills?: string[] | string;
    workEnvironment?: string;
    favoriteSeason?: string;
    idealWeather?: string;
  };
  tinderBadgeStyle: string;
  formatList: (value: string[] | string | undefined) => string;
  isMobile: boolean;
}

const ProfileCreative: React.FC<ProfileCreativeProps> = ({ 
  details, 
  tinderBadgeStyle, 
  formatList,
  isMobile
}) => {
  return (
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
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<Home size={18} />} 
        label="Dream Home" 
        value={details.dreamHome || "Not specified"} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<Car size={18} />} 
        label="Transportation" 
        value={details.transportationPreference || "Not specified"} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
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
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<Briefcase size={18} />} 
        label="Work Environment" 
        value={details.workEnvironment || "Not specified"} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<MountainSnow size={18} />} 
        label="Favorite Season" 
        value={details.favoriteSeason || "Not specified"} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<CloudSun size={18} />} 
        label="Ideal Weather" 
        value={details.idealWeather || "Not specified"} 
      />
    </div>
  );
};

export default ProfileCreative;
