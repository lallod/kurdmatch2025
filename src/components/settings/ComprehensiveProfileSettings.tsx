import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Camera, Loader2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { getCurrentUserProfile, updateProfile, uploadProfilePhoto } from '@/api/profiles';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import type { Profile } from '@/api/profiles';

interface ComprehensiveProfileSettingsProps {
  onSave?: () => void;
}

const ComprehensiveProfileSettings: React.FC<ComprehensiveProfileSettingsProps> = ({ onSave }) => {
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  // Available options for select fields (Kurdish-focused)
  const heightOptions = ['5\'2"', '5\'3"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"', '6\'0"', '6\'1"', '6\'2"'];
  const bodyTypeOptions = ['Slim', 'Average', 'Athletic', 'Curvy', 'Plus-size'];
  const ethnicityOptions = ['Kurdish', 'Kurdish-Persian', 'Kurdish-Turkish', 'Kurdish-Arab', 'Middle Eastern', 'Mixed'];
  const kurdistanRegionOptions = ['South-Kurdistan', 'West-Kurdistan', 'East-Kurdistan', 'North-Kurdistan'];
  const religionOptions = ['Islam', 'Yarsanism', 'Yazidism', 'Christianity', 'Secular', 'Spiritual'];
  const politicalViewOptions = ['Progressive', 'Liberal', 'Moderate', 'Conservative', 'Kurdish Nationalist', 'Apolitical'];
  const educationOptions = ['High School', 'Some College', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD'];
  const relationshipGoalOptions = ['Looking for something serious', 'Marriage', 'Friendship first', 'Taking things slow', 'Seeking connection'];
  const childrenOptions = ['Want children someday', 'Don\'t want children', 'Open to children', 'Have children already'];
  const exerciseOptions = ['Regular exercise', 'Occasional exercise', 'Daily fitness routine', 'Sports enthusiast'];
  const smokingOptions = ['Non-smoker', 'Social smoker', 'Regular smoker', 'Former smoker'];
  const drinkingOptions = ['Non-drinker', 'Social drinker', 'Regular drinker', 'Former drinker'];
  const sleepScheduleOptions = ['Early bird', 'Night owl', 'Balanced sleeper', 'Inconsistent schedule'];
  const petOptions = ['Have pets', 'Love pets but don\'t have any', 'Allergic to pets', 'No pets'];
  const languageOptions = ['Kurdish', 'English', 'Arabic', 'Turkish', 'Persian', 'German', 'French', 'Spanish'];

  const valueOptions = ['Family', 'Kurdish heritage', 'Honesty', 'Community', 'Tradition', 'Freedom', 'Education', 'Respect', 'Cultural preservation', 'Independence'];
  const interestOptions = ['Kurdish music', 'Poetry', 'Literature', 'Cultural events', 'Traditional dance', 'History', 'Politics', 'Art', 'Photography', 'Travel'];
  const hobbyOptions = ['Reading', 'Dancing', 'Cooking', 'Photography', 'Hiking', 'Music', 'Writing', 'Travel', 'Learning languages', 'Volunteering'];
  const creativePursuitOptions = ['Photography', 'Painting', 'Drawing', 'Writing', 'Music production', 'Graphic design', 'Pottery', 'Jewelry making'];
  const weekendActivityOptions = ['Family gatherings', 'Cultural events', 'Outdoor activities', 'Relaxing at home', 'Exploring new places', 'Creative projects'];

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const profileData = await getCurrentUserProfile();
      setProfile(profileData);
      setFormData({
        ...profileData,
        age: profileData?.age || 25,
        values: profileData?.values || [],
        interests: profileData?.interests || [],
        hobbies: profileData?.hobbies || [],
        languages: profileData?.languages || [],
        creative_pursuits: profileData?.creative_pursuits || [],
        weekend_activities: profileData?.weekend_activities || []
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Auto-save after a delay
    debounceAutoSave(field, value);
  };

  const handleArrayAdd = (field: keyof Profile, value: string) => {
    const currentArray = (formData[field] as string[]) || [];
    if (!currentArray.includes(value)) {
      const newArray = [...currentArray, value];
      handleInputChange(field, newArray);
    }
  };

  const handleArrayRemove = (field: keyof Profile, value: string) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = currentArray.filter(item => item !== value);
    handleInputChange(field, newArray);
  };

  const debounceAutoSave = (() => {
    let timeoutId: NodeJS.Timeout;
    return (field: keyof Profile, value: any) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        autoSave(field, value);
      }, 1000); // Auto-save after 1 second of inactivity
    };
  })();

  const autoSave = async (field: keyof Profile, value: any) => {
    if (!user) return;
    
    try {
      await updateProfile(user.id, { [field]: value });
      toast.success(`${field} updated`, { duration: 2000 });
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast.error('Failed to save changes');
    }
  };

  const handleSaveAll = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      await updateProfile(user.id, formData);
      toast.success('Profile updated successfully');
      onSave?.();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      await uploadProfilePhoto(file, true);
      toast.success('Profile photo updated');
      loadProfile();
    } catch (error) {
      console.error('Failed to upload photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
              <TabsTrigger value="interests">Interests</TabsTrigger>
              <TabsTrigger value="career">Career</TabsTrigger>
              <TabsTrigger value="relationship">Relationship</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid gap-6">
                {/* Profile Photo */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={profile?.profile_image || 'https://via.placeholder.com/80'}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <label className="absolute -bottom-1 -right-1 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/90">
                      <Camera className="h-3 w-3 text-primary-foreground" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <p className="font-medium">{profile?.name}</p>
                    <p className="text-sm text-muted-foreground">Change profile photo</p>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age || ''}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                      placeholder="Your age"
                    />
                  </div>

                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Select value={formData.height} onValueChange={(value) => handleInputChange('height', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select height" />
                      </SelectTrigger>
                      <SelectContent>
                        {heightOptions.map(height => (
                          <SelectItem key={height} value={height}>{height}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="body_type">Body Type</Label>
                    <Select value={formData.body_type} onValueChange={(value) => handleInputChange('body_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select body type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bodyTypeOptions.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="ethnicity">Ethnicity</Label>
                    <Select value={formData.ethnicity} onValueChange={(value) => handleInputChange('ethnicity', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ethnicity" />
                      </SelectTrigger>
                      <SelectContent>
                        {ethnicityOptions.map(ethnicity => (
                          <SelectItem key={ethnicity} value={ethnicity}>{ethnicity}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Your location"
                    />
                  </div>

                  <div>
                    <Label htmlFor="kurdistan_region">Kurdistan Region</Label>
                    <Select value={formData.kurdistan_region} onValueChange={(value) => handleInputChange('kurdistan_region', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Kurdistan region" />
                      </SelectTrigger>
                      <SelectContent>
                        {kurdistanRegionOptions.map(region => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <Label>Languages</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.languages || []).map(lang => (
                      <Badge key={lang} variant="secondary" className="cursor-pointer" onClick={() => handleArrayRemove('languages', lang)}>
                        {lang} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={(value) => handleArrayAdd('languages', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.filter(lang => !(formData.languages || []).includes(lang)).map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lifestyle" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="exercise_habits">Exercise Habits</Label>
                  <Select value={formData.exercise_habits} onValueChange={(value) => handleInputChange('exercise_habits', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How often do you exercise?" />
                    </SelectTrigger>
                    <SelectContent>
                      {exerciseOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dietary_preferences">Dietary Preferences</Label>
                  <Select value={formData.dietary_preferences} onValueChange={(value) => handleInputChange('dietary_preferences', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="What's your diet like?" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Halal', 'Vegetarian', 'Omnivore', 'Pescatarian'].map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="smoking">Smoking</Label>
                  <Select value={formData.smoking} onValueChange={(value) => handleInputChange('smoking', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Do you smoke?" />
                    </SelectTrigger>
                    <SelectContent>
                      {smokingOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="drinking">Drinking</Label>
                  <Select value={formData.drinking} onValueChange={(value) => handleInputChange('drinking', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Do you drink alcohol?" />
                    </SelectTrigger>
                    <SelectContent>
                      {drinkingOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sleep_schedule">Sleep Schedule</Label>
                  <Select value={formData.sleep_schedule} onValueChange={(value) => handleInputChange('sleep_schedule', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Are you a night owl or early bird?" />
                    </SelectTrigger>
                    <SelectContent>
                      {sleepScheduleOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="have_pets">Pets</Label>
                  <Select value={formData.have_pets} onValueChange={(value) => handleInputChange('have_pets', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Do you have pets?" />
                    </SelectTrigger>
                    <SelectContent>
                      {petOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="interests" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Values</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.values || []).map(value => (
                      <Badge key={value} variant="secondary" className="cursor-pointer" onClick={() => handleArrayRemove('values', value)}>
                        {value} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={(value) => handleArrayAdd('values', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add value" />
                    </SelectTrigger>
                    <SelectContent>
                      {valueOptions.filter(val => !(formData.values || []).includes(val)).map(val => (
                        <SelectItem key={val} value={val}>{val}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Interests</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.interests || []).map(interest => (
                      <Badge key={interest} variant="secondary" className="cursor-pointer" onClick={() => handleArrayRemove('interests', interest)}>
                        {interest} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={(value) => handleArrayAdd('interests', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add interest" />
                    </SelectTrigger>
                    <SelectContent>
                      {interestOptions.filter(interest => !(formData.interests || []).includes(interest)).map(interest => (
                        <SelectItem key={interest} value={interest}>{interest}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Hobbies</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.hobbies || []).map(hobby => (
                      <Badge key={hobby} variant="secondary" className="cursor-pointer" onClick={() => handleArrayRemove('hobbies', hobby)}>
                        {hobby} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={(value) => handleArrayAdd('hobbies', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add hobby" />
                    </SelectTrigger>
                    <SelectContent>
                      {hobbyOptions.filter(hobby => !(formData.hobbies || []).includes(hobby)).map(hobby => (
                        <SelectItem key={hobby} value={hobby}>{hobby}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Creative Pursuits</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.creative_pursuits || []).map(pursuit => (
                      <Badge key={pursuit} variant="secondary" className="cursor-pointer" onClick={() => handleArrayRemove('creative_pursuits', pursuit)}>
                        {pursuit} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={(value) => handleArrayAdd('creative_pursuits', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add creative pursuit" />
                    </SelectTrigger>
                    <SelectContent>
                      {creativePursuitOptions.filter(pursuit => !(formData.creative_pursuits || []).includes(pursuit)).map(pursuit => (
                        <SelectItem key={pursuit} value={pursuit}>{pursuit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Weekend Activities</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.weekend_activities || []).map(activity => (
                      <Badge key={activity} variant="secondary" className="cursor-pointer" onClick={() => handleArrayRemove('weekend_activities', activity)}>
                        {activity} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={(value) => handleArrayAdd('weekend_activities', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add weekend activity" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekendActivityOptions.filter(activity => !(formData.weekend_activities || []).includes(activity)).map(activity => (
                        <SelectItem key={activity} value={activity}>{activity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="career" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation || ''}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    placeholder="Your job title"
                  />
                </div>

                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company || ''}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Where you work"
                  />
                </div>

                <div>
                  <Label htmlFor="education">Education Level</Label>
                  <Select value={formData.education} onValueChange={(value) => handleInputChange('education', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationOptions.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="work_life_balance">Work-Life Balance</Label>
                  <Select value={formData.work_life_balance} onValueChange={(value) => handleInputChange('work_life_balance', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How do you approach work?" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Excellent balance', 'Work-focused', 'Life-focused', 'Flexible approach', 'Still figuring it out'].map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="career_ambitions">Career Ambitions</Label>
                  <Textarea
                    id="career_ambitions"
                    value={formData.career_ambitions || ''}
                    onChange={(e) => handleInputChange('career_ambitions', e.target.value)}
                    placeholder="What are your professional goals and dreams?"
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="relationship" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="relationship_goals">Relationship Goals</Label>
                  <Select value={formData.relationship_goals} onValueChange={(value) => handleInputChange('relationship_goals', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="What are you looking for?" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationshipGoalOptions.map(goal => (
                        <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="want_children">Children</Label>
                  <Select value={formData.want_children} onValueChange={(value) => handleInputChange('want_children', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Your thoughts on children?" />
                    </SelectTrigger>
                    <SelectContent>
                      {childrenOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="family_closeness">Family Closeness</Label>
                  <Select value={formData.family_closeness} onValueChange={(value) => handleInputChange('family_closeness', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How close are you to family?" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Very close', 'Close', 'Moderately close', 'Independent', 'It\'s complicated'].map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="love_language">Love Language</Label>
                  <Select value={formData.love_language} onValueChange={(value) => handleInputChange('love_language', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How do you feel most loved?" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Words of affirmation', 'Quality time', 'Physical touch', 'Acts of service', 'Receiving gifts'].map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="communication_style">Communication Style</Label>
                  <Select value={formData.communication_style} onValueChange={(value) => handleInputChange('communication_style', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How do you communicate?" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Direct and honest', 'Gentle and caring', 'Humorous and light', 'Deep and meaningful', 'Depends on the situation'].map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ideal_date">Ideal Date</Label>
                  <Input
                    id="ideal_date"
                    value={formData.ideal_date || ''}
                    onChange={(e) => handleInputChange('ideal_date', e.target.value)}
                    placeholder="Describe your ideal date"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="personal" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="religion">Religion</Label>
                  <Select value={formData.religion} onValueChange={(value) => handleInputChange('religion', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select religion" />
                    </SelectTrigger>
                    <SelectContent>
                      {religionOptions.map(religion => (
                        <SelectItem key={religion} value={religion}>{religion}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="political_views">Political Views</Label>
                  <Select value={formData.political_views} onValueChange={(value) => handleInputChange('political_views', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select political views" />
                    </SelectTrigger>
                    <SelectContent>
                      {politicalViewOptions.map(view => (
                        <SelectItem key={view} value={view}>{view}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="zodiac_sign">Zodiac Sign</Label>
                  <Select value={formData.zodiac_sign} onValueChange={(value) => handleInputChange('zodiac_sign', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select zodiac sign" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(sign => (
                        <SelectItem key={sign} value={sign}>{sign}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="personality_type">Personality Type (MBTI)</Label>
                  <Select value={formData.personality_type} onValueChange={(value) => handleInputChange('personality_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select personality type" />
                    </SelectTrigger>
                    <SelectContent>
                      {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <div className="pt-6 border-t">
              <Button onClick={handleSaveAll} disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving All Changes...
                  </>
                ) : (
                  'Save All Changes'
                )}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveProfileSettings;