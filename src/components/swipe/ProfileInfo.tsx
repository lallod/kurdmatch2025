import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Verified } from 'lucide-react';
import { Profile } from '@/types/swipe';
import { SWIPE_CONFIG } from '@/config/swipe';
import { convertAndFormatHeight } from '@/utils/heightConverter';
import { getKurdistanRegionDisplay } from '@/utils/profileDataNormalizer';
import { VideoVerifiedBadge } from '@/components/verification/VideoVerifiedBadge';
import { CompatibilityBadge } from '@/components/compatibility/CompatibilityBadge';
import { OnlineStatusBadge } from '@/components/shared/OnlineStatusBadge';

interface ProfileInfoProps {
  profile: Profile;
  minimal?: boolean;
  showOnlineStatus?: boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile, minimal = false, showOnlineStatus = true }) => {
  const heightDisplay = convertAndFormatHeight(profile.height || '');
  const kurdistanRegion = getKurdistanRegionDisplay(profile.kurdistanRegion || '');

  return (
    <div className="text-white space-y-1.5 sm:space-y-2">
      {/* Name, Age, Verification Badge, and Online Status */}
      <div className={`flex items-center ${SWIPE_CONFIG.info.location.gap}`}>
        <h2 className={`${SWIPE_CONFIG.info.name.size} font-bold`}>{profile.name}</h2>
        <span className={`${SWIPE_CONFIG.info.age.size} font-light`}>{profile.age}</span>
        {profile.video_verified && (
          <VideoVerifiedBadge isVerified={true} size="md" />
        )}
        {showOnlineStatus && (
          <OnlineStatusBadge userId={profile.id} size="sm" showText={true} className="ml-2" />
        )}
      </div>
      
      {/* Compatibility Score */}
      {profile.compatibilityScore > 0 && (
        <div className="flex items-center gap-2">
          <CompatibilityBadge 
            targetUserId={profile.id} 
            initialScore={profile.compatibilityScore}
            size="sm"
          />
        </div>
      )}
      
      {/* Location */}
      <div className={`flex items-center gap-1.5 sm:gap-2 text-white/90 text-xs sm:text-sm`}>
        <svg className={`${SWIPE_CONFIG.info.location.iconSize}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span>{profile.location}</span>
        <span className="text-white/70">•</span>
        <span>{profile.distance || Math.floor(Math.random() * 20) + 1}km away</span>
      </div>

      {/* Kurdistan Region & Height */}
      {(profile.kurdistanRegion || profile.height) && (
        <div className="flex items-center gap-2 text-white/80 text-sm">
          {profile.kurdistanRegion && (
            <>
              <span>From {kurdistanRegion}</span>
              {profile.height && heightDisplay !== 'Not specified' && (
                <span className="text-white/70">•</span>
              )}
            </>
          )}
          {profile.height && heightDisplay !== 'Not specified' && (
            <span>{heightDisplay}</span>
          )}
        </div>
      )}

      {/* Deal-breaker badges: Religion, Occupation, Relationship Goals */}
      {minimal && (
        <div className="flex flex-wrap gap-1.5">
          {profile.religion && (
            <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs">
              {profile.religion}
            </span>
          )}
          {profile.occupation && (
            <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs">
              {profile.occupation}
            </span>
          )}
          {profile.relationshipGoals && (
            <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs">
              {profile.relationshipGoals}
            </span>
          )}
        </div>
      )}
      
      {/* Interests snippet */}
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