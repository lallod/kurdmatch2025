
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Plus, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';
import LanguageList from '../language-selector/LanguageList';
import { allLanguages } from '@/data/languages';

interface LanguageEditorProps {
  selectedLanguages: string[];
  setSelectedLanguages: React.Dispatch<React.SetStateAction<string[]>>;
  onSave: () => void;
  maxLanguages?: number;
}

const LanguageEditor: React.FC<LanguageEditorProps> = ({
  selectedLanguages,
  setSelectedLanguages,
  onSave,
  maxLanguages = 5
}) => {
  const { t } = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const filteredLanguages = allLanguages.filter(lang => 
    lang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageToggle = (language: string) => {
    if (selectedLanguages.includes(language)) {
      // Remove the language if it's already selected
      setSelectedLanguages(prev => prev.filter(lang => lang !== language));
    } else {
      // Add the language if we haven't reached the max
      if (selectedLanguages.length < maxLanguages) {
        setSelectedLanguages(prev => [...prev, language]);
      } else {
        toast.error(`You can select up to ${maxLanguages} languages`);
      }
    }
  };

  const handleRemoveLanguage = (language: string) => {
    setSelectedLanguages(prev => prev.filter(lang => lang !== language));
  };

  const handleAddCustomLanguage = () => {
    if (!newLanguage.trim()) return;

    const customLang = newLanguage.trim();
    
    // Check if already in the list
    if (selectedLanguages.includes(customLang)) {
      toast.error(t('toast.language.already_selected', 'This language is already selected'));
      return;
    }
    
    // Check max languages
    if (selectedLanguages.length >= maxLanguages) {
      toast.error(`You can select up to ${maxLanguages} languages`);
      return;
    }
    
    setSelectedLanguages(prev => [...prev, customLang]);
    setNewLanguage('');
    toast.success(`Added ${customLang} to your languages`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        Languages You Speak
      </h2>
      
      <div className="p-4 bg-gray-50 rounded-lg border">
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedLanguages.map((language) => (
            <Badge key={language} className="pl-3 pr-2 py-1.5 bg-white text-black border shadow-sm">
              {language}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 ml-1 -mr-1 hover:bg-gray-100 rounded-full"
                onClick={() => handleRemoveLanguage(language)}
              >
                <X size={12} />
              </Button>
            </Badge>
          ))}
          
          {selectedLanguages.length === 0 && (
            <p className="w-full text-center text-gray-500 py-2">No languages selected</p>
          )}
        </div>
      </div>
      
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Add new languages"
          value={newLanguage}
          onChange={(e) => setNewLanguage(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddCustomLanguage();
            }
          }}
        />
        <Button 
          className="bg-tinder-rose hover:bg-tinder-rose/90"
          onClick={handleAddCustomLanguage}
          disabled={!newLanguage.trim() || selectedLanguages.length >= maxLanguages}
        >
          <Plus size={16} />
          Add
        </Button>
      </div>
      
      <div className="mt-2 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          placeholder="Search languages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <ScrollArea className="h-64 mt-2">
        <LanguageList
          displayedLanguages={filteredLanguages}
          selectedLanguages={selectedLanguages}
          maxItems={maxLanguages}
          searchValue={searchQuery}
          toggleLanguage={handleLanguageToggle}
        />
      </ScrollArea>
      
      {selectedLanguages.length >= maxLanguages && (
        <p className="text-sm text-amber-600 text-center">
          Maximum of {maxLanguages} languages allowed
        </p>
      )}
      
      <Button 
        className="w-full mt-4 bg-tinder-rose hover:bg-tinder-rose/90"
        onClick={onSave}
      >
        <Check size={16} className="mr-1" />
        Save Languages
      </Button>
    </div>
  );
};

export default LanguageEditor;
