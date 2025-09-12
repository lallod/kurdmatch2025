import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, X, MessageCircle, Heart, Star, User, Briefcase, Home, Sparkles, Users } from 'lucide-react';
import { Profile as ProfileType } from '@/types/swipe';
import { supabase } from '@/integrations/supabase/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileSwipeActions from '@/components/swipe/ProfileSwipeActions';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileId = location.state?.profileId;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [matchPercentage] = useState(Math.floor(Math.random() * 20) + 75); // Mock match percentage

  useEffect(() => {
    console.log('Location state:', location.state);
    console.log('Profile ID from state:', profileId);
    
    if (profileId) {
      fetchProfile();
    } else {
      console.log('No profile ID provided - location.state:', location.state);
      setLoading(false);
    }
  }, [profileId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log('Fetching profile for ID:', profileId);
      console.log('ProfileId type:', typeof profileId);
      console.log('ProfileId value:', profileId);
      
      // Check if profileId exists
      if (!profileId) {
        console.error('No profileId provided');
        setProfile(null);
        return;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .maybeSingle();

      console.log('Supabase query result:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!data) {
        console.log('No profile found for ID:', profileId);
      }
      
      console.log('Profile data received:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-2 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2 text-white">Profile not found</h2>
          <button 
            onClick={() => navigate(-1)}
            className="text-purple-300 hover:text-purple-200"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const calculateDistance = () => Math.floor(Math.random() * 30) + 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
      {/* Header */}
      <div className="relative z-10 p-4">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 rounded-full bg-black/20 backdrop-blur-sm text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="absolute top-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-sm">
          <div className="w-6 h-6 border border-white/60 rounded text-white/80 flex items-center justify-center text-xs">
            P
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-md mx-auto px-4 pb-20">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl">
          {/* Profile Image */}
          <div className="aspect-[3/4] relative overflow-hidden">
            <img
              src={profile.profile_image || '/placeholder.svg'}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
            

            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
                  <span className="text-xl text-white/90">{profile.age}</span>
                </div>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-3 py-1">
                  ⚡ {matchPercentage}%
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-white/90 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>{profile.location}</span>
                <span className="text-white/70">•</span>
                <span>{calculateDistance()}km away</span>
              </div>

              {profile.kurdistan_region && (
                <Badge className="bg-purple-500/80 text-white mb-3 mr-2">
                  {profile.kurdistan_region}
                </Badge>
              )}

              <div className="text-white/90 text-sm mb-2">
                Looking for: {profile.relationship_goals || 'Not specified'}
              </div>

              {profile.occupation && (
                <Badge className="bg-pink-500/80 text-white text-sm">
                  {profile.occupation}
                </Badge>
              )}
            </div>
          </div>

          {/* About Section */}
          {profile.bio && (
            <div className="p-6 bg-black/20 border-b border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-pink-500/20 rounded-full flex items-center justify-center">
                  ⚡
                </div>
                <h3 className="text-lg font-semibold text-white">About {profile.name.split(' ')[0]}</h3>
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-3">{profile.bio}</p>
              
              {(!profile.interests || profile.interests.length === 0) && (
                <p className="text-white/60 text-sm">No common interests found</p>
              )}
            </div>
          )}

          {/* Expandable Sections */}
          <div className="bg-gradient-to-b from-black/20 to-black/40">
            <Accordion type="multiple" className="w-full">
              {/* Basic Info */}
              <AccordionItem value="basic" className="border-b border-white/10">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-white/80 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-white/70" />
                    <span className="font-medium">Basic Info</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-2 text-sm text-white/90">
                    {profile.height && <div><span className="text-white/70">Height:</span> {profile.height}</div>}
                    {profile.body_type && <div><span className="text-white/70">Body Type:</span> {profile.body_type}</div>}
                    {profile.ethnicity && <div><span className="text-white/70">Ethnicity:</span> {profile.ethnicity}</div>}
                    {profile.religion && <div><span className="text-white/70">Religion:</span> {profile.religion}</div>}
                    {profile.zodiac_sign && <div><span className="text-white/70">Zodiac:</span> {profile.zodiac_sign}</div>}
                    {profile.personality_type && <div><span className="text-white/70">Personality:</span> {profile.personality_type}</div>}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Career & Education */}
              <AccordionItem value="career" className="border-b border-white/10">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-white/80 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-white/70" />
                    <span className="font-medium">Career & Education</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-2 text-sm text-white/90">
                    {profile.occupation && <div><span className="text-white/70">Occupation:</span> {profile.occupation}</div>}
                    {profile.education && <div><span className="text-white/70">Education:</span> {profile.education}</div>}
                    {profile.company && <div><span className="text-white/70">Company:</span> {profile.company}</div>}
                    {profile.career_ambitions && <div><span className="text-white/70">Goals:</span> {profile.career_ambitions}</div>}
                    {profile.work_environment && <div><span className="text-white/70">Work Style:</span> {profile.work_environment}</div>}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Lifestyle */}
              <AccordionItem value="lifestyle" className="border-b border-white/10">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-white/80 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-white/70" />
                    <span className="font-medium">Lifestyle</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-2 text-sm text-white/90">
                    {profile.exercise_habits && <div><span className="text-white/70">Exercise:</span> {profile.exercise_habits}</div>}
                    {profile.dietary_preferences && <div><span className="text-white/70">Diet:</span> {profile.dietary_preferences}</div>}
                    {profile.smoking && <div><span className="text-white/70">Smoking:</span> {profile.smoking}</div>}
                    {profile.drinking && <div><span className="text-white/70">Drinking:</span> {profile.drinking}</div>}
                    {profile.sleep_schedule && <div><span className="text-white/70">Sleep:</span> {profile.sleep_schedule}</div>}
                    {profile.have_pets && <div><span className="text-white/70">Pets:</span> {profile.have_pets}</div>}
                    
                    {profile.hobbies && profile.hobbies.length > 0 && (
                      <div>
                        <span className="text-white/70">Hobbies:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.hobbies.map((hobby: string, index: number) => (
                            <Badge key={index} className="bg-white/20 text-white text-xs">
                              {hobby}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Beliefs & Values */}
              <AccordionItem value="beliefs" className="border-b border-white/10">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-white/80 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-white/70" />
                    <span className="font-medium">Beliefs & Values</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-2 text-sm text-white/90">
                    {profile.political_views && <div><span className="text-white/70">Political Views:</span> {profile.political_views}</div>}
                    
                    {profile.values && profile.values.length > 0 && (
                      <div>
                        <span className="text-white/70">Values:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.values.map((value: string, index: number) => (
                            <Badge key={index} className="bg-purple-500/30 text-white text-xs">
                              {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {profile.interests && profile.interests.length > 0 && (
                      <div>
                        <span className="text-white/70">Interests:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.interests.map((interest: string, index: number) => (
                            <Badge key={index} className="bg-pink-500/30 text-white text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Relationships */}
              <AccordionItem value="relationships" className="border-b-0">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-white/80 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-white/70" />
                    <span className="font-medium">Relationships</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-2 text-sm text-white/90">
                    {profile.relationship_goals && <div><span className="text-white/70">Looking for:</span> {profile.relationship_goals}</div>}
                    {profile.want_children && <div><span className="text-white/70">Children:</span> {profile.want_children}</div>}
                    {profile.love_language && <div><span className="text-white/70">Love Language:</span> {profile.love_language}</div>}
                    {profile.communication_style && <div><span className="text-white/70">Communication:</span> {profile.communication_style}</div>}
                    {profile.ideal_date && <div><span className="text-white/70">Ideal Date:</span> {profile.ideal_date}</div>}
                    {profile.family_closeness && <div><span className="text-white/70">Family:</span> {profile.family_closeness}</div>}
                    
                    {profile.languages && profile.languages.length > 0 && (
                      <div>
                        <span className="text-white/70">Languages:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.languages.map((language: string, index: number) => (
                            <Badge key={index} className="bg-purple-400/30 text-white text-xs">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        
        {/* Profile Swipe Actions */}
        <div className="mt-6">
          <ProfileSwipeActions
            profileId={profileId}
            profileName={profile.name}
            profileImage={profile.profile_image || '/placeholder.svg'}
          />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;