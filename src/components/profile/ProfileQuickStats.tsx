
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
  // Make the card styling more consistent between desktop and mobile
  const cardClass = isMobile
    ? "bg-gradient-to-br from-gray-50/90 to-white/95 p-4 rounded-lg border border-gray-100/80 shadow-sm hover:shadow-[0_5px_15px_rgba(253,41,123,0.1)] hover:border-tinder-rose/20 transition-all duration-300"
    : "bg-gradient-to-br from-gray-50/90 to-white/95 p-4 rounded-lg border border-gray-100/80 shadow-sm hover:shadow-[0_5px_15px_rgba(253,41,123,0.1)] hover:border-tinder-rose/20 transition-all duration-300";

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
          <p className="text-sm text-gray-600 ai-text-gradient">{education.split(',')[0]}</p>
        </div>
        
        <div className={`${cardClass} group`}>
          <div className="flex items-center mb-3">
            <div className={`${iconContainerClass} mr-3`}>
              <Briefcase size={16} className="text-tinder-orange" />
            </div>
            <h4 className="text-sm font-medium">Work</h4>
          </div>
          <p className="text-sm text-gray-600 ai-text-gradient">{occupation}</p>
        </div>
        
        <div className={`${cardClass} group`}>
          <div className="flex items-center mb-3">
            <div className={`${iconContainerClass} mr-3`}>
              <Heart size={16} className="text-tinder-peach" />
            </div>
            <h4 className="text-sm font-medium">Looking for</h4>
          </div>
          <p className="text-sm text-gray-600 ai-text-gradient">{relationshipGoals.split('looking for ')[1]}</p>
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
        <p className="text-sm text-gray-600 ai-text-gradient">{education}</p>
      </div>
      
      <div className={`${cardClass} group`}>
        <div className="flex items-center mb-3">
          <div className={iconContainerClass}>
            <Briefcase size={16} className="text-tinder-orange" />
          </div>
          <h4 className="text-sm font-medium">Work</h4>
        </div>
        <p className="text-sm text-gray-600 ai-text-gradient">{occupation} at {company}</p>
      </div>
      
      <div className={`${cardClass} group`}>
        <div className="flex items-center mb-3">
          <div className={iconContainerClass}>
            <Heart size={16} className="text-tinder-peach" />
          </div>
          <h4 className="text-sm font-medium">Relationship Goals</h4>
        </div>
        <p className="text-sm text-gray-600 ai-text-gradient">{relationshipGoals}</p>
      </div>
      
      <div className={`${cardClass} group`}>
        <div className="flex items-center mb-3">
          <div className={iconContainerClass}>
            <Star size={16} className="text-blue-400" />
          </div>
          <h4 className="text-sm font-medium">Personality</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={`${tinderBadgeStyle} transition-all duration-300 hover:shadow-[0_0_10px_rgba(253,41,123,0.3)]`}>{zodiacSign}</Badge>
          <Badge variant="outline" className={`${tinderBadgeStyle} transition-all duration-300 hover:shadow-[0_0_10px_rgba(253,41,123,0.3)]`}>{personalityType}</Badge>
        </div>
      </div>
    </div>
  );
};

export default ProfileQuickStats;

