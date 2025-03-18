
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, Baby, PawPrint, Users, MessageCircle, Sparkles, X
} from 'lucide-react';
import DetailItem from './DetailItem';

interface ProfileRelationshipsProps {
  details: {
    relationshipGoals: string;
    wantChildren: string;
    childrenStatus?: string;
    havePets: string;
    familyCloseness?: string;
    friendshipStyle?: string;
    communicationStyle?: string;
    loveLanguage?: string;
    petPeeves?: string[] | string;
  };
  tinderBadgeStyle: string;
  formatList: (value: string[] | string | undefined) => string;
  isMobile: boolean;
}

const ProfileRelationships: React.FC<ProfileRelationshipsProps> = ({ 
  details, 
  tinderBadgeStyle, 
  formatList,
  isMobile
}) => {
  return (
    <div className="space-y-1 py-4">
      <DetailItem 
        icon={<Heart size={18} />} 
        label="Relationship Goals" 
        value={details.relationshipGoals} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<Baby size={18} />} 
        label="Children" 
        value={
          <div>
            <div>Future plans: {details.wantChildren}</div>
            <div>Current: {details.childrenStatus || "Not specified"}</div>
          </div>
        } 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<PawPrint size={18} />} 
        label="Pets" 
        value={details.havePets} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<Users size={18} />} 
        label="Family & Friends" 
        value={
          <div>
            <div>Family: {details.familyCloseness || "Not specified"}</div>
            <div>Friends: {details.friendshipStyle || "Not specified"}</div>
          </div>
        } 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<MessageCircle size={18} />} 
        label="Communication Style" 
        value={details.communicationStyle || "Not specified"} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<Sparkles size={18} />} 
        label="Love Language" 
        value={details.loveLanguage || "Not specified"} 
      />
      
      <Separator className={isMobile ? "bg-gray-800" : ""} />
      
      <DetailItem 
        icon={<X size={18} />} 
        label="Pet Peeves" 
        value={
          <div className="flex flex-wrap gap-2 mt-1">
            {Array.isArray(details.petPeeves) ? 
              details.petPeeves.map((peeve, i) => (
                <Badge key={i} variant="outline" className={tinderBadgeStyle}>{peeve}</Badge>
              )) : 
              formatList(details.petPeeves).split(", ").map((peeve, i) => (
                <Badge key={i} variant="outline" className={tinderBadgeStyle}>{peeve}</Badge>
              ))
            }
          </div>
        } 
      />
    </div>
  );
};

export default ProfileRelationships;
