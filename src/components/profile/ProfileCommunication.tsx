
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Languages, MessageCircle, Brain, Bot, Pencil, ArrowLeft
} from 'lucide-react';
import DetailItem from './DetailItem';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import DetailEditor from '@/components/DetailEditor';
import LanguageSelector from '@/components/LanguageSelector';

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

  return (
    <div className="space-y-6 py-4">
      <div>
        <h4 className="font-medium mb-2 flex items-center justify-between">
          <span>Languages</span>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="edit" className="ml-2">
                <Pencil size={16} />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <ScrollArea className="h-[calc(100vh-5rem)]">
                <div className="py-6 pr-6">
                  <div className="flex items-center gap-2 mb-6">
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft size={18} />
                        <span className="sr-only">Back</span>
                      </Button>
                    </SheetClose>
                    <h3 className="text-lg font-semibold">Edit Languages</h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Select the languages you speak. You can select up to 5 languages.
                    </p>
                    <LanguageSelector 
                      selectedLanguages={selectedLanguages}
                      onChange={setSelectedLanguages}
                      maxItems={5}
                    />
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
              {details.languages.map((language, index) => (
                <Badge key={index} variant="outline" className={tinderBadgeStyle}>{language}</Badge>
              ))}
            </div>
          } 
        />
      </div>
      
      <div>
        <h4 className="font-medium mb-2 flex items-center justify-between">
          <span className="flex items-center">
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
              <Button variant="edit" className="ml-2">
                <Pencil size={16} />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <ScrollArea className="h-[calc(100vh-5rem)]">
                <div className="py-6 pr-6">
                  <div className="flex items-center gap-2 mb-6">
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowLeft size={18} />
                        <span className="sr-only">Back</span>
                      </Button>
                    </SheetClose>
                    <h3 className="text-lg font-semibold">Edit Communication</h3>
                  </div>
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
