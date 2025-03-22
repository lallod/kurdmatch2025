
import React from 'react';
import { Role } from './types';
import { ShieldAlert, ShieldCheck, Shield, User, Users } from 'lucide-react';

export const getRoleIcon = (roleName: string) => {
  switch (roleName) {
    case 'Super Admin':
      return <ShieldAlert size={20} className="text-purple-600" />;
    case 'Admin':
      return <ShieldCheck size={20} className="text-blue-600" />;
    case 'Moderator':
      return <Shield size={20} className="text-green-600" />;
    case 'Support Agent':
      return <User size={20} className="text-amber-600" />;
    default:
      return <Users size={20} className="text-gray-600" />;
  }
};

export const filterRoles = (roles: Role[], searchTerm: string) => {
  return roles.filter(role => {
    return role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           role.description.toLowerCase().includes(searchTerm.toLowerCase());
  });
};
