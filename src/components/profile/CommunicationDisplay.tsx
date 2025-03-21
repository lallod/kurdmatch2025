
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Brain } from 'lucide-react';
import DetailItem from './DetailItem';

interface CommunicationDisplayProps {
  communicationStyle?: string;
  decisionMakingStyle?: string;
}

const CommunicationDisplay: React.FC<CommunicationDisplayProps> = ({ 
  communicationStyle, 
  decisionMakingStyle 
}) => {
  return (
    <div className="space-y-1">
      <DetailItem 
        icon={<MessageCircle size={18} />} 
        label="Communication Style" 
        value={communicationStyle || "Not specified"} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Brain size={18} />} 
        label="Decision Making" 
        value={decisionMakingStyle || "Not specified"} 
      />
    </div>
  );
};

export default CommunicationDisplay;
