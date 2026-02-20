import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Trophy, Gem, Star, ThermometerSun, Globe, Brain
} from 'lucide-react';
import DetailItem from './DetailItem';
import { useTranslations } from '@/hooks/useTranslations';

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
  onFieldEdit?: (updates: Record<string, any>) => Promise<void>;
}

const ProfilePersonality: React.FC<ProfilePersonalityProps> = ({ 
  details, 
  tinderBadgeStyle, 
  formatList,
  isMobile,
  onFieldEdit
}) => {
  const { t } = useTranslations();
  const notSpecified = t('common.not_specified', 'Not specified');

  const renderBadgeList = (items: string[] | string | undefined) => {
    if (!items) return <span className="text-muted-foreground">{notSpecified}</span>;
    const itemList = Array.isArray(items) ? items : formatList(items).split(", ");
    if (itemList.length === 0) return <span className="text-muted-foreground">{notSpecified}</span>;
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
        icon={<Trophy size={18} />} label={t('profile.growth_goals', 'Growth Goals')}
        editable={!!onFieldEdit}
        fieldKey="growthGoals"
        fieldType="multi-select"
        fieldOptions={["Career growth", "Health & fitness", "Education", "Spiritual growth", "Financial freedom", "Better relationships", "Travel more", "Learn new skills"]}
        onFieldEdit={onFieldEdit}
        value={renderBadgeList(details.growthGoals)} 
      />
      <Separator />
      <DetailItem 
        icon={<Gem size={18} />} label={t('profile.hidden_talents', 'Hidden Talents')}
        editable={!!onFieldEdit}
        fieldKey="hiddenTalents"
        fieldType="multi-select"
        fieldOptions={["Singing", "Dancing", "Cooking", "Drawing", "Writing", "Languages", "Sports", "Comedy", "Crafts"]}
        onFieldEdit={onFieldEdit}
        value={renderBadgeList(details.hiddenTalents)} 
      />
      <Separator />
      <DetailItem 
        icon={<Star size={18} />} label={t('profile.favorite_memory', 'Favorite Memory')}
        value={details.favoriteMemory || notSpecified}
        editable={!!onFieldEdit}
        fieldKey="favoriteMemory"
        fieldType="text"
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<ThermometerSun size={18} />} label={t('profile.stress_relievers', 'Stress Relievers')}
        editable={!!onFieldEdit}
        fieldKey="stressRelievers"
        fieldType="multi-select"
        fieldOptions={["Exercise", "Meditation", "Music", "Reading", "Nature walks", "Cooking", "Gaming", "Socializing", "Art"]}
        onFieldEdit={onFieldEdit}
        value={renderBadgeList(details.stressRelievers)} 
      />
      <Separator />
      <DetailItem 
        icon={<Globe size={18} />} label={t('profile.charity_involvement', 'Charity Involvement')}
        value={details.charityInvolvement || notSpecified}
        editable={!!onFieldEdit}
        fieldKey="charityInvolvement"
        fieldType="text"
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Brain size={18} />} label={t('profile.decision_making_style', 'Decision Making Style')}
        value={details.decisionMakingStyle || notSpecified}
        editable={!!onFieldEdit}
        fieldKey="decisionMakingStyle"
        fieldType="select"
        fieldOptions={["Analytical", "Intuitive", "Collaborative", "Spontaneous"]}
        onFieldEdit={onFieldEdit}
      />
    </div>
  );
};

export default ProfilePersonality;
