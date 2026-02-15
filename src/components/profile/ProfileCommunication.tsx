
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, Bot, Globe 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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

const ProfileCommunication: React.FC<ProfileCommunicationProps> = ({ 
  details, 
  tinderBadgeStyle,
  isMobile,
  onFieldEdit
}) => {
  const currentLanguages = details.languages || [];

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

  return (
    <div className="space-y-6 py-4">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
            <Globe size={18} />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Languages</p>
        </div>
        
        <div className="ml-[52px]">
          {onFieldEdit ? (
            <div className="grid grid-cols-2 gap-1.5">
              {allLanguages.map((lang) => {
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
                    {lang}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {currentLanguages.length > 0 ? (
                currentLanguages.map((language, index) => (
                  <span key={index} className={`text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium`}>{language}</span>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">No languages selected</span>
              )}
            </div>
          )}
        </div>
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
