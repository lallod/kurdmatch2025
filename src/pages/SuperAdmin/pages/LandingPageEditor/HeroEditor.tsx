
import React from 'react';
import { PenLine } from 'lucide-react';
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
import { HeroContent } from './types';
import { useTranslations } from '@/hooks/useTranslations';

interface HeroEditorProps {
  hero: HeroContent;
  updateHero: (field: keyof HeroContent, value: string) => void;
}

const HeroEditor: React.FC<HeroEditorProps> = ({ hero, updateHero }) => {
  const { t } = useTranslations();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenLine className="h-5 w-5" />
          {t('admin.hero_section_content', 'Hero Section Content')}
        </CardTitle>
        <CardDescription>
          {t('admin.hero_section_desc', 'Edit the main content displayed in the hero section at the top of the landing page')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="hero-tagline">{t('admin.tagline', 'Tagline')}</Label>
          <Input 
            id="hero-tagline" 
            value={hero.tagline} 
            onChange={(e) => updateHero('tagline', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {t('admin.tagline_desc', 'Short tagline displayed above the main title')}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hero-title">{t('admin.main_title', 'Main Title')}</Label>
          <Input 
            id="hero-title" 
            value={hero.title} 
            onChange={(e) => updateHero('title', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hero-subtitle">{t('admin.subtitle', 'Subtitle')}</Label>
          <Textarea 
            id="hero-subtitle" 
            value={hero.subtitle} 
            onChange={(e) => updateHero('subtitle', e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hero-user-count">{t('admin.user_count', 'User Count')}</Label>
          <Input 
            id="hero-user-count" 
            value={hero.userCount} 
            onChange={(e) => updateHero('userCount', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {t('admin.user_count_desc', 'Number of users shown on the counter (e.g., "10,000+")')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroEditor;
