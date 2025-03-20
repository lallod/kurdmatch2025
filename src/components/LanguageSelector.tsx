
import React, { useState } from 'react';
import { Check, ChevronDown, Globe, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { allLanguages, languageCategories } from '@/data/languages';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedLanguages.map(language => (
          <Badge key={language} variant="secondary" className="pl-2 pr-1 py-1.5">
            {language}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 ml-1 -mr-1 text-muted-foreground hover:text-foreground"
              onClick={() => removeLanguage(language)}
            >
              <X size={12} />
            </Button>
          </Badge>
        ))}
        
        {selectedLanguages.length === 0 && (
          <p className="text-sm text-muted-foreground">No languages selected</p>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>Select languages</span>
            <Globe className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="flex items-center border-b px-3">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="middle-eastern">Middle East</TabsTrigger>
                <TabsTrigger value="kurdish">Kurdish</TabsTrigger>
                <TabsTrigger value="european">European</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-2 border-b">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search languages..." 
                  className="h-8 flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            
            <ScrollArea className="h-[300px]">
              <div className="p-2">
                {filteredLanguages().length === 0 ? (
                  <p className="text-sm text-center py-4 text-muted-foreground">No languages found</p>
                ) : (
                  <div className="space-y-1">
                    {filteredLanguages().map(language => (
                      <div 
                        key={language}
                        className={`
                          flex items-center justify-between rounded-md px-2 py-1.5 text-sm
                          ${selectedLanguages.includes(language) 
                            ? 'bg-primary/10 text-primary' 
                            : 'hover:bg-accent cursor-pointer'}
                          ${selectedLanguages.length >= maxItems && !selectedLanguages.includes(language) 
                            ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        onClick={() => {
                          if (selectedLanguages.length < maxItems || selectedLanguages.includes(language)) {
                            toggleLanguage(language);
                          }
                        }}
                      >
                        <span>{language}</span>
                        {selectedLanguages.includes(language) && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {selectedLanguages.length >= maxItems && (
              <div className="p-2 border-t">
                <p className="text-xs text-muted-foreground text-center">
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
