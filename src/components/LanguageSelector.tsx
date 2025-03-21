
import React, { useState } from 'react';
import { Check, ChevronDown, Globe, Search, X, Languages, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { allLanguages, languageCategories } from '@/data/languages';

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
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const getFilteredLanguages = () => {
    const searchLower = searchValue.toLowerCase();
    
    switch(activeTab) {
      case 'middle-eastern':
        return languageCategories.middleEastern.filter(language => 
          language.toLowerCase().includes(searchLower)
        );
      case 'kurdish':
        return languageCategories.kurdishDialects.filter(language => 
          language.toLowerCase().includes(searchLower)
        );
      case 'european':
        return languageCategories.european.filter(language => 
          language.toLowerCase().includes(searchLower)
        );
      case 'all':
      default:
        return allLanguages.filter(language => 
          language.toLowerCase().includes(searchLower)
        );
    }
  };

  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      onChange(selectedLanguages.filter(l => l !== language));
    } else {
      if (selectedLanguages.length < maxItems) {
        onChange([...selectedLanguages, language]);
      }
    }
  };

  const removeLanguage = (language: string) => {
    onChange(selectedLanguages.filter(l => l !== language));
  };

  const filteredLanguages = getFilteredLanguages();

  return (
    <div className="space-y-4">
      <div className="glass p-3 rounded-lg border border-tinder-rose/10 shadow-sm">
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedLanguages.map(language => (
            <Badge key={language} className="bg-gradient-to-r from-white/90 to-white/80 text-tinder-rose border-tinder-rose/20 shadow-sm pl-3 pr-2 py-1.5 hover:border-tinder-rose/30 neo-border">
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
              <p className="text-sm futuristic-text">No languages selected yet</p>
            </div>
          )}
        </div>
      </div>

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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center border-b px-3 bg-gradient-to-r from-gray-50 to-white">
              <TabsList className="grid grid-cols-4 w-full bg-transparent h-12">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-[0_2px_0_0_rgba(253,41,123,0.6)] rounded-t-md data-[state=active]:text-tinder-rose transition-all duration-300"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="middle-eastern" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-[0_2px_0_0_rgba(253,41,123,0.6)] rounded-t-md data-[state=active]:text-tinder-rose transition-all duration-300"
                >
                  Middle East
                </TabsTrigger>
                <TabsTrigger 
                  value="kurdish" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-[0_2px_0_0_rgba(253,41,123,0.6)] rounded-t-md data-[state=active]:text-tinder-rose transition-all duration-300"
                >
                  Kurdish
                </TabsTrigger>
                <TabsTrigger 
                  value="european" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-[0_2px_0_0_rgba(253,41,123,0.6)] rounded-t-md data-[state=active]:text-tinder-rose transition-all duration-300"
                >
                  European
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-2 border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-2 neo-border rounded-md px-2 bg-white">
                <Search className="h-4 w-4 text-tinder-rose/60" />
                <Input 
                  placeholder="Search languages..." 
                  className="h-9 flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                {searchValue && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 rounded-full hover:bg-tinder-rose/10" 
                    onClick={() => setSearchValue('')}
                  >
                    <X size={12} />
                  </Button>
                )}
              </div>
            </div>
            
            <ScrollArea className="h-[300px] rounded-b-lg">
              <div className="p-2">
                {filteredLanguages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-gray-500">
                    <Search className="h-8 w-8 mb-2 opacity-50 text-tinder-rose/30" />
                    <p className="text-sm text-center">No languages found matching "{searchValue}"</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredLanguages.map(language => (
                      <div 
                        key={language}
                        className={`
                          flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-all duration-200
                          ${selectedLanguages.includes(language) 
                            ? 'bg-gradient-to-r from-tinder-rose/5 to-tinder-rose/10 text-tinder-rose border border-tinder-rose/20 shadow-sm' 
                            : 'hover:bg-gray-50 cursor-pointer hover:border hover:border-tinder-rose/10 border border-transparent'}
                          ${selectedLanguages.length >= maxItems && !selectedLanguages.includes(language) 
                            ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        onClick={() => {
                          if (selectedLanguages.length < maxItems || selectedLanguages.includes(language)) {
                            toggleLanguage(language);
                          }
                        }}
                      >
                        <span className="font-medium futuristic-text">{language}</span>
                        {selectedLanguages.includes(language) && (
                          <div className="rounded-full bg-tinder-rose/10 p-1">
                            <Check className="h-3 w-3 text-tinder-rose" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {selectedLanguages.length >= maxItems && (
              <div className="p-3 border-t bg-yellow-50/50">
                <p className="text-xs text-amber-700 text-center flex items-center justify-center">
                  <Sparkles size={12} className="mr-1 text-amber-500" />
                  Maximum of {maxItems} languages allowed
                </p>
              </div>
            )}
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LanguageSelector;
