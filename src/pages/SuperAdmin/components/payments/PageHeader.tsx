
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  DollarSign 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

export const PageHeader = () => {
  const { t } = useTranslations();
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">{t('admin.payment_processing', 'Payment Processing')}</h1>
        <p className="text-muted-foreground">{t('admin.manage_payment_transactions', 'Manage payment transactions and billing')}</p>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={() => {
            toast.success(t('admin.payment_data_exported', 'Payment data exported successfully'));
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          {t('common.export', 'Export')}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <DollarSign className="mr-2 h-4 w-4" />
              {t('admin.payment_actions', 'Payment Actions')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                toast.success(t('admin.sync_payment_data_success', 'Sync payment data with external service'));
              }}
            >
              {t('admin.sync_payment_data', 'Sync Payment Data')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toast.success(t('admin.generate_monthly_report_success', 'Generate monthly report'));
              }}
            >
              {t('admin.generate_monthly_report', 'Generate Monthly Report')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toast.success(t('admin.configure_payment_gateway_success', 'Configure payment gateway'));
              }}
            >
              {t('admin.configure_payment_gateway', 'Configure Payment Gateway')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
