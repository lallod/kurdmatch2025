
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
import { Payment } from '../types/payment';

interface ResendReceiptDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  payment: Payment | null;
  onResend: () => void;
}

export const ResendReceiptDialog = ({
  isOpen,
  setIsOpen,
  payment,
  onResend
}: ResendReceiptDialogProps) => {
  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Resend Receipt</DialogTitle>
          <DialogDescription>
            Resend the receipt to the customer's email address.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p>Resend receipt for transaction <strong>{payment.invoiceNumber}</strong> to:</p>
          <p className="font-medium mt-2">{payment.email}</p>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="default" 
            onClick={onResend}
          >
            Send Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
