
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Profile } from '@/types/swipe';

interface ProfileQuickBadgesProps {
  profile: Profile;
}

const ProfileQuickBadges = ({ profile }: ProfileQuickBadgesProps) => {
  return (
    <div className="hidden md:flex flex-wrap gap-1 mb-1 sm:mb-2">
      {profile.occupation && (
        <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200 px-1.5 py-0.5">
          {profile.occupation}
        </Badge>
      )}
      {profile.height && (
        <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200 px-1.5 py-0.5">
          {profile.height?.includes('cm') ? profile.height : `${profile.height} cm`}
        </Badge>
      )}
      {profile.languages && (
        <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200 px-1.5 py-0.5">
          {profile.languages[0]}{profile.languages.length > 1 ? ` +${profile.languages.length - 1}` : ''}
        </Badge>
      )}
    </div>
  );
};

export default ProfileQuickBadges;
