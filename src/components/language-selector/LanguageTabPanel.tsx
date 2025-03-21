
import React, { useState, useEffect } from 'react';
import { X, Plus, Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import LanguageList from './LanguageList';

interface LanguageTabPanelProps {
  selectedLanguages: string[];
  toggleLanguage: (language: string) => void;
  allLanguages: string[];
  languageCategories: {
    middleEastern: string[];
    kurdishDialects: string[];
    european: string[];
  };
  maxItems: number;
}

const LanguageTabPanel: React.FC<LanguageTabPanelProps> = ({
  selectedLanguages,
  toggleLanguage,
  allLanguages,
  languageCategories,
  maxItems
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [customLanguage, setCustomLanguage] = useState('');
  const [displayedLanguages, setDisplayedLanguages] = useState<string[]>(allLanguages);

  // Update displayed languages when tab or search changes
  useEffect(() => {
    setDisplayedLanguages(getFilteredLanguages());
  }, [activeTab, searchValue]);

  const getFilteredLanguages = () => {
    const searchLower = searchValue.toLowerCase();
    
    let filteredList: string[] = [];
    
    switch(activeTab) {
      case 'middle-eastern':
        filteredList = languageCategories.middleEastern;
        break;
      case 'kurdish':
        filteredList = languageCategories.kurdishDialects;
        break;
      case 'european':
        filteredList = languageCategories.european;
        break;
      case 'all':
      default:
        filteredList = allLanguages;
        break;
    }
    
    // Apply search filter
    return filteredList.filter(language => 
      language.toLowerCase().includes(searchLower)
    );
  };

  const addCustomLanguage = () => {
    if (!customLanguage.trim()) {
      return;
    }
    
    const formattedLanguage = customLanguage.trim();
    
    // Check if language already exists
    if (allLanguages.some(lang => lang.toLowerCase() === formattedLanguage.toLowerCase())) {
      toast.error(`${formattedLanguage} already exists in the language list`);
      return;
    }
    
    // Check if already added to selected languages
    if (selectedLanguages.some(lang => lang.toLowerCase() === formattedLanguage.toLowerCase())) {
      toast.error(`${formattedLanguage} is already selected`);
      return;
    }
    
    // Limit check
    if (selectedLanguages.length >= maxItems) {
      toast.error(`You can select up to ${maxItems} languages`);
      return;
    }
    
    toggleLanguage(formattedLanguage);
    setCustomLanguage('');
    toast.success(`Added ${formattedLanguage} to your languages`);
  };

  const handleTabChange = (value: string) => {
    console.log('Tab changed to:', value);
    setActiveTab(value);
    setSearchValue(''); // Reset search when changing tabs
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
      
      {/* Add custom language section */}
      <div className="p-2 border-b">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Add custom language..."
            value={customLanguage}
            onChange={(e) => setCustomLanguage(e.target.value)}
            className="h-9 neo-border focus-visible:ring-tinder-rose/20"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomLanguage();
              }
            }}
          />
          <Button 
            size="sm"
            onClick={addCustomLanguage}
            className="bg-tinder-rose hover:bg-tinder-rose/90 flex items-center gap-1"
          >
            <Plus size={16} />
            Add
          </Button>
        </div>
      </div>
      
      <LanguageList 
        displayedLanguages={displayedLanguages}
        selectedLanguages={selectedLanguages}
        maxItems={maxItems}
        searchValue={searchValue}
        toggleLanguage={toggleLanguage}
      />
      
      {selectedLanguages.length >= maxItems && (
        <div className="p-3 border-t bg-yellow-50/50">
          <p className="text-xs text-amber-700 text-center flex items-center justify-center">
            <Sparkles size={12} className="mr-1 text-amber-500" />
            Maximum of {maxItems} languages allowed
          </p>
        </div>
      )}
    </Tabs>
  );
};

export default LanguageTabPanel;
