import React from 'react';
import { Profile } from '@/types/swipe';
import { MapPin, Briefcase, Heart, BookOpen } from 'lucide-react';

interface ProfileBioSectionProps {
  profile: Profile;
}

const ProfileBioSection: React.FC<ProfileBioSectionProps> = ({ profile }) => {
  return (
    <div className="p-6 space-y-4 bg-gradient-to-b from-card to-muted/5">
      {/* Bio */}
      {profile.bio && (
        <div className="space-y-2">
          <p className="text-foreground/90 leading-relaxed text-sm">{profile.bio}</p>
        </div>
      )}
      
      {/* Key Kurdish Cultural Info */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {profile.religion && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>{profile.religion}</span>
          </div>
        )}
        
        {profile.education && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span>{profile.education}</span>
          </div>
        )}
        
        {profile.relationshipGoals && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="h-3 w-3" />
            <span className="truncate">{profile.relationshipGoals}</span>
          </div>
        )}
        
        {profile.wantChildren && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span className="truncate">{profile.wantChildren}</span>
          </div>
        )}
      </div>
      
      {/* Kurdish Cultural Highlights */}
      {profile.values && profile.values.length > 0 && (
        <div>
          <h4 className="font-medium text-foreground text-sm mb-2">Values</h4>
          <div className="flex flex-wrap gap-1.5">
            {profile.values.slice(0, 4).map((value, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Interests with Kurdish focus */}
      {profile.interests && profile.interests.length > 0 && (
        <div>
          <h4 className="font-medium text-foreground text-sm mb-2">Interests</h4>
          <div className="flex flex-wrap gap-1.5">
            {profile.interests.slice(0, 5).map((interest, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-secondary/15 text-secondary-foreground rounded-full text-xs"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileBioSection;