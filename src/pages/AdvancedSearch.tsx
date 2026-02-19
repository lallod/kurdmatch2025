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
import { useTranslations } from '@/hooks/useTranslations';

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
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 60]);
  const [gender, setGender] = useState('all');
  const [location, setLocation] = useState('');
  const [region, setRegion] = useState('all');
  const { t } = useTranslations();

  useEffect(() => { searchProfiles(); }, [ageRange, gender, location, region]);

  const searchProfiles = async () => {
    try {
      setLoading(true);
      let query = supabase.from('profiles').select('id, name, age, location, profile_image, bio, gender, kurdistan_region, verified').gte('age', ageRange[0]).lte('age', ageRange[1]).order('verified', { ascending: false }).order('last_active', { ascending: false }).limit(50);
      if (gender !== 'all') query = query.eq('gender', gender);
      if (location) query = query.ilike('location', `%${location}%`);
      if (region !== 'all') query = query.eq('kurdistan_region', region);
      if (searchQuery) query = query.or(`name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%,occupation.ilike.%${searchQuery}%`);
      const { data, error } = await query;
      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error searching profiles:', error);
      toast.error(t('search.search_failed', 'Failed to search profiles'));
    } finally { setLoading(false); }
  };

  const handleSearch = () => { searchProfiles(); };
  const handleClearFilters = () => { setAgeRange([18, 60]); setGender('all'); setLocation(''); setRegion('all'); };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/10">
        <div className="max-w-md mx-auto px-4 h-12 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-foreground hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">{t('search.title', 'Advanced Search')}</h1>
        </div>
        <div className="max-w-md mx-auto px-4 pb-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input type="text" placeholder="Search by name, bio, or occupation..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground" />
            </div>
            <Button onClick={handleSearch} className="bg-primary text-primary-foreground hover:bg-primary/90">Search</Button>
            <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className="border-border text-foreground hover:bg-muted">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {showFilters && (
          <div className="mb-6">
            <AdvancedSearchFilters ageRange={ageRange} gender={gender} location={location} region={region} onAgeRangeChange={setAgeRange} onGenderChange={setGender} onLocationChange={setLocation} onRegionChange={setRegion} onClear={handleClearFilters} />
          </div>
        )}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-foreground"><p>Searching...</p></div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-12 text-foreground">
              <p className="text-muted-foreground">No profiles found</p>
              <p className="text-sm text-muted-foreground/70 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground text-sm mb-4">Found {profiles.length} profile{profiles.length !== 1 ? 's' : ''}</p>
              {profiles.map((profile) => (
                <div key={profile.id} onClick={() => navigate(`/profile/${profile.id}`)} className="bg-card/50 backdrop-blur-md border border-border/20 rounded-2xl p-4 cursor-pointer hover:bg-card/70 transition-colors">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={profile.profile_image} alt={profile.name} className="object-cover object-top" />
                      <AvatarFallback className="bg-primary text-primary-foreground">{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-foreground font-semibold truncate">{profile.name}, {profile.age}</h3>
                        {profile.verified && <Badge variant="secondary" className="bg-info/20 text-info border-info/30">✓ Verified</Badge>}
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{profile.location}</p>
                      {profile.kurdistan_region && <Badge variant="outline" className="border-border text-muted-foreground mb-2">{profile.kurdistan_region}</Badge>}
                      <p className="text-muted-foreground/70 text-sm line-clamp-2">{profile.bio}</p>
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
