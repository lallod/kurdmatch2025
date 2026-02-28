
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, Star, Sparkles } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface CompletionCelebrationProps {
  onStartDiscovering: () => void;
  userName?: string;
}

export const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({
  onStartDiscovering,
  userName = "there"
}) => {
  const { t } = useTranslations();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-200 rounded-full opacity-10 animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 space-y-6">
          {/* Celebration Icon */}
          <div className="relative mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-yellow-500 animate-spin" />
            </div>
            <div className="absolute -bottom-2 -left-2">
              <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {t('wizard.all_set', "You're all set, {{name}}! 🎉").replace('{{name}}', userName)}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('wizard.profile_complete', 'Your profile is now')} <span className="font-semibold text-purple-600">100%</span>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={100} className="h-3" />
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-green-600">
              <Star className="w-4 h-4" />
              <span>{t('wizard.profile_strength', 'Profile Strength: Excellent!')}</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-purple-50 rounded-2xl p-4 space-y-2">
            <h3 className="font-semibold text-purple-900">{t('wizard.what_next', 'What happens next?')}</h3>
            <div className="space-y-1 text-sm text-purple-700">
              <p>✨ {t('wizard.benefit_matches', '3x more compatible matches')}</p>
              <p>💝 {t('wizard.benefit_priority', 'Priority in search results')}</p>
              <p>🎯 {t('wizard.benefit_recommendations', 'Better match recommendations')}</p>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={onStartDiscovering}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg transform transition-transform hover:scale-105"
            size="lg"
          >
            {t('wizard.start_discovering', 'Start Discovering!')} 🚀
          </Button>

          <p className="text-sm text-gray-500">
            {t('wizard.ready_connections', 'You are now ready to find amazing connections!')}
          </p>
        </div>
      </div>
    </div>
  );
};
