import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Clock, ArrowRight, Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import BottomNavigation from '@/components/BottomNavigation';
import PremiumPlansDialog from '@/components/subscription/PremiumPlansDialog';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const ViewedMe = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [viewedProfiles, setViewedProfiles] = useState([]);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // For now, we'll mock the premium status since we don't have a subscription system
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const loadViewedProfiles = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch profile views
        const { data: profileViews, error: viewsError } = await supabase
          .from('profile_views')
          .select('id, viewer_id, viewed_at')
          .eq('viewed_profile_id', user.id)
          .order('viewed_at', { ascending: false })
          .limit(50);
          
        if (viewsError) throw viewsError;
        
        if (!profileViews || profileViews.length === 0) {
          setViewedProfiles([]);
          return;
        }
        
        // Fetch viewer profiles separately
        const viewerIds = profileViews.map(v => v.viewer_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, age, profile_image, location, verified')
          .in('id', viewerIds);
          
        if (profilesError) throw profilesError;
        
        // Create a map for quick lookup
        const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
        
        // Transform data and calculate time ago
        const transformedProfiles = profileViews.map((view: any) => {
          const profile = profilesMap.get(view.viewer_id);
          if (!profile) return null;
          const viewedAt = new Date(view.viewed_at);
          const now = new Date();
          const diffMs = now.getTime() - viewedAt.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);
          
          let timeAgo;
          if (diffMins < 60) {
            timeAgo = diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`;
          } else if (diffHours < 24) {
            timeAgo = diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
          } else if (diffDays === 1) {
            timeAgo = 'Yesterday';
          } else {
            timeAgo = `${diffDays} days ago`;
          }
          
          return {
            id: profile.id,
            name: profile.name,
            age: profile.age,
            profile_image: profile.profile_image,
            location: profile.location,
            verified: profile.verified,
            viewedAt: timeAgo,
            hasViewed: false, // Could be enhanced with mutual view checking
            compatibilityScore: Math.floor(Math.random() * 30) + 70 // Placeholder for compatibility algorithm
          };
        }).filter(Boolean); // Remove any null entries
        
        setViewedProfiles(transformedProfiles);
      } catch (error) {
        console.error('Failed to load viewed profiles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadViewedProfiles();
  }, [user]);

  const handleProfileClick = (profileId: string) => {
    navigate(`/profile/${profileId}`);
  };

  const handleUpgrade = () => {
    setShowPremiumDialog(true);
  };

  const handleSelectPlan = (planId: string) => {
    console.log('Selected plan:', planId);
    setShowPremiumDialog(false);
    // In a real app, this would integrate with Stripe
    // For demo purposes, we'll set the user as subscribed
    setIsSubscribed(true);
  };

  // Premium feature now available to all users (will be restricted later)
  // if (!isSubscribed) {
  //   return premium gate component...
  // }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading profile views...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-8 pb-24">
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
            {viewedProfiles.map((profile) => (
              <Card 
                key={profile.id} 
                className="overflow-hidden bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
                onClick={() => handleProfileClick(profile.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-white/30">
                        <AvatarImage src={profile.profile_image} alt={profile.name} />
                        <AvatarFallback className="bg-purple-600 text-white">
                          {profile.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{profile.name}</span>
                          <span className="text-purple-200">{profile.age}</span>
                          {profile.verified && (
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-purple-200 mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{profile.viewedAt}</span>
                        </div>
                        {profile.location && (
                          <p className="text-purple-300 text-sm">{profile.location}</p>
                        )}
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
            ))}
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
      
      <PremiumPlansDialog
        open={showPremiumDialog}
        onOpenChange={setShowPremiumDialog}
        onSelectPlan={handleSelectPlan}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default ViewedMe;