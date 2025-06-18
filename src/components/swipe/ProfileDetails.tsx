
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Profile } from '@/types/swipe';

interface ProfileDetailsProps {
  profile: Profile;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onProfileTap?: () => void;
}

const ProfileDetails = ({ profile, isExpanded, onToggleExpanded, onProfileTap }: ProfileDetailsProps) => {
  const handleProfileTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    onProfileTap?.();
  };

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpanded();
  };

  return (
    <div className="p-2 sm:p-3 cursor-pointer" onClick={handleProfileTap}>
      {/* Quick Info */}
      <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
        {profile.occupation && (
          <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200 px-2 py-0.5">
            {profile.occupation}
          </Badge>
        )}
        {profile.height && (
          <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200 px-2 py-0.5">
            {profile.height}cm
          </Badge>
        )}
        {profile.languages && (
          <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200 px-2 py-0.5">
            {profile.languages[0]}{profile.languages.length > 1 ? ` +${profile.languages.length - 1}` : ''}
          </Badge>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="mb-2 sm:mb-3">
          <p className="text-white text-sm leading-snug">
            {isExpanded ? profile.bio : `${profile.bio.slice(0, 80)}...`}
          </p>
          <button
            onClick={handleReadMoreClick}
            className="text-purple-300 text-sm mt-0.5 hover:text-purple-200 touch-manipulation"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        </div>
      )}

      {/* Interests */}
      {profile.interests && profile.interests.length > 0 && (
        <div className="mb-1">
          <h4 className="text-white font-medium mb-1.5 text-sm">Interests</h4>
          <div className="flex flex-wrap gap-1">
            {profile.interests.slice(0, 3).map((interest, index) => (
              <Badge key={index} variant="outline" className="text-xs border-pink-400/30 text-pink-300 px-1.5 py-0.5">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
