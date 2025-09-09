import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { getCurrentUserProfile, updateProfile, uploadProfilePhoto } from '@/api/profiles';
import { toast } from 'sonner';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Settings = () => {
  const { user, signOut } = useSupabaseAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    occupation: '',
    bio: '',
  });

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
        name: profileData.name || '',
        age: profileData.age?.toString() || '',
        location: profileData.location || '',
        occupation: profileData.occupation || '',
        bio: profileData.bio || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(user.id, {
        name: formData.name,
        age: parseInt(formData.age) || null,
        location: formData.location,
        occupation: formData.occupation,
        bio: formData.bio,
      });
      toast.success('Profile updated successfully');
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
      loadProfile(); // Reload to get updated photo
    } catch (error) {
      console.error('Failed to upload photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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

            {/* Form Fields */}
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Your age"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Your location"
                />
              </div>

              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  placeholder="Your occupation"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;