
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TrendingUp, Clock, DollarSign, Heart } from 'lucide-react';
import { ProfileData } from '@/types/profile';

interface PersonalGrowthEditorProps {
  profileData: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}

const PersonalGrowthEditor: React.FC<PersonalGrowthEditorProps> = ({
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
          <TrendingUp className="mr-2 h-5 w-5" />
          Personal Growth & Habits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-white">Growth Goals</Label>
          <Input
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Learn Spanish, Get fit, Read more books..."
            defaultValue={Array.isArray(profileData.growthGoals) ? profileData.growthGoals.join(', ') : ''}
            onBlur={(e) => handleArrayUpdate('growthGoals', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Morning Routine</Label>
          <Textarea
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Coffee, meditation, workout..."
            defaultValue={profileData.morningRoutine || ''}
            onBlur={(e) => onUpdate({ morningRoutine: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Evening Routine</Label>
          <Textarea
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Reading, journaling, tea..."
            defaultValue={profileData.eveningRoutine || ''}
            onBlur={(e) => onUpdate({ eveningRoutine: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Financial Habits</Label>
          <Input
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Budget conscious, investor, saver..."
            defaultValue={profileData.financialHabits || ''}
            onBlur={(e) => onUpdate({ financialHabits: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Stress Relievers</Label>
          <Input
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Yoga, music, nature walks..."
            defaultValue={Array.isArray(profileData.stressRelievers) ? profileData.stressRelievers.join(', ') : ''}
            onBlur={(e) => handleArrayUpdate('stressRelievers', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalGrowthEditor;
