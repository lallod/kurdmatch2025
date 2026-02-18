
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface PageHeaderProps {
  onNewRole: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onNewRole }) => {
  const { t } = useTranslations();
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">{t('admin.role_management', 'Role Management')}</h1>
      <Button onClick={onNewRole} className="gap-2">
        <Plus size={16} />
        {t('admin.new_role', 'New Role')}
      </Button>
    </div>
  );
};

export default PageHeader;
