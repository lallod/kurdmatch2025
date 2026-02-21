
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Brain } from 'lucide-react';
import DetailItem from './DetailItem';
import { useTranslations } from '@/hooks/useTranslations';

interface CommunicationDisplayProps {
  communicationStyle?: string;
  decisionMakingStyle?: string;
}

const CommunicationDisplay: React.FC<CommunicationDisplayProps> = ({ 
  communicationStyle, 
  decisionMakingStyle 
}) => {
  const { t } = useTranslations();
  
  return (
    <div className="space-y-1">
      <DetailItem 
        icon={<MessageCircle size={18} />} 
        label={t('profile.communication_style', 'Communication Style')} 
        value={communicationStyle || t('profile.not_specified', 'Not specified')} 
      />
      
      <Separator />
      
      <DetailItem 
        icon={<Brain size={18} />} 
        label={t('profile.decision_making', 'Decision Making')} 
        value={decisionMakingStyle || t('profile.not_specified', 'Not specified')} 
      />
    </div>
  );
};

export default CommunicationDisplay;
