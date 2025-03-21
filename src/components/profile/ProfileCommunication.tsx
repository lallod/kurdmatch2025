
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { 
  Languages, MessageCircle, Bot, Pencil, Globe 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { toast } from 'sonner';
import LanguageDisplay from './LanguageDisplay';
import LanguageEditor from './LanguageEditor';
import CommunicationDisplay from './CommunicationDisplay';
import CommunicationEditor from './CommunicationEditor';

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
              <SheetClose asChild>
                <LanguageEditor
                  selectedLanguages={selectedLanguages}
                  setSelectedLanguages={setSelectedLanguages}
                  onSave={handleSaveLanguages}
                />
              </SheetClose>
            </SheetContent>
          </Sheet>
        </h4>
        <LanguageDisplay languages={profileLanguages} tinderBadgeStyle={tinderBadgeStyle} />
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
              <CommunicationEditor 
                communicationStyle={details.communicationStyle}
                decisionMakingStyle={details.decisionMakingStyle}
              />
            </SheetContent>
          </Sheet>
        </h4>
        <CommunicationDisplay 
          communicationStyle={details.communicationStyle}
          decisionMakingStyle={details.decisionMakingStyle}
        />
      </div>
    </div>
  );
};

export default ProfileCommunication;
