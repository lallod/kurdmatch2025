
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Trophy, Gem, Star, ThermometerSun, Globe, Brain
} from 'lucide-react';
import DetailItem from './DetailItem';

interface ProfilePersonalityProps {
  details: {
    growthGoals?: string[] | string;
    hiddenTalents?: string[] | string;
    favoriteMemory?: string;
    stressRelievers?: string[] | string;
    charityInvolvement?: string;
    decisionMakingStyle?: string;
  };
  tinderBadgeStyle: string;
  formatList: (value: string[] | string | undefined) => string;
  isMobile: boolean;
}

const ProfilePersonality: React.FC<ProfilePersonalityProps> = ({ 
  details, 
  tinderBadgeStyle, 
  formatList,
  isMobile
}) => {
  // Helper function to render badge lists
  const renderBadgeList = (items: string[] | string | undefined) => {
    if (!items) return null;
    
    const itemList = Array.isArray(items) 
      ? items 
      : formatList(items).split(", ");
    
    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {itemList.map((item, i) => (
          <Badge key={i} variant="outline" className={tinderBadgeStyle}>{item}</Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 py-4">
      <DetailItem 
        icon={<Trophy size={18} />} 
        label="Growth Goals" 
        value={renderBadgeList(details.growthGoals)} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Gem size={18} />} 
        label="Hidden Talents" 
        value={renderBadgeList(details.hiddenTalents)} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Star size={18} />} 
        label="Favorite Memory" 
        value={details.favoriteMemory || "Not specified"} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<ThermometerSun size={18} />} 
        label="Stress Relievers" 
        value={renderBadgeList(details.stressRelievers)} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Globe size={18} />} 
        label="Charity Involvement" 
        value={details.charityInvolvement || "Not specified"} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Brain size={18} />} 
        label="Decision Making Style" 
        value={details.decisionMakingStyle || "Not specified"} 
      />
    </div>
  );
};

export default ProfilePersonality;
