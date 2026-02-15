import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, X, MessageCircle, Heart, Star, User, Briefcase, Home, Sparkles, Users } from 'lucide-react';
import { Profile as ProfileType } from '@/types/swipe';
import { supabase } from '@/integrations/supabase/client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

import ProfileSwipeActions from '@/components/swipe/ProfileSwipeActions';
import ProfileActionButtons from '@/components/profile/ProfileActionButtons';
import { toast } from 'sonner';
import { getDisplayValue, hasRealArrayValues } from '@/utils/profileHelpers';
import { useCompatibility } from '@/hooks/useCompatibility';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSupabaseAuth();
  const { calculateCompatibility } = useCompatibility();
  const profileId = location.state?.profileId;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [matchPercentage, setMatchPercentage] = useState(50);

  useEffect(() => {
    if (profileId) {
      fetchProfile();
      if (user) {
        calculateCompatibility(profileId).then(score => {
          setMatchPercentage(score);
        });
      }
    } else {
      setLoading(false);
    }
  }, [profileId, user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (!profileId) { setProfile(null); return; }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .neq('profile_image', 'https://placehold.co/400')
        .not('profile_image', 'is', null)
        .neq('profile_image', '')
        .maybeSingle();

      if (error) throw error;
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-foreground">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-foreground">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Profile not found</h2>
          <button onClick={() => navigate(-1)} className="text-primary hover:text-primary/80">Go back</button>
        </div>
      </div>
    );
  }

  const calculateDistance = () => Math.floor(Math.random() * 30) + 5;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative z-10 p-3 sm:p-4">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 sm:top-4 left-3 sm:left-4 p-1.5 sm:p-2 rounded-full bg-card/80 backdrop-blur-sm text-foreground/80 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Profile Card */}
      <div className="max-w-md mx-auto px-3 sm:px-4 pb-24">
        <div className="bg-card/50 backdrop-blur-md rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-border/20">
          {/* Profile Image */}
          <div className="aspect-[3/4] relative overflow-hidden">
            <img src={profile.profile_image} alt={profile.name} className="w-full h-full object-cover object-top" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">{profile.name}</h1>
                  <span className="text-lg sm:text-xl text-white/90">{profile.age}</span>
                </div>
                <Badge className="bg-primary text-primary-foreground font-semibold px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm">
                  ⚡ {matchPercentage}%
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-white/90 mb-2 sm:mb-3 text-sm">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span className="text-xs sm:text-sm">{profile.location}</span>
                <span className="text-white/70">•</span>
                <span className="text-xs sm:text-sm">{calculateDistance()}km away</span>
              </div>
              {profile.kurdistan_region && (
                <Badge className="bg-primary/80 text-primary-foreground mb-2 sm:mb-3 mr-2 text-xs">{profile.kurdistan_region}</Badge>
              )}
              <div className="text-white/90 text-xs sm:text-sm mb-2">
                {getDisplayValue(profile.relationship_goals) && <>Looking for: {profile.relationship_goals}</>}
              </div>
              {getDisplayValue(profile.occupation) && (
                <Badge className="bg-accent/80 text-accent-foreground text-xs sm:text-sm">{profile.occupation}</Badge>
              )}
            </div>
          </div>

          {/* About Section */}
          {getDisplayValue(profile.bio) && (
            <div className="p-4 sm:p-6 bg-card/30 border-b border-border/10">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm">⚡</div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">About {profile.name.split(' ')[0]}</h3>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3">{profile.bio}</p>
            </div>
          )}

          {/* Expandable Sections */}
          <div className="bg-card/20">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="basic" className="border-b border-border/10">
                <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-foreground hover:text-foreground/80 hover:no-underline">
                  <div className="flex items-center gap-2 sm:gap-3"><User className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" /><span className="font-medium text-sm sm:text-base">Basic Info</span></div>
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-3 sm:pb-4">
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                    {getDisplayValue(profile.height) && <div><span className="text-muted-foreground/70">Height:</span> {profile.height}</div>}
                    {getDisplayValue(profile.body_type) && <div><span className="text-muted-foreground/70">Body Type:</span> {profile.body_type}</div>}
                    {getDisplayValue(profile.ethnicity) && <div><span className="text-muted-foreground/70">Ethnicity:</span> {profile.ethnicity}</div>}
                    {getDisplayValue(profile.religion) && <div><span className="text-muted-foreground/70">Religion:</span> {profile.religion}</div>}
                    {getDisplayValue(profile.zodiac_sign) && <div><span className="text-muted-foreground/70">Zodiac:</span> {profile.zodiac_sign}</div>}
                    {getDisplayValue(profile.personality_type) && <div><span className="text-muted-foreground/70">Personality:</span> {profile.personality_type}</div>}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="career" className="border-b border-border/10">
                <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-foreground hover:text-foreground/80 hover:no-underline">
                  <div className="flex items-center gap-2 sm:gap-3"><Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" /><span className="font-medium text-sm sm:text-base">Career & Education</span></div>
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-3 sm:pb-4">
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                    {getDisplayValue(profile.occupation) && <div><span className="text-muted-foreground/70">Occupation:</span> {profile.occupation}</div>}
                    {getDisplayValue(profile.education) && <div><span className="text-muted-foreground/70">Education:</span> {profile.education}</div>}
                    {getDisplayValue(profile.company) && <div><span className="text-muted-foreground/70">Company:</span> {profile.company}</div>}
                    {getDisplayValue(profile.career_ambitions) && <div><span className="text-muted-foreground/70">Goals:</span> {profile.career_ambitions}</div>}
                    {getDisplayValue(profile.work_environment) && <div><span className="text-muted-foreground/70">Work Style:</span> {profile.work_environment}</div>}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="lifestyle" className="border-b border-border/10">
                <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-foreground hover:text-foreground/80 hover:no-underline">
                  <div className="flex items-center gap-2 sm:gap-3"><Home className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" /><span className="font-medium text-sm sm:text-base">Lifestyle</span></div>
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-3 sm:pb-4">
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                    {getDisplayValue(profile.exercise_habits) && <div><span className="text-muted-foreground/70">Exercise:</span> {profile.exercise_habits}</div>}
                    {getDisplayValue(profile.dietary_preferences) && <div><span className="text-muted-foreground/70">Diet:</span> {profile.dietary_preferences}</div>}
                    {getDisplayValue(profile.smoking) && <div><span className="text-muted-foreground/70">Smoking:</span> {profile.smoking}</div>}
                    {getDisplayValue(profile.drinking) && <div><span className="text-muted-foreground/70">Drinking:</span> {profile.drinking}</div>}
                    {getDisplayValue(profile.sleep_schedule) && <div><span className="text-muted-foreground/70">Sleep:</span> {profile.sleep_schedule}</div>}
                    {getDisplayValue(profile.have_pets) && <div><span className="text-muted-foreground/70">Pets:</span> {profile.have_pets}</div>}
                    {hasRealArrayValues(profile.hobbies) && (
                      <div>
                        <span className="text-muted-foreground/70">Hobbies:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.hobbies.map((hobby: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">{hobby}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="beliefs" className="border-b border-border/10">
                <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-foreground hover:text-foreground/80 hover:no-underline">
                  <div className="flex items-center gap-2 sm:gap-3"><Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" /><span className="font-medium text-sm sm:text-base">Beliefs & Values</span></div>
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-3 sm:pb-4">
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                    {getDisplayValue(profile.political_views) && <div><span className="text-muted-foreground/70">Political Views:</span> {profile.political_views}</div>}
                    {hasRealArrayValues(profile.values) && (
                      <div>
                        <span className="text-muted-foreground/70">Values:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.values.map((value: string, index: number) => (
                            <Badge key={index} className="bg-primary/20 text-primary text-xs">{value}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {hasRealArrayValues(profile.interests) && (
                      <div>
                        <span className="text-muted-foreground/70">Interests:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.interests.map((interest: string, index: number) => (
                            <Badge key={index} className="bg-accent/20 text-accent text-xs">{interest}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="relationships" className="border-b-0">
                <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-foreground hover:text-foreground/80 hover:no-underline">
                  <div className="flex items-center gap-2 sm:gap-3"><Users className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" /><span className="font-medium text-sm sm:text-base">Relationships</span></div>
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-3 sm:pb-4">
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                    {getDisplayValue(profile.relationship_goals) && <div><span className="text-muted-foreground/70">Looking for:</span> {profile.relationship_goals}</div>}
                    {getDisplayValue(profile.want_children) && <div><span className="text-muted-foreground/70">Children:</span> {profile.want_children}</div>}
                    {getDisplayValue(profile.love_language) && <div><span className="text-muted-foreground/70">Love Language:</span> {profile.love_language}</div>}
                    {getDisplayValue(profile.communication_style) && <div><span className="text-muted-foreground/70">Communication:</span> {profile.communication_style}</div>}
                    {getDisplayValue(profile.ideal_date) && <div><span className="text-muted-foreground/70">Ideal Date:</span> {profile.ideal_date}</div>}
                    {getDisplayValue(profile.family_closeness) && <div><span className="text-muted-foreground/70">Family:</span> {profile.family_closeness}</div>}
                    {hasRealArrayValues(profile.languages) && (
                      <div>
                        <span className="text-muted-foreground/70">Languages:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.languages.map((language: string, index: number) => (
                            <Badge key={index} className="bg-primary/20 text-primary text-xs">{language}</Badge>
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
        
        <div className="mt-4 sm:mt-6">
          <ProfileActionButtons userId={profileId} userName={profile.name} />
        </div>
        <div className="mt-4">
          <ProfileSwipeActions profileId={profileId} profileName={profile.name} profileImage={profile.profile_image} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
