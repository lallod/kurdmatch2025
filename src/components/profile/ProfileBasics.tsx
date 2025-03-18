
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, Church, Award
} from 'lucide-react';
import DetailItem from './DetailItem';

interface ProfileBasicsProps {
  details: {
    height: string;
    bodyType: string;
    ethnicity: string;
    religion: string;
    politicalViews: string;
    values?: string[] | string;
  };
  tinderBadgeStyle: string;
  formatList: (value: string[] | string | undefined) => string;
  isMobile: boolean;
}

const ProfileBasics: React.FC<ProfileBasicsProps> = ({ 
  details, 
  tinderBadgeStyle, 
  formatList,
  isMobile
}) => {
  // Check if height is already in cm format, otherwise convert from feet/inches
  const heightInCm = details.height.includes("cm") 
    ? details.height // Already in cm format
    : details.height.includes("'") 
      ? `${Math.round(parseInt(details.height.split("'")[0]) * 30.48 + parseInt(details.height.split("'")[1]) * 2.54)} cm` 
      : details.height;

  return (
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
  );
};

export default ProfileBasics;
