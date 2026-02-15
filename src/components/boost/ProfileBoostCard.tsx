import { useState, useEffect } from 'react';
import { Zap, Clock, TrendingUp, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface BoostStats {
  viewsIncrease: number;
  likesIncrease: number;
  matchesIncrease: number;
}

interface ProfileBoostCardProps {
  onClose?: () => void;
}

export const ProfileBoostCard = ({ onClose }: ProfileBoostCardProps) => {
  const { user } = useSupabaseAuth();
  const [isBoostActive, setIsBoostActive] = useState(false);
  const [boostTimeRemaining, setBoostTimeRemaining] = useState(0);
  const [boostStats, setBoostStats] = useState<BoostStats | null>(null);
  const [dailyBoostsUsed, setDailyBoostsUsed] = useState(0);
  const [maxDailyBoosts, setMaxDailyBoosts] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkBoostStatus();
      checkDailyUsage();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBoostActive && boostTimeRemaining > 0) {
      interval = setInterval(() => {
        setBoostTimeRemaining(prev => {
          if (prev <= 1) {
            setIsBoostActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBoostActive, boostTimeRemaining]);

  const checkBoostStatus = async () => {
    // Check if there's an active boost (within last 30 minutes)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    
    const { data } = await supabase
      .from('daily_usage')
      .select('updated_at, boosts_count')
      .eq('user_id', user?.id)
      .gte('updated_at', thirtyMinutesAgo)
      .single();

    if (data && data.boosts_count > 0) {
      const boostEndTime = new Date(data.updated_at).getTime() + 30 * 60 * 1000;
      const remaining = Math.max(0, Math.floor((boostEndTime - Date.now()) / 1000));
      
      if (remaining > 0) {
        setIsBoostActive(true);
        setBoostTimeRemaining(remaining);
        // Fetch real stats since boost started
        await fetchBoostStats(data.updated_at);
      }
    }
  };

  const fetchBoostStats = async (boostStartTime: string) => {
    if (!user) return;
    
    try {
      // Get profile views since boost started  
      const { count: viewsCount } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('viewed_profile_id', user.id)
        .gte('viewed_at', boostStartTime);

      // Get likes since boost started
      const { count: likesCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('likee_id', user.id)
        .gte('created_at', boostStartTime);

      // Get matches since boost started
      const { count: matchesCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .gte('matched_at', boostStartTime);

      setBoostStats({
        viewsIncrease: viewsCount || 0,
        likesIncrease: likesCount || 0,
        matchesIncrease: matchesCount || 0,
      });
    } catch (error) {
      console.error('Error fetching boost stats:', error);
      setBoostStats({ viewsIncrease: 0, likesIncrease: 0, matchesIncrease: 0 });
    }
  };

  const checkDailyUsage = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    const { data } = await supabase
      .from('daily_usage')
      .select('boosts_count')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (data) {
      setDailyBoostsUsed(data.boosts_count);
    }

    // Check if premium user
    const { data: profile } = await supabase
      .from('profiles')
      .select('verified')
      .eq('id', user.id)
      .single();

    // Premium users get 3 boosts, free users get 1
    setMaxDailyBoosts(profile?.verified ? 3 : 1);
  };

  const activateBoost = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Check daily limit
      const { data: canPerform, error } = await supabase.rpc('can_perform_action', {
        user_uuid: user.id,
        action_type: 'boost'
      });

      if (error || !canPerform) {
        toast.error('You have used all your boosts for today');
        return;
      }

      // Increment boost count directly
      const today = new Date().toISOString().split('T')[0];
      await supabase
        .from('daily_usage')
        .upsert({
          user_id: user.id,
          date: today,
          boosts_count: dailyBoostsUsed + 1,
        }, {
          onConflict: 'user_id,date'
        });

      // Activate boost
      setIsBoostActive(true);
      setBoostTimeRemaining(30 * 60); // 30 minutes
      setDailyBoostsUsed(prev => prev + 1);
      
      // Initialize stats
      setBoostStats({
        viewsIncrease: 0,
        likesIncrease: 0,
        matchesIncrease: 0,
      });

      toast.success('Profile Boost activated! 🚀', {
        description: 'Your profile will be shown to more people for 30 minutes',
      });

      // Refresh real stats periodically
      const boostStart = new Date().toISOString();
      const statsInterval = setInterval(() => {
        fetchBoostStats(boostStart);
      }, 15000);

      setTimeout(() => clearInterval(statsInterval), 30 * 60 * 1000);

    } catch (error) {
      console.error('Boost error:', error);
      toast.error('Failed to activate boost');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const boostProgress = (boostTimeRemaining / (30 * 60)) * 100;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10">
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Profile Boost
          {isBoostActive && (
            <Badge variant="secondary" className="ml-auto bg-yellow-500/20 text-yellow-600">
              <Sparkles className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {isBoostActive ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Time remaining</span>
              </div>
              <span className="font-mono text-lg font-bold text-primary">
                {formatTime(boostTimeRemaining)}
              </span>
            </div>
            
            <Progress value={boostProgress} className="h-2" />

            {boostStats && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{boostStats.viewsIncrease}</p>
                  <p className="text-xs text-muted-foreground">Extra Views</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Zap className="h-5 w-5 text-pink-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{boostStats.likesIncrease}</p>
                  <p className="text-xs text-muted-foreground">New Likes</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Sparkles className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold">{boostStats.matchesIncrease}</p>
                  <p className="text-xs text-muted-foreground">Matches</p>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Boost your profile to get up to <span className="font-bold text-foreground">10x more views</span> for 30 minutes!
            </p>
            
            <div className="flex items-center justify-between text-sm">
              <span>Daily boosts used</span>
              <span className="font-medium">{dailyBoostsUsed} / {maxDailyBoosts}</span>
            </div>
            
            <Progress value={(dailyBoostsUsed / maxDailyBoosts) * 100} className="h-2" />

            {dailyBoostsUsed >= maxDailyBoosts ? (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Crown className="h-5 w-5 text-yellow-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Get more boosts</p>
                  <p className="text-xs text-muted-foreground">
                    Upgrade to Premium for 3 daily boosts
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Upgrade
                </Button>
              </div>
            ) : (
              <Button 
                onClick={activateBoost} 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isLoading ? 'Activating...' : 'Boost My Profile'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
