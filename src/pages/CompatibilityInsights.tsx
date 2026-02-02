import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Sparkles, MessageCircle, Target, Users, Star, Lightbulb, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MatchScoreCard } from '@/components/compatibility/MatchScoreCard';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import BottomNavigation from '@/components/BottomNavigation';
import { cn } from '@/lib/utils';

interface ProfileData {
  id: string;
  name: string;
  profile_image: string;
  bio: string;
  interests: string[];
  occupation: string;
  location: string;
}

interface AITip {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const CompatibilityInsights = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  
  const [targetProfile, setTargetProfile] = useState<ProfileData | null>(null);
  const [myProfile, setMyProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiTips, setAiTips] = useState<AITip[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!userId || !user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch both profiles in parallel
        const [targetResult, myResult] = await Promise.all([
          supabase
            .from('profiles')
            .select('id, name, profile_image, bio, interests, occupation, location')
            .eq('id', userId)
            .single(),
          supabase
            .from('profiles')
            .select('id, name, profile_image, bio, interests, occupation, location')
            .eq('id', user.id)
            .single()
        ]);

        if (targetResult.data) {
          setTargetProfile(targetResult.data as unknown as ProfileData);
        }
        if (myResult.data) {
          setMyProfile(myResult.data as unknown as ProfileData);
        }

        // Generate AI tips based on profiles
        generateAiTips(targetResult.data as unknown as ProfileData, myResult.data as unknown as ProfileData);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, [userId, user?.id]);

  const generateAiTips = (target: ProfileData | null, me: ProfileData | null) => {
    const tips: AITip[] = [];

    if (target && me) {
      // Find common interests
      const targetInterests = target.interests || [];
      const myInterests = me.interests || [];
      const commonInterests = targetInterests.filter(i => myInterests.includes(i));

      if (commonInterests.length > 0) {
        tips.push({
          title: 'Felles interesser',
          description: `Dere deler interesse for ${commonInterests.slice(0, 3).join(', ')}. Bruk dette som samtalestarter!`,
          icon: <Heart className="w-5 h-5 text-pink-500" />
        });
      }

      if (target.occupation) {
        tips.push({
          title: 'Karriereprat',
          description: `${target.name} jobber som ${target.occupation}. Spør om deres arbeidshverdag!`,
          icon: <Target className="w-5 h-5 text-blue-500" />
        });
      }

      if (target.location) {
        tips.push({
          title: 'Lokalkunnskap',
          description: `De bor i ${target.location}. Spør om deres favorittsted der!`,
          icon: <Sparkles className="w-5 h-5 text-purple-500" />
        });
      }

      tips.push({
        title: 'Dypere samtaler',
        description: 'Still åpne spørsmål som "Hva drømmer du om?" for å bygge ekte forbindelse.',
        icon: <Lightbulb className="w-5 h-5 text-yellow-500" />
      });
    }

    setAiTips(tips);
  };

  const getSharedInterests = () => {
    if (!targetProfile?.interests || !myProfile?.interests) return [];
    return targetProfile.interests.filter(i => myProfile.interests?.includes(i));
  };

  const getUniqueInterests = (profile: ProfileData | null, other: ProfileData | null) => {
    if (!profile?.interests || !other?.interests) return profile?.interests || [];
    return profile.interests.filter(i => !other.interests?.includes(i));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
        <div className="animate-pulse text-white">Laster kompatibilitetsdata...</div>
      </div>
    );
  }

  if (!targetProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Kunne ikke finne profil</p>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4 text-white">
            Gå tilbake
          </Button>
        </div>
      </div>
    );
  }

  const sharedInterests = getSharedInterests();
  const myUniqueInterests = getUniqueInterests(myProfile, targetProfile);
  const theirUniqueInterests = getUniqueInterests(targetProfile, myProfile);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="w-10 h-10 border-2 border-purple-400/50">
              <AvatarImage src={targetProfile.profile_image} />
              <AvatarFallback>{targetProfile.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold text-white">
                Kompatibilitet med {targetProfile.name}
              </h1>
              <p className="text-xs text-purple-200">AI-drevet analyse</p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="p-4 space-y-6">
          {/* Match Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MatchScoreCard targetUserId={userId!} />
          </motion.div>

          {/* Interest Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-primary" />
                  Interessesammenligning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Shared Interests */}
                {sharedInterests.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-green-400 mb-2 flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      Delt ({sharedInterests.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sharedInterests.map((interest, idx) => (
                        <Badge 
                          key={idx} 
                          className="bg-green-500/20 text-green-300 border-green-500/30"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="bg-border/30" />

                {/* Side by Side Comparison */}
                <div className="grid grid-cols-2 gap-4">
                  {/* My Interests */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Dine interesser
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {myUniqueInterests.slice(0, 5).map((interest, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary"
                          className="text-xs"
                        >
                          {interest}
                        </Badge>
                      ))}
                      {myUniqueInterests.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{myUniqueInterests.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Their Interests */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {targetProfile.name}s interesser
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {theirUniqueInterests.slice(0, 5).map((interest, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary"
                          className="text-xs"
                        >
                          {interest}
                        </Badge>
                      ))}
                      {theirUniqueInterests.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{theirUniqueInterests.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Connection Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI-tips for bedre forbindelse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiTips.map((tip, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex gap-3 p-3 rounded-lg bg-muted/30 border border-border/30"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {tip.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tip.title}</p>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3"
          >
            <Button 
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              onClick={() => navigate(`/messages?user=${userId}`)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Send melding
            </Button>
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => navigate(`/profile/${userId}`)}
            >
              Se full profil
            </Button>
          </motion.div>
        </div>
      </ScrollArea>

      <BottomNavigation />
    </div>
  );
};

export default CompatibilityInsights;
