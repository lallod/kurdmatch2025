
import React, { useState } from 'react';
import { Check, ChevronDown, Globe, Search, X, Languages } from 'lucide-react';
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

  const filteredLanguages = () => {
    if (activeTab === 'all') {
      return allLanguages.filter(language => 
        language.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else if (activeTab === 'middle-eastern') {
      return languageCategories.middleEastern.filter(language => 
        language.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else if (activeTab === 'kurdish') {
      return languageCategories.kurdishDialects.filter(language => 
        language.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else if (activeTab === 'european') {
      return languageCategories.european.filter(language => 
        language.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    return [];
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

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedLanguages.map(language => (
            <Badge key={language} className="bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 pl-3 pr-2 py-1.5 shadow-sm">
              {language}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 ml-1 -mr-1 hover:bg-gray-200 rounded-full"
                onClick={() => removeLanguage(language)}
              >
                <X size={12} />
              </Button>
            </Badge>
          ))}
          
          {selectedLanguages.length === 0 && (
            <div className="flex items-center justify-center w-full py-6 text-gray-500">
              <Languages className="mr-2 h-5 w-5 opacity-70" />
              <p className="text-sm">No languages selected yet</p>
            </div>
          )}
        </div>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between bg-white border-gray-200 hover:bg-gray-50 shadow-sm">
            <span className="flex items-center">
              <Globe className="mr-2 h-4 w-4 text-gray-500" />
              Select languages
            </span>
            <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="start">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="flex items-center border-b px-3 bg-gray-50">
              <TabsList className="grid grid-cols-4 w-full bg-transparent h-12">
                <TabsTrigger value="all" className="data-[state=active]:bg-white rounded-t-md data-[state=active]:border-b-2 data-[state=active]:border-tinder-rose data-[state=active]:shadow-none">All</TabsTrigger>
                <TabsTrigger value="middle-eastern" className="data-[state=active]:bg-white rounded-t-md data-[state=active]:border-b-2 data-[state=active]:border-tinder-rose data-[state=active]:shadow-none">Middle East</TabsTrigger>
                <TabsTrigger value="kurdish" className="data-[state=active]:bg-white rounded-t-md data-[state=active]:border-b-2 data-[state=active]:border-tinder-rose data-[state=active]:shadow-none">Kurdish</TabsTrigger>
                <TabsTrigger value="european" className="data-[state=active]:bg-white rounded-t-md data-[state=active]:border-b-2 data-[state=active]:border-tinder-rose data-[state=active]:shadow-none">European</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-2 border-b bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2 bg-gray-50 rounded-md border border-gray-200 px-2">
                <Search className="h-4 w-4 text-gray-400" />
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
                    className="h-5 w-5 rounded-full hover:bg-gray-200" 
                    onClick={() => setSearchValue('')}
                  >
                    <X size={12} />
                  </Button>
                )}
              </div>
            </div>
            
            <ScrollArea className="h-[300px] rounded-b-lg">
              <div className="p-2">
                {filteredLanguages().length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-gray-500">
                    <Search className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm text-center">No languages found matching "{searchValue}"</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredLanguages().map(language => (
                      <div 
                        key={language}
                        className={`
                          flex items-center justify-between rounded-md px-3 py-2.5 text-sm
                          ${selectedLanguages.includes(language) 
                            ? 'bg-tinder-rose/5 text-tinder-rose border border-tinder-rose/20' 
                            : 'hover:bg-gray-50 cursor-pointer'}
                          ${selectedLanguages.length >= maxItems && !selectedLanguages.includes(language) 
                            ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        onClick={() => {
                          if (selectedLanguages.length < maxItems || selectedLanguages.includes(language)) {
                            toggleLanguage(language);
                          }
                        }}
                      >
                        <span className="font-medium">{language}</span>
                        {selectedLanguages.includes(language) && (
                          <Check className="h-4 w-4 text-tinder-rose" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {selectedLanguages.length >= maxItems && (
              <div className="p-3 border-t bg-yellow-50/50">
                <p className="text-xs text-amber-700 text-center">
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
