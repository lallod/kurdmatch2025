
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Languages, MessageCircle, Brain, Bot, Pencil, Globe, X, Check, Plus, Search
} from 'lucide-react';
import DetailItem from './DetailItem';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import DetailEditor from '@/components/DetailEditor';
import { Input } from '@/components/ui/input';
import { allLanguages } from '@/data/languages';
import { toast } from 'sonner';

interface ProfileCommunicationProps {
  details: {
    languages: string[];
    communicationStyle?: string;
    decisionMakingStyle?: string;
  };
  tinderBadgeStyle: string;
  isMobile: boolean;
}

const ProfileCommunication: React.FC<ProfileCommunicationProps> = ({ 
  details, 
  tinderBadgeStyle,
  isMobile
}) => {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(details.languages || []);
  const [profileLanguages, setProfileLanguages] = useState<string[]>(details.languages || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const maxLanguages = 5;

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
      toast.error("This language is already selected");
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

  const handleSaveLanguages = () => {
    setProfileLanguages(selectedLanguages);
    toast.success("Languages saved successfully!");
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <h4 className="font-medium mb-2 flex items-center justify-between">
          <span className="flex items-center">
            <Globe size={18} className="mr-2 text-tinder-orange/70" />
            Languages
          </span>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full hover:bg-gray-100">
                <Pencil size={16} className="text-gray-500" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <ScrollArea className="h-[calc(100vh-5rem)]">
                <div className="py-6 pr-2">
                  <SheetHeader className="mb-6">
                    <div className="flex items-center gap-2">
                      <SheetTitle className="text-left">Edit Languages</SheetTitle>
                    </div>
                  </SheetHeader>
                  
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Languages size={20} className="text-tinder-rose" />
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
                      <div className="grid grid-cols-1 gap-1">
                        {filteredLanguages.map((language) => (
                          <div
                            key={language}
                            className={`
                              flex items-center justify-between px-3 py-2.5 rounded-md transition-colors
                              ${selectedLanguages.includes(language) 
                                ? 'bg-tinder-rose/10 text-tinder-rose' 
                                : 'hover:bg-gray-100 cursor-pointer'}
                              ${selectedLanguages.length >= maxLanguages && !selectedLanguages.includes(language)
                                ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            onClick={() => handleLanguageToggle(language)}
                          >
                            <span>{language}</span>
                            {selectedLanguages.includes(language) && (
                              <Check className="h-4 w-4 text-tinder-rose" />
                            )}
                          </div>
                        ))}
                        
                        {filteredLanguages.length === 0 && (
                          <div className="p-4 text-center text-gray-500">
                            No languages found matching "{searchQuery}"
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    
                    {selectedLanguages.length >= maxLanguages && (
                      <p className="text-sm text-amber-600 text-center">
                        Maximum of {maxLanguages} languages allowed
                      </p>
                    )}
                    
                    <SheetClose asChild>
                      <Button 
                        className="w-full mt-4 bg-tinder-rose hover:bg-tinder-rose/90"
                        onClick={handleSaveLanguages}
                      >
                        <Check size={16} className="mr-1" />
                        Save Languages
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </h4>
        <DetailItem 
          icon={<Languages size={18} />} 
          label="Can speak" 
          value={
            <div className="flex flex-wrap gap-2 mt-1">
              {profileLanguages.length > 0 ? (
                profileLanguages.map((language, index) => (
                  <Badge key={index} variant="outline" className={tinderBadgeStyle}>{language}</Badge>
                ))
              ) : (
                <span className="text-gray-500">No languages selected</span>
              )}
            </div>
          } 
        />
      </div>
      
      <div>
        <h4 className="font-medium mb-2 flex items-center justify-between">
          <span className="flex items-center">
            <MessageCircle size={18} className="mr-2 text-tinder-orange/70" />
            Communication
            <span className="ml-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Bot size={12} className="text-tinder-orange" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-white/90 backdrop-blur-sm border border-tinder-rose/10">
                    <p className="text-xs text-muted-foreground">
                      AI analyzes communication style based on profile data
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          </span>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full hover:bg-gray-100">
                <Pencil size={16} className="text-gray-500" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <ScrollArea className="h-[calc(100vh-5rem)]">
                <div className="py-6 pr-2">
                  <SheetHeader className="mb-6">
                    <div className="flex items-center gap-2">
                      <SheetTitle className="text-left">Edit Communication</SheetTitle>
                    </div>
                  </SheetHeader>
                  
                  <DetailEditor
                    icon={<MessageCircle size={18} />}
                    title="Your Communication Style"
                    fields={[
                      { name: 'communicationStyle', label: 'Communication Style', value: details.communicationStyle || '', type: 'select' },
                      { name: 'decisionMakingStyle', label: 'Decision Making Style', value: details.decisionMakingStyle || '', type: 'select' },
                    ]}
                  />
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </h4>
        <div className="space-y-1">
          <DetailItem 
            icon={<MessageCircle size={18} />} 
            label="Communication Style" 
            value={details.communicationStyle || "Not specified"} 
          />
          
          <Separator />
          
          <DetailItem 
            icon={<Brain size={18} />} 
            label="Decision Making" 
            value={details.decisionMakingStyle || "Not specified"} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileCommunication;
