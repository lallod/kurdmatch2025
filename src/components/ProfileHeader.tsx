
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Verified, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileHeaderProps {
  name: string;
  age: number;
  location: string;
  occupation: string;
  lastActive: string;
  verified: boolean;
  profileImage: string;
  onDislike?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  age,
  location,
  occupation,
  lastActive,
  verified,
  profileImage,
  onDislike,
}) => {
  const isMobile = useIsMobile();

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

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 md:py-16 lg:py-24 flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div className="relative">
          <div className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[280px] md:h-[280px] rounded-full overflow-hidden border-4 border-white shadow-xl transition-transform-slow hover:scale-[1.02]">
            <img
              src={profileImage}
              alt={`${name}'s profile`}
              className="w-full h-full object-cover animate-fade-in"
              loading="eager"
            />
          </div>
          {verified && (
            <div className="absolute bottom-3 right-3 bg-white text-primary rounded-full p-1 shadow-md">
              <Verified size={isMobile ? 16 : 20} className="text-blue-500" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3 md:gap-4 animate-fade-up">
          <div>
            <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
                {name}, <span className="font-normal">{age}</span>
              </h1>
            </div>
            <p className="text-md sm:text-lg text-muted-foreground">{occupation}</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <Badge variant="outline" className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm">
              {location}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm">
              Active {lastActive}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3 mt-4 md:mt-6 justify-center md:justify-start">
            <Button 
              size={isMobile ? "default" : "lg"} 
              className="rounded-full shadow-md transition-all-slow hover:shadow-lg flex items-center gap-2 bg-gradient-tinder text-white"
            >
              <MessageCircle size={isMobile ? 14 : 16} />
              <span>Message</span>
            </Button>
            <Button 
              size={isMobile ? "default" : "lg"} 
              variant="outline" 
              className="rounded-full bg-white backdrop-blur-sm border-tinder-rose text-tinder-rose hover:bg-tinder-light hover:text-tinder-rose hover:border-tinder-rose shadow-md transition-all-slow hover:shadow-lg flex items-center gap-2"
            >
              <Heart size={isMobile ? 14 : 16} className="animate-pulse-heart" />
              <span>Like</span>
            </Button>
            <Button 
              size={isMobile ? "default" : "lg"} 
              variant="outline" 
              className="rounded-full bg-white backdrop-blur-sm border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 shadow-md transition-all-slow hover:shadow-lg flex items-center gap-2"
              onClick={onDislike}
            >
              <X size={isMobile ? 14 : 16} />
              <span>Dislike</span>
            </Button>
            <Button 
              size={isMobile ? "icon" : "lg"} 
              variant="outline" 
              className="rounded-full bg-white backdrop-blur-sm border-gray-200 hover:bg-gray-50 shadow-md transition-all-slow hover:shadow-lg"
            >
              <Share2 size={isMobile ? 14 : 16} />
              {!isMobile && <span className="ml-2">Share</span>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
