import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { Accordion } from '@/components/ui/accordion';
import { 
  Settings, Heart, Camera, CheckCircle2, Share2,
  User, Wine, Star, Briefcase, MapPin, Plus, Shield,
  Languages, BrainCircuit, Palette, Plane
} from 'lucide-react';
import PrivacySettings from '@/components/my-profile/PrivacySettings';
import EditableAccordionSection from '@/components/my-profile/EditableAccordionSection';
import { ProfileData, KurdistanRegion } from '@/types/profile';
import EditableAboutMeSection from '@/components/my-profile/sections/EditableAboutMeSection';

import ProfileBasics from '@/components/profile/ProfileBasics';
import ProfileLifestyle from '@/components/profile/ProfileLifestyle';
import ProfileInterests from '@/components/profile/ProfileInterests';
import ProfileCommunication from '@/components/profile/ProfileCommunication';
import ProfilePersonality from '@/components/profile/ProfilePersonality';
import ProfileCreative from '@/components/profile/ProfileCreative';
import ProfileTravel from '@/components/profile/ProfileTravel';
import ProfileQuickStats from '@/components/profile/ProfileQuickStats';

import { useRealProfileData } from '@/hooks/useRealProfileData';
import { toast } from 'sonner';
import { uploadProfilePhoto, getUserPhotos, deletePhoto, setPhotoPrimary } from '@/api/profiles';
import { X } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';


const MyProfile = () => {
  const navigate = useNavigate();
  
  const { t } = useTranslations();
  
  const { 
    profileData: realProfileData, fieldSources = {}, loading, onboardingProgress, categoryProgress, engagement, updateProfileData, refreshData 
  } = useRealProfileData();

  const profileData: ProfileData = realProfileData ? {
    name: realProfileData.name || '',
    age: realProfileData.age || 0,
    location: realProfileData.location || '',
    occupation: realProfileData.occupation || '',
    lastActive: realProfileData.last_active || '',
    verified: realProfileData.verified || false,
    profileImage: realProfileData.profile_image || '',
    distance: 0,
    kurdistanRegion: (realProfileData.kurdistan_region as KurdistanRegion) || "South-Kurdistan",
    bio: realProfileData.bio || '',
    height: realProfileData.height || '',
    bodyType: realProfileData.body_type || '',
    ethnicity: realProfileData.ethnicity || '',
    religion: realProfileData.religion || '',
    politicalViews: realProfileData.political_views || '',
    values: realProfileData.values || [],
    interests: realProfileData.interests || [],
    hobbies: realProfileData.hobbies || [],
    languages: realProfileData.languages || [],
    education: realProfileData.education || '',
    company: realProfileData.company || '',
    relationshipGoals: realProfileData.relationship_goals || '',
    wantChildren: realProfileData.want_children || '',
    havePets: realProfileData.have_pets || '',
    exerciseHabits: realProfileData.exercise_habits || '',
    zodiacSign: realProfileData.zodiac_sign || '',
    personalityType: realProfileData.personality_type || '',
    sleepSchedule: realProfileData.sleep_schedule || '',
    travelFrequency: realProfileData.travel_frequency || '',
    communicationStyle: realProfileData.communication_style || '',
    loveLanguage: realProfileData.love_language || '',
    creativePursuits: realProfileData.creative_pursuits || [],
    weekendActivities: realProfileData.weekend_activities || [],
    dietaryPreferences: realProfileData.dietary_preferences || '',
    smoking: realProfileData.smoking || '',
    drinking: realProfileData.drinking || '',
    idealDate: realProfileData.ideal_date || '',
    workLifeBalance: realProfileData.work_life_balance || '',
    careerAmbitions: realProfileData.career_ambitions || '',
    morningRoutine: realProfileData.morning_routine || '',
    eveningRoutine: realProfileData.evening_routine || '',
    decisionMakingStyle: realProfileData.decision_making_style || '',
    growthGoals: realProfileData.growth_goals || [],
    hiddenTalents: realProfileData.hidden_talents || [],
    favoriteMemory: realProfileData.favorite_memory || '',
    stressRelievers: realProfileData.stress_relievers || [],
    charityInvolvement: realProfileData.charity_involvement || '',
    musicInstruments: realProfileData.music_instruments || [],
    favoriteGames: realProfileData.favorite_games || [],
    techSkills: realProfileData.tech_skills || [],
    dreamHome: realProfileData.dream_home || '',
    transportationPreference: realProfileData.transportation_preference || '',
    workEnvironment: realProfileData.work_environment || '',
    favoriteSeason: realProfileData.favorite_season || '',
    idealWeather: realProfileData.ideal_weather || '',
    dreamVacation: realProfileData.dream_vacation || '',
    financialHabits: realProfileData.financial_habits || '',
    petPeeves: realProfileData.pet_peeves || [],
    childrenStatus: realProfileData.children_status || '',
    familyCloseness: realProfileData.family_closeness || '',
    friendshipStyle: realProfileData.friendship_style || '',
    favoriteQuote: realProfileData.favorite_quote || '',
    favoritePodcasts: realProfileData.favorite_podcasts || [],
    favoriteBooks: realProfileData.favorite_books || [],
    favoriteMovies: realProfileData.favorite_movies || [],
    favoriteMusic: realProfileData.favorite_music || [],
    favoriteFoods: realProfileData.favorite_foods || [],
  } : {
    name: '', age: 0, location: '', occupation: '', lastActive: '', verified: false, profileImage: '', distance: 0,
    kurdistanRegion: "South-Kurdistan" as KurdistanRegion, bio: '', height: '', bodyType: '', ethnicity: '',
    religion: '', politicalViews: '', values: [], interests: [], hobbies: [], languages: [], education: '',
    company: '', relationshipGoals: '', wantChildren: '', havePets: '', exerciseHabits: '', zodiacSign: '',
    personalityType: '', sleepSchedule: '', travelFrequency: '', communicationStyle: '', loveLanguage: '',
    petPeeves: [], dreamVacation: '', weekendActivities: [], financialHabits: '', idealDate: '', childrenStatus: '',
    familyCloseness: '', friendshipStyle: '', workLifeBalance: '', careerAmbitions: '', dietaryPreferences: '',
    favoriteQuote: '', morningRoutine: '', eveningRoutine: '', favoriteSeason: '', idealWeather: '',
    creativePursuits: [], dreamHome: '', transportationPreference: '', techSkills: [], musicInstruments: [],
    favoriteGames: [], favoritePodcasts: [], favoriteBooks: [], favoriteMovies: [], favoriteMusic: [],
    favoriteFoods: [], charityInvolvement: '', growthGoals: [], hiddenTalents: [], favoriteMemory: '',
    stressRelievers: [], workEnvironment: '', decisionMakingStyle: '', smoking: '', drinking: ''
  };

  // Map profileData to the `details` format expected by profile viewer components
  const details = {
    about: profileData.bio,
    height: profileData.height,
    bodyType: profileData.bodyType,
    ethnicity: profileData.ethnicity,
    education: profileData.education,
    occupation: profileData.occupation,
    company: profileData.company,
    religion: profileData.religion,
    politicalViews: profileData.politicalViews,
    drinking: profileData.drinking,
    smoking: profileData.smoking,
    relationshipGoals: profileData.relationshipGoals,
    wantChildren: profileData.wantChildren,
    havePets: profileData.havePets,
    languages: profileData.languages,
    interests: profileData.interests,
    hobbies: profileData.hobbies,
    exerciseHabits: profileData.exerciseHabits,
    zodiacSign: profileData.zodiacSign,
    personalityType: profileData.personalityType,
    sleepSchedule: profileData.sleepSchedule,
    travelFrequency: profileData.travelFrequency,
    communicationStyle: profileData.communicationStyle,
    loveLanguage: profileData.loveLanguage,
    weekendActivities: profileData.weekendActivities,
    dietaryPreferences: profileData.dietaryPreferences,
    idealDate: profileData.idealDate,
    workLifeBalance: profileData.workLifeBalance,
    careerAmbitions: profileData.careerAmbitions,
    values: profileData.values,
    creativePursuits: profileData.creativePursuits,
    morningRoutine: profileData.morningRoutine || '',
    eveningRoutine: profileData.eveningRoutine || '',
    decisionMakingStyle: profileData.decisionMakingStyle || '',
    growthGoals: profileData.growthGoals || [],
    hiddenTalents: profileData.hiddenTalents || [],
    favoriteMemory: profileData.favoriteMemory || '',
    stressRelievers: profileData.stressRelievers || [],
    charityInvolvement: profileData.charityInvolvement || '',
    musicInstruments: profileData.musicInstruments || [],
    favoriteGames: profileData.favoriteGames || [],
    techSkills: profileData.techSkills || [],
    dreamHome: profileData.dreamHome || '',
    transportationPreference: profileData.transportationPreference || '',
    workEnvironment: profileData.workEnvironment || '',
    favoriteSeason: profileData.favoriteSeason || '',
    idealWeather: profileData.idealWeather || '',
    dreamVacation: profileData.dreamVacation || '',
    financialHabits: profileData.financialHabits || '',
    favoriteBooks: profileData.favoriteBooks || [],
    favoriteMovies: profileData.favoriteMovies || [],
    favoriteMusic: profileData.favoriteMusic || [],
    favoriteFoods: profileData.favoriteFoods || [],
    favoriteQuote: profileData.favoriteQuote || '',
    favoritePodcasts: profileData.favoritePodcasts || [],
    petPeeves: profileData.petPeeves || [],
    childrenStatus: profileData.childrenStatus || '',
    familyCloseness: profileData.familyCloseness || '',
    friendshipStyle: profileData.friendshipStyle || '',
  };

  const tinderBadgeStyle = "rounded-full bg-primary/10 border border-primary/20 text-primary shadow-sm";
  const formatList = (value: string[] | string | undefined) => {
    if (!value) return "";
    if (Array.isArray(value)) return value.join(", ");
    return value;
  };

  const [galleryPhotos, setGalleryPhotos] = useState<{ id: string; url: string; is_primary: boolean }[]>([]);

  const loadPhotos = async () => {
    if (!realProfileData?.id) return;
    try {
      const photos = await getUserPhotos(realProfileData.id);
      setGalleryPhotos(photos);
    } catch (err) {
      console.error('Failed to load photos:', err);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [realProfileData?.id]);

  const galleryImages = galleryPhotos.map(p => p.url);

  const profileCompletion = categoryProgress?.overall || 0;
  const profileStats = {
    views: engagement?.profileViews || 0,
    likes: engagement?.likesReceived || 0,
    matches: engagement?.matches || 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const isPrimary = galleryPhotos.length === 0;
        await uploadProfilePhoto(files[0], isPrimary);
        await loadPhotos();
        if (isPrimary) refreshData();
        toast.success(isPrimary ? 'Profile photo set' : 'Photo uploaded');
      } catch (error) {
        console.error('Photo upload failed:', error);
        toast.error('Failed to upload photo');
      }
    }
  };

  const handleRemovePhoto = async (photoId: string) => {
    try {
      await deletePhoto(photoId);
      await loadPhotos();
      refreshData();
      toast.success('Photo removed');
    } catch (error) {
      toast.error('Failed to remove photo');
    }
  };

  const handleSetPrimary = async (photoId: string) => {
    try {
      await setPhotoPrimary(photoId);
      await loadPhotos();
      refreshData();
      toast.success('Profile photo updated');
    } catch (error) {
      toast.error('Failed to set profile photo');
    }
  };

  const handleProfileUpdate = async (updates: Partial<ProfileData>) => {
    try {
      const fieldMap: Record<string, string> = {
        height: 'height', bodyType: 'body_type', ethnicity: 'ethnicity',
        religion: 'religion', politicalViews: 'political_views',
        values: 'values', interests: 'interests', hobbies: 'hobbies',
        languages: 'languages', education: 'education', company: 'company',
        relationshipGoals: 'relationship_goals', wantChildren: 'want_children',
        havePets: 'have_pets', exerciseHabits: 'exercise_habits',
        zodiacSign: 'zodiac_sign', personalityType: 'personality_type',
        sleepSchedule: 'sleep_schedule', travelFrequency: 'travel_frequency',
        communicationStyle: 'communication_style', loveLanguage: 'love_language',
        creativePursuits: 'creative_pursuits', weekendActivities: 'weekend_activities',
        dietaryPreferences: 'dietary_preferences', smoking: 'smoking', drinking: 'drinking',
        idealDate: 'ideal_date', workLifeBalance: 'work_life_balance',
        careerAmbitions: 'career_ambitions', occupation: 'occupation', name: 'name',
        location: 'location', bio: 'bio', kurdistanRegion: 'kurdistan_region',
        morningRoutine: 'morning_routine', eveningRoutine: 'evening_routine',
        decisionMakingStyle: 'decision_making_style',
        growthGoals: 'growth_goals', hiddenTalents: 'hidden_talents',
        stressRelievers: 'stress_relievers', charityInvolvement: 'charity_involvement',
        favoriteMemory: 'favorite_memory', musicInstruments: 'music_instruments',
        favoriteGames: 'favorite_games', techSkills: 'tech_skills',
        dreamHome: 'dream_home', transportationPreference: 'transportation_preference',
        workEnvironment: 'work_environment', favoriteSeason: 'favorite_season',
        idealWeather: 'ideal_weather', dreamVacation: 'dream_vacation',
        financialHabits: 'financial_habits',
        petPeeves: 'pet_peeves', childrenStatus: 'children_status',
        familyCloseness: 'family_closeness', friendshipStyle: 'friendship_style',
        favoriteQuote: 'favorite_quote', favoritePodcasts: 'favorite_podcasts',
        favoriteBooks: 'favorite_books', favoriteMovies: 'favorite_movies',
        favoriteMusic: 'favorite_music', favoriteFoods: 'favorite_foods',
      };
      const dbUpdates: any = {};
      for (const [key, value] of Object.entries(updates)) {
        const dbKey = fieldMap[key];
        if (dbKey !== undefined) {
          dbUpdates[dbKey] = value;
        }
      }
      if (Object.keys(dbUpdates).length > 0) {
        await updateProfileData(dbUpdates);
        toast.success('Profile updated successfully');
      }
    } catch (error) { toast.error('Failed to update profile'); }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/10">
          <div className="max-w-md mx-auto px-4 h-12 flex items-center justify-between">
            <h1 className="text-lg font-bold text-foreground">{t('my_profile.title', 'Profile')}</h1>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => navigate('/settings')}>
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Hero section */}
        <div className="relative">
          <div className="h-28 bg-gradient-to-b from-primary/20 to-background" />
          <div className="max-w-md mx-auto px-4 -mt-16 flex flex-col items-center">
            <div className="relative mb-3">
              <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
                <AvatarImage src={galleryPhotos[0]?.url || profileData.profileImage} alt={profileData.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {profileData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg">
                <Camera className="h-4 w-4 text-primary-foreground" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            <div className="flex items-center gap-1.5 mb-1">
              <h2 className="text-xl font-bold text-foreground">{profileData.name}</h2>
              {profileData.verified && <CheckCircle2 className="h-5 w-5 text-primary fill-primary" />}
              {profileData.age > 0 && <span className="text-muted-foreground font-medium">, {profileData.age}</span>}
            </div>

            {profileData.occupation && (
              <p className="text-sm text-muted-foreground">{profileData.occupation}</p>
            )}
            {profileData.location && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />{profileData.location}
              </p>
            )}

            <div className="flex gap-1.5 mt-2">
              <Badge className="bg-primary/15 text-primary border-primary/20 text-xs rounded-full">{profileData.kurdistanRegion}</Badge>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto mt-4 space-y-3">
          {/* Stats card */}
          <div className="mx-4 bg-card rounded-2xl p-4 shadow-md">
            <div className="flex justify-around">
              {[
                 { value: profileStats.views, label: t('my_profile.views', 'Views'), path: '/viewed-me' },
                 { value: profileStats.likes, label: t('my_profile.likes', 'Likes'), path: '/liked-me' },
                 { value: profileStats.matches, label: t('my_profile.matches', 'Matches'), path: '/matches' },
              ].map((stat, i) => (
                <React.Fragment key={stat.label}>
                  {i > 0 && <div className="w-px bg-border/30" />}
                  <button onClick={() => navigate(stat.path)} className="text-center px-4 hover:opacity-80 transition-opacity">
                    <div className="text-xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Completion banner */}
          {profileCompletion < 100 && (
            <div className="mx-4 bg-gradient-to-r from-primary/15 to-accent/15 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
                    <circle cx="28" cy="28" r="24" fill="none" strokeWidth="4" className="stroke-muted/30" />
                    <circle cx="28" cy="28" r="24" fill="none" strokeWidth="4" className="stroke-primary"
                      strokeDasharray={`${(profileCompletion / 100) * 150.8} 150.8`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                    {profileCompletion}%
                  </span>
                </div>
                <div className="flex-1">
                   <p className="text-sm font-semibold text-foreground">{t('my_profile.complete_profile', 'Complete your profile')}</p>
                   <p className="text-xs text-muted-foreground mt-0.5">{t('my_profile.complete_profile_desc', 'Fill in missing details to get more matches')}</p>
                </div>
                 <Button size="sm" className="rounded-full h-9 px-4 text-xs">
                  {t('my_profile.continue', 'Continue')}
                </Button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mx-4 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 h-11 rounded-2xl text-sm font-medium"
              onClick={() => navigate(`/profile/${realProfileData?.id}`)}
            >
              <Share2 className="h-4 w-4 mr-1.5" />
              {t('my_profile.share_profile', 'Share Profile')}
            </Button>
          </div>

          {/* Bio section - editable inline */}
          <div className="mx-4">
            <EditableAboutMeSection bio={profileData.bio} onSave={(newBio: string) => handleProfileUpdate({ bio: newBio })} profileData={profileData} />
          </div>

          {/* Photo Grid */}
          <div className="mx-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">Photos</h3>
            <div className="bg-card rounded-2xl p-3 shadow-sm">
              <div className="grid grid-cols-3 gap-2">
                {galleryPhotos.slice(0, 6).map((photo, i) => (
                  <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden bg-muted group">
                    <img src={photo.url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    {photo.is_primary && (
                      <div className="absolute top-1.5 left-1.5">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 drop-shadow" />
                      </div>
                    )}
                    {/* Action overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!photo.is_primary && (
                        <button
                          onClick={() => handleSetPrimary(photo.id)}
                          className="h-8 w-8 rounded-full bg-card/90 flex items-center justify-center"
                          title="Set as profile photo"
                        >
                          <Star className="w-4 h-4 text-amber-400" />
                        </button>
                      )}
                      <button
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="h-8 w-8 rounded-full bg-destructive/90 flex items-center justify-center"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4 text-destructive-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
                {galleryPhotos.length < 6 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-border/40 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Plus className="w-6 h-6 text-muted-foreground" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats (as others see) */}
          <div className="mx-4">
            <ProfileQuickStats
              education={details.education}
              occupation={details.occupation}
              company={details.company}
              relationshipGoals={details.relationshipGoals}
              zodiacSign={details.zodiacSign}
              personalityType={details.personalityType}
              tinderBadgeStyle={tinderBadgeStyle}
              isMobile={true}
            />
          </div>

          {/* Profile Sections - as others see them, with edit buttons */}
          <div className="mx-4">
            <Accordion type="multiple" defaultValue={["basics", "lifestyle", "interests", "more", "personality", "creatives", "travel"]} className="w-full space-y-3">
              <EditableAccordionSection
                value="basics" title="Basics" icon={<User />} color="text-primary"
                gradientClass="bg-gradient-to-r from-primary/5 to-transparent" borderClass="border-primary/10"
              >
                <ProfileBasics details={details as any} tinderBadgeStyle={tinderBadgeStyle} formatList={formatList} isMobile={true} onFieldEdit={handleProfileUpdate} />
              </EditableAccordionSection>

              <EditableAccordionSection
                value="lifestyle" title="Lifestyle" icon={<Wine />} color="text-orange-500"
                gradientClass="bg-gradient-to-r from-orange-500/5 to-transparent" borderClass="border-orange-500/10"
              >
                <ProfileLifestyle details={details as any} formatList={formatList} isMobile={true} onFieldEdit={handleProfileUpdate} />
              </EditableAccordionSection>

              <EditableAccordionSection
                value="interests" title="Interests & Hobbies" icon={<Star />} color="text-amber-500"
                gradientClass="bg-gradient-to-r from-amber-500/5 to-transparent" borderClass="border-amber-500/10"
              >
                <ProfileInterests details={details as any} tinderBadgeStyle={tinderBadgeStyle} formatList={formatList} isMobile={true} onFieldEdit={handleProfileUpdate} />
              </EditableAccordionSection>

              <EditableAccordionSection
                value="more" title="Communication" icon={<Languages />} color="text-primary"
                gradientClass="bg-gradient-to-r from-primary/5 to-transparent" borderClass="border-primary/10"
              >
                <ProfileCommunication details={details as any} tinderBadgeStyle={tinderBadgeStyle} isMobile={true} onFieldEdit={handleProfileUpdate} />
              </EditableAccordionSection>

              <EditableAccordionSection
                value="personality" title="Personality & Growth" icon={<BrainCircuit />} color="text-purple-500"
                gradientClass="bg-gradient-to-r from-purple-500/5 to-transparent" borderClass="border-purple-500/10"
              >
                <ProfilePersonality details={details as any} tinderBadgeStyle={tinderBadgeStyle} formatList={formatList} isMobile={true} onFieldEdit={handleProfileUpdate} />
              </EditableAccordionSection>

              <EditableAccordionSection
                value="creatives" title="Creative & Lifestyle" icon={<Palette />} color="text-pink-500"
                gradientClass="bg-gradient-to-r from-pink-500/5 to-transparent" borderClass="border-pink-500/10"
              >
                <ProfileCreative details={details as any} tinderBadgeStyle={tinderBadgeStyle} formatList={formatList} isMobile={true} onFieldEdit={handleProfileUpdate} />
              </EditableAccordionSection>

              <EditableAccordionSection
                value="travel" title="Travel" icon={<Plane />} color="text-teal-600"
                gradientClass="bg-gradient-to-r from-teal-600/5 to-transparent" borderClass="border-teal-600/10"
              >
                <ProfileTravel details={details as any} isMobile={true} onFieldEdit={handleProfileUpdate} />
              </EditableAccordionSection>
            </Accordion>
          </div>

          {/* Privacy & Visibility */}
          <div className="mx-4">
            <div className="flex items-center gap-2 px-1 mb-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Privacy & Visibility</h3>
            </div>
            <PrivacySettings />
          </div>
        </div>
      </div>

    </div>
  );
};

export default MyProfile;
