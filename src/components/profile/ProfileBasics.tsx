
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
  // Ensure height is displayed in cm format
  const heightDisplay = details.height?.includes('cm') ? details.height : `${details.height} cm`;

  return (
    <div className="space-y-1 py-4">
      <DetailItem 
        icon={<User size={18} />} 
        label="Basics" 
        value={
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline" className={tinderBadgeStyle}>{heightDisplay}</Badge>
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
