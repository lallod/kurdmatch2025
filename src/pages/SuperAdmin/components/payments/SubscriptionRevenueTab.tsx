
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

// Monthly revenue data for chart
const monthlyRevenue = [
  { month: 'Jan', revenue: 12500 },
  { month: 'Feb', revenue: 14200 },
  { month: 'Mar', revenue: 16800 },
  { month: 'Apr', revenue: 15300 },
  { month: 'May', revenue: 17500 },
  { month: 'Jun', revenue: 19200 },
];

interface SubscriptionRevenueTabProps {
  formatCurrency: (amount: number) => string;
}

export const SubscriptionRevenueTab = ({ formatCurrency }: SubscriptionRevenueTabProps) => {
  const { t } = useTranslations();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.subscription_revenue_overview', 'Subscription Revenue Overview')}</CardTitle>
        <CardDescription>{t('admin.mrr_metrics', 'Monthly recurring revenue and subscription metrics')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('admin.monthly_recurring_revenue', 'Monthly Recurring Revenue')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(19200)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('admin.mrr_change', '+8.4% from last month')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('admin.active_subscribers', 'Active Subscribers')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">926</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('admin.new_subscribers_month', '+23 new subscribers this month')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('admin.avg_revenue_per_user', 'Average Revenue Per User')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(20.73)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('admin.arpu_change', '+$1.25 from last month')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('admin.monthly_revenue_year', 'Monthly Revenue (2023)')}</h3>
            <div className="h-[300px] w-full">
              <div className="h-full w-full flex flex-col justify-end">
                <div className="flex h-full items-end gap-2">
                  {monthlyRevenue.map((item) => (
                    <div key={item.month} className="flex flex-col items-center">
                      <div 
                        className="w-12 bg-gradient-to-t from-tinder-rose to-tinder-orange rounded-t"
                        style={{ 
                          height: `${(item.revenue / 20000) * 100}%`,
                          minHeight: '20px'
                        }}
                      />
                      <div className="text-xs mt-2">{item.month}</div>
                      <div className="text-xs font-semibold">{formatCurrency(item.revenue)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('admin.subscription_plans', 'Subscription Plans')}</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 mr-2">Premium</Badge>
                    <span>{formatCurrency(19.99)}/{t('admin.this_month', 'month').toLowerCase()}</span>
                  </div>
                  <span>452 {t('admin.subscribers', 'subscribers')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 mr-2">Basic</Badge>
                    <span>{formatCurrency(9.99)}/{t('admin.this_month', 'month').toLowerCase()}</span>
                  </div>
                  <span>321 {t('admin.subscribers', 'subscribers')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 mr-2">Ultimate</Badge>
                    <span>{formatCurrency(29.99)}/{t('admin.this_month', 'month').toLowerCase()}</span>
                  </div>
                  <span>153 {t('admin.subscribers', 'subscribers')}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t('admin.churn_rate', 'Churn Rate')}</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{t('admin.monthly_churn', 'Monthly Churn')}</span>
                    <span className="text-sm font-semibold">3.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '3.2%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{t('admin.annual_projection', 'Annual Projection')}</span>
                    <span className="text-sm font-semibold">32.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '32.5%' }}></div>
                  </div>
                </div>
                <div className="pt-2">
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">
                    <AlertTriangle className="h-3 w-3 mr-1" /> {t('admin.requires_attention', 'Requires attention')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
