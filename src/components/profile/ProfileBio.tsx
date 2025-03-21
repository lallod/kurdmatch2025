
import React from 'react';
import { User, Sparkles } from 'lucide-react';

interface ProfileBioProps {
  about: string;
  isMobile: boolean;
}

const ProfileBio: React.FC<ProfileBioProps> = ({ about, isMobile }) => {
  return (
    <div className="mb-6 relative">
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-tinder-rose/10 via-white/80 to-tinder-orange/10 backdrop-blur-md"></div>
        
        <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-tinder-rose/30 to-tinder-orange/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-10 w-20 h-8 bg-gradient-to-r from-tinder-orange/20 to-tinder-rose/10 rounded-full blur-lg"></div>
        <div className="absolute top-10 left-4 w-4 h-12 bg-gradient-to-b from-tinder-rose/20 to-transparent rounded-full blur-md"></div>
        
        <div className="absolute inset-0 border-2 border-tinder-orange/20 rounded-2xl"></div>
        
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-40"></div>
        
        <div className="relative z-10 p-6">
          <h3 className="text-xl font-medium text-tinder-rose flex items-center mb-3">
            <User size={18} className="mr-2" />
            Bio
          </h3>
          
          <p className="text-foreground leading-relaxed font-medium relative z-10 text-balance">
            {about}
            <span className="absolute -bottom-1 -right-1">
              <Sparkles size={16} className="text-tinder-orange animate-pulse opacity-70" />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileBio;
