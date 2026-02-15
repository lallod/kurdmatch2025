
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
  onFieldEdit?: (updates: Record<string, any>) => Promise<void>;
}

const ProfileTravel: React.FC<ProfileTravelProps> = ({ details, isMobile, onFieldEdit }) => {
  return (
    <div className="space-y-6 py-4 animate-fade-in">
      <DetailItem 
        icon={<Plane size={18} />} 
        label="Travel Frequency" 
        value={details.travelFrequency}
        editable={!!onFieldEdit}
        fieldKey="travelFrequency"
        fieldType="select"
        fieldOptions={["Rarely", "Once a year", "A few times a year", "Monthly", "Constantly traveling"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Palmtree size={18} />} 
        label="Dream Vacation" 
        value={details.dreamVacation || "Not specified"}
        editable={!!onFieldEdit}
        fieldKey="dreamVacation"
        fieldType="text"
        onFieldEdit={onFieldEdit}
      />
    </div>
  );
};

export default ProfileTravel;
