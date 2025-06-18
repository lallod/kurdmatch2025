
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Profile } from '@/types/swipe';

interface ProfileDetailsProps {
  profile: Profile;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const ProfileDetails = ({ profile, isExpanded, onToggleExpanded }: ProfileDetailsProps) => {
  return (
    <div className="p-1 sm:p-2">
      {/* Quick Info - Full Width Usage */}
      <div className="flex flex-wrap gap-1 mb-1 sm:mb-2">
        {profile.occupation && (
          <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200 px-1.5 py-0.5">
            {profile.occupation}
          </Badge>
        )}
        {profile.height && (
          <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200 px-1.5 py-0.5">
            {profile.height}cm
          </Badge>
        )}
        {profile.languages && (
          <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200 px-1.5 py-0.5">
            {profile.languages[0]}{profile.languages.length > 1 ? ` +${profile.languages.length - 1}` : ''}
          </Badge>
        )}
      </div>

      {/* Bio - Maximum Width Usage */}
      {profile.bio && (
        <div className="mb-1 sm:mb-2">
          <p className="text-white text-sm leading-snug">
            {isExpanded ? profile.bio : `${profile.bio.slice(0, 80)}...`}
          </p>
          <button
            onClick={onToggleExpanded}
            className="text-purple-300 text-sm mt-0.5 hover:text-purple-200 touch-manipulation"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        </div>
      )}

      {/* Interests - Edge to Edge */}
      {profile.interests && profile.interests.length > 0 && (
        <div>
          <h4 className="text-white font-medium mb-1 text-sm">Interests</h4>
          <div className="flex flex-wrap gap-1">
            {profile.interests.slice(0, 3).map((interest, index) => (
              <Badge key={index} variant="outline" className="text-xs border-pink-400/30 text-pink-300 px-1 py-0.5">
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
