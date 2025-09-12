import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Verified } from 'lucide-react';
import { Profile } from '@/types/swipe';
import { SWIPE_CONFIG } from '@/config/swipe';

interface ProfileInfoProps {
  profile: Profile;
  minimal?: boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile, minimal = false }) => {
  return (
    <div className={`text-white ${SWIPE_CONFIG.info.name.size === 'text-2xl sm:text-3xl' ? 'space-y-2 sm:space-y-3' : 'space-y-3'}`}>
      {/* Name and Age */}
      <div className={`flex items-center ${SWIPE_CONFIG.info.location.gap}`}>
        <h2 className={`${SWIPE_CONFIG.info.name.size} font-bold`}>{profile.name}</h2>
        <span className={`${SWIPE_CONFIG.info.age.size} font-light`}>{profile.age}</span>
      </div>
      
      {/* Location */}
      <div className={`flex items-center gap-2 text-white/90 text-sm sm:text-base`}>
        <svg className={`${SWIPE_CONFIG.info.location.iconSize}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span>{profile.location}</span>
        <span className="text-white/70">•</span>
        <span>{profile.distance || Math.floor(Math.random() * 20) + 1}km away</span>
      </div>
      
      {/* Interests/Bio snippet */}
      {minimal && profile.interests && profile.interests.length > 0 && (
        <div className={`flex flex-wrap ${SWIPE_CONFIG.info.interests.gap}`}>
          {profile.interests.slice(0, 3).map((interest, index) => (
            <span key={index} className={`bg-white/20 backdrop-blur-sm text-white ${SWIPE_CONFIG.info.interests.padding} rounded-full ${SWIPE_CONFIG.info.interests.textSize}`}>
              {interest}
            </span>
          ))}
          {profile.interests.length > 3 && (
            <span className={`bg-white/20 backdrop-blur-sm text-white ${SWIPE_CONFIG.info.interests.padding} rounded-full ${SWIPE_CONFIG.info.interests.textSize}`}>
              +{profile.interests.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;