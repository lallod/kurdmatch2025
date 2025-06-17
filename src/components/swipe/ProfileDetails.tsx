
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
    <div className="p-3 sm:p-4">
      {/* Quick Info */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        {profile.occupation && (
          <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200">
            {profile.occupation}
          </Badge>
        )}
        {profile.height && (
          <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200">
            {profile.height}cm
          </Badge>
        )}
        {profile.languages && (
          <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200">
            {profile.languages[0]}{profile.languages.length > 1 ? ` +${profile.languages.length - 1}` : ''}
          </Badge>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="mb-3 sm:mb-4">
          <p className="text-white text-sm leading-relaxed">
            {isExpanded ? profile.bio : `${profile.bio.slice(0, 80)}...`}
          </p>
          <button
            onClick={onToggleExpanded}
            className="text-purple-300 text-sm mt-1 hover:text-purple-200 touch-manipulation"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        </div>
      )}

      {/* Interests */}
      {profile.interests && profile.interests.length > 0 && (
        <div className="mb-2">
          <h4 className="text-white font-medium mb-2 text-sm sm:text-base">Interests</h4>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {profile.interests.slice(0, 3).map((interest, index) => (
              <Badge key={index} variant="outline" className="text-xs border-pink-400/30 text-pink-300">
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
