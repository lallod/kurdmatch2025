
import React, { useState } from 'react';
import { User, Sparkles, Wand2, Bot, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProfileBioProps {
  about: string;
  isMobile: boolean;
}

const ProfileBio: React.FC<ProfileBioProps> = ({ about, isMobile }) => {
  const [isSubscriber] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBio, setGeneratedBio] = useState<string>("");
  const { toast } = useToast();
  
  const generateBio = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const newBio = about || "Hi there! I'm a UX Designer with a passion for creating beautiful digital experiences. I love hiking in the mountains, trying new restaurants in San Francisco, and curling up with good books like The Alchemist. As a Libra with ENFJ personality, I value deep connections and communication. Looking for someone who shares my sense of adventure and appreciation for both the outdoors and quality time together.";
      setGeneratedBio(newBio);
      setIsGenerating(false);
      
      toast({
        title: "Bio Generated",
        description: "AI has created a personalized bio based on your profile.",
        variant: "default",
      });
    }, 1500);
  };

  const applyGeneratedBio = () => {
    toast({
      title: "Bio Applied",
      description: "Your profile has been updated with the AI-generated bio.",
      variant: "default",
    });
  };

  return (
    <div className="mb-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium text-tinder-rose flex items-center">
          <User size={18} className="mr-2" />
          Bio
        </h3>
      </div>
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-tinder-rose/10 via-white/80 to-tinder-orange/10 backdrop-blur-md"></div>
        
        <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-tinder-rose/30 to-tinder-orange/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-10 w-20 h-8 bg-gradient-to-r from-tinder-orange/20 to-tinder-rose/10 rounded-full blur-lg"></div>
        <div className="absolute top-10 left-4 w-4 h-12 bg-gradient-to-b from-tinder-rose/20 to-transparent rounded-full blur-md"></div>
        
        <div className="absolute inset-0 border-2 border-tinder-orange/20 rounded-2xl"></div>
        
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-40"></div>
        
        <div className="relative z-10 p-6">
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
