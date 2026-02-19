
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  Wallet 
} from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

export const PaymentSettingsTab = () => {
  const { t } = useTranslations();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.payment_settings', 'Payment Settings')}</CardTitle>
        <CardDescription>{t('admin.configure_payment_settings', 'Configure payment gateways and transaction settings')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('admin.payment_gateways', 'Payment Gateways')}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-blue-500 mr-4" />
                  <div>
                    <h4 className="font-medium">Stripe</h4>
                    <p className="text-sm text-muted-foreground">{t('admin.primary_payment_processor', 'Primary payment processor')}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" /> {t('common.active', 'Active')}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <Wallet className="h-8 w-8 text-blue-400 mr-4" />
                  <div>
                    <h4 className="font-medium">PayPal</h4>
                    <p className="text-sm text-muted-foreground">{t('admin.secondary_payment_processor', 'Secondary payment processor')}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" /> {t('common.active', 'Active')}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-gray-400 mr-4" />
                  <div>
                    <h4 className="font-medium">Square</h4>
                    <p className="text-sm text-muted-foreground">{t('admin.not_configured', 'Not configured')}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                  <XCircle className="h-3 w-3 mr-1" /> {t('common.inactive', 'Inactive')}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('admin.invoice_settings', 'Invoice Settings')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">{t('admin.company_information', 'Company Information')}</h4>
                <p className="text-sm text-muted-foreground">{t('admin.info_displayed_invoices', 'Information displayed on invoices')}</p>
                <Button variant="outline" className="w-full mt-2">
                  {t('admin.edit_company_info', 'Edit Company Information')}
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">{t('admin.invoice_templates', 'Invoice Templates')}</h4>
                <p className="text-sm text-muted-foreground">{t('admin.customize_invoice', 'Customize invoice appearance')}</p>
                <Button variant="outline" className="w-full mt-2">
                  {t('admin.manage_templates', 'Manage Templates')}
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('admin.tax_settings', 'Tax Settings')}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{t('admin.auto_tax_calculation', 'Automatic Tax Calculation')}</h4>
                  <p className="text-sm text-muted-foreground">{t('admin.tax_calc_desc', 'Calculate taxes based on customer location')}</p>
                </div>
                <Button variant="outline">{t('common.configure', 'Configure')}</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{t('admin.tax_reports', 'Tax Reports')}</h4>
                  <p className="text-sm text-muted-foreground">{t('admin.tax_reports_desc', 'Download tax reports for accounting')}</p>
                </div>
                <Button variant="outline">{t('admin.generate_report', 'Generate Report')}</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
