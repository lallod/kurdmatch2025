import { useState, useEffect } from 'react';
import { Hash, TrendingUp, Users, Compass } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

interface CompactDiscoveryDropdownsProps {
  onHashtagFilter: (hashtag: string | null) => void;
  onGroupFilter: (groupId: string | null) => void;
  activeHashtag: string | null;
  activeGroup: string | null;
}

export const CompactDiscoveryDropdowns = ({ 
  onHashtagFilter, 
  onGroupFilter,
  activeHashtag,
  activeGroup 
}: CompactDiscoveryDropdownsProps) => {
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
      {/* Explore Hashtags Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 hover:text-purple-200 ${
              activeHashtag && explore.some(h => h.name === activeHashtag) ? 'ring-2 ring-purple-400' : ''
            }`}
          >
            <Hash className="w-4 h-4" />
            {activeHashtag && explore.some(h => h.name === activeHashtag) ? `#${activeHashtag}` : 'Explore'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-sm border-purple-400/30">
          <DropdownMenuLabel className="text-purple-400">Explore Hashtags</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {explore.length > 0 ? (
            <>
              <DropdownMenuItem
                onClick={() => onHashtagFilter(null)}
                className="cursor-pointer"
              >
                <span className="text-muted-foreground">All Posts</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {explore.map((hashtag) => (
                <DropdownMenuItem
                  key={hashtag.id}
                  onClick={() => onHashtagFilter(hashtag.name)}
                  className={`cursor-pointer ${activeHashtag === hashtag.name ? 'bg-purple-500/20' : ''}`}
                >
                  <Hash className="w-4 h-4 mr-2 text-purple-400" />
                  {hashtag.name}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {hashtag.usage_count}
                  </span>
                </DropdownMenuItem>
              ))}
            </>
          ) : (
            <DropdownMenuItem disabled>No data available</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Trending Hashtags Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 hover:text-purple-200 ${
              activeHashtag && trending.some(h => h.name === activeHashtag) ? 'ring-2 ring-purple-400' : ''
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            {activeHashtag && trending.some(h => h.name === activeHashtag) ? `#${activeHashtag}` : 'Trending'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-sm border-purple-400/30">
          <DropdownMenuLabel className="text-purple-400">Trending Hashtags</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {trending.length > 0 ? (
            <>
              <DropdownMenuItem
                onClick={() => onHashtagFilter(null)}
                className="cursor-pointer"
              >
                <span className="text-muted-foreground">All Posts</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {trending.map((hashtag) => (
                <DropdownMenuItem
                  key={hashtag.id}
                  onClick={() => onHashtagFilter(hashtag.name)}
                  className={`cursor-pointer ${activeHashtag === hashtag.name ? 'bg-purple-500/20' : ''}`}
                >
                  <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
                  {hashtag.name}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {hashtag.usage_count}
                  </span>
                </DropdownMenuItem>
              ))}
            </>
          ) : (
            <DropdownMenuItem disabled>No data available</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Groups Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 hover:text-purple-200 ${
              activeGroup ? 'ring-2 ring-purple-400' : ''
            }`}
          >
            <Users className="w-4 h-4" />
            {activeGroup && groups.find(g => g.id === activeGroup) 
              ? groups.find(g => g.id === activeGroup)?.name 
              : 'Groups'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-sm border-purple-400/30">
          <DropdownMenuLabel className="text-purple-400">Groups</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {groups.length > 0 ? (
            <>
              <DropdownMenuItem
                onClick={() => onGroupFilter(null)}
                className="cursor-pointer"
              >
                <span className="text-muted-foreground">All Posts</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {groups.map((group) => (
                <DropdownMenuItem
                  key={group.id}
                  onClick={() => onGroupFilter(group.id)}
                  className={`cursor-pointer ${activeGroup === group.id ? 'bg-purple-500/20' : ''}`}
                >
                  <Users className="w-4 h-4 mr-2 text-purple-400" />
                  {group.name}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {group.member_count} members
                  </span>
                </DropdownMenuItem>
              ))}
            </>
          ) : (
            <DropdownMenuItem disabled>No data available</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
