import React from 'react';
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
    <div className="text-white space-y-2">
      {/* Name, Age, Verification */}
      <div className="flex items-center gap-2">
        <h2 className={`${SWIPE_CONFIG.info.name.size} font-extrabold tracking-tight drop-shadow-lg`}>{profile.name}</h2>
        <span className={`${SWIPE_CONFIG.info.age.size} font-light opacity-90`}>{profile.age}</span>
        {profile.video_verified && (
          <VideoVerifiedBadge isVerified={true} size="md" />
        )}
        {showOnlineStatus && (
          <OnlineStatusBadge userId={profile.id} size="sm" showText={true} className="ml-1" />
        )}
      </div>

      {/* Compatibility Score */}
      {profile.compatibilityScore > 0 && (
        <CompatibilityBadge
          targetUserId={profile.id}
          initialScore={profile.compatibilityScore}
          size="sm"
        />
      )}

      {/* Location & Region */}
      <div className="flex items-center gap-1.5 text-white/85 text-xs">
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span>{profile.location}</span>
        {profile.kurdistanRegion && (
          <>
            <span className="text-white/50">•</span>
            <span>{kurdistanRegion}</span>
          </>
        )}
        {profile.height && heightDisplay !== 'Not specified' && (
          <>
            <span className="text-white/50">•</span>
            <span>{heightDisplay}</span>
          </>
        )}
      </div>

      {/* Deal-breaker pills */}
      {minimal && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {profile.religion && (
            <span className="bg-white/15 backdrop-blur-md text-white/95 px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/10">
              {profile.religion}
            </span>
          )}
          {profile.occupation && (
            <span className="bg-white/15 backdrop-blur-md text-white/95 px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/10">
              {profile.occupation}
            </span>
          )}
          {profile.relationshipGoals && (
            <span className="bg-white/15 backdrop-blur-md text-white/95 px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/10">
              {profile.relationshipGoals}
            </span>
          )}
          {profile.interests && profile.interests.length > 0 && (
            <>
              {profile.interests.slice(0, 2).map((interest, index) => (
                <span key={index} className="bg-white/10 backdrop-blur-md text-white/80 px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/5">
                  {interest}
                </span>
              ))}
              {profile.interests.length > 2 && (
                <span className="bg-white/10 backdrop-blur-md text-white/60 px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/5">
                  +{profile.interests.length - 2}
                </span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
