
import React, { useState } from 'react';
import { User, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIBioGeneration } from '@/hooks/useAIBioGeneration';

interface ProfileBioProps {
  about: string;
  isMobile: boolean;
  profileId?: string;
  onBioUpdate?: (newBio: string) => void;
}

const ProfileBio: React.FC<ProfileBioProps> = ({ about, isMobile, profileId, onBioUpdate }) => {
  const { generateBio, isGenerating } = useAIBioGeneration();
  const [displayBio, setDisplayBio] = useState(about);

  const handleRegenerateBio = async () => {
    if (!profileId) return;
    
    const newBio = await generateBio(profileId);
    if (newBio) {
      setDisplayBio(newBio);
      onBioUpdate?.(newBio);
    }
  };

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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-medium text-tinder-rose flex items-center">
              <User size={18} className="mr-2" />
              Bio
              <Sparkles size={14} className="ml-2 text-tinder-orange animate-pulse opacity-70" />
            </h3>
            
            {profileId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerateBio}
                disabled={isGenerating}
                className="text-tinder-orange hover:text-tinder-rose hover:bg-tinder-orange/10"
              >
                <RefreshCw size={16} className={`mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            )}
          </div>
          
          <p className="text-foreground leading-relaxed font-medium relative z-10 text-balance">
            {displayBio}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileBio;
