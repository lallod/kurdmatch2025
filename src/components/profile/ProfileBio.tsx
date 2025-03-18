
import React from 'react';
import { User, Sparkles, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div className="flex items-center">
          <div className="mr-2 text-xs bg-gradient-to-r from-tinder-rose to-tinder-orange bg-clip-text text-transparent font-medium flex items-center">
            <Sparkles size={14} className="mr-1 text-tinder-orange" />
            AI Generated
          </div>
          <Button variant="outline" size="sm" className="text-xs border-tinder-rose/20 text-muted-foreground">
            <Lock size={12} className="mr-1" />
            Subscribers Only
          </Button>
        </div>
      </div>
      <div className="bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 p-5 rounded-lg border-l-4 border-tinder-rose">
        <p className="text-muted-foreground leading-relaxed italic">{about}</p>
      </div>
    </div>
  );
};

export default ProfileBio;
