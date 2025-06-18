
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Brain, Handshake } from 'lucide-react';
import { ProfileData } from '@/types/profile';

interface SocialStyleEditorProps {
  profileData: ProfileData;
  onUpdate: (updates: Partial<ProfileData>) => void;
}

const SocialStyleEditor: React.FC<SocialStyleEditorProps> = ({
  profileData,
  onUpdate
}) => {
  return (
    <Card className="backdrop-blur-md bg-white/10 border border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Users className="mr-2 h-5 w-5" />
          Social Style
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-white">Friendship Style</Label>
          <Input
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Close-knit circle, social butterfly, quality over quantity..."
            defaultValue={profileData.friendshipStyle || ''}
            onBlur={(e) => onUpdate({ friendshipStyle: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Decision Making Style</Label>
          <Input
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Analytical, intuitive, collaborative..."
            defaultValue={profileData.decisionMakingStyle || ''}
            onBlur={(e) => onUpdate({ decisionMakingStyle: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Charity Involvement</Label>
          <Input
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Animal shelter volunteer, environmental causes..."
            defaultValue={profileData.charityInvolvement || ''}
            onBlur={(e) => onUpdate({ charityInvolvement: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialStyleEditor;
