
import React, { useState } from 'react';
import { User, Sparkles, Bot } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
          
          <div className="mt-4 flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 shadow-sm">
                    <Bot size={14} className="text-tinder-orange" />
                    <span className="text-xs font-medium text-tinder-rose/90">AI Enhanced</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-white backdrop-blur-lg border border-tinder-rose/20 shadow-lg">
                  <p className="text-xs font-medium">
                    AI analyzed this profile to create an enhanced bio
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBio;
