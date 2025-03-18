
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, X, Filter, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

const LikedMe = () => {
  const { toast } = useToast();
  const [likedProfiles, setLikedProfiles] = useState([
    {
      id: 1,
      name: "Aiden Taylor",
      age: 28,
      avatar: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=150&q=80",
      distance: "2 miles away",
      matchPercentage: 95,
      premium: true,
      bio: "Software engineer by day, amateur chef by night. Love hiking and photography.",
      interests: ["Hiking", "Cooking", "Photography", "Travel"],
      isLikedBack: false
    },
    {
      id: 2,
      name: "Isabella Kim",
      age: 26,
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&q=80",
      distance: "5 miles away",
      matchPercentage: 87,
      premium: false,
      bio: "Art teacher who loves dancing and painting. Always looking for new adventures!",
      interests: ["Art", "Dancing", "Museums", "Coffee"],
      isLikedBack: false
    },
    {
      id: 3,
      name: "Ethan Johnson",
      age: 31,
      avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&q=80",
      distance: "7 miles away",
      matchPercentage: 82,
      premium: true,
      bio: "Financial analyst, fitness enthusiast, and dog lover. Looking for someone to share adventures with.",
      interests: ["Fitness", "Dogs", "Finance", "Reading"],
      isLikedBack: false
    },
    {
      id: 4,
      name: "Zoe Martinez",
      age: 24,
      avatar: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=150&q=80",
      distance: "10 miles away",
      matchPercentage: 78,
      premium: false,
      bio: "Tech startup founder, avid reader, and coffee addict. Let's discuss our favorite books over coffee!",
      interests: ["Startups", "Reading", "Coffee", "Technology"],
      isLikedBack: false
    }
  ]);

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterMinMatch, setFilterMinMatch] = useState(0);
  const [filterDistance, setFilterDistance] = useState(20);
  const [filterPremiumOnly, setFilterPremiumOnly] = useState(false);

  const handleLikeBack = (id) => {
    setLikedProfiles(profiles => 
      profiles.map(profile => 
        profile.id === id 
          ? { ...profile, isLikedBack: true } 
          : profile
      )
    );
    
    toast({
      title: "It's a match!",
      description: "You can now start chatting with this person",
      variant: "default",
    });
  };

  const handleDislike = (id) => {
    setLikedProfiles(profiles => profiles.filter(profile => profile.id !== id));
    setSelectedProfile(null);
    
    toast({
      title: "Profile removed",
      description: "You won't see this profile again",
      variant: "destructive",
    });
  };

  const handleOpenProfile = (profile) => {
    setSelectedProfile(profile);
  };

  const handleCloseProfile = () => {
    setSelectedProfile(null);
  };

  const applyFilters = () => {
    // This would typically filter the data from the API
    // Here we're just closing the filter panel for demo purposes
    setShowFilters(false);
    
    toast({
      title: "Filters applied",
      description: "Your preferences have been saved",
    });
  };

  const filteredProfiles = likedProfiles.filter(profile => 
    profile.matchPercentage >= filterMinMatch && 
    (!filterPremiumOnly || profile.premium)
  );

  return (
    <div className="min-h-screen pt-8 px-4 pb-24">
      {selectedProfile ? (
        // Detailed profile view
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="icon" onClick={handleCloseProfile} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-bold">{selectedProfile.name}'s Profile</h2>
          </div>
          
          <div className="relative h-80 rounded-xl overflow-hidden mb-4">
            <img 
              src={selectedProfile.avatar} 
              alt={selectedProfile.name} 
              className="w-full h-full object-cover"
            />
            {selectedProfile.premium && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-tinder text-white border-0">
                  Premium
                </Badge>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">{selectedProfile.name}</h3>
              <span className="text-lg">{selectedProfile.age}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{selectedProfile.distance}</p>
            <Badge variant="outline" className="mb-4 bg-tinder-rose/5 text-tinder-rose border-tinder-rose/10">
              {selectedProfile.matchPercentage}% Match
            </Badge>
            
            <p className="my-4 text-muted-foreground">{selectedProfile.bio}</p>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProfile.interests.map((interest, idx) => (
                  <Badge key={idx} variant="secondary" className="py-1">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full p-4 h-14 w-14 border-gray-300"
              onClick={() => handleDislike(selectedProfile.id)}
            >
              <X className="h-6 w-6 text-gray-500" />
            </Button>
            
            {!selectedProfile.isLikedBack ? (
              <Button 
                size="lg" 
                className="rounded-full p-4 h-14 w-14 bg-gradient-tinder hover:opacity-90 border-none"
                onClick={() => handleLikeBack(selectedProfile.id)}
              >
                <Heart className="h-6 w-6 text-white" />
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="rounded-full p-4 h-14 w-14 bg-primary hover:bg-primary/90"
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </Button>
            )}
          </div>
        </div>
      ) : showFilters ? (
        // Filter panel
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => setShowFilters(false)}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <h2 className="text-xl font-bold">Filters</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Minimum Match Percentage: {filterMinMatch}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filterMinMatch}
                onChange={(e) => setFilterMinMatch(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Maximum Distance: {filterDistance} miles
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={filterDistance}
                onChange={(e) => setFilterDistance(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Premium Profiles Only</label>
              <input
                type="checkbox"
                checked={filterPremiumOnly}
                onChange={(e) => setFilterPremiumOnly(e.target.checked)}
                className="ml-2 h-4 w-4"
              />
            </div>
            
            <Button className="w-full mt-4 bg-gradient-tinder" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      ) : (
        // Main liked list view
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Liked You</h1>
              <Badge variant="outline" className="bg-tinder-rose/10 text-tinder-rose border-tinder-rose/20">
                {filteredProfiles.length} likes
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowFilters(true)}>
              <Filter className="h-5 w-5" />
            </Button>
          </div>

          {filteredProfiles.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredProfiles.map((profile) => (
                <Card 
                  key={profile.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleOpenProfile(profile)}
                >
                  <div className="relative h-40 bg-gray-100 overflow-hidden">
                    <img 
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                    {profile.premium && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-gradient-tinder text-white border-0">
                          Premium
                        </Badge>
                      </div>
                    )}
                    {profile.isLikedBack && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary text-white border-0">
                          Match
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-1 mb-1">
                      <h3 className="font-semibold text-sm truncate">{profile.name}</h3>
                      <span className="text-sm text-muted-foreground">{profile.age}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{profile.distance}</p>
                    <Badge variant="outline" className="text-xs bg-tinder-rose/5 text-tinder-rose border-tinder-rose/10">
                      {profile.matchPercentage}% Match
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No likes yet</p>
              <p className="text-sm text-muted-foreground mt-1">When someone likes your profile, they'll appear here</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LikedMe;
