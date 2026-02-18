
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
import { useTranslations } from '@/hooks/useTranslations';

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
  const { t } = useTranslations();
  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('admin.process_refund', 'Process Refund')}</DialogTitle>
          <DialogDescription>
            {t('admin.process_refund_desc', 'Process a refund for this transaction.')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <p>{t('admin.process_refund_for', 'Process refund for:')}</p>
            <p className="font-medium">{payment.userName}</p>
            <p className="text-sm">{payment.email}</p>
          </div>
          
          <div>
            <p><strong>{t('common.transaction', 'Transaction')}:</strong> {payment.invoiceNumber}</p>
            <p><strong>{t('common.date', 'Date')}:</strong> {payment.date}</p>
            <p><strong>{t('common.amount', 'Amount')}:</strong> {formatCurrency(payment.amount)}</p>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-red-600">
              <AlertTriangle className="inline-block h-4 w-4 mr-1" />
              {t('admin.refund_warning', 'This action cannot be undone. The customer will be refunded the full amount.')}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button 
            variant="destructive" 
            onClick={onRefund}
          >
            {t('admin.process_refund', 'Process Refund')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
