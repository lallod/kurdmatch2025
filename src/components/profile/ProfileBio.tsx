
import React from 'react';
import { User } from 'lucide-react';

interface ProfileBioProps {
  about: string;
  isMobile: boolean;
}

const ProfileBio: React.FC<ProfileBioProps> = ({ about, isMobile }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium mb-4 text-tinder-rose flex items-center">
        <User size={18} className="mr-2" />
        Bio
      </h3>
      <div className="bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 p-5 rounded-lg border-l-4 border-tinder-rose">
        <p className="text-muted-foreground leading-relaxed italic">{about}</p>
      </div>
    </div>
  );
};

export default ProfileBio;
