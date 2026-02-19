
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface RoleSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const RoleSearch: React.FC<RoleSearchProps> = ({ searchTerm, onSearchChange }) => {
  const { t } = useTranslations();
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        placeholder={t('admin.search_roles', 'Search roles...')}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default RoleSearch;
