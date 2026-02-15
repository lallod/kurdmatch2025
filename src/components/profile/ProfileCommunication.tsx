
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, Bot, Globe 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import DetailItem from './DetailItem';
import { allLanguages } from '@/data/languages';

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

const MAX_LANGUAGES = 5;

const ProfileCommunication: React.FC<ProfileCommunicationProps> = ({ 
  details, 
  tinderBadgeStyle,
  isMobile,
  onFieldEdit
}) => {
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const currentLanguages = details.languages || [];

  const handleToggleLanguage = async (language: string) => {
    if (!onFieldEdit) return;
    let updated: string[];
    if (currentLanguages.includes(language)) {
      updated = currentLanguages.filter(l => l !== language);
    } else {
      if (currentLanguages.length >= MAX_LANGUAGES) {
        toast.error(`Maximum ${MAX_LANGUAGES} languages allowed`);
        return;
      }
      updated = [...currentLanguages, language];
    }
    await onFieldEdit({ languages: updated });
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center text-sm text-muted-foreground font-medium">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary mr-3">
              <Globe size={18} />
            </div>
            Languages
          </span>
          {onFieldEdit && (
            <button
              onClick={() => setShowLanguagePicker(!showLanguagePicker)}
              className="text-xs text-primary font-medium hover:underline"
            >
              {showLanguagePicker ? 'Done' : 'Edit'}
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-1 ml-[52px]">
          {currentLanguages.length > 0 ? (
            currentLanguages.map((language, index) => (
              <Badge key={index} variant="outline" className={tinderBadgeStyle}>{language}</Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">No languages selected</span>
          )}
        </div>

        {showLanguagePicker && onFieldEdit && (
          <div className="mt-3 ml-[52px] p-3 bg-muted/30 rounded-2xl border border-border/30">
            <p className="text-xs text-muted-foreground mb-2">
              Tap to toggle ({currentLanguages.length}/{MAX_LANGUAGES})
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
              {allLanguages.map((lang) => {
                const isSelected = currentLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    onClick={() => handleToggleLanguage(lang)}
                    className={`text-xs px-2.5 py-1.5 rounded-full border transition-all ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background text-foreground border-border/50 hover:border-primary/40'
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <Separator />

      <DetailItem
        icon={<MessageCircle size={18} />}
        label="Communication Style"
        value={details.communicationStyle || 'Not specified'}
        editable={!!onFieldEdit}
        fieldKey="communicationStyle"
        fieldType="select"
        fieldOptions={["Direct", "Diplomatic", "Expressive", "Reserved", "Humorous", "Analytical"]}
        onFieldEdit={onFieldEdit}
      />

      <DetailItem
        icon={<Bot size={18} />}
        label="Decision Making"
        value={
          <div className="flex items-center gap-1.5">
            <span>{details.decisionMakingStyle || 'Not specified'}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Bot size={12} className="text-primary" />
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-popover border border-border">
                  <p className="text-xs text-muted-foreground">
                    AI analyzes decision style based on profile data
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        }
        editable={!!onFieldEdit}
        fieldKey="decisionMakingStyle"
        fieldType="select"
        fieldOptions={["Analytical", "Intuitive", "Collaborative", "Decisive", "Cautious"]}
        onFieldEdit={onFieldEdit}
      />
    </div>
  );
};

export default ProfileCommunication;
