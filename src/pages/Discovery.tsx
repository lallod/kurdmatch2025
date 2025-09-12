import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Users, Filter, X, Briefcase, Book, Heart, Languages, UtensilsCrossed, Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
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
import { KurdistanRegion } from '@/types/profile';
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

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  avatar: string;
  distance: number;
  compatibilityScore: number;
  kurdistanRegion?: KurdistanRegion;
  area: string;
  interests?: string[];
  occupation?: string;
  religion?: string;
  bodyType?: string;
  languages?: string[];
  dietaryPreferences?: string;
  height?: string;
}

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
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  
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
  
  const allProfiles: Profile[] = [
    {
      id: 1,
      name: "Noah Williams",
      age: 29,
      location: "Seattle, WA",
      avatar: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=150&q=80",
      distance: 5,
      compatibilityScore: 92,
      area: "us",
      interests: ["Photography", "Hiking", "Coding"],
      occupation: "Software Engineer",
      religion: "agnostic",
      bodyType: "athletic",
      languages: ["english", "spanish"],
      height: "185",
      dietaryPreferences: "Vegetarian"
    },
    {
      id: 2,
      name: "Mia Garcia",
      age: 27,
      location: "Erbil, Kurdistan",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&q=80",
      distance: 12,
      compatibilityScore: 88,
      kurdistanRegion: "South-Kurdistan",
      area: "South-Kurdistan",
      interests: ["Cooking", "Reading", "Travel"],
      occupation: "Teacher",
      religion: "muslim",
      bodyType: "average",
      languages: ["kurdish", "english", "arabic"],
      height: "165",
      dietaryPreferences: "No restrictions"
    },
    {
      id: 3,
      name: "Liam Wilson",
      age: 32,
      location: "Qamishli, Kurdistan",
      avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&q=80",
      distance: 8,
      compatibilityScore: 76,
      kurdistanRegion: "West-Kurdistan",
      area: "West-Kurdistan",
      interests: ["Music", "Politics", "History"],
      occupation: "Journalist",
      religion: "christian",
      bodyType: "slim",
      languages: ["kurdish", "english", "arabic", "turkish"],
      height: "178",
      dietaryPreferences: "No restrictions"
    },
    {
      id: 4,
      name: "Sophia Brown",
      age: 25,
      location: "New York, NY",
      avatar: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=150&q=80",
      distance: 3,
      compatibilityScore: 85,
      area: "us",
      interests: ["Fashion", "Art", "Film"],
      occupation: "Designer",
      religion: "spiritual",
      bodyType: "slim",
      languages: ["english", "french"],
      height: "170",
      dietaryPreferences: "Pescatarian"
    },
    {
      id: 5,
      name: "Lucas Davis",
      age: 30,
      location: "Mahabad, Kurdistan",
      avatar: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=150&q=80",
      distance: 15,
      compatibilityScore: 91,
      kurdistanRegion: "East-Kurdistan",
      area: "East-Kurdistan",
      interests: ["Technology", "Sports", "Reading"],
      occupation: "IT Consultant",
      religion: "muslim",
      bodyType: "muscular",
      languages: ["kurdish", "persian", "english"],
      height: "182",
      dietaryPreferences: "No restrictions"
    },
    {
      id: 6,
      name: "Emma Johnson",
      age: 26,
      location: "Diyarbakır, Kurdistan",
      avatar: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=150&q=80",
      distance: 7,
      compatibilityScore: 95,
      kurdistanRegion: "North-Kurdistan",
      area: "North-Kurdistan",
      interests: ["Language", "Culture", "Education"],
      occupation: "Linguist",
      religion: "muslim",
      bodyType: "average",
      languages: ["kurdish", "turkish", "english"],
      height: "163",
      dietaryPreferences: "No restrictions"
    },
    {
      id: 7,
      name: "Oliver Smith",
      age: 31,
      location: "Berlin, Germany",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80",
      distance: 20,
      compatibilityScore: 87,
      area: "eu",
      interests: ["Travel", "Music", "Food"],
      occupation: "Chef",
      religion: "atheist",
      bodyType: "average",
      languages: ["english", "german"],
      height: "180",
      dietaryPreferences: "No restrictions"
    },
    {
      id: 8,
      name: "Ava Martin",
      age: 24,
      location: "Paris, France",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      distance: 25,
      compatibilityScore: 90,
      area: "eu",
      interests: ["Fashion", "Art", "Photography"],
      occupation: "Photographer",
      religion: "catholic",
      bodyType: "slim",
      languages: ["english", "french"],
      height: "168",
      dietaryPreferences: "Vegan"
    }
  ];

  const applyFilters = (formValues: FilterFormValues) => {
    const { 
      area, 
      ageRange, 
      distance, 
      minCompatibility, 
      hasInterests, 
      occupationFilter, 
      showVerifiedOnly,
      religion,
      bodyType,
      language,
      heightRange,
      dietaryPreference
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

  const filteredProfiles = allProfiles.filter(profile => {
    const values = form.getValues();
    
    const matchesArea = selectedArea === "all" || profile.area === selectedArea;
    
    const matchesAge = profile.age >= values.ageRange[0] && profile.age <= values.ageRange[1];
    
    const matchesDistance = profile.distance <= values.distance;
    
    const matchesCompatibility = profile.compatibilityScore >= values.minCompatibility;
    
    const matchesOccupation = !values.occupationFilter || 
      (profile.occupation && profile.occupation.toLowerCase().includes(values.occupationFilter.toLowerCase()));
    
    const matchesInterests = !values.hasInterests || (profile.interests && profile.interests.length > 0);
    
    const matchesReligion = values.religion === "all" || 
      (profile.religion && profile.religion === values.religion);
    
    const matchesBodyType = values.bodyType === "all" || 
      (profile.bodyType && profile.bodyType === values.bodyType);
    
    const matchesLanguage = values.language === "all" || 
      (profile.languages && profile.languages.includes(values.language));
    
    const height = profile.height ? parseInt(profile.height) : 0;
    const matchesHeight = height >= values.heightRange[0] && height <= values.heightRange[1];
    
    const matchesDietary = !values.dietaryPreference || 
      (profile.dietaryPreferences && profile.dietaryPreferences.toLowerCase().includes(values.dietaryPreference.toLowerCase()));
    
    return matchesArea && matchesAge && matchesDistance && matchesCompatibility && 
           matchesOccupation && matchesInterests && matchesReligion && 
           matchesBodyType && matchesLanguage && matchesHeight && matchesDietary;
  });

  const handleProfileClick = (profile: Profile) => {
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
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Discover People
            </h1>
            <p className="text-purple-200">Find your perfect match in our community</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
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
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {areas.map((area) => (
                      <SelectItem key={area.value} value={area.value} className="text-white hover:bg-gray-800">
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
                <DropdownMenuContent className="w-80 p-4 max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(applyFilters)} className="space-y-4">
                      <DropdownMenuLabel className="font-bold text-white">Filter Profiles</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-700" />

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

                      <DropdownMenuSeparator className="bg-gray-700" />
                      
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

                      <DropdownMenuSeparator className="bg-gray-700" />
                      
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
                      
                      <DropdownMenuSeparator className="bg-gray-700" />
                      
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
                                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                  <SelectValue placeholder="All Religions" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                  {religions.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
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
                      <DropdownMenuSeparator className="bg-gray-700" />
                      
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
                                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                  <SelectValue placeholder="All Body Types" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                  {bodyTypes.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700">
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
                        <Button type="button" variant="outline" size="sm" onClick={resetFilters} className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
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
              {filteredProfiles.map((profile) => (
                <Card 
                  key={profile.id} 
                  className="overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
                  onClick={() => handleProfileClick(profile)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-16 w-16 ring-2 ring-purple-400/30">
                        <AvatarImage src={profile.avatar} alt={profile.name} />
                        <AvatarFallback className="bg-purple-500 text-white">{profile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-white">{profile.name}</span>
                          <span className="text-purple-200">{profile.age}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-purple-300 mt-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{profile.location}</span>
                        </div>
                        {profile.occupation && (
                          <div className="text-sm text-purple-300 flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5" />
                            {profile.occupation}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className={`${
                        profile.compatibilityScore > 90 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                          : profile.compatibilityScore > 80 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                      }`}>
                        <Sparkles className="h-3 w-3 mr-1" />
                        {profile.compatibilityScore}% match
                      </Badge>
                      <Badge variant="outline" className="px-2 py-1 text-xs border-purple-300/30 text-purple-200">
                        {profile.distance} miles away
                      </Badge>
                      {profile.kurdistanRegion && (
                        <Badge variant="outline" className="px-2 py-1 text-xs bg-purple-500/20 text-purple-200 border-purple-400/30">
                          {profile.kurdistanRegion}
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
                      
                      {profile.dietaryPreferences && (
                        <Badge variant="secondary" className="text-xs flex items-center gap-1 bg-white/10 text-purple-200">
                          <UtensilsCrossed className="h-3 w-3" />
                          {profile.dietaryPreferences}
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
                src={selectedProfile.avatar}
                alt={selectedProfile.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-white">{selectedProfile.name}</h1>
                    <span className="text-xl text-white/90">{selectedProfile.age}</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-3 py-1">
                    ⚡ {selectedProfile.compatibilityScore}%
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-white/90 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedProfile.location}</span>
                  <span className="text-white/70">•</span>
                  <span>{selectedProfile.distance}km away</span>
                </div>
                {selectedProfile.occupation && (
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
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Discovery;
