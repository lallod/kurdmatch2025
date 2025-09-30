import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NearbyUser, Coordinates } from '@/types/location';
import { useToast } from '@/hooks/use-toast';

interface UseNearbyUsersOptions {
  radiusKm?: number;
  maxResults?: number;
  autoFetch?: boolean;
}

export const useNearbyUsers = (options: UseNearbyUsersOptions = {}) => {
  const {
    radiusKm = 50,
    maxResults = 100,
    autoFetch = true,
  } = options;

  const [users, setUsers] = useState<NearbyUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const { toast } = useToast();

  const fetchNearbyUsers = async (coords: Coordinates) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: rpcError } = await supabase.rpc('nearby_users', {
        current_lat: coords.latitude,
        current_long: coords.longitude,
        radius_km: radiusKm,
        max_results: maxResults,
      });

      if (rpcError) throw rpcError;

      setUsers(data || []);
      setUserLocation(coords);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('Error fetching nearby users:', error);
      toast({
        title: 'Failed to load nearby users',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCurrentUserLocation = async (coords: Coordinates, locationName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          latitude: coords.latitude,
          longitude: coords.longitude,
          location: locationName,
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refetch nearby users with new location
      await fetchNearbyUsers(coords);
    } catch (err) {
      console.error('Error updating user location:', err);
    }
  };

  useEffect(() => {
    if (autoFetch && userLocation) {
      fetchNearbyUsers(userLocation);
    }
  }, [radiusKm, maxResults]);

  return {
    users,
    isLoading,
    error,
    userLocation,
    fetchNearbyUsers,
    updateCurrentUserLocation,
    refetch: () => userLocation && fetchNearbyUsers(userLocation),
  };
};
