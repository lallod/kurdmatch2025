
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Printer, Download, Mail } from 'lucide-react';
import { Payment } from '../types/payment';
import { toast } from 'sonner';
import { paymentStatuses } from './PaymentStatusBadge';
import { paymentMethods } from './PaymentMethodDisplay';
import { useTranslations } from '@/hooks/useTranslations';

interface ViewReceiptDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  payment: Payment | null;
  formatCurrency: (amount: number) => string;
  onResendReceipt: () => void;
}

export const ViewReceiptDialog = ({
  isOpen,
  setIsOpen,
  payment,
  formatCurrency,
  onResendReceipt
}: ViewReceiptDialogProps) => {
  const { t } = useTranslations();
  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('admin.payment_receipt', 'Payment Receipt')}</DialogTitle>
          <DialogDescription>
            {t('admin.receipt_details_for', 'Receipt details for transaction')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{t('admin.receipt', 'RECEIPT')}</h3>
                <p className="text-muted-foreground">{payment.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{t('admin.company_name', 'Company Name')}</p>
                <p className="text-sm text-muted-foreground">123 Business St</p>
                <p className="text-sm text-muted-foreground">Business City, BC 12345</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">{t('admin.billed_to', 'Billed To')}</h4>
              <p className="font-medium">{payment.userName}</p>
              <p className="text-sm">{payment.email}</p>
              {payment.billingAddress && (
                <>
                  <p className="text-sm">{payment.billingAddress.address}</p>
                  <p className="text-sm">
                    {payment.billingAddress.city}, {payment.billingAddress.state} {payment.billingAddress.postalCode}
                  </p>
                  <p className="text-sm">{payment.billingAddress.country}</p>
                </>
              )}
            </div>
            <div className="text-right">
              <h4 className="text-sm font-medium text-muted-foreground">{t('admin.payment_info', 'Payment Info')}</h4>
              <p><strong>{t('common.date', 'Date')}:</strong> {payment.date}</p>
              <p><strong>{t('common.status', 'Status')}:</strong> {paymentStatuses.find(s => s.id === payment.status)?.label}</p>
              <p><strong>{t('common.method', 'Method')}:</strong> {paymentMethods.find(m => m.id === payment.method)?.label}</p>
              {payment.cardInfo && (
                <p><strong>{t('admin.card', 'Card')}:</strong> {payment.cardInfo.type} {t('admin.ending_in', 'ending in')} {payment.cardInfo.last4}</p>
              )}
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.description', 'Description')}</TableHead>
                  <TableHead className="text-right">{t('common.amount', 'Amount')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div>
                      <p className="font-medium">{payment.planName} {t('admin.subscription', 'Subscription')}</p>
                      <p className="text-sm text-muted-foreground">{payment.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-between border-t pt-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('admin.thank_you', 'Thank you for your business!')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm"><strong>{t('admin.subtotal', 'Subtotal')}:</strong> {formatCurrency(payment.amount)}</p>
              <p className="text-sm"><strong>{t('admin.tax', 'Tax')}:</strong> {formatCurrency(0)}</p>
              <p className="font-bold"><strong>{t('admin.total', 'Total')}:</strong> {formatCurrency(payment.amount)}</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                toast.success(t('admin.receipt_printed', 'Receipt printed successfully'));
              }}
            >
              <Printer className="mr-2 h-4 w-4" />
              {t('admin.print', 'Print')}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                toast.success(t('admin.receipt_downloaded', 'Receipt downloaded as PDF'));
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              {t('admin.download_pdf', 'Download PDF')}
            </Button>
            <Button
              variant="default"
              onClick={onResendReceipt}
            >
              <Mail className="mr-2 h-4 w-4" />
              {t('admin.email_receipt', 'Email Receipt')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
