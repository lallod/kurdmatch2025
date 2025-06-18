
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Heart, Globe, Languages, Sparkles, User, Coffee } from 'lucide-react';
import { Profile } from '@/types/swipe';

interface ExpandedProfileProps {
  profile: Profile;
}

const ExpandedProfile = ({ profile }: ExpandedProfileProps) => {
  return (
    <div className="bg-gradient-to-b from-black/60 via-black/70 to-black/80 backdrop-blur-lg text-white min-h-screen">
      {/* Header with name and compatibility */}
      <div className="px-4 sm:px-6 pt-8 pb-6 text-center border-b border-white/10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">{profile.name}, {profile.age}</h2>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            {profile.compatibilityScore}% Match
          </Badge>
          {profile.verified && (
            <Badge className="bg-blue-500/90 text-white">Verified ✓</Badge>
          )}
        </div>
        <div className="flex items-center justify-center gap-1 text-white/80 text-sm">
          <MapPin className="h-4 w-4" />
          <span>{profile.location} • {profile.distance}km away</span>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 space-y-8">
        {/* About Section */}
        {profile.bio && (
          <section className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-purple-300">
              <Heart className="h-5 w-5 text-pink-400" />
              About {profile.name}
            </h3>
            <p className="text-white/90 leading-relaxed text-sm sm:text-base">{profile.bio}</p>
          </section>
        )}

        {/* Basic Info Grid */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-purple-300">
            <User className="h-5 w-5 text-purple-400" />
            Basic Info
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.occupation && (
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <Briefcase className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <div>
                  <span className="text-white/60 text-xs">Work</span>
                  <p className="text-white text-sm">{profile.occupation}</p>
                </div>
              </div>
            )}
            {profile.height && (
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <span className="text-purple-400 text-lg flex-shrink-0">📏</span>
                <div>
                  <span className="text-white/60 text-xs">Height</span>
                  <p className="text-white text-sm">{profile.height}cm</p>
                </div>
              </div>
            )}
            {profile.kurdistanRegion && (
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <Globe className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <div>
                  <span className="text-white/60 text-xs">Region</span>
                  <p className="text-white text-sm">{profile.kurdistanRegion}</p>
                </div>
              </div>
            )}
            {profile.relationshipGoals && (
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <Heart className="h-4 w-4 text-pink-400 flex-shrink-0" />
                <div>
                  <span className="text-white/60 text-xs">Looking for</span>
                  <p className="text-white text-sm">{profile.relationshipGoals}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Languages */}
        {profile.languages && profile.languages.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-purple-300">
              <Languages className="h-5 w-5 text-blue-400" />
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((language, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="border-blue-400/30 text-blue-200 bg-blue-500/20 capitalize"
                >
                  {language}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-purple-300">
              <Coffee className="h-5 w-5 text-orange-400" />
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="border-orange-400/30 text-orange-200 bg-orange-500/20"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Lifestyle Details */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-purple-300">Lifestyle</h3>
          <div className="space-y-3">
            {profile.religion && (
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70">Religion</span>
                <span className="text-white capitalize">{profile.religion}</span>
              </div>
            )}
            {profile.bodyType && (
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70">Body Type</span>
                <span className="text-white capitalize">{profile.bodyType}</span>
              </div>
            )}
            {profile.dietaryPreferences && (
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70">Diet</span>
                <span className="text-white">{profile.dietaryPreferences}</span>
              </div>
            )}
          </div>
        </section>

        {/* Bottom spacing for mobile navigation */}
        <div className="h-20 sm:h-8"></div>
      </div>
    </div>
  );
};

export default ExpandedProfile;
