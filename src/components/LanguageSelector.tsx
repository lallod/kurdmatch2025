
import React, { useState } from 'react';
import { Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { allLanguages, languageCategories } from '@/data/languages';
import { toast } from 'sonner';
import SelectedLanguageBadges from './language-selector/SelectedLanguageBadges';
import LanguageTabPanel from './language-selector/LanguageTabPanel';

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onChange: (languages: string[]) => void;
  maxItems?: number;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguages,
  onChange,
  maxItems = 5
}) => {
  const [open, setOpen] = useState(false);

  const toggleLanguage = (language: string) => {
    // Language toggled
    if (selectedLanguages.includes(language)) {
      onChange(selectedLanguages.filter(l => l !== language));
    } else {
      if (selectedLanguages.length < maxItems) {
        onChange([...selectedLanguages, language]);
      } else {
        toast.error(`You can select up to ${maxItems} languages`);
      }
    }
  };

  const removeLanguage = (language: string) => {
    onChange(selectedLanguages.filter(l => l !== language));
  };

  return (
    <div className="space-y-4">
      <SelectedLanguageBadges 
        selectedLanguages={selectedLanguages}
        removeLanguage={removeLanguage}
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between neo-card border-tinder-rose/10 hover:border-tinder-rose/20 fancy-shine">
            <span className="flex items-center">
              <Globe className="mr-2 h-4 w-4 text-tinder-rose" />
              <span className="futuristic-text">Select languages</span>
            </span>
            <Sparkles className="ml-2 h-4 w-4 text-tinder-rose/70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-0 neo-glow border-tinder-rose/10" align="start">
          <LanguageTabPanel 
            selectedLanguages={selectedLanguages}
            toggleLanguage={toggleLanguage}
            allLanguages={allLanguages}
            languageCategories={languageCategories}
            maxItems={maxItems}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LanguageSelector;
