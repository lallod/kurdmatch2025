import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Verified } from 'lucide-react';
import { Profile } from '@/types/swipe';

interface ProfileInfoProps {
  profile: Profile;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
  return (
    <div className="text-white space-y-3">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-3xl font-bold tracking-tight">{profile.name}</h2>
        <span className="text-2xl font-light">{profile.age}</span>
        {profile.verified && (
          <div className="bg-blue-500 rounded-full p-1">
            <Verified className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 text-white/90">
        <span className="text-base">{profile.location}</span>
        {profile.kurdistanRegion && (
          <>
            <span className="text-white/60">•</span>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
              {profile.kurdistanRegion}
            </Badge>
          </>
        )}
      </div>
      
      {profile.occupation && (
        <div className="text-white/80 text-sm font-medium">
          {profile.occupation}
          {profile.company && (
            <span className="text-white/60"> at {profile.company}</span>
          )}
        </div>
      )}

      {/* Quick compatibility highlights */}
      <div className="flex flex-wrap gap-2 mt-3">
        {profile.languages?.slice(0, 3).map((language, index) => (
          <span key={index} className="px-2 py-1 bg-white/20 rounded-full text-xs text-white backdrop-blur-sm">
            {language}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProfileInfo;