
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Sun, Home } from 'lucide-react';
import { ProfileData } from '@/types/profile';

interface PreferencesEditorProps {
  profileData: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}

const PreferencesEditor: React.FC<PreferencesEditorProps> = ({
  profileData,
  onUpdate
}) => {
  return (
    <Card className="backdrop-blur-md bg-white/10 border border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <MapPin className="mr-2 h-5 w-5" />
          Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-white">Favorite Season</Label>
          <Input
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Spring, Summer, Fall, Winter..."
            defaultValue={profileData.favoriteSeason || ''}
            onBlur={(e) => onUpdate({ favoriteSeason: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Ideal Weather</Label>
          <Input
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Sunny and warm, cool and crisp, rainy days..."
            defaultValue={profileData.idealWeather || ''}
            onBlur={(e) => onUpdate({ idealWeather: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Dream Home</Label>
          <Textarea
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Mountain cabin, city loft, beach house..."
            defaultValue={profileData.dreamHome || ''}
            onBlur={(e) => onUpdate({ dreamHome: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Travel Frequency</Label>
          <Input
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Once a year, quarterly, monthly..."
            defaultValue={profileData.travelFrequency || ''}
            onBlur={(e) => onUpdate({ travelFrequency: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesEditor;
