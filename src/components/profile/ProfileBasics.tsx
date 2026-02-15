
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
  onFieldEdit?: (updates: Record<string, any>) => Promise<void>;
}

const ProfileBasics: React.FC<ProfileBasicsProps> = ({ 
  details, 
  tinderBadgeStyle, 
  formatList,
  isMobile,
  onFieldEdit
}) => {
  const heightDisplay = details.height?.includes('cm') ? details.height : `${details.height} cm`;

  return (
    <div className="space-y-1 py-4">
      <DetailItem 
        icon={<User size={18} />} 
        label="Height"
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
        label="Body Type"
        value={details.bodyType}
        editable={!!onFieldEdit}
        fieldKey="bodyType"
        fieldType="select"
        fieldOptions={["Slim", "Athletic", "Average", "Curvy", "Plus-size"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<User size={18} />} 
        label="Ethnicity"
        value={details.ethnicity}
        editable={!!onFieldEdit}
        fieldKey="ethnicity"
        fieldType="select"
        fieldOptions={["Kurdish", "Middle Eastern", "European", "Asian", "African", "Latin American", "Mixed", "Other"]}
        onFieldEdit={onFieldEdit}
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Church size={18} />} 
        label="Religion"
        value={details.religion}
        editable={!!onFieldEdit}
        fieldKey="religion"
        fieldType="select"
        fieldOptions={["Islam", "Christianity", "Judaism", "Yazidism", "Zoroastrianism", "Other", "Not religious"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Church size={18} />} 
        label="Political Views"
        value={details.politicalViews}
        editable={!!onFieldEdit}
        fieldKey="politicalViews"
        fieldType="select"
        fieldOptions={["Liberal", "Conservative", "Moderate", "Progressive", "Libertarian", "Apolitical", "Other"]}
        onFieldEdit={onFieldEdit}
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Award size={18} />} 
        label="Values" 
        editable={!!onFieldEdit}
        fieldKey="values"
        fieldType="multi-select"
        fieldOptions={["Family", "Honesty", "Loyalty", "Ambition", "Kindness", "Faith", "Freedom", "Education", "Tradition", "Equality"]}
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
