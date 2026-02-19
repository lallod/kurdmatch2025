
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ProfileData } from '@/types/profile';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import { SuggestionBadge } from '@/components/ui/suggestion-badge';
import { useTranslations } from '@/hooks/useTranslations';

interface InterestsHobbiesEditorProps {
  profileData: ProfileData;
  fieldSources?: { [key: string]: 'user' | 'random' | 'initial' };
  onUpdate: (updates: Partial<ProfileData>) => void;
  onSaveComplete?: () => void;
  onCancel?: () => void;
}

const InterestsHobbiesEditor: React.FC<InterestsHobbiesEditorProps> = ({ profileData, fieldSources = {}, onUpdate, onSaveComplete, onCancel }) => {
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    interests: profileData.interests || [],
    hobbies: Array.isArray(profileData.hobbies) ? profileData.hobbies : [],
    creativePursuits: Array.isArray(profileData.creativePursuits) ? profileData.creativePursuits : [],
    weekendActivities: Array.isArray(profileData.weekendActivities) ? profileData.weekendActivities : []
  });
  const [hasChanges, setHasChanges] = useState(false);

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
    toast.success(t('toast.profile.interests_updated', 'Interests & hobbies updated!'));
    onSaveComplete?.();
  };

  const handleCancel = () => {
    setFormData({
      interests: profileData.interests || [],
      hobbies: Array.isArray(profileData.hobbies) ? profileData.hobbies : [],
      creativePursuits: Array.isArray(profileData.creativePursuits) ? profileData.creativePursuits : [],
      weekendActivities: Array.isArray(profileData.weekendActivities) ? profileData.weekendActivities : []
    });
    setHasChanges(false);
    onCancel?.();
  };

  const commonInterests = ['Travel', 'Photography', 'Cooking', 'Hiking', 'Reading', 'Music', 'Dancing', 'Sports', 'Fitness', 'Art', 'Movies', 'Gaming', 'Technology', 'Fashion', 'Food', 'Nature', 'Animals', 'History', 'Science', 'Politics'];
  const commonHobbies = ['Drawing', 'Painting', 'Writing', 'Singing', 'Playing instruments', 'Gardening', 'Crafting', 'Collecting', 'Board games', 'Video games', 'Yoga', 'Meditation', 'Running', 'Cycling', 'Swimming', 'Rock climbing', 'Martial arts', 'Chess'];
  const creativePursuits = ['Photography', 'Painting', 'Drawing', 'Writing', 'Music production', 'Graphic design', 'Web development', 'Pottery', 'Jewelry making', 'Knitting', 'Woodworking', 'Sculpture'];
  const weekendActivities = ['Hiking', 'Beach trips', 'Museum visits', 'Concerts', 'Farmers markets', 'Brunch', 'Movie marathons', 'Game nights', 'Road trips', 'Camping', 'Shopping', 'Volunteering'];

  const labelClass = "text-muted-foreground text-xs font-medium";

  const renderBadgeSection = (label: string, fieldKey: string, sourceKey: string, items: string[]) => (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Label className={labelClass}>{label}</Label>
        <SuggestionBadge show={fieldSources[sourceKey] === 'random'} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map(item => (
          <Badge key={item}
            variant={(formData[fieldKey as keyof typeof formData] as string[]).includes(item) ? "default" : "outline"}
            className={`cursor-pointer transition-colors text-xs ${
              (formData[fieldKey as keyof typeof formData] as string[]).includes(item)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
            onClick={() => handleArrayToggle(fieldKey, item)}
          >
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {renderBadgeSection(t('profile.interests', 'Interests'), 'interests', 'interests', commonInterests)}
      {renderBadgeSection(t('profile.hobbies', 'Hobbies'), 'hobbies', 'hobbies', commonHobbies)}
      {renderBadgeSection(t('profile.creative_pursuits', 'Creative Pursuits'), 'creativePursuits', 'creative_pursuits', creativePursuits)}
      {renderBadgeSection(t('profile.weekend_activities', 'Weekend Activities'), 'weekendActivities', 'weekend_activities', weekendActivities)}

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={handleCancel} className="flex-1 h-9 text-sm">
          <X className="mr-2 h-4 w-4" /> {t('common.cancel', 'Cancel')}
        </Button>
        <Button onClick={handleSave} className="flex-1 h-9 text-sm bg-primary hover:bg-primary/90" disabled={!hasChanges}>
          <Save className="mr-2 h-4 w-4" /> {t('common.save', 'Save')}
        </Button>
      </div>
    </div>
  );
};

export default InterestsHobbiesEditor;
