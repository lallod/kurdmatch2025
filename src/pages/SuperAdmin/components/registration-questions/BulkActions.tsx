
import React from 'react';
import { Button } from '@/components/ui/button';

interface BulkActionsProps {
  selectedCount: number;
  onEnableBulk: () => void;
  onDisableBulk: () => void;
  onDeleteBulk: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onEnableBulk,
  onDisableBulk,
  onDeleteBulk
}) => {
  if (selectedCount === 0) return null;
  
  return (
    <div className="bg-secondary/30 p-2 rounded-lg flex items-center justify-between">
      <span className="text-sm">{selectedCount} questions selected</span>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onEnableBulk}
        >
          Enable
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onDisableBulk}
        >
          Disable
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onDeleteBulk}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;
