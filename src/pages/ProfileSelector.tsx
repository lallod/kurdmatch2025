import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useMockAuth } from '@/integrations/supabase/mockAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  profile_image: string;
  occupation: string;
}

const ProfileSelector = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const { selectProfile, currentProfile } = useMockAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentProfile) {
      navigate('/discovery');
    }
  }, [currentProfile, navigate]);

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = profiles.filter(profile =>
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.occupation.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProfiles(filtered);
    } else {
      setFilteredProfiles(profiles);
    }
  }, [searchTerm, profiles]);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, age, gender, location, profile_image, occupation')
        .order('name');

      if (error) throw error;
      setProfiles(data || []);
      setFilteredProfiles(data || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProfile = async (profileId: string, profileName: string) => {
    setSelecting(true);
    try {
      await selectProfile(profileId);
      toast.success(`Logged in as ${profileName}`);
      navigate('/discovery');
    } catch (error) {
      console.error('Error selecting profile:', error);
      toast.error('Failed to select profile');
    } finally {
      setSelecting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              KurdMatch
            </h1>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Select a Profile
          </h2>
          <p className="text-purple-200">
            Choose from {profiles.length} available profiles
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by name, location, or occupation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
            />
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="backdrop-blur-md bg-white/10 rounded-xl border border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-200"
            >
              <div className="aspect-square relative">
                <img
                  src={profile.profile_image}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/400';
                  }}
                />
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {profile.name}, {profile.age}
                  </h3>
                  <p className="text-purple-200 text-sm">{profile.occupation}</p>
                  <p className="text-purple-300 text-xs">{profile.location}</p>
                </div>
                <Button
                  onClick={() => handleSelectProfile(profile.id, profile.name)}
                  disabled={selecting}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  {selecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Selecting...
                    </>
                  ) : (
                    'Select Profile'
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-purple-200 text-lg">
              No profiles found matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSelector;
