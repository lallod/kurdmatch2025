
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, UserPlus, Users, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslations } from '@/hooks/useTranslations';

interface PageHeaderProps {
  onExport: () => void;
  onAddUser: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onExport, onAddUser }) => {
  const { t } = useTranslations();
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.users_management', 'Users Management')}</h1>
          <p className="text-gray-600 mt-1">{t('admin.manage_real_users', 'Manage real users who registered through your app')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onExport} className="gap-2">
            <Download size={16} />
            {t('admin.export_users', 'Export Users')}
          </Button>
          <Button onClick={onAddUser} className="gap-2">
            <UserPlus size={16} />
            {t('admin.user_management', 'User Management')}
          </Button>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 !text-blue-600" />
        <AlertTitle className="text-blue-800">{t('admin.real_users_only', 'Real Users Only')}</AlertTitle>
        <AlertDescription className="text-blue-700">
          {t('admin.real_users_info', 'This page now shows only real users who registered through your app\'s normal registration process. To see users here, have them register at /register. All test data generation has been disabled.')}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PageHeader;
