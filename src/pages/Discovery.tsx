
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, MapPin, Users, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { KurdistanRegion } from '@/types/profile';

const areas = [
  { name: "All Regions", value: "all" },
  { name: "South Kurdistan", value: "South-Kurdistan" },
  { name: "West Kurdistan", value: "West-Kurdistan" },
  { name: "East Kurdistan", value: "East-Kurdistan" },
  { name: "North Kurdistan", value: "North-Kurdistan" },
  { name: "United States", value: "us" },
  { name: "Europe", value: "eu" }
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
}

const Discovery = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");
  
  const allProfiles: Profile[] = [
    {
      id: 1,
      name: "Noah Williams",
      age: 29,
      location: "Seattle, WA",
      avatar: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=150&q=80",
      distance: 5,
      compatibilityScore: 92,
      area: "us"
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
      area: "South-Kurdistan"
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
      area: "West-Kurdistan"
    },
    {
      id: 4,
      name: "Sophia Brown",
      age: 25,
      location: "New York, NY",
      avatar: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=150&q=80",
      distance: 3,
      compatibilityScore: 85,
      area: "us"
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
      area: "East-Kurdistan"
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
      area: "North-Kurdistan"
    },
    {
      id: 7,
      name: "Oliver Smith",
      age: 31,
      location: "Berlin, Germany",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80",
      distance: 20,
      compatibilityScore: 87,
      area: "eu"
    },
    {
      id: 8,
      name: "Ava Martin",
      age: 24,
      location: "Paris, France",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      distance: 25,
      compatibilityScore: 90,
      area: "eu"
    }
  ];

  // Filter profiles based on search query and selected area
  const filteredProfiles = allProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        profile.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesArea = selectedArea === "all" || profile.area === selectedArea;
    
    return matchesSearch && matchesArea;
  });

  const handleProfileClick = (profileId: number) => {
    navigate(`/profile/${profileId}`);
  };

  return (
    <div className="min-h-screen pt-8 px-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-6">Discover People</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or location"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full sm:w-52">
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
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{filteredProfiles.length} people found</span>
          </div>
          
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </Button>
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
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="bg-muted/30 p-4 rounded-full mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No matching profiles found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default Discovery;
