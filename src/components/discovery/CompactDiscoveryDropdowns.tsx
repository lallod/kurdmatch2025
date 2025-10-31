import { useState, useEffect } from 'react';
import { Hash, TrendingUp, Users, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { getTrendingHashtags } from '@/api/hashtags';
import { getGroups } from '@/api/groups';
import { supabase } from '@/integrations/supabase/client';
import type { Group } from '@/api/groups';

interface Hashtag {
  id: string;
  name: string;
  usage_count: number;
}

export const CompactDiscoveryDropdowns = () => {
  const navigate = useNavigate();
  const [trending, setTrending] = useState<Hashtag[]>([]);
  const [explore, setExplore] = useState<Hashtag[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // Load all data in parallel for faster loading
      const [trendingData, exploreData, groupsData] = await Promise.all([
        getTrendingHashtags(5),
        supabase
          .from('hashtags')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        getGroups({})
      ]);

      setTrending(trendingData);
      setExplore(exploreData.data || []);
      setGroups((groupsData || []).slice(0, 3));
    } catch (error) {
      console.error('Error loading discovery data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-2 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-24 bg-white/10 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* Trending Hashtags Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 hover:bg-purple-500/30 text-white"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Trending</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-sm border-border">
          {trending.length === 0 ? (
            <DropdownMenuItem disabled>No trending hashtags</DropdownMenuItem>
          ) : (
            <>
              {trending.map((hashtag) => (
                <DropdownMenuItem
                  key={hashtag.id}
                  onClick={() => navigate(`/hashtag/${hashtag.name}`)}
                  className="cursor-pointer"
                >
                  <Hash className="w-3 h-3 mr-2 text-purple-400" />
                  <span className="text-sm">{hashtag.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {hashtag.usage_count}
                  </span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => navigate('/hashtags')}
                className="cursor-pointer border-t border-border mt-1"
              >
                <span className="text-xs text-purple-400 font-medium">View All →</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Explore Hashtags Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-400/30 hover:bg-blue-500/30 text-white"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Explore</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-sm border-border">
          {explore.length === 0 ? (
            <DropdownMenuItem disabled>No hashtags to explore</DropdownMenuItem>
          ) : (
            <>
              {explore.map((hashtag) => (
                <DropdownMenuItem
                  key={hashtag.id}
                  onClick={() => navigate(`/hashtag/${hashtag.name}`)}
                  className="cursor-pointer"
                >
                  <Hash className="w-3 h-3 mr-2 text-blue-400" />
                  <span className="text-sm">{hashtag.name}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => navigate('/hashtags')}
                className="cursor-pointer border-t border-border mt-1"
              >
                <span className="text-xs text-blue-400 font-medium">View All →</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Groups Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-400/30 hover:bg-emerald-500/30 text-white"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Groups</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-sm border-border">
          {groups.length === 0 ? (
            <DropdownMenuItem disabled>No groups available</DropdownMenuItem>
          ) : (
            <>
              {groups.map((group) => (
                <DropdownMenuItem
                  key={group.id}
                  onClick={() => navigate(`/groups/${group.id}`)}
                  className="cursor-pointer"
                >
                  {group.icon && (
                    <span className="mr-2 text-base">{group.icon}</span>
                  )}
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium">{group.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {group.member_count}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => navigate('/groups')}
                className="cursor-pointer border-t border-border mt-1"
              >
                <span className="text-xs text-emerald-400 font-medium">View All →</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
