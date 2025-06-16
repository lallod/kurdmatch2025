
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, UserPlus, Users, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PageHeaderProps {
  onExport: () => void;
  onAddUser: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onExport, onAddUser }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-1">Manage real users who registered through your app</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onExport} className="gap-2">
            <Download size={16} />
            Export Users
          </Button>
          <Button onClick={onAddUser} className="gap-2">
            <UserPlus size={16} />
            User Management
          </Button>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 !text-blue-600" />
        <AlertTitle className="text-blue-800">Real Users Only</AlertTitle>
        <AlertDescription className="text-blue-700">
          This page now shows only real users who registered through your app's normal registration process. 
          To see users here, have them register at <strong>/register</strong>. All test data generation has been disabled.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PageHeader;
