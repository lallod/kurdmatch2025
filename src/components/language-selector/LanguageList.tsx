
import React from 'react';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import LanguageItem from './LanguageItem';

interface LanguageListProps {
  displayedLanguages: string[];
  selectedLanguages: string[];
  maxItems: number;
  searchValue: string;
  toggleLanguage: (language: string) => void;
}

const LanguageList: React.FC<LanguageListProps> = ({
  displayedLanguages,
  selectedLanguages,
  maxItems,
  searchValue,
  toggleLanguage
}) => {
  return (
    <ScrollArea className="h-[300px] rounded-b-lg">
      <div className="p-2">
        {displayedLanguages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-gray-500">
            <Search className="h-8 w-8 mb-2 opacity-50 text-tinder-rose/30" />
            <p className="text-sm text-center">No languages found matching "{searchValue}"</p>
          </div>
        ) : (
          <div className="space-y-1">
            {displayedLanguages.map(language => (
              <LanguageItem
                key={language}
                language={language}
                isSelected={selectedLanguages.includes(language)}
                isDisabled={selectedLanguages.length >= maxItems && !selectedLanguages.includes(language)}
                onToggle={() => {
                  if (selectedLanguages.length < maxItems || selectedLanguages.includes(language)) {
                    toggleLanguage(language);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default LanguageList;
