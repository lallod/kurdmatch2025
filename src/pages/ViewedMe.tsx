
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Heart, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ViewedMe = () => {
  const navigate = useNavigate();
  const [profileViewingData, setProfileViewingData] = useState({});

  // Load profile viewing data from localStorage
  useEffect(() => {
    const viewingData = JSON.parse(localStorage.getItem('profileViewing') || '{}');
    setProfileViewingData(viewingData);
  }, []);

  const getViewingPercentage = (profileId: number) => {
    return profileViewingData[profileId]?.percentage || 0;
  };

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

  const likedProfiles = [
    {
      id: 6,
      name: "Emma Johnson",
      age: 26,
      avatar: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=150&q=80",
      likedAt: "1 hour ago",
      compatibilityScore: 95
    },
    {
      id: 7,
      name: "Oliver Smith",
      age: 31,
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80",
      likedAt: "Yesterday",
      compatibilityScore: 87
    },
    {
      id: 8,
      name: "Ava Martin",
      age: 24,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      likedAt: "2 days ago",
      compatibilityScore: 90
    }
  ];

  const handleProfileClick = (profileId: number) => {
    // Navigate directly to the profile page with ID
    navigate(`/profile/${profileId}`);
  };

  return (
    <div className="min-h-screen pt-8 px-4 pb-24">
      <Tabs defaultValue="viewed" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profile Interactions</h1>
          <TabsList>
            <TabsTrigger value="viewed" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>Viewed Me</span>
              <Badge variant="secondary" className="ml-1 text-xs">{viewedProfiles.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="likes" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>Liked Me</span>
              <Badge variant="secondary" className="ml-1 text-xs">{likedProfiles.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="viewed" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {viewedProfiles.map((profile) => {
              const viewingPercentage = getViewingPercentage(profile.id);
              
              return (
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
                        
                        {viewingPercentage > 0 && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                            {viewingPercentage}% profile viewed
                          </Badge>
                        )}
                        
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
              );
            })}
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
        </TabsContent>

        <TabsContent value="likes" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            {likedProfiles.map((profile) => {
              const viewingPercentage = getViewingPercentage(profile.id);
              
              return (
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
                            <span>{profile.likedAt}</span>
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
                        
                        {viewingPercentage > 0 && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                            {viewingPercentage}% profile viewed
                          </Badge>
                        )}
                        
                        <Badge variant="outline" className="bg-tinder-rose/10 text-tinder-rose border-tinder-rose/20">
                          <Heart className="h-3 w-3 mr-1 fill-tinder-rose" />
                          Liked you
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewedMe;
