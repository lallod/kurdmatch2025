
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, Home, Car, Cpu, Briefcase, MountainSnow, CloudSun
} from 'lucide-react';
import DetailItem from './DetailItem';

interface ProfileCreativeProps {
  details: {
    creativePursuits?: string[] | string;
    dreamHome?: string;
    transportationPreference?: string;
    techSkills?: string[] | string;
    workEnvironment?: string;
    favoriteSeason?: string;
    idealWeather?: string;
  };
  tinderBadgeStyle: string;
  formatList: (value: string[] | string | undefined) => string;
  isMobile: boolean;
  onFieldEdit?: (updates: Record<string, any>) => Promise<void>;
}

const ProfileCreative: React.FC<ProfileCreativeProps> = ({ 
  details, 
  tinderBadgeStyle, 
  formatList,
  isMobile,
  onFieldEdit
}) => {
  const renderBadgeList = (items: string[] | string | undefined) => {
    if (!items) return <span className="text-muted-foreground">Not specified</span>;
    const itemList = Array.isArray(items) ? items : formatList(items).split(", ");
    if (itemList.length === 0) return <span className="text-muted-foreground">Not specified</span>;
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
        icon={<Palette size={18} />} label="Creative Pursuits" 
        editable={!!onFieldEdit}
        fieldKey="creativePursuits"
        fieldType="multi-select"
        fieldOptions={["Photography", "Painting", "Writing", "Music", "Dance", "Film", "Crafts", "Design", "Poetry"]}
        onFieldEdit={onFieldEdit}
        value={renderBadgeList(details.creativePursuits)} 
      />
      <Separator />
      <DetailItem 
        icon={<Home size={18} />} label="Dream Home" 
        value={details.dreamHome || "Not specified"}
        editable={!!onFieldEdit}
        fieldKey="dreamHome"
        fieldType="select"
        fieldOptions={["City apartment", "Suburban house", "Country home", "Beach house", "Mountain cabin", "Penthouse", "Tiny home"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Car size={18} />} label="Transportation" 
        value={details.transportationPreference || "Not specified"}
        editable={!!onFieldEdit}
        fieldKey="transportationPreference"
        fieldType="select"
        fieldOptions={["Car", "Public transit", "Bicycle", "Walking", "Motorcycle", "Mixed"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<Cpu size={18} />} label="Tech Skills" 
        editable={!!onFieldEdit}
        fieldKey="techSkills"
        fieldType="multi-select"
        fieldOptions={["Programming", "Design", "Video editing", "Photography", "Social media", "Data analysis", "AI/ML", "Web development"]}
        onFieldEdit={onFieldEdit}
        value={renderBadgeList(details.techSkills)} 
      />
      <Separator />
      <DetailItem 
        icon={<Briefcase size={18} />} label="Work Environment" 
        value={details.workEnvironment || "Not specified"}
        editable={!!onFieldEdit}
        fieldKey="workEnvironment"
        fieldType="select"
        fieldOptions={["Office", "Remote", "Hybrid", "Outdoor", "Studio", "Lab"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<MountainSnow size={18} />} label="Favorite Season" 
        value={details.favoriteSeason || "Not specified"}
        editable={!!onFieldEdit}
        fieldKey="favoriteSeason"
        fieldType="select"
        fieldOptions={["Spring", "Summer", "Autumn", "Winter"]}
        onFieldEdit={onFieldEdit}
      />
      <Separator />
      <DetailItem 
        icon={<CloudSun size={18} />} label="Ideal Weather" 
        value={details.idealWeather || "Not specified"}
        editable={!!onFieldEdit}
        fieldKey="idealWeather"
        fieldType="select"
        fieldOptions={["Sunny & warm", "Cool & breezy", "Rainy & cozy", "Snowy", "Mild & temperate", "Hot & tropical"]}
        onFieldEdit={onFieldEdit}
      />
    </div>
  );
};

export default ProfileCreative;
