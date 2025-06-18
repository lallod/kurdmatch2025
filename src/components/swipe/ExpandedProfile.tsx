
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, GraduationCap, Heart, Globe, MessageSquare } from 'lucide-react';
import { Profile } from '@/types/swipe';

interface ExpandedProfileProps {
  profile: Profile;
}

const ExpandedProfile = ({ profile }: ExpandedProfileProps) => {
  return (
    <div className="bg-gradient-to-b from-black/40 to-black/60 backdrop-blur-lg text-white p-4 sm:p-6 space-y-6">
      {/* About Section */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-400" />
          About {profile.name}
        </h3>
        {profile.bio && (
          <p className="text-white/90 leading-relaxed">{profile.bio}</p>
        )}
      </div>

      {/* Basic Info */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-purple-300">Basic Info</h4>
        <div className="grid grid-cols-2 gap-3">
          {profile.occupation && (
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-purple-400" />
              <span>{profile.occupation}</span>
            </div>
          )}
          {profile.height && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-purple-400">📏</span>
              <span>{profile.height}cm</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-purple-400" />
            <span>{profile.location}</span>
          </div>
          {profile.kurdistanRegion && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-purple-400" />
              <span>{profile.kurdistanRegion}</span>
            </div>
          )}
        </div>
      </div>

      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-purple-300">Languages</h4>
          <div className="flex flex-wrap gap-2">
            {profile.languages.map((language, index) => (
              <Badge key={index} variant="outline" className="border-purple-400/30 text-purple-200 bg-purple-500/20">
                {language}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {profile.interests && profile.interests.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-purple-300">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <Badge key={index} variant="outline" className="border-pink-400/30 text-pink-200 bg-pink-500/20">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Lifestyle */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-purple-300">Lifestyle</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {profile.religion && (
            <div>
              <span className="text-white/60">Religion:</span>
              <span className="ml-2 capitalize">{profile.religion}</span>
            </div>
          )}
          {profile.bodyType && (
            <div>
              <span className="text-white/60">Body Type:</span>
              <span className="ml-2 capitalize">{profile.bodyType}</span>
            </div>
          )}
          {profile.dietaryPreferences && (
            <div>
              <span className="text-white/60">Diet:</span>
              <span className="ml-2">{profile.dietaryPreferences}</span>
            </div>
          )}
          {profile.relationshipGoals && (
            <div>
              <span className="text-white/60">Looking for:</span>
              <span className="ml-2">{profile.relationshipGoals}</span>
            </div>
          )}
        </div>
      </div>

      {/* Compatibility */}
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-full px-4 py-2">
          <span className="text-green-300 font-semibold">{profile.compatibilityScore}% Match</span>
        </div>
      </div>
    </div>
  );
};

export default ExpandedProfile;
