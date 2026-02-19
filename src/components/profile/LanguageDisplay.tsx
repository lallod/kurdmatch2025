
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Languages } from 'lucide-react';
import DetailItem from './DetailItem';
import { languageCategories } from '@/data/languages';
import { useTranslations } from '@/hooks/useTranslations';

const MAX_VISIBLE = 3;

interface LanguageDisplayProps {
  languages: string[];
  tinderBadgeStyle: string;
}

const LanguageDisplay: React.FC<LanguageDisplayProps> = ({ languages, tinderBadgeStyle }) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslations();

  const kurdishDialects = languages.filter(l => languageCategories.kurdish.includes(l));
  const otherLanguages = languages.filter(l => !languageCategories.kurdish.includes(l));

  const visibleOther = expanded ? otherLanguages : otherLanguages.slice(0, MAX_VISIBLE);
  const hasMoreOther = otherLanguages.length > MAX_VISIBLE;

  if (languages.length === 0) {
    return (
      <DetailItem 
        icon={<Languages size={18} />} 
        label={t('profile.can_speak', 'Can speak')} 
        value={<span className="text-muted-foreground text-sm">{t('profile.no_languages_selected', 'No languages selected')}</span>} 
      />
    );
  }

  return (
    <DetailItem 
      icon={<Languages size={18} />} 
      label={t('profile.can_speak', 'Can speak')} 
      value={
        <div className="space-y-2 mt-1">
          {kurdishDialects.length > 0 && (
            <div>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t('profile.kurdish', 'Kurdish')}</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {kurdishDialects.map((lang, i) => (
                  <Badge key={i} variant="outline" className={tinderBadgeStyle}>{lang.replace('Kurdish (', '').replace(')', '')}</Badge>
                ))}
              </div>
            </div>
          )}
          {otherLanguages.length > 0 && (
            <div>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t('profile.languages', 'Languages')}</span>
              <div className="flex flex-wrap gap-1.5 mt-1 items-center">
                {visibleOther.map((lang, i) => (
                  <Badge key={i} variant="outline" className={tinderBadgeStyle}>{lang}</Badge>
                ))}
                {hasMoreOther && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-xs text-primary font-medium hover:underline transition-colors"
                  >
                    {expanded ? t('common.see_less', 'See less') : `+${otherLanguages.length - MAX_VISIBLE} ${t('common.more', 'more')}`}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      } 
    />
  );
};

export default LanguageDisplay;
