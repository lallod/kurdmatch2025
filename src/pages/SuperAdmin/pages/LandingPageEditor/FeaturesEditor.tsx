
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
import { useTranslations } from '@/hooks/useTranslations';

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
  const { t } = useTranslations();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          {t('admin.features_section', 'Features Section')}
        </CardTitle>
        <CardDescription>
          {t('admin.features_section_desc', 'Edit the features section title and feature cards')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="features-title">{t('admin.section_title', 'Section Title')}</Label>
          <Input 
            id="features-title" 
            value={title} 
            onChange={(e) => updateTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('admin.feature_cards', 'Feature Cards')}</h3>
          
          {cards.map((card, index) => (
            <Card key={card.id} className="bg-gray-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('admin.feature_card', 'Feature Card')} {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor={`feature-${card.id}-title`}>{t('admin.title', 'Title')}</Label>
                  <Input 
                    id={`feature-${card.id}-title`} 
                    value={card.title} 
                    onChange={(e) => updateCard(card.id, 'title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`feature-${card.id}-description`}>{t('admin.description', 'Description')}</Label>
                  <Textarea 
                    id={`feature-${card.id}-description`} 
                    value={card.description} 
                    onChange={(e) => updateCard(card.id, 'description', e.target.value)}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`feature-${card.id}-icon`}>{t('admin.icon', 'Icon')}</Label>
                  <Input 
                    id={`feature-${card.id}-icon`} 
                    value={card.icon} 
                    onChange={(e) => updateCard(card.id, 'icon', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('admin.icon_name_hint', 'Icon name (Globe, Users, Heart, etc.)')}
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
