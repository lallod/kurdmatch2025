
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ViewedMe = () => {
  const navigate = useNavigate();
  const viewedProfiles = [
    {
      id: 1,
      name: "Noah Williams",
      age: 29,
      avatar: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=150&q=80",
      viewedAt: "10 minutes ago",
      hasViewed: false,
      compatibilityScore: 92
    },
    {
      id: 2,
      name: "Mia Garcia",
      age: 27,
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&q=80",
      viewedAt: "2 hours ago",
      hasViewed: true,
      compatibilityScore: 88
    },
    {
      id: 3,
      name: "Liam Wilson",
      age: 32,
      avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&q=80",
      viewedAt: "Yesterday",
      hasViewed: false,
      compatibilityScore: 76
    },
    {
      id: 4,
      name: "Sophia Brown",
      age: 25,
      avatar: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=150&q=80",
      viewedAt: "2 days ago",
      hasViewed: true,
      compatibilityScore: 85
    },
    {
      id: 5,
      name: "Lucas Davis",
      age: 30,
      avatar: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=150&q=80",
      viewedAt: "3 days ago",
      hasViewed: false,
      compatibilityScore: 91
    }
  ];

  const handleProfileClick = (profileId: number) => {
    // Navigate to profile page with ID
    navigate(`/profile/${profileId}`);
    
    // For demo purposes, we'll just go to the index page which has profile data
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-8 px-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Profile Views</h1>
        <Badge variant="outline" className="bg-tinder-rose/10 text-tinder-rose border-tinder-rose/20">
          {viewedProfiles.length} views
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {viewedProfiles.map((profile) => (
          <Card 
            key={profile.id} 
            className="overflow-hidden hover:bg-muted/30 transition-colors cursor-pointer"
            onClick={() => handleProfileClick(profile.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{profile.name}</span>
                      <span className="text-muted-foreground">{profile.age}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{profile.viewedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`${
                    profile.compatibilityScore > 90 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : profile.compatibilityScore > 80 
                        ? 'bg-tinder-rose/10 text-tinder-rose border-tinder-rose/20'
                        : 'bg-orange-100 text-orange-700 border-orange-200'
                  }`}>
                    {profile.compatibilityScore}% match
                  </Badge>
                  {!profile.hasViewed && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                      New
                    </Badge>
                  )}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {viewedProfiles.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="bg-muted/30 p-4 rounded-full mb-4">
            <Eye className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No profile views yet</p>
          <p className="text-sm text-muted-foreground mt-1">When someone views your profile, they'll appear here</p>
        </div>
      )}
    </div>
  );
};

export default ViewedMe;
