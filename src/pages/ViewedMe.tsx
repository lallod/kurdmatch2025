
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Clock, ArrowRight, Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import BottomNavigation from '@/components/BottomNavigation';

const ViewedMe = () => {
  const navigate = useNavigate();
  const [profileViewingData, setProfileViewingData] = useState({});
  
  // Mock subscription status - in real app, this would come from auth context
  const [isSubscribed, setIsSubscribed] = useState(false);

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

  const handleProfileClick = (profileId: number) => {
    if (!isSubscribed) {
      return;
    }
    navigate(`/profile/${profileId}`);
  };

  const handleUpgrade = () => {
    // In real app, this would navigate to subscription page
    console.log('Navigate to subscription page');
  };

  // Subscription gate component
  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 overflow-hidden">
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-white">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Premium Feature</h1>
              <p className="text-purple-200 text-lg">
                See who's been checking out your profile with Premium insights
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="h-6 w-6 text-purple-300" />
                <span className="text-lg font-medium">Profile View Insights</span>
              </div>
              <p className="text-purple-200 text-sm mb-4">
                Discover who's interested in you and boost your connection chances
              </p>
              <div className="space-y-2 text-sm text-purple-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>See detailed viewing analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Track profile completion rates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Get compatibility insights</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-full text-lg transition-all duration-200 transform hover:scale-105"
            >
              <Crown className="h-5 w-5 mr-2" />
              Upgrade to Premium
            </Button>

            <p className="text-purple-300 text-sm mt-4">
              Unlock all premium features and boost your dating success
            </p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 overflow-hidden">
      <div className="px-4 pt-8 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Profile Views</h1>
              <p className="text-purple-200 text-sm">See who's been checking you out</p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
            {viewedProfiles.length} views
          </Badge>
        </div>

        {viewedProfiles.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {viewedProfiles.map((profile) => {
              const viewingPercentage = getViewingPercentage(profile.id);
              
              return (
                <Card 
                  key={profile.id} 
                  className="overflow-hidden bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
                  onClick={() => handleProfileClick(profile.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 ring-2 ring-white/30">
                          <AvatarImage src={profile.avatar} alt={profile.name} />
                          <AvatarFallback className="bg-purple-600 text-white">
                            {profile.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{profile.name}</span>
                            <span className="text-purple-200">{profile.age}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-purple-200 mt-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{profile.viewedAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${
                          profile.compatibilityScore > 90 
                            ? 'bg-green-500/20 text-green-300 border-green-400/30' 
                            : profile.compatibilityScore > 80 
                              ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                              : 'bg-orange-500/20 text-orange-300 border-orange-400/30'
                        } backdrop-blur-sm`}>
                          {profile.compatibilityScore}% match
                        </Badge>
                        
                        {viewingPercentage > 0 && (
                          <Badge className="text-xs bg-blue-500/20 text-blue-300 border-blue-400/30 backdrop-blur-sm">
                            {viewingPercentage}% viewed
                          </Badge>
                        )}
                        
                        {!profile.hasViewed && (
                          <Badge className="text-xs bg-pink-500/20 text-pink-300 border-pink-400/30 backdrop-blur-sm">
                            New
                          </Badge>
                        )}
                        <ArrowRight className="h-4 w-4 text-purple-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
              <Eye className="h-10 w-10 text-purple-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No profile views yet</h3>
            <p className="text-purple-200 max-w-sm">
              When someone views your profile, they'll appear here. Keep your profile active to get more views!
            </p>
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ViewedMe;
