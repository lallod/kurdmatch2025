
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Users, Filter, X, Briefcase, Book, Heart, Languages, UtensilsCrossed } from 'lucide-react';
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

const areas = [
  { name: "All Regions", value: "all" },
  { name: "South Kurdistan", value: "South-Kurdistan" },
  { name: "West Kurdistan", value: "West-Kurdistan" },
  { name: "East Kurdistan", value: "East-Kurdistan" },
  { name: "North Kurdistan", value: "North-Kurdistan" },
  { name: "United States", value: "us" },
  { name: "Europe", value: "eu" }
];

const religions = [
  { name: "All Religions", value: "all" },
  { name: "Christian", value: "christian" },
  { name: "Muslim", value: "muslim" },
  { name: "Jewish", value: "jewish" },
  { name: "Hindu", value: "hindu" },
  { name: "Buddhist", value: "buddhist" },
  { name: "Spiritual", value: "spiritual" },
  { name: "Atheist", value: "atheist" },
  { name: "Agnostic", value: "agnostic" },
  { name: "Other", value: "other" }
];

const bodyTypes = [
  { name: "All Body Types", value: "all" },
  { name: "Athletic", value: "athletic" },
  { name: "Average", value: "average" },
  { name: "Slim", value: "slim" },
  { name: "Curvy", value: "curvy" },
  { name: "Muscular", value: "muscular" }
];

const languageOptions = [
  { name: "All Languages", value: "all" },
  { name: "Kurdish", value: "kurdish" },
  { name: "English", value: "english" },
  { name: "Arabic", value: "arabic" },
  { name: "Turkish", value: "turkish" },
  { name: "Persian", value: "persian" },
  { name: "German", value: "german" },
  { name: "French", value: "french" },
  { name: "Spanish", value: "spanish" }
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
      heightRange: [150, 200], // Height in cm
      dietaryPreference: ""
    }
  });
  
  // Extended profile data with more details
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

  // Filter profiles based on selected filters
  const filteredProfiles = allProfiles.filter(profile => {
    const values = form.getValues();
    
    // Filter by area
    const matchesArea = selectedArea === "all" || profile.area === selectedArea;
    
    // Filter by age range
    const matchesAge = profile.age >= values.ageRange[0] && profile.age <= values.ageRange[1];
    
    // Filter by distance
    const matchesDistance = profile.distance <= values.distance;
    
    // Filter by compatibility score
    const matchesCompatibility = profile.compatibilityScore >= values.minCompatibility;
    
    // Filter by occupation
    const matchesOccupation = !values.occupationFilter || 
      (profile.occupation && profile.occupation.toLowerCase().includes(values.occupationFilter.toLowerCase()));
    
    // Filter by interests
    const matchesInterests = !values.hasInterests || (profile.interests && profile.interests.length > 0);
    
    // Filter by religion
    const matchesReligion = values.religion === "all" || 
      (profile.religion && profile.religion === values.religion);
    
    // Filter by body type
    const matchesBodyType = values.bodyType === "all" || 
      (profile.bodyType && profile.bodyType === values.bodyType);
    
    // Filter by language
    const matchesLanguage = values.language === "all" || 
      (profile.languages && profile.languages.includes(values.language));
    
    // Filter by height
    const height = profile.height ? parseInt(profile.height) : 0;
    const matchesHeight = height >= values.heightRange[0] && height <= values.heightRange[1];
    
    // Filter by dietary preference
    const matchesDietary = !values.dietaryPreference || 
      (profile.dietaryPreferences && profile.dietaryPreferences.toLowerCase().includes(values.dietaryPreference.toLowerCase()));
    
    return matchesArea && matchesAge && matchesDistance && matchesCompatibility && 
           matchesOccupation && matchesInterests && matchesReligion && 
           matchesBodyType && matchesLanguage && matchesHeight && matchesDietary;
  });

  const handleProfileClick = (profileId: number) => {
    navigate(`/profile/${profileId}`);
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
    <div className="min-h-screen pt-8 px-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-6">Discover People</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="w-full">
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger>
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area.value} value={area.value}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DropdownMenu open={isFilterExpanded} onOpenChange={setIsFilterExpanded}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 whitespace-nowrap">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFilters > 0 && (
                  <Badge className="ml-1 bg-tinder-rose text-white h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full">
                    {activeFilters}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4 max-h-[80vh] overflow-y-auto">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(applyFilters)} className="space-y-4">
                  <DropdownMenuLabel className="font-bold">Filter Profiles</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <FormField
                      control={form.control}
                      name="ageRange"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Age Range: {field.value[0]} - {field.value[1]}</FormLabel>
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

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <FormField
                      control={form.control}
                      name="distance"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Distance: {field.value} miles</FormLabel>
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

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <FormField
                      control={form.control}
                      name="minCompatibility"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Minimum Compatibility: {field.value}%</FormLabel>
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
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <FormField
                      control={form.control}
                      name="religion"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Religion</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All Religions" />
                            </SelectTrigger>
                            <SelectContent>
                              {religions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <FormField
                      control={form.control}
                      name="bodyType"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Body Type</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All Body Types" />
                            </SelectTrigger>
                            <SelectContent>
                              {bodyTypes.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Languages</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All Languages" />
                            </SelectTrigger>
                            <SelectContent>
                              {languageOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <FormField
                      control={form.control}
                      name="heightRange"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Height (cm): {field.value[0]} - {field.value[1]}</FormLabel>
                          <FormControl>
                            <Slider 
                              defaultValue={field.value} 
                              min={140} 
                              max={220} 
                              step={1} 
                              onValueChange={field.onChange}
                              className="mt-2" 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <FormField
                      control={form.control}
                      name="dietaryPreference"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Dietary Preference</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Vegan, Vegetarian"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <FormField
                      control={form.control}
                      name="occupationFilter"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Occupation contains</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Engineer, Teacher"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <FormField
                      control={form.control}
                      name="hasInterests"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">Has interests</FormLabel>
                        </FormItem>
                      )}
                    />
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <FormField
                      control={form.control}
                      name="showVerifiedOnly"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">Verified profiles only</FormLabel>
                        </FormItem>
                      )}
                    />
                  </DropdownMenuGroup>

                  <div className="flex justify-between pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={resetFilters}>
                      Reset
                    </Button>
                    <Button type="submit" size="sm">Apply Filters</Button>
                  </div>
                </form>
              </Form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{filteredProfiles.length} people found</span>
          </div>
          
          {activeFilters > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 text-red-500 border-red-200 hover:bg-red-50"
              onClick={resetFilters}
            >
              <X className="h-4 w-4" />
              <span>Clear filters</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProfiles.map((profile) => (
          <Card 
            key={profile.id} 
            className="overflow-hidden hover:bg-muted/30 transition-colors cursor-pointer"
            onClick={() => handleProfileClick(profile.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{profile.name}</span>
                    <span className="text-muted-foreground">{profile.age}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{profile.location}</span>
                  </div>
                  {profile.occupation && (
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {profile.occupation}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className={`${
                  profile.compatibilityScore > 90 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : profile.compatibilityScore > 80 
                      ? 'bg-tinder-rose/10 text-tinder-rose border-tinder-rose/20'
                      : 'bg-orange-100 text-orange-700 border-orange-200'
                }`}>
                  {profile.compatibilityScore}% match
                </Badge>
                <Badge variant="outline" className="px-2 py-1 text-xs">
                  {profile.distance} miles away
                </Badge>
                {profile.kurdistanRegion && (
                  <Badge variant="outline" className="px-2 py-1 text-xs bg-tinder-rose/5 text-tinder-rose/90">
                    {profile.kurdistanRegion}
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {/* Show profile details as mini badges */}
                {profile.religion && (
                  <Badge variant="secondary" size="sm" className="text-xs flex items-center gap-1">
                    <Book className="h-3 w-3" />
                    {profile.religion}
                  </Badge>
                )}
                
                {profile.languages && profile.languages.length > 0 && (
                  <Badge variant="secondary" size="sm" className="text-xs flex items-center gap-1">
                    <Languages className="h-3 w-3" />
                    {profile.languages[0]}{profile.languages.length > 1 ? ` +${profile.languages.length - 1}` : ''}
                  </Badge>
                )}
                
                {profile.dietaryPreferences && (
                  <Badge variant="secondary" size="sm" className="text-xs flex items-center gap-1">
                    <UtensilsCrossed className="h-3 w-3" />
                    {profile.dietaryPreferences}
                  </Badge>
                )}
              </div>
              
              {profile.interests && profile.interests.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {profile.interests.slice(0, 3).map((interest, index) => (
                    <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
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

      {filteredProfiles.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="bg-muted/30 p-4 rounded-full mb-4">
            <Filter className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No matching profiles found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default Discovery;
