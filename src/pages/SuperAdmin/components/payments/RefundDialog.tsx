
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Payment } from '../types/payment';

interface RefundDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  payment: Payment | null;
  formatCurrency: (amount: number) => string;
  onRefund: () => void;
}

export const RefundDialog = ({
  isOpen,
  setIsOpen,
  payment,
  formatCurrency,
  onRefund
}: RefundDialogProps) => {
  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
          <DialogDescription>
            Process a refund for this transaction.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <p>Process refund for:</p>
            <p className="font-medium">{payment.userName}</p>
            <p className="text-sm">{payment.email}</p>
          </div>
          
          <div>
            <p><strong>Transaction:</strong> {payment.invoiceNumber}</p>
            <p><strong>Date:</strong> {payment.date}</p>
            <p><strong>Amount:</strong> {formatCurrency(payment.amount)}</p>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-red-600">
              <AlertTriangle className="inline-block h-4 w-4 mr-1" />
              This action cannot be undone. The customer will be refunded the full amount.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onRefund}
          >
            Process Refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
