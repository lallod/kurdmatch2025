
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, Bot, Globe 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import DetailItem from './DetailItem';
import { allLanguages, languageCategories } from '@/data/languages';
import { useTranslations } from '@/hooks/useTranslations';

interface ProfileCommunicationProps {
  details: {
    languages: string[];
    communicationStyle?: string;
    decisionMakingStyle?: string;
  };
  tinderBadgeStyle: string;
  isMobile: boolean;
  onFieldEdit?: (updates: Record<string, any>) => Promise<void>;
}

const ProfileCommunication: React.FC<ProfileCommunicationProps> = ({ 
  details, 
  tinderBadgeStyle,
  isMobile,
  onFieldEdit
}) => {
  const { t } = useTranslations();
  const currentLanguages = details.languages || [];
  const [showAllEditLanguages, setShowAllEditLanguages] = useState(false);

  const kurdishDialects = languageCategories.kurdish;
  const popularLanguages = languageCategories.popular;
  const remainingLanguages = allLanguages.filter(
    l => !kurdishDialects.includes(l) && !popularLanguages.includes(l)
  );

  const currentKurdish = currentLanguages.filter(l => languageCategories.kurdish.includes(l));
  const currentOther = currentLanguages.filter(l => !languageCategories.kurdish.includes(l));

  const handleToggleLanguage = async (language: string) => {
    if (!onFieldEdit) return;
    let updated: string[];
    if (currentLanguages.includes(language)) {
      updated = currentLanguages.filter(l => l !== language);
    } else {
      updated = [...currentLanguages, language];
    }
    await onFieldEdit({ languages: updated });
  };

  const renderLangButton = (lang: string, displayName?: string) => {
    const isSelected = currentLanguages.includes(lang);
    return (
      <button
        key={lang}
        onClick={() => handleToggleLanguage(lang)}
        className={`text-xs px-3 py-2 rounded-lg border text-left transition-all ${
          isSelected 
            ? 'bg-primary text-primary-foreground border-primary font-medium' 
            : 'bg-background text-muted-foreground border-border/40 hover:border-primary/40'
        }`}
      >
        {displayName || lang}
      </button>
    );
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
            <Globe size={18} />
          </div>
          <p className="text-sm text-muted-foreground font-medium">{t('profile.languages', 'Languages')}</p>
        </div>
        
        <div className="ml-[52px]">
          {onFieldEdit ? (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t('profile.kurdish_dialects', 'Kurdish Dialects')}</span>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {kurdishDialects.map(lang => renderLangButton(lang, lang.replace('Kurdish (', '').replace(')', '')))}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t('profile.languages', 'Languages')}</span>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {popularLanguages.map(lang => renderLangButton(lang))}
                  {showAllEditLanguages && remainingLanguages.map(lang => renderLangButton(lang))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllEditLanguages(!showAllEditLanguages)}
                  className="text-xs text-primary font-medium hover:underline transition-colors mt-2"
                >
                  {showAllEditLanguages ? t('common.see_less', 'See less') : `${t('common.see_more_languages', 'See more languages')} (+${remainingLanguages.length})`}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {currentKurdish.length > 0 && (
                <div>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t('profile.kurdish', 'Kurdish')}</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {currentKurdish.map((language, index) => (
                      <span key={index} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">{language.replace('Kurdish (', '').replace(')', '')}</span>
                    ))}
                  </div>
                </div>
              )}
              {currentOther.length > 0 && (
                <div>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t('profile.languages', 'Languages')}</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {currentOther.map((language, index) => (
                      <span key={index} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">{language}</span>
                    ))}
                  </div>
                </div>
              )}
              {currentLanguages.length === 0 && (
                <span className="text-muted-foreground text-sm">{t('profile.no_languages_selected', 'No languages selected')}</span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Separator />

      <DetailItem
        icon={<MessageCircle size={18} />}
        label={t('profile.communication_style', 'Communication Style')}
        value={details.communicationStyle || t('common.not_specified', 'Not specified')}
        editable={!!onFieldEdit}
        fieldKey="communicationStyle"
        fieldType="select"
        fieldOptions={[
          t('profile.direct', 'Direct'),
          t('profile.diplomatic', 'Diplomatic'),
          t('profile.expressive', 'Expressive'),
          t('profile.reserved', 'Reserved'),
          t('profile.humorous', 'Humorous'),
          t('profile.analytical', 'Analytical')
        ]}
        onFieldEdit={onFieldEdit}
      />

      <DetailItem
        icon={<Bot size={18} />}
        label={t('profile.decision_making', 'Decision Making')}
        value={
          <div className="flex items-center gap-1.5">
            <span>{details.decisionMakingStyle || t('common.not_specified', 'Not specified')}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Bot size={12} className="text-primary" />
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-popover border border-border">
                  <p className="text-xs text-muted-foreground">
                    {t('profile.ai_decision_style', 'AI analyzes decision style based on profile data')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        }
        editable={!!onFieldEdit}
        fieldKey="decisionMakingStyle"
        fieldType="select"
        fieldOptions={[
          t('profile.analytical', 'Analytical'),
          t('profile.intuitive', 'Intuitive'),
          t('profile.collaborative', 'Collaborative'),
          t('profile.decisive', 'Decisive'),
          t('profile.cautious', 'Cautious')
        ]}
        onFieldEdit={onFieldEdit}
      />
    </div>
  );
};

export default ProfileCommunication;
