
import { useState } from 'react';
import { User } from '../types';

export const useUserFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const applyFilters = (users: User[]) => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' || 
        user.status === statusFilter;
      
      const matchesRole = 
        roleFilter === 'all' || 
        user.role === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });
  };

  return {
    searchTerm,
    statusFilter,
    roleFilter,
    setSearchTerm,
    setStatusFilter,
    setRoleFilter,
    applyFilters
  };
};
