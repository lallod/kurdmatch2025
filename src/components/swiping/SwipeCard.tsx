
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Heart, 
  X, 
  Star, 
  MessageCircle, 
  Shield, 
  Flag,
  ChevronDown,
  Verified
} from 'lucide-react';
import ProfileDetails from '@/components/ProfileDetails';
import { trackProfileView } from '@/api/profileViews';
import { likeProfile } from '@/api/likes';
import { toast } from 'sonner';

interface SwipeCardProps {
  profile: any;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  onMessage: () => void;
  onReport: () => void;
  onBlock: () => void;
  isActive: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipe,
  onMessage,
  onReport,
  onBlock,
  isActive
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showFullProfile, setShowFullProfile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isActive && profile) {
      // Track profile view when card becomes active
      trackProfileView(profile.id).catch(console.error);
    }
  }, [isActive, profile]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isActive) return;
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging || !isActive) return;
    setIsDragging(false);
    
    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold) {
      onSwipe(dragOffset.x > 0 ? 'right' : 'left');
    } else if (dragOffset.y < -threshold) {
      onSwipe('up');
    }
    
    setDragOffset({ x: 0, y: 0 });
  };

  const handlePass = () => {
    onSwipe('left');
  };

  const handleLike = async () => {
    try {
      const result = await likeProfile(profile.id);
      if (result.match) {
        toast.success("It's a match! 🎉");
      } else {
        toast.success("Like sent!");
      }
      onSwipe('right');
    } catch (error) {
      toast.error("Failed to like profile");
    }
  };

  const handleSuperLike = async () => {
    try {
      // Super like logic would go here
      toast.success("Super Like sent! ⭐");
      onSwipe('up');
    } catch (error) {
      toast.error("Failed to send Super Like");
    }
  };

  const getSwipeOpacity = () => {
    const maxOffset = 100;
    const opacity = Math.max(0.3, 1 - Math.abs(dragOffset.x) / maxOffset);
    return opacity;
  };

  const getSwipeColor = () => {
    if (dragOffset.x > 50) return 'rgba(147, 51, 234, 0.2)'; // Purple for like
    if (dragOffset.x < -50) return 'rgba(239, 68, 68, 0.2)'; // Red for pass
    if (dragOffset.y < -50) return 'rgba(234, 179, 8, 0.2)'; // Yellow for super like
    return 'transparent';
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Simple distance calculation - in real app you'd use more precise geolocation
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  const formatProfileDetails = (profile: any) => {
    return {
      about: profile.bio || '',
      height: profile.height || '',
      bodyType: profile.body_type || '',
      ethnicity: profile.ethnicity || '',
      education: profile.education || '',
      occupation: profile.occupation || '',
      company: profile.company || '',
      religion: profile.religion || '',
      politicalViews: profile.political_views || '',
      drinking: '',
      smoking: '',
      relationshipGoals: profile.relationship_goals || '',
      wantChildren: profile.want_children || '',
      havePets: profile.have_pets || '',
      languages: profile.languages || [],
      interests: profile.interests || [],
      hobbies: profile.hobbies || [],
      favoriteBooks: [],
      favoriteMovies: [],
      favoriteMusic: [],
      favoriteFoods: [],
      exerciseHabits: profile.exercise_habits || '',
      zodiacSign: profile.zodiac_sign || '',
      personalityType: profile.personality_type || '',
      sleepSchedule: profile.sleep_schedule || '',
      travelFrequency: profile.travel_frequency || '',
      communicationStyle: profile.communication_style || '',
      loveLanguage: profile.love_language || '',
      values: profile.values || []
    };
  };

  if (!profile) return null;

  return (
    <div className="relative w-full h-full">
      <Card 
        ref={cardRef}
        className={`absolute inset-0 overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl transition-all duration-300 cursor-grab ${
          isDragging ? 'cursor-grabbing scale-105' : ''
        } ${isActive ? 'z-10' : 'z-0'}`}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.1}deg)`,
          opacity: getSwipeOpacity(),
          backgroundColor: getSwipeColor()
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDragging(false);
          setDragOffset({ x: 0, y: 0 });
        }}
      >
        {/* Photo Gallery */}
        <div className="relative h-96 overflow-hidden">
          <img 
            src={profile.profile_image || profile.photos?.[0]?.url || '/placeholder.svg'}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Profile Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <span className="text-xl">{profile.age}</span>
              {profile.verified && (
                <Verified className="h-6 w-6 text-blue-400 fill-current" />
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-200 mb-2">
              <MapPin className="h-4 w-4" />
              <span>{calculateDistance(0, 0, 1, 1)} km away</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {profile.kurdistan_region && (
                <Badge className="bg-purple-500/80 text-white">
                  {profile.kurdistan_region}
                </Badge>
              )}
              {profile.location && (
                <Badge className="bg-white/20 text-white">
                  📍 {profile.location}
                </Badge>
              )}
              {profile.relationship_goals && (
                <Badge className="bg-pink-500/80 text-white">
                  💕 {profile.relationship_goals}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Action Buttons Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-white/20 backdrop-blur border-white/30 hover:bg-white/30"
              onClick={(e) => {
                e.stopPropagation();
                onReport();
              }}
            >
              <Flag className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/20 backdrop-blur border-white/30 hover:bg-white/30"
              onClick={(e) => {
                e.stopPropagation();
                onBlock();
              }}
            >
              <Shield className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expandable Content */}
        <CardContent className="p-4">
          <div className="flex items-center justify-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullProfile(!showFullProfile)}
              className="text-purple-300 hover:text-purple-100"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${showFullProfile ? 'rotate-180' : ''}`} />
              <span className="ml-1">
                {showFullProfile ? 'Hide Details' : 'View Full Profile'}
              </span>
            </Button>
          </div>

          {showFullProfile && (
            <div className="space-y-4">
              <ProfileDetails details={formatProfileDetails(profile)} />
            </div>
          )}
        </CardContent>

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          <Button
            size="lg"
            variant="outline"
            className="bg-red-500/20 border-red-400 text-red-300 hover:bg-red-500/30 rounded-full h-14 w-14"
            onClick={handlePass}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="bg-yellow-500/20 border-yellow-400 text-yellow-300 hover:bg-yellow-500/30 rounded-full h-16 w-16"
            onClick={handleSuperLike}
          >
            <Star className="h-7 w-7" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="bg-purple-500/20 border-purple-400 text-purple-300 hover:bg-purple-500/30 rounded-full h-14 w-14"
            onClick={handleLike}
          >
            <Heart className="h-6 w-6" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="bg-blue-500/20 border-blue-400 text-blue-300 hover:bg-blue-500/30 rounded-full h-14 w-14"
            onClick={onMessage}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SwipeCard;
