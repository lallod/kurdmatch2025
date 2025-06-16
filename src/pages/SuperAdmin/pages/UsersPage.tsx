
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import UserManagementTabs from '../components/users/redesign/UserManagementTabs';

const UsersPage = () => {
  return (
    <div className="space-y-6">
      <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-800">
        <ShieldAlert className="h-4 w-4 !text-yellow-600" />
        <AlertTitle className="font-semibold">Administrator Responsibility</AlertTitle>
        <AlertDescription className="text-yellow-700">
          You are viewing sensitive user data. Handle this information with the utmost care and respect for user privacy. All actions are logged.
        </AlertDescription>
      </Alert>

      <UserManagementTabs />
    </div>
  );
};

export default UsersPage;
