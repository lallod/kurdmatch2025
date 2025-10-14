import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdvancedSearchFilters } from '@/components/discovery/AdvancedSearchFilters';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  profile_image: string;
  bio: string;
  gender: string;
  kurdistan_region: string;
  verified: boolean;
}

const AdvancedSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 60]);
  const [gender, setGender] = useState('all');
  const [location, setLocation] = useState('');
  const [region, setRegion] = useState('all');

  useEffect(() => {
    searchProfiles();
  }, [ageRange, gender, location, region]);

  const searchProfiles = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('profiles')
        .select('id, name, age, location, profile_image, bio, gender, kurdistan_region, verified')
        .gte('age', ageRange[0])
        .lte('age', ageRange[1])
        .order('verified', { ascending: false })
        .order('last_active', { ascending: false })
        .limit(50);

      // Apply filters
      if (gender !== 'all') {
        query = query.eq('gender', gender);
      }

      if (location) {
        query = query.ilike('location', `%${location}%`);
      }

      if (region !== 'all') {
        query = query.eq('kurdistan_region', region);
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%,occupation.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error searching profiles:', error);
      toast.error('Failed to search profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchProfiles();
  };

  const handleClearFilters = () => {
    setAgeRange([18, 60]);
    setGender('all');
    setLocation('');
    setRegion('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Advanced Search</h1>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, bio, or occupation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              Search
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filters */}
        {showFilters && (
          <div className="mb-6">
            <AdvancedSearchFilters
              ageRange={ageRange}
              gender={gender}
              location={location}
              region={region}
              onAgeRangeChange={setAgeRange}
              onGenderChange={setGender}
              onLocationChange={setLocation}
              onRegionChange={setRegion}
              onClear={handleClearFilters}
            />
          </div>
        )}

        {/* Results */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-white">
              <p>Searching...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-12 text-white">
              <p className="text-white/70">No profiles found</p>
              <p className="text-sm text-white/50 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <p className="text-white/70 text-sm mb-4">
                Found {profiles.length} profile{profiles.length !== 1 ? 's' : ''}
              </p>
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => navigate(`/profile/${profile.id}`)}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={profile.profile_image} alt={profile.name} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold truncate">
                          {profile.name}, {profile.age}
                        </h3>
                        {profile.verified && (
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-white/70 text-sm mb-2">{profile.location}</p>
                      {profile.kurdistan_region && (
                        <Badge variant="outline" className="border-white/20 text-white/70 mb-2">
                          {profile.kurdistan_region}
                        </Badge>
                      )}
                      <p className="text-white/60 text-sm line-clamp-2">{profile.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
