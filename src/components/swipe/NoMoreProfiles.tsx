
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';


interface NoMoreProfilesProps {
  onStartOver: () => void;
}

const NoMoreProfiles = ({ onStartOver }: NoMoreProfilesProps) => {
  const { t } = useTranslations();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center pb-24 px-4">
      <div className="text-center text-foreground w-full max-w-sm">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">{t('swipe.no_more', 'No more profiles')}</h2>
        <p className="text-muted-foreground mb-4 text-sm sm:text-base">{t('swipe.check_back', 'Check back later for new matches!')}</p>
        <Button 
          onClick={onStartOver} 
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full sm:w-auto"
        >
          {t('swipe.start_over', 'Start Over')}
        </Button>
      </div>
      
    </div>
  );
};

export default NoMoreProfiles;
