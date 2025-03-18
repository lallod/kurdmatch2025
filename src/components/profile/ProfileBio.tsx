
import React from 'react';
import { User, Sparkles } from 'lucide-react';

interface ProfileBioProps {
  about: string;
  isMobile: boolean;
}

const ProfileBio: React.FC<ProfileBioProps> = ({ about, isMobile }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium text-tinder-rose flex items-center">
          <User size={18} className="mr-2" />
          Bio
        </h3>
        <div className="text-xs bg-gradient-to-r from-tinder-rose to-tinder-orange bg-clip-text text-transparent font-medium flex items-center">
          <Sparkles size={14} className="mr-1 text-tinder-orange" />
          AI Generated
        </div>
      </div>
      <div className="bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 p-5 rounded-lg border-l-4 border-tinder-rose">
        <p className="text-muted-foreground leading-relaxed italic">{about}</p>
      </div>
    </div>
  );
};

export default ProfileBio;
