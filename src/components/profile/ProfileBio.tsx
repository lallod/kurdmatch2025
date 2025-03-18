
import React from 'react';
import { User } from 'lucide-react';

interface ProfileBioProps {
  about: string;
  isMobile: boolean;
}

const ProfileBio: React.FC<ProfileBioProps> = ({ about, isMobile }) => {
  if (isMobile) {
    return (
      <div className="mb-6 bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-800">
        <h2 className="text-2xl font-medium text-white mb-3 flex items-center">
          <User size={20} className="mr-2 text-tinder-rose" />
          About Me
        </h2>
        <p className="text-gray-300 leading-relaxed border-l-4 border-tinder-rose/40 pl-4 italic">{about}</p>
      </div>
    );
  }

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
