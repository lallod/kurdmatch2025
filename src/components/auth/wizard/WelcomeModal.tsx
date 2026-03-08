
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, Star } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWizard: () => void;
  userName?: string;
  currentProgress?: number;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onStartWizard,
  userName = "there",
  currentProgress = 15
}) => {
  const { t } = useTranslations();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-3 sm:mx-4 max-w-[calc(100vw-24px)]">
        <DialogHeader className="text-center space-y-3 sm:space-y-4">
          <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            {t('welcome.title', 'Welcome to KurdConnect, {{name}}!', { name: userName })}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 sm:space-y-6 py-3 sm:py-4">
          <div className="text-center space-y-2">
            <p className="text-sm sm:text-base text-gray-600">
              {t('welcome.complete_profile', 'Complete your profile to get 3x more compatible matches. It only takes a few minutes!')}
            </p>
          </div>
          
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-medium">{t('welcome.profile_strength', 'Profile Strength')}</span>
              <span className="text-purple-600 font-semibold">{t('welcome.percent_complete', '{{percent}}% Complete', { percent: currentProgress })}</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500" />
              <span>{t('welcome.basic_created', 'Basic profile created')}</span>
            </div>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <Button 
              onClick={onStartWizard}
              className="w-full h-11 sm:h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-medium text-sm sm:text-base"
            >
              {t('welcome.lets_go', "Let's Go!")} ✨
            </Button>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="w-full h-10 sm:h-11 text-gray-500 hover:text-gray-700 text-sm sm:text-base"
            >
              {t('welcome.skip_for_now', 'Skip for Now')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
