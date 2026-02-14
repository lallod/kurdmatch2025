
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, PartyPopper, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MatchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  matchedProfile: {
    id: number;
    name: string;
    profileImage: string;
  } | null;
  currentUserImage?: string;
}

const MatchPopup = ({ isOpen, onClose, matchedProfile, currentUserImage }: MatchPopupProps) => {
  const navigate = useNavigate();

  const handleStartChat = () => {
    navigate('/messages');
    onClose();
  };

  const handleKeepSwiping = () => {
    onClose();
  };

  if (!matchedProfile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-card border-border text-foreground">
        <div className="flex flex-col items-center py-4 sm:py-6 px-3 sm:px-4 text-center">
          {/* Animated elements */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
            <Heart className="text-primary w-6 h-6 sm:w-8 sm:h-8 animate-bounce" />
          </div>
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
            <Heart className="text-primary w-6 h-6 sm:w-8 sm:h-8 animate-bounce" />
          </div>
          <div className="absolute bottom-16 sm:bottom-20 left-3 sm:left-6">
            <Sparkles className="text-warning w-4 h-4 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div className="absolute bottom-16 sm:bottom-20 right-3 sm:right-6">
            <Sparkles className="text-warning w-4 h-4 sm:w-6 sm:h-6 animate-pulse" />
          </div>

          {/* Main content */}
          <div className="flex items-center mb-3 sm:mb-4">
            <PartyPopper className="h-7 w-7 sm:h-10 sm:w-10 mr-1.5 sm:mr-2 text-warning animate-bounce" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">It's a Match!</h2>
            <PartyPopper className="h-7 w-7 sm:h-10 sm:w-10 ml-1.5 sm:ml-2 text-warning animate-bounce" />
          </div>

          <p className="text-base sm:text-lg mb-4 sm:mb-6 text-muted-foreground">You and {matchedProfile.name} liked each other</p>

          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent blur opacity-75 animate-pulse"></div>
              <img 
                src={currentUserImage || '/placeholder.svg'}
                alt="Your profile" 
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-3 sm:border-4 border-border object-cover object-top relative z-10"
              />
            </div>
            <div className="flex items-center">
              <Heart className="text-primary w-6 h-6 sm:w-8 sm:h-8 mx-1.5 sm:mx-2 animate-pulse" fill="currentColor" />
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-primary blur opacity-75 animate-pulse"></div>
              <img 
                src={matchedProfile.profileImage} 
                alt={matchedProfile.name} 
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-3 sm:border-4 border-border object-cover object-top relative z-10"
              />
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3 w-full">
            <Button 
              onClick={handleStartChat} 
              className="w-full h-11 sm:h-12 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              Send a Message
            </Button>
            <Button 
              onClick={handleKeepSwiping} 
              variant="outline" 
              className="w-full h-10 sm:h-11 border-border text-foreground hover:bg-muted text-sm sm:text-base"
            >
              Keep Swiping
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchPopup;
