import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Users, X, Briefcase, Heart, Hash, TrendingUp, Filter, Calendar, Sparkles, ChevronRight, Flame } from 'lucide-react';
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
    setSmartFilters({ ageRange: [18, 50], distance: 100, verifiedOnly: false, videoVerifiedOnly: false, hasPhotos: true, relationshipGoals: [], education: [], occupation: '', region: '', recentlyActive: false, compatibilityMin: 0 });
    setActiveFilters(0);
    setSelectedArea("all");
  };

  const filteredProfiles = dbProfiles.filter(profile => {
    const matchesOccupation = !smartFilters.occupation || (profile.occupation && profile.occupation.toLowerCase().includes(smartFilters.occupation.toLowerCase()));
    const matchesVerified = !smartFilters.verifiedOnly || profile.verified;
    return matchesOccupation && matchesVerified;
  });

  const handleProfileClick = (profile: DiscoveryProfile) => setSelectedProfile(profile);
  const handleLike = async () => {
    if (!selectedProfile) return;
    try {
      const result = await likeProfile(selectedProfile.id.toString());
      if (result.success) { toast.success(result.match ? "It's a match! 🎉" : "Liked!"); setSelectedProfile(null); }
      else toast.error(result.error || "Failed to like profile");
    } catch { toast.error("Something went wrong"); }
  };
  const handlePass = () => { toast.info("Passed"); setSelectedProfile(null); };
  const handleRewind = () => toast.info("Rewind");
  const handleSuperLike = () => { if (!selectedProfile) return; toast.info("Super liked!"); setSelectedProfile(null); };
  const handleBoost = () => toast.info("Boosted!");
  const handleStoryClick = (story: Story) => setSelectedStory(story);
  const handleAddStory = () => setShowCreateStory(true);
  const handleStoryCreated = async () => { const s = await getStories(); setStories(s); };

  const tabs: { key: DiscoveryTab; label: string; icon: React.ReactNode }[] = [
    { key: 'people', label: 'People', icon: <Heart className="w-3.5 h-3.5" /> },
    { key: 'events', label: 'Events', icon: <Calendar className="w-3.5 h-3.5" /> },
    { key: 'hashtags', label: 'Tags', icon: <Hash className="w-3.5 h-3.5" /> },
    { key: 'trending', label: 'Hot', icon: <Flame className="w-3.5 h-3.5" /> },
    { key: 'groups', label: 'Groups', icon: <Users className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Discover
            </h1>
          </div>
          <div className="flex items-center gap-0.5">
            <NotificationBell />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Search */}
        <div className="px-4 pt-2 pb-1">
          <SearchBar />
        </div>

        {/* Stories */}
        <div className="px-3 pt-2 pb-1">
          <StoryBubbles stories={stories} onStoryClick={handleStoryClick} onAddStory={handleAddStory} />
        </div>

        {/* Tabs */}
        <div className="px-4 py-2.5">
          <div className="bg-card/50 rounded-2xl p-1 flex gap-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  if (tab.key === 'hashtags') navigate('/discovery/hashtags');
                  if (tab.key === 'trending') navigate('/discovery/trending');
                  if (tab.key === 'groups') navigate('/discovery/groups');
                }}
                className={`flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* People Tab */}
        {activeTab === 'people' && (
          <>
            {/* Filters row */}
            <div className="px-4 pb-2 flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="h-9 text-xs bg-card/60 border-border/20 text-foreground rounded-xl">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    {areas.map((area) => (
                      <SelectItem key={area.value} value={area.value} className="text-xs text-foreground">{area.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <SmartFilters onFiltersChange={handleSmartFiltersChange} activeFilterCount={activeFilters} />
              {activeFilters > 0 && (
                <button onClick={resetFilters} className="h-9 px-3 rounded-xl bg-destructive/10 text-destructive text-[10px] font-medium flex items-center gap-1 shrink-0">
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {/* Results */}
            <div className="px-4 pb-3 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">{filteredProfiles.length} people found</span>
              {filteredProfiles.length > 0 && (
                <span className="text-[10px] text-primary font-medium">Swipe to explore →</span>
              )}
            </div>

            {/* Profile Cards — Photo-first card layout */}
            <div className="px-4">
              {profilesLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden bg-card animate-pulse">
                      <div className="aspect-[3/4] bg-muted" />
                    </div>
                  ))}
                </div>
              ) : filteredProfiles.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">No matches found</h3>
                  <p className="text-xs text-muted-foreground mb-5">Try adjusting your filters</p>
                  <Button onClick={resetFilters} size="sm" className="rounded-xl h-10 text-xs px-6">Reset Filters</Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredProfiles.map((profile) => (
                    <button
                      key={profile.id}
                      className="group relative rounded-2xl overflow-hidden bg-card shadow-lg shadow-black/20 active:scale-[0.97] transition-transform duration-200 text-left"
                      onClick={() => handleProfileClick(profile)}
                    >
                      {/* Photo */}
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <img
                          src={profile.profile_image}
                          alt={profile.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        
                        {/* Verified badge */}
                        {profile.verified && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-primary-foreground text-[10px] font-bold">✓</span>
                          </div>
                        )}

                        {/* Online indicator */}
                        <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-background/50 shadow-sm" />

                        {/* Info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-2.5">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-sm text-white leading-tight">{profile.name}</span>
                            <span className="text-white/70 text-xs">{profile.age}</span>
                          </div>
                          <div className="flex items-center gap-1 text-white/60 text-[10px] mt-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            <span className="truncate">{profile.location}</span>
                          </div>
                          {profile.occupation && profile.occupation !== 'Not specified' && (
                            <div className="flex items-center gap-1 text-white/50 text-[9px] mt-0.5">
                              <Briefcase className="w-2.5 h-2.5" />
                              <span className="truncate">{profile.occupation}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tags below photo */}
                      <div className="p-2 flex flex-wrap gap-1">
                        {profile.kurdistan_region && (
                          <Badge variant="outline" className="text-[8px] px-1.5 py-0 rounded-full border-primary/20 text-primary bg-primary/5 h-4">
                            {profile.kurdistan_region}
                          </Badge>
                        )}
                        {profile.religion && (
                          <Badge variant="secondary" className="text-[8px] px-1.5 py-0 rounded-full bg-muted text-muted-foreground h-4">
                            {profile.religion}
                          </Badge>
                        )}
                        {profile.interests && profile.interests.slice(0, 1).map((interest, i) => (
                          <Badge key={i} variant="secondary" className="text-[8px] px-1.5 py-0 rounded-full bg-muted text-muted-foreground h-4">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="px-4 pt-2">
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Upcoming Events</h3>
              <p className="text-xs text-muted-foreground mb-5">Discover events near you</p>
              <Button onClick={() => navigate('/create-event')} size="sm" className="rounded-xl h-10 text-xs px-6 gap-2">
                <Calendar className="w-3.5 h-3.5" />
                Create Event
              </Button>
            </div>
          </div>
        )}

        {/* Quick links for non-people tabs */}
        {(activeTab === 'hashtags' || activeTab === 'trending' || activeTab === 'groups') && (
          <div className="px-4 pt-2 space-y-2">
            {[
              { icon: Hash, label: 'Explore Hashtags', desc: 'Find trending topics', path: '/discovery/hashtags' },
              { icon: Flame, label: 'Trending Now', desc: 'See what\'s popular', path: '/discovery/trending' },
              { icon: Users, label: 'Community Groups', desc: 'Join groups near you', path: '/discovery/groups' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full bg-card rounded-2xl p-4 flex items-center gap-3 shadow-sm active:scale-[0.98] transition-transform"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-foreground">{item.label}</div>
                  <div className="text-[11px] text-muted-foreground">{item.desc}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Profile Modal — bottom sheet style */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center" onClick={() => setSelectedProfile(null)}>
          <div
            className="bg-card rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="aspect-[3/4] relative overflow-hidden">
              <img src={selectedProfile.profile_image} alt={selectedProfile.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-white">{selectedProfile.name}</h1>
                  <span className="text-lg text-white/70">{selectedProfile.age}</span>
                  {selectedProfile.verified && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-[9px] font-bold">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-white/70 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedProfile.location}</span>
                </div>
                {selectedProfile.occupation && selectedProfile.occupation !== 'Not specified' && (
                  <Badge className="mt-2 bg-primary/80 text-primary-foreground text-xs rounded-lg">{selectedProfile.occupation}</Badge>
                )}
              </div>
            </div>
            
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center active:scale-95 transition-transform"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="p-4 pb-6">
              <SwipeActions onRewind={handleRewind} onPass={handlePass} onLike={handleLike} onSuperLike={handleSuperLike} onBoost={handleBoost} />
            </div>
          </div>
        </div>
      )}

      {selectedStory && (
        <StoryViewer open={!!selectedStory} onOpenChange={(open) => !open && setSelectedStory(null)} stories={stories} initialIndex={stories.findIndex(s => s.id === selectedStory.id)} />
      )}

      {currentUserId && (
        <CreateStoryModal open={showCreateStory} onOpenChange={setShowCreateStory} onStoryCreated={handleStoryCreated} userId={currentUserId} />
      )}
    </div>
  );
};

export default Discovery;
