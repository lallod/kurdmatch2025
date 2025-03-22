
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  onNewRole: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onNewRole }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
      <Button onClick={onNewRole} className="gap-2">
        <Plus size={16} />
        New Role
      </Button>
    </div>
  );
};

export default PageHeader;
