
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, Baby, PawPrint, Users, MessageCircle, Sparkles, X
} from 'lucide-react';
import DetailItem from './DetailItem';
import { useTranslations } from '@/hooks/useTranslations';

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
  const { t } = useTranslations();
  
  return (
    <div className="space-y-1 py-4">
      <DetailItem 
        icon={<Heart size={18} />} 
        label={t('profile.relationship_goals', 'Relationship Goals')} 
        value={details.relationshipGoals} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Baby size={18} />} 
        label={t('profile.children', 'Children')} 
        value={
          <div>
            <div>{t('profile.future_plans', 'Future plans')}: {details.wantChildren}</div>
            <div>{t('profile.current', 'Current')}: {details.childrenStatus || t('profile.not_specified', 'Not specified')}</div>
          </div>
        } 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<PawPrint size={18} />} 
        label={t('profile.pets', 'Pets')} 
        value={details.havePets} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Users size={18} />} 
        label={t('profile.family_friends', 'Family & Friends')} 
        value={
          <div>
            <div>{t('profile.family', 'Family')}: {details.familyCloseness || t('profile.not_specified', 'Not specified')}</div>
            <div>{t('profile.friends', 'Friends')}: {details.friendshipStyle || t('profile.not_specified', 'Not specified')}</div>
          </div>
        } 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<MessageCircle size={18} />} 
        label={t('profile.communication_style', 'Communication Style')} 
        value={details.communicationStyle || t('profile.not_specified', 'Not specified')} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Sparkles size={18} />} 
        label={t('profile.love_language', 'Love Language')} 
        value={details.loveLanguage || t('profile.not_specified', 'Not specified')} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<X size={18} />} 
        label={t('profile.pet_peeves', 'Pet Peeves')} 
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
