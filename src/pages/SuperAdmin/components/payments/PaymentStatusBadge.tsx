
import React from 'react';
import { Badge } from '@/components/ui/badge';

// Payment status options
export const paymentStatuses = [
  { id: 'completed', label: 'Completed', color: 'green' },
  { id: 'pending', label: 'Pending', color: 'amber' },
  { id: 'failed', label: 'Failed', color: 'red' },
  { id: 'refunded', label: 'Refunded', color: 'blue' },
  { id: 'disputed', label: 'Disputed', color: 'purple' },
];

interface PaymentStatusBadgeProps {
  status: string;
}

export const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  const statusConfig = paymentStatuses.find(s => s.id === status);
  
  if (!statusConfig) return <Badge>{status}</Badge>;
  
  let className = '';
  
  switch (statusConfig.color) {
    case 'green':
      className = 'bg-green-100 text-green-800 hover:bg-green-100';
      break;
    case 'amber':
      className = 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      break;
    case 'red':
      className = 'bg-red-100 text-red-800 hover:bg-red-100';
      break;
    case 'blue':
      className = 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      break;
    case 'purple':
      className = 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      break;
    default:
      className = 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
  
  return <Badge variant="outline" className={className}>{statusConfig.label}</Badge>;
};
