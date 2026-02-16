import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectionViewStats from '@/components/profile/SectionViewStats';

import PremiumPlansDialog from '@/components/subscription/PremiumPlansDialog';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useCompatibility } from '@/hooks/useCompatibility';
import { useTranslations } from '@/hooks/useTranslations';

const ViewedMe = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { getCompatibilityForProfiles } = useCompatibility();
  const { t } = useTranslations();
  const [viewedProfiles, setViewedProfiles] = useState([]);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const loadViewedProfiles = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
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
        
        const viewerIds = profileViews.map(v => v.viewer_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, age, profile_image, location, verified')
          .in('id', viewerIds);
          
        if (profilesError) throw profilesError;
        
        const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
        const compatibilityScores = await getCompatibilityForProfiles(viewerIds);
        
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
            hasViewed: false,
            compatibilityScore: compatibilityScores.get(profile.id) || 50
          };
        }).filter(Boolean);
        
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
    setShowPremiumDialog(false);
    setIsSubscribed(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-foreground text-xl">{t('profile.loading_views', 'Loading profile views...')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-10 bg-background border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 h-11 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/15 rounded-full flex items-center justify-center">
            <Eye className="h-4 w-4 text-primary" />
          </div>
          <h1 className="text-base font-semibold text-foreground">{t('viewed_me.title', 'Profile Views')}</h1>
          <Badge className="ml-auto bg-muted text-muted-foreground border-border text-xs">
            {viewedProfiles.length}
          </Badge>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-4 pb-24">

        {viewedProfiles.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {viewedProfiles.map((profile) => (
              <Card 
                key={profile.id} 
                className="overflow-hidden hover:bg-card/80 transition-all duration-200 cursor-pointer"
                onClick={() => handleProfileClick(profile.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-border">
                        <AvatarImage src={profile.profile_image} alt={profile.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {profile.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{profile.name}</span>
                          <span className="text-muted-foreground">{profile.age}</span>
                          {profile.verified && (
                            <Badge className="bg-info/20 text-info border-info/30 text-xs">✓</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{profile.viewedAt}</span>
                        </div>
                        {profile.location && (
                          <p className="text-muted-foreground text-sm">{profile.location}</p>
                        )}
                        <div className="mt-1">
                          <SectionViewStats 
                            viewerId={profile.id} 
                            viewedProfileId={user!.id} 
                            compact 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`text-white ${
                        profile.compatibilityScore > 90 
                          ? 'bg-success border-success/30' 
                          : profile.compatibilityScore > 80 
                            ? 'bg-primary border-primary/30'
                            : 'bg-warning border-warning/30'
                      }`}>
                        {profile.compatibilityScore}% match
                      </Badge>
                      
                      {!profile.hasViewed && (
                        <Badge className="text-xs bg-primary text-white border-primary/30">New</Badge>
                      )}
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Eye className="h-10 w-10 text-muted-foreground" />
            </div>
             <h3 className="text-xl font-semibold text-foreground mb-2">{t('viewed_me.no_views', 'No profile views yet')}</h3>
             <p className="text-muted-foreground max-w-sm">
               {t('viewed_me.no_views_desc', "When someone views your profile, they'll appear here. Keep your profile active to get more views!")}
             </p>
          </div>
        )}
      </div>
      
      <PremiumPlansDialog
        open={showPremiumDialog}
        onOpenChange={setShowPremiumDialog}
        onSelectPlan={handleSelectPlan}
      />
      
      
    </div>
  );
};

export default ViewedMe;
