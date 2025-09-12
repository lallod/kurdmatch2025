import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, MessageCircle, User } from 'lucide-react';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
  profileImage: string;
  onViewProfile: () => void;
  onContinueSwiping: () => void;
}

const MatchModal: React.FC<MatchModalProps> = ({
  isOpen,
  onClose,
  profileName,
  profileImage,
  onViewProfile,
  onContinueSwiping
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-purple-900/95 via-purple-800/95 to-pink-900/95 backdrop-blur-md border border-white/20 text-white max-w-md p-0 overflow-hidden">
        {/* Celebration Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 animate-pulse"></div>
          {/* Floating hearts */}
          <div className="absolute top-4 left-4 animate-bounce delay-75">
            <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />
          </div>
          <div className="absolute top-8 right-6 animate-bounce delay-150">
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
          </div>
          <div className="absolute bottom-12 left-8 animate-bounce delay-300">
            <Heart className="w-5 h-5 text-purple-400 fill-purple-400" />
          </div>
          <div className="absolute bottom-20 right-4 animate-bounce delay-500">
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
        </div>

        <div className="relative z-10 p-8 text-center space-y-6">
          {/* Match Header */}
          <div className="space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Heart className="w-10 h-10 text-white fill-white" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                It's a Match! 🎉
              </h1>
              <p className="text-purple-200 text-lg">
                You and {profileName} liked each other!
              </p>
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full p-1 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 animate-spin">
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900"></div>
              </div>
              <img
                src={profileImage}
                alt={profileName}
                className="relative z-10 w-24 h-24 rounded-full object-cover border-4 border-transparent"
              />
            </div>
          </div>

          {/* Match Message */}
          <div className="space-y-3">
            <p className="text-white font-semibold text-lg">
              Congratulations! 🥳
            </p>
            <p className="text-purple-200">
              You can now message each other and start a conversation. Don't be shy - say hello!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={onViewProfile}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 text-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Conversation
            </Button>
            
            <Button
              variant="outline"
              onClick={onContinueSwiping}
              className="w-full border-white/20 text-white hover:bg-white/10 py-3"
            >
              <User className="w-4 h-4 mr-2" />
              Keep Swiping
            </Button>
          </div>

          {/* Fun fact */}
          <div className="bg-white/10 rounded-lg p-3 mt-6">
            <p className="text-purple-200 text-sm">
              💡 <strong>Did you know?</strong> Matches are 3x more likely to lead to conversations than regular likes!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchModal;