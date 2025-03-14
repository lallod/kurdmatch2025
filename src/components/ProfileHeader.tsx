
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21.3 12.23c0-.84-.14-1.66-.41-2.43l1.34-1c.29-.24.4-.67.25-1.04-.36-.91-.89-1.74-1.55-2.46-.29-.32-.75-.38-1.1-.14l-1.42.96c-.6-.48-1.28-.87-2-.113v-1.76c0-.41-.3-.76-.71-.83-1-.16-2.03-.16-3.04 0-.41.07-.71.42-.71.83v1.76c-.74.26-1.42.65-2.02 1.13l-1.42-.96c-.35-.24-.81-.18-1.1.14-.66.72-1.19 1.55-1.55 2.46-.15.37-.04.8.25 1.04l1.34 1c-.27.77-.41 1.59-.41 2.43 0 .84.14 1.66.41 2.43l-1.34 1c-.29.24-.4.67-.25 1.04.36.91.89 1.74 1.55 2.46.29.32.75.38 1.1.14l1.42-.96c.6.48 1.28.87 2 1.13v1.76c0 .41.3.76.71.83 1 .16 2.03.16 3.04 0 .41-.07.71-.42.71-.83v-1.76c.74-.26 1.42-.65 2.02-1.13l1.42.96c.35.24.81.18 1.1-.14.66-.72 1.19-1.55 1.55-2.46.15-.37.04-.8-.25-1.04l-1.34-1c.27-.77.41-1.59.41-2.43zm-9.3 3.65c-2.02 0-3.65-1.63-3.65-3.65s1.63-3.65 3.65-3.65 3.65 1.63 3.65 3.65-1.63 3.65-3.65 3.65z"
                  fill="currentColor"
                />
              </svg>
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
            <Button size="lg" className="rounded-full shadow-md transition-all-slow hover:shadow-lg flex items-center gap-2">
              <MessageCircle size={16} />
              <span>Message</span>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-white/80 backdrop-blur-sm border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700 shadow-md transition-all-slow hover:shadow-lg flex items-center gap-2">
              <Heart size={16} />
              <span>Like</span>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50 shadow-md transition-all-slow hover:shadow-lg">
              <Share2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
