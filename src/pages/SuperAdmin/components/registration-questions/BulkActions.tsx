
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';

interface BulkActionsProps {
  selectedCount: number;
  onEnableBulk: () => void;
  onDisableBulk: () => void;
  onDeleteBulk: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount, onEnableBulk, onDisableBulk, onDeleteBulk
}) => {
  const { t } = useTranslations();
  if (selectedCount === 0) return null;
  
  return (
    <div className="bg-white/5 p-2 rounded-lg flex items-center justify-between border border-white/10">
      <span className="text-sm text-white">{selectedCount} {t('admin.questions_selected', 'questions selected')}</span>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={onEnableBulk}>
          {t('admin.enable', 'Enable')}
        </Button>
        <Button variant="outline" size="sm" onClick={onDisableBulk}>
          {t('admin.disable', 'Disable')}
        </Button>
        <Button variant="destructive" size="sm" onClick={onDeleteBulk}>
          {t('admin.delete', 'Delete')}
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;
