import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Verified } from 'lucide-react';
import { Profile } from '@/types/swipe';

interface ProfileInfoProps {
  profile: Profile;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => {
  return (
    <div className="text-white">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-2xl font-bold">{profile.name}</h2>
        <span className="text-xl">{profile.age}</span>
        {profile.verified && (
          <Verified className="h-5 w-5 text-blue-400" />
        )}
      </div>
      
      <div className="text-sm text-white/90 mb-2">
        {profile.location}
      </div>
      
      {profile.occupation && (
        <div className="text-sm text-white/80">
          {profile.occupation}
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;