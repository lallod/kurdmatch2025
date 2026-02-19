
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LandingPageContent } from '../types';
import HeroEditor from '../HeroEditor';
import FeaturesEditor from '../FeaturesEditor';
import KurdistanEditor from '../KurdistanEditor';
import FooterEditor from '../FooterEditor';
import { useTranslations } from '@/hooks/useTranslations';

interface EditorTabsProps {
  content: LandingPageContent;
  updateHero: (field: keyof LandingPageContent['hero'], value: string) => void;
  updateFeatureTitle: (value: string) => void;
  updateFeatureCard: (id: string, field: keyof Omit<LandingPageContent['features']['cards'][0], 'id'>, value: string) => void;
  updateKurdistanSection: (field: keyof LandingPageContent['kurdistan'], value: string | string[]) => void;
  updateKurdistanPoint: (section: 'leftPoints' | 'rightPoints', index: number, value: string) => void;
  updateFooter: (field: keyof LandingPageContent['footer'], value: string) => void;
}

const EditorTabs: React.FC<EditorTabsProps> = ({
  content,
  updateHero,
  updateFeatureTitle,
  updateFeatureCard,
  updateKurdistanSection,
  updateKurdistanPoint,
  updateFooter
}) => {
  const { t } = useTranslations();
  return (
    <Tabs defaultValue="hero">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="hero">{t('admin.hero_section', 'Hero Section')}</TabsTrigger>
        <TabsTrigger value="features">{t('admin.features', 'Features')}</TabsTrigger>
        <TabsTrigger value="kurdistan">{t('admin.kurdish_heritage', 'Kurdish Heritage')}</TabsTrigger>
        <TabsTrigger value="footer">{t('admin.footer', 'Footer')}</TabsTrigger>
      </TabsList>

      <TabsContent value="hero" className="space-y-4">
        <HeroEditor hero={content.hero} updateHero={updateHero} />
      </TabsContent>

      <TabsContent value="features" className="space-y-4">
        <FeaturesEditor 
          title={content.features.title} 
          updateTitle={updateFeatureTitle}
          cards={content.features.cards}
          updateCard={updateFeatureCard}
        />
      </TabsContent>

      <TabsContent value="kurdistan" className="space-y-4">
        <KurdistanEditor 
          kurdistan={content.kurdistan}
          updateKurdistanSection={updateKurdistanSection}
          updateKurdistanPoint={updateKurdistanPoint}
        />
      </TabsContent>

      <TabsContent value="footer" className="space-y-4">
        <FooterEditor footer={content.footer} updateFooter={updateFooter} />
      </TabsContent>
    </Tabs>
  );
};

export default EditorTabs;
