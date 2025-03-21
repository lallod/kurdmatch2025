
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Languages, MessageCircle, Brain, Bot, Pencil, ArrowLeft, Globe
} from 'lucide-react';
import DetailItem from './DetailItem';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import DetailEditor from '@/components/DetailEditor';
import LanguageSelector from '@/components/LanguageSelector';
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
                    <p className="text-sm text-muted-foreground">
                      Select the languages you speak or wish to practice. You can select up to 5 languages.
                    </p>
                    <LanguageSelector 
                      selectedLanguages={selectedLanguages}
                      onChange={setSelectedLanguages}
                      maxItems={5}
                    />
                    
                    <div className="mt-8 flex justify-end">
                      <SheetClose asChild>
                        <Button 
                          className="bg-tinder-rose hover:bg-tinder-rose/90"
                          onClick={handleSaveLanguages}
                        >
                          Save Changes
                        </Button>
                      </SheetClose>
                    </div>
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
