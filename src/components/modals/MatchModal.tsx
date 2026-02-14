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
      <DialogContent className="bg-card border-border text-foreground p-0 overflow-hidden">
        {/* Celebration Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 animate-pulse"></div>
          <div className="absolute top-4 left-4 animate-bounce delay-75">
            <Heart className="w-6 h-6 text-primary fill-primary" />
          </div>
          <div className="absolute top-8 right-6 animate-bounce delay-150">
            <Heart className="w-4 h-4 text-destructive fill-destructive" />
          </div>
          <div className="absolute bottom-12 left-8 animate-bounce delay-300">
            <Heart className="w-5 h-5 text-primary/70 fill-primary/70" />
          </div>
          <div className="absolute bottom-20 right-4 animate-bounce delay-500">
            <Sparkles className="w-6 h-6 text-warning" />
          </div>
        </div>

        <div className="relative z-10 p-8 text-center space-y-6">
          {/* Match Header */}
          <div className="space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Heart className="w-10 h-10 text-primary-foreground fill-primary-foreground" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                It's a Match! 🎉
              </h1>
              <p className="text-muted-foreground text-lg">
                You and {profileName} liked each other!
              </p>
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full p-1 bg-gradient-to-br from-primary via-accent to-primary animate-spin">
                <div className="absolute inset-1 rounded-full bg-card"></div>
              </div>
              <img
                src={profileImage}
                alt={profileName}
                className="relative z-10 w-24 h-24 rounded-full object-cover object-top border-4 border-transparent"
              />
            </div>
          </div>

          {/* Match Message */}
          <div className="space-y-3">
            <p className="text-foreground font-semibold text-lg">
              Congratulations! 🥳
            </p>
            <p className="text-muted-foreground">
              You can now message each other and start a conversation. Don't be shy - say hello!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={onViewProfile}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-3 text-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Conversation
            </Button>
            
            <Button
              variant="outline"
              onClick={onContinueSwiping}
              className="w-full border-border text-foreground hover:bg-muted py-3"
            >
              <User className="w-4 h-4 mr-2" />
              Keep Swiping
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchModal;
