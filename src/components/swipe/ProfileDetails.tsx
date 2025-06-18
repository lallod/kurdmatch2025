
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
    <div className="p-4 sm:p-6 space-y-6">
      {/* Profile Header in Details Section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          {profile.name}, {profile.age}
        </h2>
        <p className="text-purple-200 text-sm sm:text-base">
          {profile.location} • {profile.distance}km away
        </p>
        {profile.kurdistanRegion && (
          <Badge variant="outline" className="mt-2 bg-purple-500/20 text-white border-purple-400/30">
            {profile.kurdistanRegion}
          </Badge>
        )}
      </div>

      {/* Quick Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Quick Info</h3>
        <div className="flex flex-wrap gap-2">
          {profile.occupation && (
            <Badge variant="secondary" className="bg-white/10 text-purple-200">
              {profile.occupation}
            </Badge>
          )}
          {profile.height && (
            <Badge variant="secondary" className="bg-white/10 text-purple-200">
              {profile.height}cm
            </Badge>
          )}
          {profile.languages && (
            <Badge variant="secondary" className="bg-white/10 text-purple-200">
              {profile.languages[0]}{profile.languages.length > 1 ? ` +${profile.languages.length - 1}` : ''}
            </Badge>
          )}
          {profile.religion && (
            <Badge variant="secondary" className="bg-white/10 text-purple-200">
              {profile.religion}
            </Badge>
          )}
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">About</h3>
          <p className="text-white text-sm sm:text-base leading-relaxed">
            {isExpanded ? profile.bio : `${profile.bio.slice(0, 120)}...`}
          </p>
          <button
            onClick={onToggleExpanded}
            className="text-purple-300 text-sm hover:text-purple-200 touch-manipulation"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        </div>
      )}

      {/* Interests */}
      {profile.interests && profile.interests.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="border-pink-400/30 text-pink-300 bg-pink-500/10"
              >
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Relationship Goals */}
      {profile.relationshipGoals && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Looking For</h3>
          <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-400/30">
            {profile.relationshipGoals}
          </Badge>
        </div>
      )}

      {/* Languages */}
      {profile.languages && profile.languages.length > 1 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {profile.languages.map((language, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="border-blue-400/30 text-blue-300 bg-blue-500/10"
              >
                {language}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Additional Details */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-lg font-semibold text-white">More Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {profile.bodyType && (
            <div className="text-white/80">
              <span className="font-medium">Body Type:</span> {profile.bodyType}
            </div>
          )}
          {profile.dietaryPreferences && (
            <div className="text-white/80">
              <span className="font-medium">Diet:</span> {profile.dietaryPreferences}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
