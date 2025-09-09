import React from 'react';
import { Profile } from '@/types/swipe';
import { MapPin, Briefcase, Heart, BookOpen } from 'lucide-react';

interface ProfileBioSectionProps {
  profile: Profile;
}

const ProfileBioSection: React.FC<ProfileBioSectionProps> = ({ profile }) => {
  return (
    <div className="p-4 space-y-4">
      {/* Bio */}
      {profile.bio && (
        <div>
          <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
        </div>
      )}
      
      {/* Basic Info Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {profile.location && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{profile.location}</span>
          </div>
        )}
        
        {profile.occupation && (
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="h-4 w-4" />
            <span>{profile.occupation}</span>
          </div>
        )}
        
        {profile.relationshipGoals && (
          <div className="flex items-center gap-2 text-gray-600">
            <Heart className="h-4 w-4" />
            <span>{profile.relationshipGoals}</span>
          </div>
        )}
        
        {profile.education && (
          <div className="flex items-center gap-2 text-gray-600">
            <BookOpen className="h-4 w-4" />
            <span>{profile.education}</span>
          </div>
        )}
      </div>
      
      {/* Interests */}
      {profile.interests && profile.interests.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {profile.interests.slice(0, 6).map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Values */}
      {profile.values && profile.values.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Values</h4>
          <div className="flex flex-wrap gap-2">
            {profile.values.slice(0, 4).map((value, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-secondary/20 text-secondary-foreground rounded-full text-sm"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileBioSection;