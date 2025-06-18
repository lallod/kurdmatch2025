
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Profile } from '@/types/swipe';
import { ChevronDown } from 'lucide-react';

interface MobileProfileDetailsProps {
  profile: Profile;
}

const MobileProfileDetails = ({ profile }: MobileProfileDetailsProps) => {
  return (
    <div className="p-4 text-white">
      {/* Scroll indicator */}
      <div className="flex justify-center mb-4">
        <div className="flex flex-col items-center text-white/60">
          <ChevronDown className="h-4 w-4 animate-bounce" />
          <span className="text-xs">Scroll for more</span>
        </div>
      </div>

      {/* Bio Section */}
      {profile.bio && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">About {profile.name}</h3>
          <p className="text-white/90 text-sm leading-relaxed">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Basic Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Basic Info</h3>
        <div className="space-y-2">
          {profile.gender && (
            <div className="flex justify-between">
              <span className="text-white/70">Gender</span>
              <span className="text-white">{profile.gender}</span>
            </div>
          )}
          {profile.bodyType && (
            <div className="flex justify-between">
              <span className="text-white/70">Body Type</span>
              <span className="text-white">{profile.bodyType}</span>
            </div>
          )}
          {profile.ethnicity && (
            <div className="flex justify-between">
              <span className="text-white/70">Ethnicity</span>
              <span className="text-white">{profile.ethnicity}</span>
            </div>
          )}
          {profile.zodiacSign && (
            <div className="flex justify-between">
              <span className="text-white/70">Zodiac</span>
              <span className="text-white">{profile.zodiacSign}</span>
            </div>
          )}
        </div>
      </div>

      {/* Lifestyle */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Lifestyle</h3>
        <div className="space-y-2">
          {profile.exerciseHabits && (
            <div className="flex justify-between">
              <span className="text-white/70">Exercise</span>
              <span className="text-white">{profile.exerciseHabits}</span>
            </div>
          )}
          {profile.drinking && (
            <div className="flex justify-between">
              <span className="text-white/70">Drinking</span>
              <span className="text-white">{profile.drinking}</span>
            </div>
          )}
          {profile.smoking && (
            <div className="flex justify-between">
              <span className="text-white/70">Smoking</span>
              <span className="text-white">{profile.smoking}</span>
            </div>
          )}
          {profile.havePets && (
            <div className="flex justify-between">
              <span className="text-white/70">Pets</span>
              <span className="text-white">{profile.havePets}</span>
            </div>
          )}
        </div>
      </div>

      {/* Career */}
      {(profile.education || profile.company) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Career & Education</h3>
          <div className="space-y-2">
            {profile.education && (
              <div className="flex justify-between">
                <span className="text-white/70">Education</span>
                <span className="text-white">{profile.education}</span>
              </div>
            )}
            {profile.company && (
              <div className="flex justify-between">
                <span className="text-white/70">Company</span>
                <span className="text-white">{profile.company}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interests */}
      {profile.interests && profile.interests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <Badge key={index} variant="outline" className="text-xs border-purple-400/30 text-purple-300 bg-purple-500/10">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Values */}
      {profile.values && profile.values.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Values</h3>
          <div className="flex flex-wrap gap-2">
            {profile.values.map((value, index) => (
              <Badge key={index} variant="outline" className="text-xs border-green-400/30 text-green-300 bg-green-500/10">
                {value}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Favorites */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Favorites</h3>
        <div className="space-y-3">
          {profile.favoriteMusic && profile.favoriteMusic.length > 0 && (
            <div>
              <span className="text-white/70 text-sm">Music: </span>
              <span className="text-white text-sm">{profile.favoriteMusic.join(", ")}</span>
            </div>
          )}
          {profile.favoriteMovies && profile.favoriteMovies.length > 0 && (
            <div>
              <span className="text-white/70 text-sm">Movies: </span>
              <span className="text-white text-sm">{profile.favoriteMovies.join(", ")}</span>
            </div>
          )}
          {profile.favoriteFoods && profile.favoriteFoods.length > 0 && (
            <div>
              <span className="text-white/70 text-sm">Food: </span>
              <span className="text-white text-sm">{profile.favoriteFoods.join(", ")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom padding for scroll */}
      <div className="h-20"></div>
    </div>
  );
};

export default MobileProfileDetails;
