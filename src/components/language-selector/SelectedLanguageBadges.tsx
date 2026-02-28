
import React from 'react';
import { X, Languages } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';

interface SelectedLanguageBadgesProps {
  selectedLanguages: string[];
  removeLanguage: (language: string) => void;
}

const SelectedLanguageBadges: React.FC<SelectedLanguageBadgesProps> = ({
  selectedLanguages,
  removeLanguage
}) => {
  const { t } = useTranslations();
  
  return (
    <div className="glass p-3 rounded-lg border border-tinder-rose/10 shadow-sm">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedLanguages.map(language => (
          <Badge 
            key={language} 
            className="bg-gradient-to-r from-white/90 to-white/80 text-tinder-rose border-tinder-rose/20 shadow-sm pl-3 pr-2 py-1.5 hover:border-tinder-rose/30 neo-border"
          >
            {language}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 ml-1 -mr-1 hover:bg-tinder-rose/10 rounded-full transition-all"
              onClick={() => removeLanguage(language)}
            >
              <X size={12} />
            </Button>
          </Badge>
        ))}
        
        {selectedLanguages.length === 0 && (
          <div className="flex items-center justify-center w-full py-6 text-gray-500">
            <div className="ai-icon-container p-2 rounded-md mr-2">
              <Languages className="h-5 w-5" />
            </div>
            <p className="text-sm futuristic-text">{t('language.no_selected', 'No languages selected yet')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedLanguageBadges;
