
import React from 'react';
import { Globe } from 'lucide-react';
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
import { FeatureCard } from './types';

interface FeaturesEditorProps {
  title: string;
  updateTitle: (value: string) => void;
  cards: FeatureCard[];
  updateCard: (id: string, field: keyof Omit<FeatureCard, 'id'>, value: string) => void;
}

const FeaturesEditor: React.FC<FeaturesEditorProps> = ({ 
  title, 
  updateTitle, 
  cards, 
  updateCard 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Features Section
        </CardTitle>
        <CardDescription>
          Edit the features section title and feature cards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="features-title">Section Title</Label>
          <Input 
            id="features-title" 
            value={title} 
            onChange={(e) => updateTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Feature Cards</h3>
          
          {cards.map((card, index) => (
            <Card key={card.id} className="bg-gray-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Feature Card {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor={`feature-${card.id}-title`}>Title</Label>
                  <Input 
                    id={`feature-${card.id}-title`} 
                    value={card.title} 
                    onChange={(e) => updateCard(card.id, 'title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`feature-${card.id}-description`}>Description</Label>
                  <Textarea 
                    id={`feature-${card.id}-description`} 
                    value={card.description} 
                    onChange={(e) => updateCard(card.id, 'description', e.target.value)}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`feature-${card.id}-icon`}>Icon</Label>
                  <Input 
                    id={`feature-${card.id}-icon`} 
                    value={card.icon} 
                    onChange={(e) => updateCard(card.id, 'icon', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Icon name (Globe, Users, Heart, etc.)
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturesEditor;
