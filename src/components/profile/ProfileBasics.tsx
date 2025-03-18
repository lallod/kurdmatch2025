
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
  // Function to convert height from feet/inches to cm
  const convertHeightToCm = (height: string): string => {
    // If already contains "cm", return as is
    if (height.toLowerCase().includes("cm")) {
      return height;
    }
    
    // If in format like "5'7"" or similar feet/inches format
    if (height.includes("'")) {
      const parts = height.split("'");
      const feet = parseInt(parts[0], 10);
      const inches = parts[1] ? parseInt(parts[1], 10) : 0;
      
      // Convert to cm: 1 foot = 30.48 cm, 1 inch = 2.54 cm
      const cm = Math.round(feet * 30.48 + inches * 2.54);
      return `${cm} cm`;
    }
    
    // If it's already a number (assuming in cm)
    if (!isNaN(Number(height))) {
      return `${height} cm`;
    }
    
    // Return original if format is not recognized
    return height;
  };

  // Get the height in cm format
  const heightInCm = convertHeightToCm(details.height);

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
