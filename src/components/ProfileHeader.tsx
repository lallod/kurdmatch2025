
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Verified } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileHeaderProps {
  name: string;
  age: number;
  location: string;
  occupation: string;
  lastActive: string;
  verified: boolean;
  profileImage: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  age,
  location,
  occupation,
  lastActive,
  verified,
  profileImage,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 z-20 px-4 py-3 glass-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src={profileImage} 
                alt={`${name}'s profile`}
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h2 className="text-white font-semibold flex items-center">
                {name}
                {verified && (
                  <Verified size={16} className="ml-1 text-blue-400" />
                )}
              </h2>
              <p className="text-xs text-white/70">{lastActive}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10">
              <MessageCircle size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/10">
              <Share2 size={20} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${profileImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(30px)',
            transform: 'scale(1.1)',
            opacity: '0.4',
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-tinder-rose/20 to-tinder-orange/20 mix-blend-overlay"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <div className="w-[220px] h-[220px] md:w-[280px] md:h-[280px] rounded-full overflow-hidden border-4 border-white shadow-xl transition-transform-slow hover:scale-[1.02]">
            <img
              src={profileImage}
              alt={`${name}'s profile`}
              className="w-full h-full object-cover animate-fade-in"
              loading="eager"
            />
          </div>
          {verified && (
            <div className="absolute bottom-3 right-3 bg-white text-primary rounded-full p-1 shadow-md">
              <Verified size={20} className="text-blue-500" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 animate-fade-up">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-4xl md:text-5xl font-light tracking-tight">
                {name}, <span className="font-normal">{age}</span>
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">{occupation}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm">
              {location}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm">
              Active {lastActive}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Button size="lg" className="rounded-full shadow-md transition-all-slow hover:shadow-lg flex items-center gap-2 bg-gradient-tinder text-white">
              <MessageCircle size={16} />
              <span>Message</span>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full bg-white backdrop-blur-sm border-tinder-rose text-tinder-rose hover:bg-tinder-light hover:text-tinder-rose hover:border-tinder-rose shadow-md transition-all-slow hover:shadow-lg flex items-center gap-2"
            >
              <Heart size={16} className="animate-pulse-heart" />
              <span>Like</span>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-white backdrop-blur-sm border-gray-200 hover:bg-gray-50 shadow-md transition-all-slow hover:shadow-lg">
              <Share2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
