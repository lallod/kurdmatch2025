
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
import { useTranslations } from '@/hooks/useTranslations';

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
  const { t } = useTranslations();
  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('admin.resend_receipt', 'Resend Receipt')}</DialogTitle>
          <DialogDescription>
            {t('admin.resend_receipt_desc', "Resend the receipt to the customer's email address.")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p>{t('admin.resend_for_transaction', 'Resend receipt for transaction')} <strong>{payment.invoiceNumber}</strong> {t('common.to', 'to:')}</p>
          <p className="font-medium mt-2">{payment.email}</p>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button 
            variant="default" 
            onClick={onResend}
          >
            {t('admin.send_receipt', 'Send Receipt')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
