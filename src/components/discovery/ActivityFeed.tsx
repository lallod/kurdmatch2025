import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, Eye, Sparkles, Users, Clock, ChevronRight, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: 'like' | 'view' | 'match' | 'superlike';
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: Date;
  message: string;
}

interface ActivityFeedProps {
  className?: string;
  maxItems?: number;
  compact?: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  className, 
  maxItems = 10,
  compact = false 
}) => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        
        // Fetch recent likes received
        const { data: likesData } = await supabase
          .from('likes')
          .select(`
            id,
            created_at,
            liker_id
          `)
          .eq('likee_id', user.id)
          .order('created_at', { ascending: false })
          .limit(maxItems);

        // Fetch recent matches
        const { data: matchesData } = await supabase
          .from('matches')
          .select(`
            id,
            matched_at,
            user1_id,
            user2_id
          `)
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .order('matched_at', { ascending: false })
          .limit(maxItems);

        const activityItems: ActivityItem[] = [];

        // Process likes - fetch profiles separately
        if (likesData) {
          const likerIds = likesData.map(l => l.liker_id).filter(Boolean);
          
          if (likerIds.length > 0) {
            const { data: profilesData } = await supabase
              .from('profiles')
              .select('id, name, profile_image')
              .in('id', likerIds as string[]);

            const profilesMap = new Map<string, { id: string; name: string | null; profile_image: string | null }>(
              (profilesData || []).map((p: any) => [p.id, p])
            );

            for (const like of likesData) {
              const profile = profilesMap.get(like.liker_id as string);
              if (profile) {
                activityItems.push({
                  id: `like-${like.id}`,
                  type: 'like',
                  userId: profile.id,
                  userName: profile.name || 'Noen',
                  userAvatar: profile.profile_image || '',
                  timestamp: new Date(like.created_at || Date.now()),
                  message: 'likte profilen din',
                });
              }
            }
          }
        }

        // Process matches
        if (matchesData) {
          for (const match of matchesData) {
            const partnerId = match.user1_id === user.id ? match.user2_id : match.user1_id;
            
            const { data: partnerProfile } = await supabase
              .from('profiles')
              .select('id, name, profile_image')
              .eq('id', partnerId as string)
              .single();

            if (partnerProfile) {
              activityItems.push({
                id: `match-${match.id}`,
                type: 'match',
                userId: partnerProfile.id,
                userName: partnerProfile.name || 'Noen',
                userAvatar: partnerProfile.profile_image || '',
                timestamp: new Date(match.matched_at || Date.now()),
                message: 'matchet med deg!',
              });
            }
          }
        }

        // Sort by timestamp
        activityItems.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        setActivities(activityItems.slice(0, maxItems));
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();

    // Subscribe to realtime updates
    const likesChannel = supabase
      .channel('activity-likes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'likes',
          filter: `likee_id=eq.${user.id}`,
        },
        () => {
          fetchActivities();
        }
      )
      .subscribe();

    const matchesChannel = supabase
      .channel('activity-matches')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
        },
        (payload) => {
          const match = payload.new as { user1_id: string; user2_id: string };
          if (match.user1_id === user.id || match.user2_id === user.id) {
            fetchActivities();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(likesChannel);
      supabase.removeChannel(matchesChannel);
    };
  }, [user?.id, maxItems]);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />;
      case 'superlike':
        return <Sparkles className="w-4 h-4 text-blue-500" />;
      case 'match':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'view':
        return <Eye className="w-4 h-4 text-purple-500" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'like':
        return 'bg-pink-500/10 border-pink-500/20';
      case 'superlike':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'match':
        return 'bg-green-500/10 border-green-500/20';
      case 'view':
        return 'bg-purple-500/10 border-purple-500/20';
      default:
        return 'bg-muted/50';
    }
  };

  const handleActivityClick = (activity: ActivityItem) => {
    if (activity.type === 'match') {
      navigate(`/messages?user=${activity.userId}`);
    } else {
      navigate(`/profile/${activity.userId}`);
    }
  };

  if (isLoading) {
    return (
      <Card className={cn('bg-card/50 backdrop-blur border-border/50', className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return null;
  }

  if (compact && !isExpanded) {
    const latestActivity = activities[0];
    return (
      <Card 
        className={cn(
          'bg-card/50 backdrop-blur border-border/50 cursor-pointer hover:bg-card/70 transition-colors',
          className
        )}
        onClick={() => setIsExpanded(true)}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={latestActivity.userAvatar} />
                  <AvatarFallback>{latestActivity.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-background">
                  {getActivityIcon(latestActivity.type)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  <span className="font-semibold">{latestActivity.userName}</span>{' '}
                  {latestActivity.message}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(latestActivity.timestamp, { 
                    addSuffix: true, 
                    locale: nb 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activities.length > 1 && (
                <Badge variant="secondary" className="text-xs">
                  +{activities.length - 1}
                </Badge>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('bg-card/50 backdrop-blur border-border/50', className)}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Aktivitet
        </CardTitle>
        {compact && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsExpanded(false)}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 pr-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:scale-[1.02]',
                  getActivityColor(activity.type)
                )}
                onClick={() => handleActivityClick(activity)}
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={activity.userAvatar} />
                    <AvatarFallback>{activity.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-background">
                    {getActivityIcon(activity.type)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    <span className="font-semibold">{activity.userName}</span>{' '}
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(activity.timestamp, { 
                      addSuffix: true, 
                      locale: nb 
                    })}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
