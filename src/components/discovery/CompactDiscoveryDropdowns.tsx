import { useState } from 'react';
import { Hash, TrendingUp, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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
  
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [groupsLoading, setGroupsLoading] = useState(false);
  
  const [trendingLoaded, setTrendingLoaded] = useState(false);
  const [exploreLoaded, setExploreLoaded] = useState(false);
  const [groupsLoaded, setGroupsLoaded] = useState(false);

  const loadTrending = async () => {
    if (trendingLoaded) return;
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

  const chipClass = (active: boolean) =>
    `text-[11px] font-medium px-3 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1 ${
      active
        ? 'bg-primary/20 text-primary border border-primary/30'
        : 'bg-card/50 text-muted-foreground border border-border/20'
    }`;

  return (
    <>
      {/* Explore */}
      <DropdownMenu onOpenChange={(open) => open && loadExplore()}>
        <DropdownMenuTrigger asChild>
          <button className={chipClass(!!activeHashtag && explore.some(h => h.name === activeHashtag))}>
            <Hash className="w-3 h-3" />
            {activeHashtag && explore.some(h => h.name === activeHashtag) ? `#${activeHashtag}` : 'Explore'}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-card border-border rounded-xl">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Explore</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {exploreLoading ? (
            <div className="p-3 text-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto" />
            </div>
          ) : explore.length > 0 ? (
            <>
              <DropdownMenuItem onClick={() => onHashtagFilter(null)} className="cursor-pointer text-xs">
                All Posts
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {explore.map((hashtag) => (
                <DropdownMenuItem
                  key={hashtag.id}
                  onClick={() => onHashtagFilter(hashtag.name)}
                  className={`cursor-pointer text-xs ${activeHashtag === hashtag.name ? 'bg-primary/10' : ''}`}
                >
                  <Hash className="w-3 h-3 mr-1.5 text-primary" />
                  {hashtag.name}
                  <span className="ml-auto text-[10px] text-muted-foreground">{hashtag.usage_count}</span>
                </DropdownMenuItem>
              ))}
            </>
          ) : (
            <DropdownMenuItem disabled className="text-xs">No data</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Trending */}
      <DropdownMenu onOpenChange={(open) => open && loadTrending()}>
        <DropdownMenuTrigger asChild>
          <button className={chipClass(!!activeHashtag && trending.some(h => h.name === activeHashtag))}>
            <TrendingUp className="w-3 h-3" />
            Trending
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-card border-border rounded-xl">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Trending</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {trendingLoading ? (
            <div className="p-3 text-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto" />
            </div>
          ) : trending.length > 0 ? (
            <>
              <DropdownMenuItem onClick={() => onHashtagFilter(null)} className="cursor-pointer text-xs">
                All Posts
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {trending.map((hashtag) => (
                <DropdownMenuItem
                  key={hashtag.id}
                  onClick={() => onHashtagFilter(hashtag.name)}
                  className={`cursor-pointer text-xs ${activeHashtag === hashtag.name ? 'bg-primary/10' : ''}`}
                >
                  <TrendingUp className="w-3 h-3 mr-1.5 text-primary" />
                  {hashtag.name}
                  <span className="ml-auto text-[10px] text-muted-foreground">{hashtag.usage_count}</span>
                </DropdownMenuItem>
              ))}
            </>
          ) : (
            <DropdownMenuItem disabled className="text-xs">No data</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Groups */}
      <DropdownMenu onOpenChange={(open) => open && loadGroups()}>
        <DropdownMenuTrigger asChild>
          <button className={chipClass(!!activeGroup)}>
            <Users className="w-3 h-3" />
            Groups
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-card border-border rounded-xl">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Groups</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {groupsLoading ? (
            <div className="p-3 text-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto" />
            </div>
          ) : groups.length > 0 ? (
            <>
              <DropdownMenuItem onClick={() => onGroupFilter(null)} className="cursor-pointer text-xs">
                All Posts
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {groups.map((group) => (
                <DropdownMenuItem
                  key={group.id}
                  onClick={() => onGroupFilter(group.id)}
                  className={`cursor-pointer text-xs ${activeGroup === group.id ? 'bg-primary/10' : ''}`}
                >
                  <Users className="w-3 h-3 mr-1.5 text-primary" />
                  {group.name}
                  <span className="ml-auto text-[10px] text-muted-foreground">{group.member_count}</span>
                </DropdownMenuItem>
              ))}
            </>
          ) : (
            <DropdownMenuItem disabled className="text-xs">No data</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
