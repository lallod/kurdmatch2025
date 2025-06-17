import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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
import { KurdistanRegion } from '@/types/profile';
import BottomNavigation from '@/components/BottomNavigation';
import SwipeContainer from '@/components/swiping/SwipeContainer';
import { Filter, Heart, X } from 'lucide-react';

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
      heightRange: [150, 200],
      dietaryPreference: ""
    }
  });
  
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-32">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur shadow-sm border-b border-white/20 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Discover Your Match
            </h1>
            <p className="text-purple-200">Swipe to find your perfect connection</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
          
          <div className="relative z-10">
            {/* Quick Filters */}
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
                    <span>Advanced Filters</span>
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
                              <FormLabel className="text-white">Distance: {field.value} km</FormLabel>
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

            {/* Main Swiping Interface */}
            <SwipeContainer 
              onFilterClick={() => setIsFilterExpanded(true)}
              activeFilters={activeFilters}
            />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Discovery;
