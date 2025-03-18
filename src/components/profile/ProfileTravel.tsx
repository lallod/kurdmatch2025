
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
    <div className="space-y-6 py-4">
      <DetailItem 
        icon={<Plane size={18} className={isMobile ? "text-white" : ""} />} 
        label="Travel Frequency" 
        value={details.travelFrequency} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<Palmtree size={18} className={isMobile ? "text-white" : ""} />} 
        label="Dream Vacation" 
        value={details.dreamVacation || "Not specified"} 
      />
    </div>
  );
};

export default ProfileTravel;
