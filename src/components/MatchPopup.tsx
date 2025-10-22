
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
    // Navigate to messages page (in a real app, this would open the chat with this specific user)
    navigate('/messages');
    onClose();
  };

  const handleKeepSwiping = () => {
    onClose();
  };

  if (!matchedProfile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gradient-to-b from-pink-500 to-orange-500 border-none text-white max-w-md mx-auto">
        <div className="flex flex-col items-center py-6 px-4 text-center">
          {/* Animated elements */}
          <div className="absolute top-4 left-4">
            <Heart className="text-white w-8 h-8 animate-bounce" />
          </div>
          <div className="absolute top-4 right-4">
            <Heart className="text-white w-8 h-8 animate-bounce" />
          </div>
          <div className="absolute bottom-20 left-6">
            <Sparkles className="text-white w-6 h-6 animate-pulse" />
          </div>
          <div className="absolute bottom-20 right-6">
            <Sparkles className="text-white w-6 h-6 animate-pulse" />
          </div>

          {/* Main content */}
          <div className="flex items-center mb-4">
            <PartyPopper className="h-10 w-10 mr-2 text-yellow-300 animate-bounce" />
            <h2 className="text-2xl font-bold">It's a Match!</h2>
            <PartyPopper className="h-10 w-10 ml-2 text-yellow-300 animate-bounce" />
          </div>

          <p className="text-lg mb-6">You and {matchedProfile.name} liked each other</p>

          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur opacity-75 animate-pulse"></div>
              <img 
                src={currentUserImage || '/placeholder.svg'}
                alt="Your profile" 
                className="h-24 w-24 rounded-full border-4 border-white object-cover relative z-10"
              />
            </div>
            <div className="flex items-center">
              <Heart className="text-red-200 w-8 h-8 mx-2 animate-pulse" fill="white" />
            </div>
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 blur opacity-75 animate-pulse"></div>
              <img 
                src={matchedProfile.profileImage} 
                alt={matchedProfile.name} 
                className="h-24 w-24 rounded-full border-4 border-white object-cover relative z-10"
              />
            </div>
          </div>

          <div className="space-y-3 w-full">
            <Button 
              onClick={handleStartChat} 
              className="w-full bg-white text-pink-500 hover:bg-gray-100 flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Send a Message
            </Button>
            <Button 
              onClick={handleKeepSwiping} 
              variant="outline" 
              className="w-full border-white text-black hover:bg-white/20"
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
