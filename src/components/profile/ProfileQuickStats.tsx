
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
  const cardClass = isMobile
    ? "bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center text-center border border-gray-700/50 hover:border-tinder-rose/40 hover:shadow-[0_0_15px_rgba(253,41,123,0.2)] transition-all duration-300"
    : "bg-gradient-to-br from-gray-50/90 to-white/95 p-4 rounded-lg border border-gray-100/80 shadow-sm hover:shadow-[0_5px_15px_rgba(253,41,123,0.1)] hover:border-tinder-rose/20 transition-all duration-300";

  const iconContainerClass = isMobile
    ? "w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-tinder-rose/30 to-tinder-orange/30 mb-2 transition-transform duration-300 group-hover:scale-110"
    : "w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-tinder-rose/10 to-tinder-orange/10 mr-3 transition-transform duration-300 group-hover:scale-110";

  if (isMobile) {
    return (
      <div className="mt-6 grid grid-cols-2 gap-3 animate-fade-in">
        <div className={`${cardClass} group`}>
          <div className={iconContainerClass}>
            <GraduationCap size={16} className="text-tinder-rose" />
          </div>
          <span className="text-xs text-tinder-light/80">Education</span>
          <span className="text-sm text-white font-medium mt-1 ai-text-gradient">{education.split(',')[0]}</span>
        </div>
        
        <div className={`${cardClass} group`}>
          <div className={iconContainerClass}>
            <Briefcase size={16} className="text-tinder-orange" />
          </div>
          <span className="text-xs text-tinder-light/80">Work</span>
          <span className="text-sm text-white font-medium mt-1 ai-text-gradient">{occupation}</span>
        </div>
        
        <div className={`${cardClass} group`}>
          <div className={iconContainerClass}>
            <Heart size={16} className="text-tinder-peach" />
          </div>
          <span className="text-xs text-tinder-light/80">Looking for</span>
          <span className="text-sm text-white font-medium mt-1 ai-text-gradient">{relationshipGoals.split('looking for ')[1]}</span>
        </div>
        
        <div className={`${cardClass} group`}>
          <div className={iconContainerClass}>
            <Star size={16} className="text-blue-400" />
          </div>
          <span className="text-xs text-tinder-light/80">Zodiac</span>
          <span className="text-sm text-white font-medium mt-1 ai-text-gradient">{zodiacSign}</span>
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
