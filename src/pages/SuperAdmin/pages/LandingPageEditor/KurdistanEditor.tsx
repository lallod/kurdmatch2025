
import React from 'react';
import { Heart } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { KurdistanSection } from './types';

interface KurdistanEditorProps {
  kurdistan: KurdistanSection;
  updateKurdistanSection: (field: keyof KurdistanSection, value: string | string[]) => void;
  updateKurdistanPoint: (section: 'leftPoints' | 'rightPoints', index: number, value: string) => void;
}

const KurdistanEditor: React.FC<KurdistanEditorProps> = ({ 
  kurdistan, 
  updateKurdistanSection, 
  updateKurdistanPoint 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Kurdish Heritage Section
        </CardTitle>
        <CardDescription>
          Edit the content in the Kurdish heritage section
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="kurdistan-title">Section Title</Label>
          <Input 
            id="kurdistan-title" 
            value={kurdistan.title} 
            onChange={(e) => updateKurdistanSection('title', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="kurdistan-subtitle">Section Subtitle</Label>
          <Textarea 
            id="kurdistan-subtitle" 
            value={kurdistan.subtitle} 
            onChange={(e) => updateKurdistanSection('subtitle', e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column */}
          <Card className="bg-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Left Box</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="kurdistan-left-title">Title</Label>
                <Input 
                  id="kurdistan-left-title" 
                  value={kurdistan.leftTitle} 
                  onChange={(e) => updateKurdistanSection('leftTitle', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kurdistan-left-description">Description</Label>
                <Textarea 
                  id="kurdistan-left-description" 
                  value={kurdistan.leftDescription} 
                  onChange={(e) => updateKurdistanSection('leftDescription', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Bullet Points</Label>
                {kurdistan.leftPoints.map((point, index) => (
                  <div key={`left-point-${index}`} className="flex gap-2">
                    <Input 
                      value={point} 
                      onChange={(e) => updateKurdistanPoint('leftPoints', index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Right column */}
          <Card className="bg-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Right Box</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="kurdistan-right-title">Title</Label>
                <Input 
                  id="kurdistan-right-title" 
                  value={kurdistan.rightTitle} 
                  onChange={(e) => updateKurdistanSection('rightTitle', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kurdistan-right-description">Description</Label>
                <Textarea 
                  id="kurdistan-right-description" 
                  value={kurdistan.rightDescription} 
                  onChange={(e) => updateKurdistanSection('rightDescription', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Bullet Points</Label>
                {kurdistan.rightPoints.map((point, index) => (
                  <div key={`right-point-${index}`} className="flex gap-2">
                    <Input 
                      value={point} 
                      onChange={(e) => updateKurdistanPoint('rightPoints', index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default KurdistanEditor;
