
import React, { useState } from 'react';
import { User, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ProfileBioProps {
  about: string;
  isMobile: boolean;
}

const ProfileBio: React.FC<ProfileBioProps> = ({ about, isMobile }) => {
  const [isSubscriber] = useState(false); // Mock subscription status
  
  // Function to simulate generating a bio based on profile information
  const generateBio = () => {
    // In a real implementation, this would use the profile data to generate a bio
    return "Hi there! I'm a UX Designer with a passion for creating beautiful digital experiences. I love hiking in the mountains, trying new restaurants in San Francisco, and curling up with good books like The Alchemist. As a Libra with ENFJ personality, I value deep connections and communication. Looking for someone who shares my sense of adventure and appreciation for both the outdoors and quality time together.";
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium text-tinder-rose flex items-center">
          <User size={18} className="mr-2" />
          Bio
        </h3>
        <div className="flex items-center gap-2">
          <div className="text-xs bg-gradient-to-r from-tinder-rose to-tinder-orange bg-clip-text text-transparent font-medium flex items-center">
            <Sparkles size={14} className="mr-1 text-tinder-orange" />
            AI Generated
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs border-tinder-rose text-tinder-rose hover:bg-tinder-rose/5 flex items-center gap-1"
              >
                <Wand2 size={14} />
                Generate Bio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI Bio Generation</DialogTitle>
                <DialogDescription>
                  {isSubscriber ? (
                    <>
                      <p className="mb-4">Generate a personalized bio based on your profile information.</p>
                      <div className="bg-gray-50 p-4 rounded-md border mb-4">
                        <p className="text-sm font-medium">{generateBio()}</p>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-tinder-rose to-tinder-orange hover:from-tinder-rose/90 hover:to-tinder-orange/90">
                        Apply Generated Bio
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="mb-4">AI bio generation is a premium feature available only to subscribers.</p>
                      <Button className="w-full bg-gradient-to-r from-tinder-rose to-tinder-orange hover:from-tinder-rose/90 hover:to-tinder-orange/90">
                        Upgrade to Premium
                      </Button>
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 p-5 rounded-lg border-l-4 border-tinder-rose">
        <p className="text-muted-foreground leading-relaxed italic">{about}</p>
      </div>
    </div>
  );
};

export default ProfileBio;
