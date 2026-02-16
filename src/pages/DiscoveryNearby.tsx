import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Loader2, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

import DistanceBadge from '@/components/location/DistanceBadge';
import { useNearbyUsers } from '@/hooks/useNearbyUsers';
import { getCurrentLocation, getCachedLocation, cacheLocation } from '@/utils/locationUtils';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const DiscoveryNearby = () => {
  const navigate = useNavigate();
  
  const [radiusKm, setRadiusKm] = useState(50);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const { users, isLoading, fetchNearbyUsers, updateCurrentUserLocation, userLocation } = useNearbyUsers({
    radiusKm,
    autoFetch: false,
  });

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    setIsDetectingLocation(true);
    
    try {
      // Try cached location first
      const cached = getCachedLocation();
      if (cached) {
        await fetchNearbyUsers(cached);
        setIsDetectingLocation(false);
        return;
      }

      // Get fresh location
      const coords = await getCurrentLocation();
      cacheLocation(coords);
      await fetchNearbyUsers(coords);
      
      toast.success(`Searching for matches within ${radiusKm} km`);
    } catch (error) {
      toast.error('Please enable location access to see nearby matches');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleRefresh = async () => {
    if (!userLocation) {
      await initializeLocation();
      return;
    }
    await fetchNearbyUsers(userLocation);
  };

  const handleRadiusChange = async (value: number[]) => {
    const newRadius = value[0];
    setRadiusKm(newRadius);
    
    if (userLocation) {
      await fetchNearbyUsers(userLocation);
    }
  };

  const handleProfileClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Nearby</h1>
                <p className="text-sm text-muted-foreground">
                  {users.length} matches within {radiusKm} km
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isDetectingLocation || isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${(isDetectingLocation || isLoading) ? 'animate-spin' : ''}`} />
              </Button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Distance Filter</SheetTitle>
                    <SheetDescription>
                      Adjust the search radius to find matches
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="space-y-6 mt-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label>Search Radius</Label>
                        <span className="text-sm font-medium text-primary">{radiusKm} km</span>
                      </div>
                      <Slider
                        value={[radiusKm]}
                        onValueChange={handleRadiusChange}
                        min={1}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1 km</span>
                        <span>100 km</span>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {(isDetectingLocation || isLoading) && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">
            {isDetectingLocation ? 'Detecting your location...' : 'Finding nearby matches...'}
          </p>
        </div>
      )}

      {/* No Location */}
      {!isDetectingLocation && !userLocation && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <MapPin className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Location Required</h3>
          <p className="text-muted-foreground text-center mb-6">
            We need your location to show nearby matches
          </p>
          <Button onClick={initializeLocation}>
            Enable Location
          </Button>
        </div>
      )}

      {/* Profiles Grid */}
      {!isDetectingLocation && !isLoading && users.length > 0 && (
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users.map((user) => (
              <Card
                key={user.id}
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handleProfileClick(user.id)}
              >
                <div className="relative aspect-[3/4]">
                  <Avatar className="w-full h-full rounded-none">
                    <AvatarImage
                      src={user.profile_image}
                      alt={user.name}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <AvatarFallback className="rounded-none text-2xl">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="absolute top-3 right-3">
                    <DistanceBadge distanceKm={user.distance_km} />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                    <h3 className="text-white text-xl font-bold mb-1">
                      {user.name}, {user.age}
                    </h3>
                    <div className="flex items-center gap-1 text-white/90 text-sm">
                      <MapPin className="w-3 h-3" />
                      <span>{user.location}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isDetectingLocation && !isLoading && userLocation && users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <MapPin className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No matches nearby</h3>
          <p className="text-muted-foreground text-center mb-6">
            Try increasing your search radius
          </p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      )}
    </div>
  );
};

export default DiscoveryNearby;
