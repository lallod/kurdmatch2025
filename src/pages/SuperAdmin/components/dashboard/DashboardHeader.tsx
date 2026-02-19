
import React from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from '@/hooks/useTranslations';

interface DashboardHeaderProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
  refreshing: boolean;
  handleRefresh: () => void;
}

const DashboardHeader = ({ timeRange, setTimeRange, refreshing, handleRefresh }: DashboardHeaderProps) => {
  const { t } = useTranslations();
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">{t('admin.dashboard', 'Dashboard')}</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('admin.last_30_days', 'Select time range')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">{t('admin.last_24_hours', 'Last 24 hours')}</SelectItem>
              <SelectItem value="week">{t('admin.last_7_days', 'Last 7 days')}</SelectItem>
              <SelectItem value="month">{t('admin.last_30_days', 'Last 30 days')}</SelectItem>
              <SelectItem value="year">{t('admin.last_year', 'Last year')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-2">
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? t('admin.refreshing', 'Refreshing...') : t('admin.refresh', 'Refresh')}
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
