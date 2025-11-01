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
  
  // Separate loading states for each dropdown
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [groupsLoading, setGroupsLoading] = useState(false);
  
  // Track if data has been loaded
  const [trendingLoaded, setTrendingLoaded] = useState(false);
  const [exploreLoaded, setExploreLoaded] = useState(false);
  const [groupsLoaded, setGroupsLoaded] = useState(false);

  const loadTrending = async () => {
    if (trendingLoaded) return; // Don't reload if already loaded
    
    setTrendingLoading(true);
    try {
      const data = await getTrendingHashtags(5);
      setTrending(data);
      setTrendingLoaded(true);
    } catch (error) {
      console.error('Error loading trending hashtags:', error);
    } finally {
      setTrendingLoading(false);
    }
  };

  const loadExplore = async () => {
    if (exploreLoaded) return;
    
    setExploreLoading(true);
    try {
      const { data } = await supabase
        .from('hashtags')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      setExplore(data || []);
      setExploreLoaded(true);
    } catch (error) {
      console.error('Error loading explore hashtags:', error);
    } finally {
      setExploreLoading(false);
    }
  };

  const loadGroups = async () => {
    if (groupsLoaded) return;
    
    setGroupsLoading(true);
    try {
      const data = await getGroups({});
      setGroups((data || []).slice(0, 3));
      setGroupsLoaded(true);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setGroupsLoading(false);
    }
  };

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
          {exploreLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto"></div>
            </div>
          ) : explore.length > 0 ? (
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
      <DropdownMenu onOpenChange={(open) => open && loadTrending()}>
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
          {trendingLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto"></div>
            </div>
          ) : trending.length > 0 ? (
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
      <DropdownMenu onOpenChange={(open) => open && loadGroups()}>
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
          {groupsLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mx-auto"></div>
            </div>
          ) : groups.length > 0 ? (
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
