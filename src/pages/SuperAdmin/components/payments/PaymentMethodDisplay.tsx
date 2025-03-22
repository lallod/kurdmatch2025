
import React from 'react';
import { CreditCard, Wallet } from 'lucide-react';

// Payment method options
export const paymentMethods = [
  { id: 'credit_card', label: 'Credit Card', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'paypal', label: 'PayPal', icon: <Wallet className="h-4 w-4" /> },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: <Wallet className="h-4 w-4" /> },
  { id: 'apple_pay', label: 'Apple Pay', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'google_pay', label: 'Google Pay', icon: <CreditCard className="h-4 w-4" /> },
];

interface PaymentMethodDisplayProps {
  methodId: string;
}

export const PaymentMethodDisplay = ({ methodId }: PaymentMethodDisplayProps) => {
  const method = paymentMethods.find(m => m.id === methodId);
  const defaultMethod = { id: methodId, label: methodId, icon: <CreditCard className="h-4 w-4" /> };
  const displayMethod = method || defaultMethod;
  
  return (
    <div className="flex items-center">
      {displayMethod.icon}
      <span className="ml-2">{displayMethod.label}</span>
    </div>
  );
};
