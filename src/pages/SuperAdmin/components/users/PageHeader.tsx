
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, UserPlus } from 'lucide-react';

interface PageHeaderProps {
  onExport: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onExport }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExport} className="gap-2">
          <Download size={16} />
          Export
        </Button>
        <Button className="gap-2">
          <UserPlus size={16} />
          Add User
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
