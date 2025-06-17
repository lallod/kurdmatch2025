
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfileData } from '@/types/profile';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';

interface LifestyleEditorProps {
  profileData: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}

const LifestyleEditor: React.FC<LifestyleEditorProps> = ({ profileData, onUpdate }) => {
  const [formData, setFormData] = useState({
    exerciseHabits: profileData.exerciseHabits || '',
    dietaryPreferences: profileData.dietaryPreferences || '',
    smoking: profileData.smoking || '',
    drinking: profileData.drinking || '',
    sleepSchedule: profileData.sleepSchedule || '',
    havePets: profileData.havePets || '',
    wantChildren: profileData.wantChildren || ''
  });
  
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(formData);
    setHasChanges(false);
    toast.success('Lifestyle updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      exerciseHabits: profileData.exerciseHabits || '',
      dietaryPreferences: profileData.dietaryPreferences || '',
      smoking: profileData.smoking || '',
      drinking: profileData.drinking || '',
      sleepSchedule: profileData.sleepSchedule || '',
      havePets: profileData.havePets || '',
      wantChildren: profileData.wantChildren || ''
    });
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Lifestyle & Habits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-purple-200">Exercise Habits</Label>
              <Select value={formData.exerciseHabits} onValueChange={(value) => handleInputChange('exerciseHabits', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="How often do you exercise?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="few-times-week">Few times a week</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="occasionally">Occasionally</SelectItem>
                  <SelectItem value="rarely">Rarely</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-purple-200">Dietary Preferences</Label>
              <Select value={formData.dietaryPreferences} onValueChange={(value) => handleInputChange('dietaryPreferences', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="What's your diet like?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="omnivore">Omnivore</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="pescatarian">Pescatarian</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="halal">Halal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-purple-200">Smoking</Label>
              <Select value={formData.smoking} onValueChange={(value) => handleInputChange('smoking', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Do you smoke?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="socially">Socially</SelectItem>
                  <SelectItem value="regularly">Regularly</SelectItem>
                  <SelectItem value="trying-to-quit">Trying to quit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-purple-200">Drinking</Label>
              <Select value={formData.drinking} onValueChange={(value) => handleInputChange('drinking', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Do you drink alcohol?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="socially">Socially</SelectItem>
                  <SelectItem value="regularly">Regularly</SelectItem>
                  <SelectItem value="occasionally">Occasionally</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-purple-200">Sleep Schedule</Label>
              <Select value={formData.sleepSchedule} onValueChange={(value) => handleInputChange('sleepSchedule', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Are you a night owl or early bird?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="early-bird">Early bird</SelectItem>
                  <SelectItem value="night-owl">Night owl</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                  <SelectItem value="depends">Depends on the day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-purple-200">Pets</Label>
              <Select value={formData.havePets} onValueChange={(value) => handleInputChange('havePets', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Do you have pets?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes-dogs">Yes, dogs</SelectItem>
                  <SelectItem value="yes-cats">Yes, cats</SelectItem>
                  <SelectItem value="yes-other">Yes, other pets</SelectItem>
                  <SelectItem value="no-but-love">No, but I love them</SelectItem>
                  <SelectItem value="no-allergic">No, I'm allergic</SelectItem>
                  <SelectItem value="no-not-interested">No, not interested</SelectItem>
                </SelectContent>
              </Select>
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

export default LifestyleEditor;
