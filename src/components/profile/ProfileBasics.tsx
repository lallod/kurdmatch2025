
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, Church, Award
} from 'lucide-react';
import DetailItem from './DetailItem';
import { useTranslations } from '@/hooks/useTranslations';

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
  onFieldEdit?: (updates: Record<string, any>) => Promise<void>;
}

const ProfileBasics: React.FC<ProfileBasicsProps> = ({ 
  details, 
  tinderBadgeStyle, 
  formatList,
  isMobile,
  onFieldEdit
}) => {
  const { t } = useTranslations();
  const heightDisplay = details.height?.includes('cm') ? details.height : `${details.height} cm`;

  return (
    <div className="space-y-1 py-4">
      <DetailItem 
        icon={<User size={18} />} 
        label={t('profile.height', 'Height')}
        value={heightDisplay}
        editable={!!onFieldEdit}
        fieldKey="height"
        fieldType="select"
        fieldOptions={Array.from({ length: 66 }, (_, i) => `${145 + i} cm`)}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<User size={18} />} 
        label={t('profile.body_type', 'Body Type')}
        value={details.bodyType}
        editable={!!onFieldEdit}
        fieldKey="bodyType"
        fieldType="select"
        fieldOptions={[
          t('profile.slim', 'Slim'),
          t('profile.athletic', 'Athletic'),
          t('profile.average', 'Average'),
          t('profile.curvy', 'Curvy'),
          t('profile.plus_size', 'Plus-size')
        ]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<User size={18} />} 
        label={t('profile.ethnicity', 'Ethnicity')}
        value={details.ethnicity}
        editable={!!onFieldEdit}
        fieldKey="ethnicity"
        fieldType="select"
        fieldOptions={[
          t('profile.kurdish', 'Kurdish'),
          t('profile.middle_eastern', 'Middle Eastern'),
          t('profile.european', 'European'),
          t('profile.asian', 'Asian'),
          t('profile.african', 'African'),
          t('profile.latin_american', 'Latin American'),
          t('profile.mixed', 'Mixed'),
          t('profile.other', 'Other')
        ]}
        onFieldEdit={onFieldEdit}
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Church size={18} />} 
        label={t('profile.religion', 'Religion')}
        value={details.religion}
        editable={!!onFieldEdit}
        fieldKey="religion"
        fieldType="select"
        fieldOptions={[
          t('profile.islam', 'Islam'),
          t('profile.christianity', 'Christianity'),
          t('profile.judaism', 'Judaism'),
          t('profile.yazidism', 'Yazidism'),
          t('profile.zoroastrianism', 'Zoroastrianism'),
          t('profile.other', 'Other'),
          t('profile.not_religious', 'Not religious')
        ]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Church size={18} />} 
        label={t('profile.political_views', 'Political Views')}
        value={details.politicalViews}
        editable={!!onFieldEdit}
        fieldKey="politicalViews"
        fieldType="select"
        fieldOptions={[
          t('profile.liberal', 'Liberal'),
          t('profile.conservative', 'Conservative'),
          t('profile.moderate', 'Moderate'),
          t('profile.progressive', 'Progressive'),
          t('profile.libertarian', 'Libertarian'),
          t('profile.apolitical', 'Apolitical'),
          t('profile.other', 'Other')
        ]}
        onFieldEdit={onFieldEdit}
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Award size={18} />} 
        label={t('profile.values', 'Values')}
        editable={!!onFieldEdit}
        fieldKey="values"
        fieldType="multi-select"
        fieldOptions={[
          t('profile.family', 'Family'),
          t('profile.honesty', 'Honesty'),
          t('profile.loyalty', 'Loyalty'),
          t('profile.ambition', 'Ambition'),
          t('profile.kindness', 'Kindness'),
          t('profile.faith', 'Faith'),
          t('profile.freedom', 'Freedom'),
          t('profile.education', 'Education'),
          t('profile.tradition', 'Tradition'),
          t('profile.equality', 'Equality')
        ]}
        onFieldEdit={onFieldEdit}
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