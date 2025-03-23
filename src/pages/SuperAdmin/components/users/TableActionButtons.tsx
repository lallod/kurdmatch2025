
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, Trash2 } from 'lucide-react';

interface TableActionButtonsProps {
  onRefresh: () => void;
  onDeleteAllUsers: () => void;
  userCount: number;
}

const TableActionButtons: React.FC<TableActionButtonsProps> = ({
  onRefresh,
  onDeleteAllUsers,
  userCount
}) => {
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={onRefresh}
      >
        <RefreshCw size={14} />
        Refresh
      </Button>
      
      <Button 
        variant="destructive"
        className="gap-2"
        onClick={onDeleteAllUsers}
        disabled={userCount === 0}
      >
        <Users size={16} />
        <Trash2 size={16} />
        Remove Users by Role
      </Button>
    </div>
  );
};

export default TableActionButtons;
