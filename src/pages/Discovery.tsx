import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Users, X, Briefcase, Book, Heart, Languages, UtensilsCrossed, Search as SearchIcon, Hash, TrendingUp, Bell, Zap, Filter, Calendar, Sparkles } from 'lucide-react';
import SearchBar from '@/components/discovery/SearchBar';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { getStories, Story } from '@/api/posts';
import StoryBubbles from '@/components/discovery/StoryBubbles';
import StoryViewer from '@/components/stories/StoryViewer';
import CreateStoryModal from '@/components/stories/CreateStoryModal';
import { supabase } from '@/integrations/supabase/client';
import { useDiscoveryProfiles, DiscoveryProfile } from '@/hooks/useDiscoveryProfiles';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import BottomNavigation from '@/components/BottomNavigation';
import SwipeActions from '@/components/swipe/SwipeActions';
import { likeProfile } from '@/api/likes';
import { toast } from 'sonner';
import { SmartFilters } from '@/components/discovery/SmartFilters';
import NotificationBell from '@/components/notifications/NotificationBell';

const areas = [
  { value: "all", name: "All Regions" },
  { value: "us", name: "United States" },
  { value: "eu", name: "Europe" },
  { value: "South-Kurdistan", name: "South Kurdistan" },
  { value: "North-Kurdistan", name: "North Kurdistan" },
  { value: "East-Kurdistan", name: "East Kurdistan" },
  { value: "West-Kurdistan", name: "West Kurdistan" }
];

type DiscoveryTab = 'people' | 'events' | 'hashtags' | 'trending' | 'groups';

interface SmartFilterState {
  ageRange: [number, number];
  distance: number;
  verifiedOnly: boolean;
  videoVerifiedOnly: boolean;
  hasPhotos: boolean;
  relationshipGoals: string[];
  education: string[];
  occupation: string;
  region: string;
  recentlyActive: boolean;
  compatibilityMin: number;
}

const Discovery = () => {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState("all");
  const [activeFilters, setActiveFilters] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<DiscoveryProfile | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DiscoveryTab>('people');
  const [smartFilters, setSmartFilters] = useState<SmartFilterState>({
    ageRange: [18, 50],
    distance: 100,
    verifiedOnly: false,
    videoVerifiedOnly: false,
    hasPhotos: true,
    relationshipGoals: [],
    education: [],
    occupation: '',
    region: '',
    recentlyActive: false,
    compatibilityMin: 0,
  });

  const { profiles: dbProfiles, loading: profilesLoading } = useDiscoveryProfiles({
    limit: 50,
    filters: {
      area: selectedArea !== 'all' ? selectedArea : undefined,
      ageRange: smartFilters.ageRange,
    }
  });

  useEffect(() => {
    const loadStories = async () => {
      const storiesData = await getStories();
      setStories(storiesData);
    };
    loadStories();

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchUser();
  }, []);
  
  const handleSmartFiltersChange = (filters: SmartFilterState) => {
    setSmartFilters(filters);
    let count = 0;
    if (filters.ageRange[0] !== 18 || filters.ageRange[1] !== 50) count++;
    if (filters.distance !== 100) count++;
    if (filters.verifiedOnly) count++;
    if (filters.videoVerifiedOnly) count++;
    if (filters.relationshipGoals.length > 0) count++;
    if (filters.education.length > 0) count++;
    if (filters.occupation) count++;
    if (filters.region) count++;
    if (filters.recentlyActive) count++;
    if (filters.compatibilityMin > 0) count++;
    setActiveFilters(count);
    if (filters.region) setSelectedArea(filters.region);
  };

  const resetFilters = () => {
    setSmartFilters({
      ageRange: [18, 50],
      distance: 100,
      verifiedOnly: false,
      videoVerifiedOnly: false,
      hasPhotos: true,
      relationshipGoals: [],
      education: [],
      occupation: '',
      region: '',
      recentlyActive: false,
      compatibilityMin: 0,
    });
    setActiveFilters(0);
    setSelectedArea("all");
  };

  const filteredProfiles = dbProfiles.filter(profile => {
    const matchesOccupation = !smartFilters.occupation || 
      (profile.occupation && profile.occupation.toLowerCase().includes(smartFilters.occupation.toLowerCase()));
    const matchesVerified = !smartFilters.verifiedOnly || profile.verified;
    return matchesOccupation && matchesVerified;
  });

  const handleProfileClick = (profile: DiscoveryProfile) => {
    setSelectedProfile(profile);
  };

  const handleLike = async () => {
    if (!selectedProfile) return;
    try {
      const result = await likeProfile(selectedProfile.id.toString());
      if (result.success) {
        toast.success(result.match ? "It's a match! 🎉" : "Liked!");
        setSelectedProfile(null);
      } else {
        toast.error(result.error || "Failed to like profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handlePass = () => { toast.info("Passed"); setSelectedProfile(null); };
  const handleRewind = () => { toast.info("Rewind"); };
  const handleSuperLike = () => { if (!selectedProfile) return; toast.info("Super liked!"); setSelectedProfile(null); };
  const handleBoost = () => { toast.info("Boosted!"); };

  const handleStoryClick = (story: Story) => { setSelectedStory(story); };
  const handleAddStory = () => { setShowCreateStory(true); };
  const handleStoryCreated = async () => { const storiesData = await getStories(); setStories(storiesData); };

  const tabs: { key: DiscoveryTab; label: string; icon: React.ReactNode }[] = [
    { key: 'people', label: 'People', icon: <Users className="w-3.5 h-3.5" /> },
    { key: 'events', label: 'Events', icon: <Calendar className="w-3.5 h-3.5" /> },
    { key: 'hashtags', label: 'Tags', icon: <Hash className="w-3.5 h-3.5" /> },
    { key: 'trending', label: 'Trending', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { key: 'groups', label: 'Groups', icon: <Users className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Frosted glass header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/10">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Discover
          </h1>
          <div className="flex items-center gap-1">
            <NotificationBell />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/discovery')}
              className="text-foreground h-10 w-10 rounded-full hover:bg-muted/50"
            >
              <Sparkles className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Search Bar - compact */}
        <div className="px-4 pt-3 pb-1">
          <SearchBar />
        </div>

        {/* Stories Row */}
        <div className="px-3 pt-2 pb-2">
          <StoryBubbles
            stories={stories}
            onStoryClick={handleStoryClick}
            onAddStory={handleAddStory}
          />
        </div>

        {/* Tab Navigation - scrollable pills */}
        <div className="px-4 py-2">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  if (tab.key === 'hashtags') navigate('/discovery/hashtags');
                  if (tab.key === 'trending') navigate('/discovery/trending');
                  if (tab.key === 'groups') navigate('/discovery/groups');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-semibold rounded-full whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card/60 text-muted-foreground hover:bg-card'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* People Tab Content */}
        {activeTab === 'people' && (
          <>
            {/* Region filter + Smart filters */}
            <div className="px-4 pb-2 flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="h-8 text-[11px] bg-card/60 border-border/20 text-foreground rounded-full">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    {areas.map((area) => (
                      <SelectItem key={area.value} value={area.value} className="text-xs text-foreground">
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <SmartFilters 
                onFiltersChange={handleSmartFiltersChange}
                activeFilterCount={activeFilters}
              />
              {activeFilters > 0 && (
                <button 
                  onClick={resetFilters}
                  className="h-8 px-2.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-medium flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>

            {/* Results count */}
            <div className="px-4 pb-3">
              <span className="text-[11px] text-muted-foreground">{filteredProfiles.length} people nearby</span>
            </div>

            {/* Profile Cards */}
            <div className="px-4 space-y-3">
              {profilesLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl p-4 animate-pulse shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-2/3" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredProfiles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Filter className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">No matches found</h3>
                  <p className="text-xs text-muted-foreground mb-4">Try adjusting your filters</p>
                  <Button onClick={resetFilters} size="sm" className="rounded-full h-9 text-xs">
                    Reset Filters
                  </Button>
                </div>
              ) : (
                filteredProfiles.map((profile) => (
                  <button
                    key={profile.id}
                    className="w-full bg-card rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] text-left"
                    onClick={() => handleProfileClick(profile)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-14 h-14 ring-2 ring-primary/20">
                        <AvatarImage src={profile.profile_image} alt={profile.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">{profile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-foreground">{profile.name}</span>
                          <span className="text-xs text-muted-foreground">{profile.age}</span>
                          {profile.verified && (
                            <span className="text-primary text-xs">✓</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{profile.location}</span>
                        </div>
                        {profile.occupation && profile.occupation !== 'Not specified' && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <Briefcase className="w-3 h-3" />
                            <span className="truncate">{profile.occupation}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags row */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {profile.kurdistan_region && (
                        <Badge variant="outline" className="text-[9px] px-2 py-0.5 rounded-full border-primary/20 text-primary bg-primary/5">
                          {profile.kurdistan_region}
                        </Badge>
                      )}
                      {profile.religion && (
                        <Badge variant="secondary" className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {profile.religion}
                        </Badge>
                      )}
                      {profile.languages && profile.languages.length > 0 && (
                        <Badge variant="secondary" className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {profile.languages[0]}{profile.languages.length > 1 ? ` +${profile.languages.length - 1}` : ''}
                        </Badge>
                      )}
                      {profile.interests && profile.interests.slice(0, 2).map((interest, i) => (
                        <Badge key={i} variant="secondary" className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </button>
                ))
              )}
            </div>
          </>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="px-4 pt-2">
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Upcoming Events</h3>
              <p className="text-xs text-muted-foreground mb-4">Discover events near you</p>
              <Button onClick={() => navigate('/create-event')} size="sm" className="rounded-full h-9 text-xs">
                Create Event
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
          <div className="bg-card rounded-t-3xl sm:rounded-3xl max-w-sm w-full max-h-[85vh] overflow-hidden shadow-2xl">
            <div className="aspect-[3/4] relative overflow-hidden">
              <img
                src={selectedProfile.profile_image}
                alt={selectedProfile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <h1 className="text-xl font-bold text-white">{selectedProfile.name}</h1>
                  <span className="text-lg text-white/80">{selectedProfile.age}</span>
                  {selectedProfile.verified && <span className="text-primary text-lg">✓</span>}
                </div>
                <div className="flex items-center gap-1.5 text-white/80 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedProfile.location}</span>
                </div>
                {selectedProfile.occupation && selectedProfile.occupation !== 'Not specified' && (
                  <Badge className="mt-2 bg-primary/80 text-primary-foreground text-xs">
                    {selectedProfile.occupation}
                  </Badge>
                )}
              </div>
            </div>
            
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center active:scale-95 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="p-4">
              <SwipeActions
                onRewind={handleRewind}
                onPass={handlePass}
                onLike={handleLike}
                onSuperLike={handleSuperLike}
                onBoost={handleBoost}
              />
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer */}
      {selectedStory && (
        <StoryViewer
          open={!!selectedStory}
          onOpenChange={(open) => !open && setSelectedStory(null)}
          stories={stories}
          initialIndex={stories.findIndex(s => s.id === selectedStory.id)}
        />
      )}

      {currentUserId && (
        <CreateStoryModal
          open={showCreateStory}
          onOpenChange={setShowCreateStory}
          onStoryCreated={handleStoryCreated}
          userId={currentUserId}
        />
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default Discovery;
