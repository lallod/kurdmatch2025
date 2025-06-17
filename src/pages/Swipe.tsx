
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, X, Star, MessageCircle, Flag, Shield, Undo2, Sparkles, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';
import { toast } from 'sonner';

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  avatar: string;
  distance: number;
  compatibilityScore: number;
  kurdistanRegion?: string;
  area: string;
  interests?: string[];
  occupation?: string;
  religion?: string;
  bodyType?: string;
  languages?: string[];
  dietaryPreferences?: string;
  height?: string;
  photos?: string[];
  bio?: string;
  relationshipGoals?: string;
  verified?: boolean;
}

const mockProfiles: Profile[] = [
  {
    id: 1,
    name: "Emma Johnson",
    age: 26,
    location: "Diyarbakır, Kurdistan",
    avatar: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=150&q=80",
    distance: 7,
    compatibilityScore: 95,
    kurdistanRegion: "North-Kurdistan",
    area: "North-Kurdistan",
    interests: ["Language", "Culture", "Education"],
    occupation: "Linguist",
    religion: "muslim",
    bodyType: "average",
    languages: ["kurdish", "turkish", "english"],
    height: "163",
    dietaryPreferences: "No restrictions",
    photos: [
      "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
    ],
    bio: "Passionate about languages and cultures. Love exploring the rich heritage of Kurdistan while building bridges between communities.",
    relationshipGoals: "Long-term relationship",
    verified: true
  },
  {
    id: 2,
    name: "Lucas Davis",
    age: 30,
    location: "Mahabad, Kurdistan",
    avatar: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=150&q=80",
    distance: 15,
    compatibilityScore: 91,
    kurdistanRegion: "East-Kurdistan",
    area: "East-Kurdistan",
    interests: ["Technology", "Sports", "Reading"],
    occupation: "IT Consultant",
    religion: "muslim",
    bodyType: "muscular",
    languages: ["kurdish", "persian", "english"],
    height: "182",
    dietaryPreferences: "No restrictions",
    photos: [
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80"
    ],
    bio: "Tech enthusiast who loves staying active. Looking for someone to share adventures and build a meaningful connection.",
    relationshipGoals: "Serious dating",
    verified: false
  },
  {
    id: 3,
    name: "Mia Garcia",
    age: 27,
    location: "Erbil, Kurdistan",
    avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&q=80",
    distance: 12,
    compatibilityScore: 88,
    kurdistanRegion: "South-Kurdistan",
    area: "South-Kurdistan",
    interests: ["Cooking", "Reading", "Travel"],
    occupation: "Teacher",
    religion: "muslim",
    bodyType: "average",
    languages: ["kurdish", "english", "arabic"],
    height: "165",
    dietaryPreferences: "No restrictions",
    photos: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&q=80"
    ],
    bio: "Educator with a passion for learning and sharing knowledge. Love cooking traditional Kurdish dishes and exploring new places.",
    relationshipGoals: "Marriage",
    verified: true
  }
];

const Swipe = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<{ type: string; profileId: number } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const currentProfile = profiles[currentIndex];

  const handleSwipeAction = (action: 'pass' | 'like' | 'superlike', profileId: number) => {
    setLastAction({ type: action, profileId });
    
    switch (action) {
      case 'pass':
        toast("Profile passed", { icon: "👋" });
        break;
      case 'like':
        toast("Profile liked!", { icon: "💜" });
        break;
      case 'superlike':
        toast("Super like sent!", { icon: "⭐" });
        break;
    }

    // Move to next profile
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentPhotoIndex(0);
      setIsExpanded(false);
    } else {
      toast("No more profiles to show", { icon: "🔄" });
    }
  };

  const handleUndo = () => {
    if (lastAction && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setLastAction(null);
      toast("Action undone", { icon: "↩️" });
    }
  };

  const handleMessage = (profileId: number) => {
    navigate(`/messages?user=${profileId}`);
  };

  const handleReport = (profileId: number) => {
    toast("Profile reported. Thank you for keeping our community safe.", { icon: "🛡️" });
  };

  const nextPhoto = () => {
    if (currentProfile?.photos && currentPhotoIndex < currentProfile.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center pb-32">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No more profiles</h2>
          <p className="text-purple-200 mb-4">Check back later for new matches!</p>
          <Button 
            onClick={() => setCurrentIndex(0)} 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Start Over
          </Button>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-32">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur shadow-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Find Your Match</h1>
            </div>
            {lastAction && (
              <Button
                onClick={handleUndo}
                variant="outline"
                size="sm"
                className="gap-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Undo2 className="h-4 w-4" />
                Undo
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          {/* Photo Gallery */}
          <div className="relative h-96">
            <img
              src={currentProfile.photos?.[currentPhotoIndex] || currentProfile.avatar}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
            
            {/* Photo Navigation */}
            {currentProfile.photos && currentProfile.photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
                  disabled={currentPhotoIndex === 0}
                >
                  <span>‹</span>
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white"
                  disabled={currentPhotoIndex === currentProfile.photos.length - 1}
                >
                  <span>›</span>
                </button>
                
                {/* Photo Indicators */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {currentProfile.photos.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-white">{currentProfile.name}</h2>
                    <span className="text-xl text-white">{currentProfile.age}</span>
                    {currentProfile.verified && (
                      <Badge className="bg-blue-500 text-white">✓</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-white/90 mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{currentProfile.location}</span>
                    <span>• {currentProfile.distance}km away</span>
                  </div>
                  {currentProfile.kurdistanRegion && (
                    <Badge variant="outline" className="text-xs bg-purple-500/20 text-white border-purple-400/30 mb-1">
                      {currentProfile.kurdistanRegion}
                    </Badge>
                  )}
                  {currentProfile.relationshipGoals && (
                    <div className="text-sm text-white/80">
                      Looking for: {currentProfile.relationshipGoals}
                    </div>
                  )}
                </div>
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {currentProfile.compatibilityScore}%
                </Badge>
              </div>
            </div>

            {/* Safety Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                onClick={() => handleReport(currentProfile.id)}
                variant="outline"
                size="sm"
                className="bg-black/50 border-white/20 text-white hover:bg-red-500/50"
              >
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Profile Details */}
          <CardContent className="p-4">
            {/* Quick Info */}
            <div className="flex flex-wrap gap-2 mb-4">
              {currentProfile.occupation && (
                <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200">
                  {currentProfile.occupation}
                </Badge>
              )}
              {currentProfile.height && (
                <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200">
                  {currentProfile.height}cm
                </Badge>
              )}
              {currentProfile.languages && (
                <Badge variant="secondary" className="text-xs bg-white/10 text-purple-200">
                  {currentProfile.languages[0]}{currentProfile.languages.length > 1 ? ` +${currentProfile.languages.length - 1}` : ''}
                </Badge>
              )}
            </div>

            {/* Bio */}
            {currentProfile.bio && (
              <div className="mb-4">
                <p className="text-white text-sm leading-relaxed">
                  {isExpanded ? currentProfile.bio : `${currentProfile.bio.slice(0, 100)}...`}
                </p>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-purple-300 text-sm mt-1 hover:text-purple-200"
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>
              </div>
            )}

            {/* Interests */}
            {currentProfile.interests && currentProfile.interests.length > 0 && (
              <div className="mb-4">
                <h4 className="text-white font-medium mb-2">Interests</h4>
                <div className="flex flex-wrap gap-1">
                  {currentProfile.interests.slice(0, 3).map((interest, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-pink-400/30 text-pink-300">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            onClick={() => handleSwipeAction('pass', currentProfile.id)}
            variant="outline"
            size="lg"
            className="w-14 h-14 rounded-full bg-red-500/20 border-red-400/30 text-red-400 hover:bg-red-500/30"
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            onClick={() => handleMessage(currentProfile.id)}
            variant="outline"
            size="lg"
            className="w-12 h-12 rounded-full bg-blue-500/20 border-blue-400/30 text-blue-400 hover:bg-blue-500/30"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>

          <Button
            onClick={() => handleSwipeAction('like', currentProfile.id)}
            variant="outline"
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 text-purple-400 hover:from-purple-500/30 hover:to-pink-500/30"
          >
            <Heart className="h-7 w-7" />
          </Button>

          <Button
            onClick={() => handleSwipeAction('superlike', currentProfile.id)}
            variant="outline"
            size="lg"
            className="w-12 h-12 rounded-full bg-yellow-500/20 border-yellow-400/30 text-yellow-400 hover:bg-yellow-500/30"
          >
            <Star className="h-5 w-5" />
          </Button>
        </div>

        {/* Profile Counter */}
        <div className="text-center mt-4">
          <span className="text-purple-200 text-sm">
            {currentIndex + 1} of {profiles.length}
          </span>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Swipe;
