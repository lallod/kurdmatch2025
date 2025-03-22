
import React from 'react';
import { Badge } from '@/components/ui/badge';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
    case 'inactive':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
    case 'suspended':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>;
    case 'moderator':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Moderator</Badge>;
    case 'premium':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Premium</Badge>;
    case 'user':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">User</Badge>;
    default:
      return <Badge>{role}</Badge>;
  }
};
