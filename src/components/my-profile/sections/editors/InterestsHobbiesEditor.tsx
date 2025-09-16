
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfileData } from '@/types/profile';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { isUserSuperAdmin } from '@/utils/auth/roleUtils';

interface InterestsHobbiesEditorProps {
  profileData: ProfileData;
  fieldSources?: { [key: string]: 'user' | 'random' | 'initial' };
  onUpdate: (updates: Partial<ProfileData>) => void;
}

const InterestsHobbiesEditor: React.FC<InterestsHobbiesEditorProps> = ({ profileData, fieldSources = {}, onUpdate }) => {
  const { user } = useSupabaseAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [formData, setFormData] = useState({
    interests: profileData.interests || [],
    hobbies: Array.isArray(profileData.hobbies) ? profileData.hobbies : [],
    creativePursuits: Array.isArray(profileData.creativePursuits) ? profileData.creativePursuits : [],
    weekendActivities: Array.isArray(profileData.weekendActivities) ? profileData.weekendActivities : []
  });
  
  const [hasChanges, setHasChanges] = useState(false);

  // Check if user is super admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const adminStatus = await isUserSuperAdmin(user.id);
        setIsSuperAdmin(adminStatus);
      }
    };
    checkAdminStatus();
  }, [user]);

  const handleArrayToggle = (field: string, item: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    const updatedArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    
    setFormData(prev => ({ ...prev, [field]: updatedArray }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
    toast.success('Interests & hobbies updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      interests: profileData.interests || [],
      hobbies: Array.isArray(profileData.hobbies) ? profileData.hobbies : [],
      creativePursuits: Array.isArray(profileData.creativePursuits) ? profileData.creativePursuits : [],
      weekendActivities: Array.isArray(profileData.weekendActivities) ? profileData.weekendActivities : []
    });
    setHasChanges(false);
  };

  const commonInterests = [
    'Travel', 'Photography', 'Cooking', 'Hiking', 'Reading', 'Music', 'Dancing', 
    'Sports', 'Fitness', 'Art', 'Movies', 'Gaming', 'Technology', 'Fashion',
    'Food', 'Nature', 'Animals', 'History', 'Science', 'Politics'
  ];

  const commonHobbies = [
    'Drawing', 'Painting', 'Writing', 'Singing', 'Playing instruments', 'Gardening',
    'Crafting', 'Collecting', 'Board games', 'Video games', 'Yoga', 'Meditation',
    'Running', 'Cycling', 'Swimming', 'Rock climbing', 'Martial arts', 'Chess'
  ];

  const creativePursuits = [
    'Photography', 'Painting', 'Drawing', 'Writing', 'Music production', 'Graphic design',
    'Web development', 'Pottery', 'Jewelry making', 'Knitting', 'Woodworking', 'Sculpture'
  ];

  const weekendActivities = [
    'Hiking', 'Beach trips', 'Museum visits', 'Concerts', 'Farmers markets', 'Brunch',
    'Movie marathons', 'Game nights', 'Road trips', 'Camping', 'Shopping', 'Volunteering'
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Interests & Hobbies</CardTitle>
          <p className="text-sm text-gray-400">Select from the available options below</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Interests */}
          <div>
            <Label className="text-purple-200">Interests</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonInterests.map(interest => (
                <Badge
                  key={interest}
                  variant={formData.interests.includes(interest) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    formData.interests.includes(interest)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => handleArrayToggle('interests', interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Hobbies */}
          <div>
            <Label className="text-purple-200">Hobbies</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonHobbies.map(hobby => (
                <Badge
                  key={hobby}
                  variant={formData.hobbies.includes(hobby) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    formData.hobbies.includes(hobby)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => handleArrayToggle('hobbies', hobby)}
                >
                  {hobby}
                </Badge>
              ))}
            </div>
          </div>

          {/* Creative Pursuits */}
          <div>
            <Label className="text-purple-200">Creative Pursuits</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {creativePursuits.map(pursuit => (
                <Badge
                  key={pursuit}
                  variant={formData.creativePursuits.includes(pursuit) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    formData.creativePursuits.includes(pursuit)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => handleArrayToggle('creativePursuits', pursuit)}
                >
                  {pursuit}
                </Badge>
              ))}
            </div>
          </div>

          {/* Weekend Activities */}
          <div>
            <Label className="text-purple-200">Weekend Activities</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {weekendActivities.map(activity => (
                <Badge
                  key={activity}
                  variant={formData.weekendActivities.includes(activity) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    formData.weekendActivities.includes(activity)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => handleArrayToggle('weekendActivities', activity)}
                >
                  {activity}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {hasChanges && (
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default InterestsHobbiesEditor;
