
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Frown, Heart } from 'lucide-react';
import { ProfileData } from '@/types/profile';

interface SpecialTraitsEditorProps {
  profileData: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}

const SpecialTraitsEditor: React.FC<SpecialTraitsEditorProps> = ({
  profileData,
  onUpdate
}) => {
  const handleArrayUpdate = (field: keyof ProfileData, value: string) => {
    const values = value.split(',').map(v => v.trim()).filter(v => v);
    onUpdate({ [field]: values });
  };

  return (
    <Card className="backdrop-blur-md bg-white/10 border border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Sparkles className="mr-2 h-5 w-5" />
          Special Traits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-white">Hidden Talents</Label>
          <Input
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Can juggle, speaks 5 languages, perfect pitch..."
            defaultValue={Array.isArray(profileData.hiddenTalents) ? profileData.hiddenTalents.join(', ') : ''}
            onBlur={(e) => handleArrayUpdate('hiddenTalents', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Pet Peeves</Label>
          <Input
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Loud chewing, being late, messy spaces..."
            defaultValue={Array.isArray(profileData.petPeeves) ? profileData.petPeeves.join(', ') : ''}
            onBlur={(e) => handleArrayUpdate('petPeeves', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Favorite Memory</Label>
          <Textarea
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Describe your most cherished memory..."
            defaultValue={profileData.favoriteMemory || ''}
            onBlur={(e) => onUpdate({ favoriteMemory: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Favorite Quote</Label>
          <Textarea
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="A quote that inspires you..."
            defaultValue={profileData.favoriteQuote || ''}
            onBlur={(e) => onUpdate({ favoriteQuote: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SpecialTraitsEditor;
