
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import UserManagementTabs from '../components/users/redesign/UserManagementTabs';

const UsersPage = () => {
  return (
    <div className="space-y-6">
      <Alert variant="destructive" className="bg-yellow-500/10 border-yellow-500/20 text-yellow-400">
        <ShieldAlert className="h-4 w-4 !text-yellow-500" />
        <AlertTitle className="font-semibold text-yellow-400">Administrator Responsibility</AlertTitle>
        <AlertDescription className="text-yellow-400/80">
          You are viewing sensitive user data. Handle this information with the utmost care and respect for user privacy. All actions are logged.
        </AlertDescription>
      </Alert>

      <UserManagementTabs />
    </div>
  );
};

export default UsersPage;
