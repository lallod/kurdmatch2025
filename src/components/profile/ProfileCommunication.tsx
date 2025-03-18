
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Languages, MessageCircle, Brain, Bot
} from 'lucide-react';
import DetailItem from './DetailItem';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  return (
    <div className="space-y-6 py-4">
      <div>
        <h4 className="font-medium mb-2">Languages</h4>
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
        <h4 className="font-medium mb-2 flex items-center">
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
