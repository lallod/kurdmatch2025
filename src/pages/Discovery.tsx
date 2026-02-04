import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Users, X, Briefcase, Book, Heart, Languages, UtensilsCrossed, Search as SearchIcon, Hash, TrendingUp, Bell, Zap, Filter } from 'lucide-react';
import SearchBar from '@/components/discovery/SearchBar';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { getStories, Story } from '@/api/posts';
import StoryBubbles from '@/components/discovery/StoryBubbles';
import StoryViewer from '@/components/stories/StoryViewer';
import CreateStoryModal from '@/components/stories/CreateStoryModal';
import { supabase } from '@/integrations/supabase/client';
import { useDiscoveryProfiles, DiscoveryProfile } from '@/hooks/useDiscoveryProfiles';
import { CompactSection } from '@/components/discovery/CompactSection';
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
import { SmartNotificationCenter } from '@/components/notifications/SmartNotificationCenter';
import { ProfileBoostCard } from '@/components/boost/ProfileBoostCard';
import { ActivityFeed } from '@/components/discovery/ActivityFeed';

const areas = [
  { value: "all", name: "All Regions" },
  { value: "us", name: "United States" },
  { value: "eu", name: "Europe" },
  { value: "South-Kurdistan", name: "South Kurdistan" },
  { value: "North-Kurdistan", name: "North Kurdistan" },
  { value: "East-Kurdistan", name: "East Kurdistan" },
  { value: "West-Kurdistan", name: "West Kurdistan" }
];

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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [boostOpen, setBoostOpen] = useState(false);
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

  // Fetch real profiles from database
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
    // Count active filters
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
    
    if (filters.region) {
      setSelectedArea(filters.region);
    }
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

  // Apply client-side filters
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

  const handlePass = () => {
    toast.info("Passed");
    setSelectedProfile(null);
  };

  const handleRewind = () => {
    toast.info("Rewind");
  };

  const handleSuperLike = () => {
    if (!selectedProfile) return;
    toast.info("Super liked!");
    setSelectedProfile(null);
  };

  const handleBoost = () => {
    toast.info("Boosted!");
  };

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
  };

  const handleAddStory = () => {
    setShowCreateStory(true);
  };

  const handleStoryCreated = async () => {
    const storiesData = await getStories();
    setStories(storiesData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur shadow-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Top Actions Row */}
          <div className="flex justify-end gap-2 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setBoostOpen(true)}
              className="text-white hover:bg-white/10 border border-white/20 rounded-full w-10 h-10"
            >
              <Zap className="w-5 h-5 text-yellow-400" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotificationsOpen(true)}
              className="text-white hover:bg-white/10 border border-white/20 rounded-full w-10 h-10"
            >
              <Bell className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <SearchIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Discover People
            </h1>
            <p className="text-sm sm:text-base text-purple-200">Find your perfect match in our community</p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      <SmartNotificationCenter 
        open={notificationsOpen} 
        onOpenChange={setNotificationsOpen} 
      />

      {/* Boost Modal */}
      {boostOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setBoostOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
            <ProfileBoostCard onClose={() => setBoostOpen(false)} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Stories Section */}
        {stories.length > 0 && (
          <div className="mb-4 sm:mb-6 backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-3 sm:p-4">
            <StoryBubbles
              stories={stories}
              onStoryClick={handleStoryClick}
              onAddStory={handleAddStory}
            />
          </div>
        )}

        {/* Activity Feed */}
        <div className="mb-4 sm:mb-6">
          <ActivityFeed compact maxItems={5} />
        </div>

        {/* Compact Navigation Sections */}
        <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
          <CompactSection
            icon={<Hash className="h-5 w-5" />}
            title="Explore Hashtags"
            count={0}
            onClick={() => navigate('/discovery/hashtags')}
          />
          
          <CompactSection
            icon={<TrendingUp className="h-5 w-5" />}
            title="Trending Topics"
            count={0}
            onClick={() => navigate('/discovery/trending')}
          />
          
          <CompactSection
            icon={<Users className="h-5 w-5" />}
            title="Community Groups"
            count={0}
            onClick={() => navigate('/discovery/groups')}
          />
        </div>

        <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-6 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
          
          <div className="relative z-10">
            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="flex-1">
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="bg-white/10 backdrop-blur border-white/20 text-white">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur border-border">
                    {areas.map((area) => (
                      <SelectItem key={area.value} value={area.value} className="text-foreground hover:bg-accent">
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
            </div>
            
            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-sm text-purple-200">
                <Users className="h-4 w-4" />
                <span>{filteredProfiles.length} people found</span>
              </div>
              
              {activeFilters > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1 text-pink-400 border-pink-400/20 hover:bg-pink-400/10 bg-transparent"
                  onClick={resetFilters}
                >
                  <X className="h-4 w-4" />
                  <span>Clear filters</span>
                </Button>
              )}
            </div>

            {/* Profile Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profilesLoading ? (
                <>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 animate-pulse">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-16 w-16 rounded-full bg-white/20"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-5 bg-white/20 rounded w-3/4"></div>
                            <div className="h-4 bg-white/20 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="h-6 bg-white/20 rounded mb-2"></div>
                        <div className="h-16 bg-white/20 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <>
                  {filteredProfiles.map((profile) => (
                    <Card 
                      key={profile.id} 
                      className="overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1"
                      onClick={() => handleProfileClick(profile)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-16 w-16 ring-2 ring-purple-400/30">
                            <AvatarImage src={profile.profile_image} alt={profile.name} />
                            <AvatarFallback className="bg-purple-500 text-white">{profile.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-white">{profile.name}</span>
                              <span className="text-purple-200">{profile.age}</span>
                              {profile.verified && (
                                <span className="text-blue-400">✓</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-purple-300 mt-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="truncate">{profile.location}</span>
                            </div>
                            {profile.occupation && profile.occupation !== 'Not specified' && (
                              <div className="text-sm text-purple-300 flex items-center gap-1 truncate">
                                <Briefcase className="h-3.5 w-3.5" />
                                {profile.occupation}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profile.kurdistan_region && (
                            <Badge variant="outline" className="px-2 py-1 text-xs bg-purple-500/20 text-purple-200 border-purple-400/30">
                              {profile.kurdistan_region}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-3">
                          {profile.religion && (
                            <Badge variant="secondary" className="text-xs flex items-center gap-1 bg-white/10 text-purple-200">
                              <Book className="h-3 w-3" />
                              {profile.religion}
                            </Badge>
                          )}
                          
                          {profile.languages && profile.languages.length > 0 && (
                            <Badge variant="secondary" className="text-xs flex items-center gap-1 bg-white/10 text-purple-200">
                              <Languages className="h-3 w-3" />
                              {profile.languages[0]}{profile.languages.length > 1 ? ` +${profile.languages.length - 1}` : ''}
                            </Badge>
                          )}
                          
                          {profile.dietary_preferences && (
                            <Badge variant="secondary" className="text-xs flex items-center gap-1 bg-white/10 text-purple-200">
                              <UtensilsCrossed className="h-3 w-3" />
                              {profile.dietary_preferences}
                            </Badge>
                          )}
                        </div>
                        
                        {profile.interests && profile.interests.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {profile.interests.slice(0, 3).map((interest, index) => (
                              <Badge key={index} variant="outline" className="text-xs flex items-center gap-1 border-pink-400/30 text-pink-300">
                                <Heart className="h-3 w-3" />
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>

            {/* Empty State */}
            {filteredProfiles.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[40vh] text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No matching profiles found</h3>
                <p className="text-purple-200 mb-4">Try adjusting your filters to see more people</p>
                <Button onClick={resetFilters} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      </div>
      
      {/* Profile Modal with Swipe Actions */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-900/90 via-purple-800/90 to-pink-900/90 backdrop-blur-md rounded-3xl max-w-sm w-full max-h-[80vh] overflow-hidden shadow-2xl border border-white/20">
            {/* Profile Info */}
            <div className="aspect-[3/4] relative overflow-hidden">
              <img
                src={selectedProfile.profile_image}
                alt={selectedProfile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-white">{selectedProfile.name}</h1>
                    <span className="text-xl text-white/90">{selectedProfile.age}</span>
                    {selectedProfile.verified && (
                      <span className="text-blue-400 text-xl">✓</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/90 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedProfile.location}</span>
                </div>
                {selectedProfile.occupation && selectedProfile.occupation !== 'Not specified' && (
                  <Badge className="bg-pink-500/80 text-white text-sm">
                    {selectedProfile.occupation}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Swipe Actions */}
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

      {/* Create Story Modal */}
      {currentUserId && (
        <CreateStoryModal
          open={showCreateStory}
          onOpenChange={setShowCreateStory}
          onStoryCreated={handleStoryCreated}
          userId={currentUserId}
        />
      )}
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Discovery;
