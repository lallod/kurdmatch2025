
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import DetailEditor from '@/components/DetailEditor';
import { MessageCircle } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface CommunicationEditorProps {
  communicationStyle?: string;
  decisionMakingStyle?: string;
}

const CommunicationEditor: React.FC<CommunicationEditorProps> = ({
  communicationStyle,
  decisionMakingStyle
}) => {
  const { t } = useTranslations();

  return (
    <ScrollArea className="h-[calc(100vh-5rem)]">
      <div className="py-6 pr-2">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-left">{t('profile.edit_communication', 'Edit Communication')}</SheetTitle>
          </div>
        </SheetHeader>
        
        <DetailEditor
          icon={<MessageCircle size={18} />}
          title={t('profile.your_communication_style', 'Your Communication Style')}
          fields={[
            { name: 'communicationStyle', label: t('profile.communication_style', 'Communication Style'), value: communicationStyle || '', type: 'select' },
            { name: 'decisionMakingStyle', label: t('profile.decision_making_style', 'Decision Making Style'), value: decisionMakingStyle || '', type: 'select' },
          ]}
        />
      </div>
    </ScrollArea>
  );
};

export default CommunicationEditor;
