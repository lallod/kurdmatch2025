
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { 
  Plane, Palmtree
} from 'lucide-react';
import DetailItem from './DetailItem';

interface ProfileTravelProps {
  details: {
    travelFrequency: string;
    dreamVacation?: string;
  };
  isMobile: boolean;
}

const ProfileTravel: React.FC<ProfileTravelProps> = ({ details, isMobile }) => {
  return (
    <div className="space-y-6 py-4 animate-fade-in">
      <DetailItem 
        icon={<Plane size={18} className="group-hover:animate-pulse" />} 
        label="Travel Frequency" 
        value={details.travelFrequency} 
      />
      
      <Separator className={isMobile ? "bg-gray-700/50" : ""} />
      
      <DetailItem 
        icon={<Palmtree size={18} className="group-hover:animate-pulse" />} 
        label="Dream Vacation" 
        value={details.dreamVacation || "Not specified"} 
      />
    </div>
  );
};

export default ProfileTravel;
