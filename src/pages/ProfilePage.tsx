
import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import ProfileHeader from '@/components/ProfileHeader';
import PhotoGallery from '@/components/PhotoGallery';
import ProfileDetails from '@/components/ProfileDetails';
import ProfileActionButtons from '@/components/profile/ProfileActionButtons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Heart, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useProfileViewTracking } from '@/hooks/useProfileViewTracking';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  // Track profile view
  useProfileViewTracking(id);

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    }
  }, [id]);

  const fetchProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch photos
      const { data: photos, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .eq('profile_id', userId)
        .order('is_primary', { ascending: false });

      if (photosError) throw photosError;

      setProfile({
        ...profileData,
        photos: photos?.map(p => p.url) || [profileData.profile_image]
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="animate-bounce flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4">
            <Heart size={40} className="text-primary animate-pulse" />
          </div>
          <div className="text-foreground text-xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const details = {
    about: profile.bio || 'No bio available',
    height: profile.height,
    bodyType: profile.body_type,
    ethnicity: profile.ethnicity,
    education: profile.education,
    occupation: profile.occupation,
    company: profile.company,
    religion: profile.religion,
    politicalViews: profile.political_views,
    drinking: profile.drinking,
    smoking: profile.smoking,
    relationshipGoals: profile.relationship_goals,
    wantChildren: profile.want_children,
    havePets: profile.have_pets,
    languages: profile.languages,
    interests: profile.interests,
    hobbies: profile.hobbies,
    values: profile.values,
    exerciseHabits: profile.exercise_habits,
    zodiacSign: profile.zodiac_sign,
    personalityType: profile.personality_type,
    sleepSchedule: profile.sleep_schedule,
    travelFrequency: profile.travel_frequency,
    communicationStyle: profile.communication_style,
    loveLanguage: profile.love_language,
    petPeeves: profile.pet_peeves,
    dreamVacation: profile.dream_vacation,
    weekendActivities: profile.weekend_activities,
    financialHabits: profile.financial_habits,
    idealDate: profile.ideal_date,
    familyCloseness: profile.family_closeness,
    friendshipStyle: profile.friendship_style,
    workLifeBalance: profile.work_life_balance,
    careerAmbitions: profile.career_ambitions,
    dietaryPreferences: profile.dietary_preferences,
    favoriteQuote: profile.favorite_quote,
    morningRoutine: profile.morning_routine,
    eveningRoutine: profile.evening_routine,
    favoriteSeason: profile.favorite_season,
    idealWeather: profile.ideal_weather,
    creativePursuits: profile.creative_pursuits,
    dreamHome: profile.dream_home,
    transportationPreference: profile.transportation_preference,
    techSkills: profile.tech_skills,
    musicInstruments: profile.music_instruments,
    favoriteGames: profile.favorite_games,
    favoritePodcasts: profile.favorite_podcasts,
    favoriteBooks: profile.favorite_books,
    favoriteMovies: profile.favorite_movies,
    favoriteMusic: profile.favorite_music,
    favoriteFoods: profile.favorite_foods,
    charityInvolvement: profile.charity_involvement,
    growthGoals: profile.growth_goals,
    hiddenTalents: profile.hidden_talents,
    favoriteMemory: profile.favorite_memory,
    stressRelievers: profile.stress_relievers,
    workEnvironment: profile.work_environment,
    decisionMakingStyle: profile.decision_making_style
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Back Button */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="min-h-screen flex flex-col w-full">
        <ProfileHeader
          name={profile.name}
          age={profile.age}
          location={profile.location}
          occupation={profile.occupation}
          lastActive="Active recently"
          verified={profile.verified}
          profileImage={profile.profile_image}
        />
        
        <div className="w-full h-[1px] bg-border"></div>
        
        {/* Photo Gallery */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full max-w-4xl px-4 py-6">
            <PhotoGallery 
              photos={profile.photos} 
              name={profile.name} 
              age={profile.age} 
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <ProfileActionButtons
            userId={profile.id}
            userName={profile.name}
          />
        </div>
      </div>
      
      {/* Details Section */}
      <div className="w-full h-[1px] bg-border"></div>
      
      <div className="w-full">
        <ProfileDetails details={details} />
      </div>
      
      <footer className="w-full py-6 md:py-8 text-center text-sm text-muted-foreground border-t border-border">
        <p>© {new Date().getFullYear()} Dating Profile App</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
