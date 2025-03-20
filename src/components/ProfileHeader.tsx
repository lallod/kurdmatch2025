
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Verified } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileHeaderProps {
  name: string;
  age: number;
  location: string;
  occupation: string;
  lastActive: string;
  verified: boolean;
  profileImage: string;
  distance?: number; // Distance in km
  kurdistanRegion?: 'West-Kurdistan' | 'East-Kurdistan' | 'North-Kurdistan' | 'South-Kurdistan';
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
  distance = 12, // Default distance if not provided
  kurdistanRegion = 'South-Kurdistan', // Default region if not provided
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
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm">
              <Navigation size={isMobile ? 14 : 16} className="text-tinder-rose" />
              <span className="font-medium">{distance} km away</span>
            </div>
            
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm">
              <MapPin size={isMobile ? 14 : 16} className="text-tinder-rose" />
              <span className="font-medium">{kurdistanRegion}</span>
            </div>
            
            <Badge variant="outline" className="px-3 py-2 rounded-full bg-white/80 backdrop-blur-sm flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Online now</span>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
