
import React from 'react';
import { 
  GraduationCap, Briefcase, Heart, Star 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProfileQuickStatsProps {
  education: string;
  occupation: string;
  company: string;
  relationshipGoals: string;
  zodiacSign: string;
  personalityType: string;
  tinderBadgeStyle: string;
  isMobile: boolean;
}

const ProfileQuickStats: React.FC<ProfileQuickStatsProps> = ({ 
  education, 
  occupation, 
  company, 
  relationshipGoals, 
  zodiacSign, 
  personalityType,
  tinderBadgeStyle,
  isMobile 
}) => {
  const cardClass = "bg-card p-4 rounded-lg border border-border/20 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300";

  // Use the same icon container styling for both mobile and desktop
  const iconContainerClass = "w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-tinder-rose/10 to-tinder-orange/10 transition-transform duration-300 group-hover:scale-110";

  if (isMobile) {
    return (
      <div className="mt-6 grid grid-cols-2 gap-3 animate-fade-in">
        <div className={`${cardClass} group`}>
          <div className="flex items-center mb-3">
            <div className={`${iconContainerClass} mr-3`}>
              <GraduationCap size={16} className="text-tinder-rose" />
            </div>
            <h4 className="text-sm font-medium">Education</h4>
          </div>
          <p className="text-sm text-muted-foreground">{education.split(',')[0]}</p>
        </div>
        
        <div className={`${cardClass} group`}>
          <div className="flex items-center mb-3">
            <div className={`${iconContainerClass} mr-3`}>
              <Briefcase size={16} className="text-tinder-orange" />
            </div>
            <h4 className="text-sm font-medium">Work</h4>
          </div>
          <p className="text-sm text-muted-foreground">{occupation}</p>
        </div>
        
        <div className={`${cardClass} group`}>
          <div className="flex items-center mb-3">
            <div className={`${iconContainerClass} mr-3`}>
              <Heart size={16} className="text-tinder-peach" />
            </div>
            <h4 className="text-sm font-medium">Looking for</h4>
          </div>
          <p className="text-sm text-muted-foreground">{relationshipGoals.split('looking for ')[1]}</p>
        </div>
        
        <div className={`${cardClass} group`}>
          <div className="flex items-center mb-3">
            <div className={`${iconContainerClass} mr-3`}>
              <Star size={16} className="text-blue-400" />
            </div>
            <h4 className="text-sm font-medium">Zodiac</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={`${tinderBadgeStyle} transition-all duration-300 hover:shadow-[0_0_10px_rgba(253,41,123,0.3)]`}>{zodiacSign}</Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6 animate-fade-in">
      <div className={`${cardClass} group`}>
        <div className="flex items-center mb-3">
          <div className={iconContainerClass}>
            <GraduationCap size={16} className="text-tinder-rose" />
          </div>
          <h4 className="text-sm font-medium">Education</h4>
        </div>
        <p className="text-sm text-muted-foreground">{education}</p>
      </div>
      
      <div className={`${cardClass} group`}>
        <div className="flex items-center mb-3">
          <div className={iconContainerClass}>
            <Briefcase size={16} className="text-tinder-orange" />
          </div>
          <h4 className="text-sm font-medium">Work</h4>
        </div>
        <p className="text-sm text-muted-foreground">{occupation} at {company}</p>
      </div>
      
      <div className={`${cardClass} group`}>
        <div className="flex items-center mb-3">
          <div className={iconContainerClass}>
            <Heart size={16} className="text-tinder-peach" />
          </div>
          <h4 className="text-sm font-medium">Relationship Goals</h4>
        </div>
        <p className="text-sm text-muted-foreground">{relationshipGoals}</p>
      </div>
      
      <div className={`${cardClass} group`}>
        <div className="flex items-center mb-3">
          <div className={iconContainerClass}>
            <Star size={16} className="text-blue-400" />
          </div>
          <h4 className="text-sm font-medium">Zodiac</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={`${tinderBadgeStyle} transition-all duration-300 hover:shadow-[0_0_10px_rgba(253,41,123,0.3)]`}>{zodiacSign}</Badge>
        </div>
      </div>
    </div>
  );
};

export default ProfileQuickStats;
