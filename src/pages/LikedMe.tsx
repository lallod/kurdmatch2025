
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart } from 'lucide-react';

const LikedMe = () => {
  const likedProfiles = [
    {
      id: 1,
      name: "Aiden Taylor",
      age: 28,
      avatar: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=150&q=80",
      distance: "2 miles away",
      matchPercentage: 95,
      premium: true
    },
    {
      id: 2,
      name: "Isabella Kim",
      age: 26,
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&q=80",
      distance: "5 miles away",
      matchPercentage: 87,
      premium: false
    },
    {
      id: 3,
      name: "Ethan Johnson",
      age: 31,
      avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&q=80",
      distance: "7 miles away",
      matchPercentage: 82,
      premium: true
    },
    {
      id: 4,
      name: "Zoe Martinez",
      age: 24,
      avatar: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=150&q=80",
      distance: "10 miles away",
      matchPercentage: 78,
      premium: false
    }
  ];

  return (
    <div className="min-h-screen pt-8 px-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Liked You</h1>
        <Badge variant="outline" className="bg-tinder-rose/10 text-tinder-rose border-tinder-rose/20">
          {likedProfiles.length} likes
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {likedProfiles.map((profile) => (
          <Card key={profile.id} className="overflow-hidden hover:shadow-md transition-shadow">
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

      {likedProfiles.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="bg-muted/30 p-4 rounded-full mb-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No likes yet</p>
          <p className="text-sm text-muted-foreground mt-1">When someone likes your profile, they'll appear here</p>
        </div>
      )}
    </div>
  );
};

export default LikedMe;
