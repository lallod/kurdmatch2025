
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Verified, X, Palette } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { KurdistanRegion } from '@/types/profile';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProfileHeaderProps {
  name: string;
  age: number;
  location: string;
  occupation: string;
  lastActive: string;
  verified: boolean;
  profileImage: string;
  distance?: number;
  kurdistanRegion?: KurdistanRegion;
  onDislike?: () => void;
  backgroundColor?: string;
  onBackgroundColorChange?: (color: string) => void;
}

const backgroundColors = [
  "#F1F0FB", // Soft Gray
  "#E5DEFF", // Soft Purple
  "#D3E4FD", // Soft Blue
  "#FFDEE2", // Soft Pink
  "#FDE1D3", // Soft Peach
  "#FEF7CD", // Soft Yellow
  "#F2FCE2", // Soft Green
  "#FD297B", // Tinder Rose
  "#FF5864", // Tinder Orange
  "#9b87f5", // Primary Purple
  "#D946EF", // Magenta Pink
  "#F97316", // Bright Orange
  "#0EA5E9", // Ocean Blue
];

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  age,
  location,
  occupation,
  lastActive,
  verified,
  profileImage,
  distance,
  kurdistanRegion,
  onDislike,
  backgroundColor = "#F1F0FB",
  onBackgroundColorChange
}) => {
  const isMobile = useIsMobile();
  const [localBgColor, setLocalBgColor] = useState(backgroundColor);
  
  const handleMessage = () => {
    toast.success(`Message sent to ${name}!`);
  };
  
  const handleLike = () => {
    toast.success(`You liked ${name}!`);
  };
  
  const handleDislike = () => {
    if (onDislike) {
      onDislike();
    } else {
      toast.info(`You passed on ${name}`);
    }
  };

  const handleColorChange = (color: string) => {
    setLocalBgColor(color);
    if (onBackgroundColorChange) {
      onBackgroundColorChange(color);
    }
    toast.success("Profile background color updated!");
  };
  
  return <div className="relative w-full">
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-full h-full" style={{
        backgroundColor: localBgColor,
        backgroundImage: `url(${profileImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(30px)',
        transform: 'scale(1.1)',
        opacity: '0.4'
      }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-tinder-rose/20 to-tinder-orange/20 mix-blend-overlay"></div>

      <div className="relative z-10 w-full px-4 sm:px-6 py-6 sm:py-8 md:py-16 lg:py-24 flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
        <div className="relative">
          <div className="w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-white shadow-xl transition-transform-slow hover:scale-[1.02] bg-black/10">
            <img 
              src={profileImage} 
              alt={`${name}'s profile`} 
              className="w-full h-full object-contain"
            />
          </div>
          {verified && <div className="absolute bottom-3 right-3 bg-white text-primary rounded-full p-1 shadow-md">
              <Verified size={isMobile ? 16 : 20} className="text-blue-500" />
            </div>}
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3 md:gap-4 animate-fade-up">
          <div>
            <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
                {name}, <span className="font-normal">{age}</span>
              </h1>
            </div>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl text-muted-foreground">{occupation}</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <Badge variant="outline" className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm">
              {location}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm">
              Active {lastActive}
            </Badge>
            {distance && (
              <Badge variant="outline" className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm">
                {distance} miles away
              </Badge>
            )}
            {kurdistanRegion && (
              <Badge variant="outline" className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm">
                {kurdistanRegion}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3 mt-4 md:mt-6 justify-center md:justify-start">
            <Button 
              size={isMobile ? "default" : "lg"} 
              className="rounded-full shadow-md transition-all-slow hover:shadow-lg flex items-center gap-2 bg-gradient-tinder text-white"
              onClick={handleMessage}
            >
              <MessageCircle size={isMobile ? 14 : 16} />
              <span>Message</span>
            </Button>
            <Button 
              size={isMobile ? "default" : "lg"} 
              variant="outline" 
              className="rounded-full bg-white backdrop-blur-sm border-tinder-rose text-tinder-rose hover:bg-tinder-light hover:text-tinder-rose hover:border-tinder-rose shadow-md transition-all-slow hover:shadow-lg flex items-center gap-2"
              onClick={handleLike}
            >
              <Heart size={isMobile ? 14 : 16} className="animate-pulse-heart" />
              <span>Like</span>
            </Button>
            <Button 
              size={isMobile ? "default" : "lg"} 
              variant="outline" 
              className="rounded-full bg-white backdrop-blur-sm border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 shadow-md transition-all-slow hover:shadow-lg flex items-center gap-2" 
              onClick={handleDislike}
            >
              <X size={isMobile ? 14 : 16} />
              <span>Dislike</span>
            </Button>
            
            {onBackgroundColorChange && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size={isMobile ? "default" : "lg"}
                    variant="outline"
                    className="rounded-full bg-white backdrop-blur-sm border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 shadow-md transition-all-slow hover:shadow-lg flex items-center gap-2"
                  >
                    <Palette size={isMobile ? 14 : 16} />
                    <span>Theme</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="end">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Change Background</h4>
                    <p className="text-xs text-muted-foreground">Pick a color for your profile background</p>
                    <div className="grid grid-cols-5 gap-2 pt-2">
                      {backgroundColors.map((color) => (
                        <button
                          key={color}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center",
                            localBgColor === color ? "border-black shadow-md scale-110" : "border-transparent hover:scale-110"
                          )}
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorChange(color)}
                          aria-label={`Set background color to ${color}`}
                        >
                          {localBgColor === color && (
                            <span className="bg-white w-2 h-2 rounded-full" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </div>;
};

export default ProfileHeader;
