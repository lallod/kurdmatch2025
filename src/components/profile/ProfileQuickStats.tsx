
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
  if (isMobile) {
    return (
      <div className="mt-6 grid grid-cols-2 gap-3 animate-fade-in">
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center text-center border border-gray-700/50 hover:border-tinder-rose/30 transition-all">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-tinder-rose/30 to-tinder-orange/30 mb-2">
            <GraduationCap size={16} className="text-tinder-rose" />
          </div>
          <span className="text-xs text-gray-400">Education</span>
          <span className="text-sm text-white font-medium mt-1">{education.split(',')[0]}</span>
        </div>
        
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center text-center border border-gray-700/50 hover:border-tinder-orange/30 transition-all">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-tinder-orange/30 to-tinder-peach/30 mb-2">
            <Briefcase size={16} className="text-tinder-orange" />
          </div>
          <span className="text-xs text-gray-400">Work</span>
          <span className="text-sm text-white font-medium mt-1">{occupation}</span>
        </div>
        
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center text-center border border-gray-700/50 hover:border-tinder-peach/30 transition-all">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-tinder-peach/30 to-tinder-orange/30 mb-2">
            <Heart size={16} className="text-tinder-peach" />
          </div>
          <span className="text-xs text-gray-400">Looking for</span>
          <span className="text-sm text-white font-medium mt-1">{relationshipGoals.split('looking for ')[1]}</span>
        </div>
        
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center text-center border border-gray-700/50 hover:border-blue-400/30 transition-all">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400/30 to-blue-300/30 mb-2">
            <Star size={16} className="text-blue-400" />
          </div>
          <span className="text-xs text-gray-400">Zodiac</span>
          <span className="text-sm text-white font-medium mt-1">{zodiacSign}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-tinder-rose/10 to-tinder-orange/10 mr-3">
            <GraduationCap size={16} className="text-tinder-rose" />
          </div>
          <h4 className="text-sm font-medium">Education</h4>
        </div>
        <p className="text-sm text-gray-600">{education}</p>
      </div>
      
      <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-tinder-orange/10 to-tinder-peach/10 mr-3">
            <Briefcase size={16} className="text-tinder-orange" />
          </div>
          <h4 className="text-sm font-medium">Work</h4>
        </div>
        <p className="text-sm text-gray-600">{occupation} at {company}</p>
      </div>
      
      <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-tinder-peach/10 to-tinder-orange/10 mr-3">
            <Heart size={16} className="text-tinder-peach" />
          </div>
          <h4 className="text-sm font-medium">Relationship Goals</h4>
        </div>
        <p className="text-sm text-gray-600">{relationshipGoals}</p>
      </div>
      
      <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400/10 to-blue-300/10 mr-3">
            <Star size={16} className="text-blue-400" />
          </div>
          <h4 className="text-sm font-medium">Personality</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={tinderBadgeStyle}>{zodiacSign}</Badge>
          <Badge variant="outline" className={tinderBadgeStyle}>{personalityType}</Badge>
        </div>
      </div>
    </div>
  );
};

export default ProfileQuickStats;
