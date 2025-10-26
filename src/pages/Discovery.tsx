import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Users, Filter, X, Briefcase, Book, Heart, Languages, UtensilsCrossed, Search as SearchIcon, Hash, TrendingUp } from 'lucide-react';
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
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Input } from '@/components/ui/input';
import BottomNavigation from '@/components/BottomNavigation';
import SwipeActions from '@/components/swipe/SwipeActions';
import { likeProfile } from '@/api/likes';
import { toast } from 'sonner';

const areas = [
  { value: "all", name: "All Regions" },
  { value: "us", name: "United States" },
  { value: "eu", name: "Europe" },
  { value: "South-Kurdistan", name: "South Kurdistan" },
  { value: "North-Kurdistan", name: "North Kurdistan" },
  { value: "East-Kurdistan", name: "East Kurdistan" },
  { value: "West-Kurdistan", name: "West Kurdistan" }
];

const religions = [
  { value: "all", name: "All Religions" },
  { value: "muslim", name: "Muslim" },
  { value: "christian", name: "Christian" },
  { value: "jewish", name: "Jewish" },
  { value: "hindu", name: "Hindu" },
  { value: "buddhist", name: "Buddhist" },
  { value: "sikh", name: "Sikh" },
  { value: "spiritual", name: "Spiritual" },
  { value: "agnostic", name: "Agnostic" },
  { value: "atheist", name: "Atheist" },
  { value: "other", name: "Other" }
];

const bodyTypes = [
  { value: "all", name: "All Body Types" },
  { value: "slim", name: "Slim" },
  { value: "average", name: "Average" },
  { value: "athletic", name: "Athletic" },
  { value: "muscular", name: "Muscular" },
  { value: "curvy", name: "Curvy" },
  { value: "full", name: "Full Figured" }
];

const languageOptions = [
  { value: "all", name: "All Languages" },
  { value: "english", name: "English" },
  { value: "kurdish", name: "Kurdish" },
  { value: "arabic", name: "Arabic" },
  { value: "turkish", name: "Turkish" },
  { value: "persian", name: "Persian" },
  { value: "spanish", name: "Spanish" },
  { value: "french", name: "French" },
  { value: "german", name: "German" }
];

interface FilterFormValues {
  area: string;
  ageRange: [number, number];
  distance: number;
  minCompatibility: number;
  hasInterests: boolean;
  occupationFilter: string;
  showVerifiedOnly: boolean;
  religion: string;
  bodyType: string;
  language: string;
  heightRange: [number, number];
  dietaryPreference: string;
}

const Discovery = () => {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState("all");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<DiscoveryProfile | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const form = useForm<FilterFormValues>({
    defaultValues: {
      area: "all",
      ageRange: [18, 50],
      distance: 50,
      minCompatibility: 70,
      hasInterests: false,
      occupationFilter: "",
      showVerifiedOnly: false,
      religion: "all",
      bodyType: "all",
      language: "all",
      heightRange: [150, 200],
      dietaryPreference: ""
    }
  });

  // Fetch real profiles from database
  const { profiles: dbProfiles, loading: profilesLoading } = useDiscoveryProfiles({
    limit: 50,
    filters: {
      area: selectedArea !== 'all' ? selectedArea : undefined,
      ageRange: form.watch('ageRange'),
      religion: form.watch('religion'),
      bodyType: form.watch('bodyType'),
      language: form.watch('language')
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
  
  const applyFilters = (formValues: FilterFormValues) => {
    const { 
      area, 
      distance, 
      minCompatibility, 
      hasInterests, 
      occupationFilter, 
      showVerifiedOnly,
      religion,
      bodyType,
      language,
      heightRange,
      dietaryPreference,
      ageRange
    } = formValues;
    
    let count = 0;
    
    if (area !== "all") count++;
    if (distance < 50) count++;
    if (minCompatibility > 70) count++;
    if (hasInterests) count++;
    if (occupationFilter) count++;
    if (showVerifiedOnly) count++;
    if (ageRange[0] > 18 || ageRange[1] < 50) count++;
    if (religion !== "all") count++;
    if (bodyType !== "all") count++;
    if (language !== "all") count++;
    if (heightRange[0] > 150 || heightRange[1] < 200) count++;
    if (dietaryPreference) count++;
    
    setActiveFilters(count);
    setSelectedArea(area);
    setIsFilterExpanded(false);
  };

  // Apply additional client-side filters
  const filteredProfiles = dbProfiles.filter(profile => {
    const values = form.getValues();
    
    const matchesOccupation = !values.occupationFilter || 
      (profile.occupation && profile.occupation.toLowerCase().includes(values.occupationFilter.toLowerCase()));
    
    const matchesInterests = !values.hasInterests || (profile.interests && profile.interests.length > 0);
    
    const matchesVerified = !values.showVerifiedOnly || profile.verified;
    
    const height = profile.height ? parseInt(profile.height) : 0;
    const matchesHeight = !height || (height >= values.heightRange[0] && height <= values.heightRange[1]);
    
    const matchesDietary = !values.dietaryPreference || 
      (profile.dietary_preferences && profile.dietary_preferences.toLowerCase().includes(values.dietaryPreference.toLowerCase()));
    
    return matchesOccupation && matchesInterests && matchesVerified && matchesHeight && matchesDietary;
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

  const resetFilters = () => {
    form.reset({
      area: "all",
      ageRange: [18, 50],
      distance: 50,
      minCompatibility: 70,
      hasInterests: false,
      occupationFilter: "",
      showVerifiedOnly: false,
      religion: "all",
      bodyType: "all",
      language: "all",
      heightRange: [150, 200],
      dietaryPreference: ""
    });
    setSelectedArea("all");
    setActiveFilters(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur shadow-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Discover People
            </h1>
            <p className="text-purple-200">Find your perfect match in our community</p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stories Section */}
        {stories.length > 0 && (
          <div className="mb-6 backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-4">
            <StoryBubbles
              stories={stories}
              onStoryClick={handleStoryClick}
              onAddStory={handleAddStory}
            />
          </div>
        )}

        {/* Compact Navigation Sections */}
        <div className="space-y-2 mb-6">
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

        <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
          
          <div className="relative z-10">
            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="w-full">
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
              
              <DropdownMenu open={isFilterExpanded} onOpenChange={setIsFilterExpanded}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 whitespace-nowrap bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20">
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                    {activeFilters > 0 && (
                      <Badge className="ml-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                        {activeFilters}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 p-4 max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur border-border">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(applyFilters)} className="space-y-4">
                      <DropdownMenuLabel className="font-bold text-foreground">Filter Profiles</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border" />

                      {/* Age Range */}
                      <DropdownMenuGroup>
                        <FormField
                          control={form.control}
                          name="ageRange"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-white">Age Range: {field.value[0]} - {field.value[1]}</FormLabel>
                              <FormControl>
                                <Slider 
                                  defaultValue={field.value} 
                                  min={18} 
                                  max={70} 
                                  step={1} 
                                  onValueChange={field.onChange}
                                  className="mt-2" 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator className="bg-border" />
                      
                      {/* Distance */}
                      <DropdownMenuGroup>
                        <FormField
                          control={form.control}
                          name="distance"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-white">Distance: {field.value} miles</FormLabel>
                              <FormControl>
                                <Slider 
                                  defaultValue={[field.value]} 
                                  min={1} 
                                  max={100} 
                                  step={1} 
                                  onValueChange={(value) => field.onChange(value[0])}
                                  className="mt-2" 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator className="bg-border" />
                      
                      {/* Compatibility */}
                      <DropdownMenuGroup>
                        <FormField
                          control={form.control}
                          name="minCompatibility"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-white">Minimum Compatibility: {field.value}%</FormLabel>
                              <FormControl>
                                <Slider 
                                  defaultValue={[field.value]} 
                                  min={50} 
                                  max={100} 
                                  step={5} 
                                  onValueChange={(value) => field.onChange(value[0])}
                                  className="mt-2" 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </DropdownMenuGroup>
                      
                      <DropdownMenuSeparator className="bg-border" />
                      
                      {/* Religion */}
                      <DropdownMenuGroup>
                        <FormField
                          control={form.control}
                          name="religion"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-white">Religion</FormLabel>
                              <Select 
                                value={field.value} 
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="bg-background/95 backdrop-blur border-border text-foreground">
                                  <SelectValue placeholder="All Religions" />
                                </SelectTrigger>
                                <SelectContent className="bg-background/95 backdrop-blur border-border">
                                  {religions.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="text-foreground hover:bg-accent">
                                      {option.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </DropdownMenuGroup>

                      {/* Continue with other form fields but update their styling... */}
                      <DropdownMenuSeparator className="bg-border" />
                      
                      {/* Body Type */}
                      <DropdownMenuGroup>
                        <FormField
                          control={form.control}
                          name="bodyType"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-white">Body Type</FormLabel>
                              <Select 
                                value={field.value} 
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="bg-background/95 backdrop-blur border-border text-foreground">
                                  <SelectValue placeholder="All Body Types" />
                                </SelectTrigger>
                                <SelectContent className="bg-background/95 backdrop-blur border-border">
                                  {bodyTypes.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="text-foreground hover:bg-accent">
                                      {option.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </DropdownMenuGroup>

                      {/* Continue with remaining form fields with similar styling updates... */}

                      <div className="flex justify-between pt-2">
                        <Button type="button" variant="outline" size="sm" onClick={resetFilters} className="bg-background/95 backdrop-blur border-border text-foreground hover:bg-accent">
                          Reset
                        </Button>
                        <Button type="submit" size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                          Apply Filters
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DropdownMenuContent>
              </DropdownMenu>
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
