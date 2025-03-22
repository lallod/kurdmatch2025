
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface RoleSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const RoleSearch: React.FC<RoleSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search roles..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default RoleSearch;
