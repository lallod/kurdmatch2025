import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, CreditCard, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useAdminSubscribers } from '../hooks/useAdminSubscribers';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

const SubscribersPage = () => {
  const { t } = useTranslations();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'basic' | 'premium' | 'ultimate'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { subscribers, loading, totalCount, stats, fetchSubscribers, cancelSubscription } = useAdminSubscribers();

  React.useEffect(() => { fetchSubscribers(currentPage, 10, typeFilter); }, [currentPage, typeFilter]);

  const handleSearch = () => { setCurrentPage(1); fetchSubscribers(1, 10, typeFilter); };
  const handleCancel = async (subscriptionId: string) => {
    const success = await cancelSubscription(subscriptionId);
    if (success) toast.success(t('admin.subscription_cancelled', 'Subscription cancelled successfully'));
    else toast.error(t('admin.subscription_cancel_failed', 'Failed to cancel subscription'));
  };
  const handleRefresh = () => { fetchSubscribers(currentPage, 10, typeFilter); };
  const filteredSubscribers = subscribers.filter(s => !searchTerm || s.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(totalCount / 10);
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.subscriber_management', 'Subscriber Management')}</h1>
          <p className="text-white/60 mt-1">{t('admin.manage_subscriptions', 'Manage premium subscriptions')}</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {t('common.refresh', 'Refresh')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#141414] border-white/5"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-white/60">{t('admin.total_subscribers', 'Total Subscribers')}</p><p className="text-2xl font-bold text-white">{stats.total}</p></div><Users className="h-8 w-8 text-blue-400" /></div></CardContent></Card>
        <Card className="bg-[#141414] border-white/5"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-white/60">{t('admin.basic_plan', 'Basic Plan')}</p><p className="text-2xl font-bold text-white">{stats.basic}</p></div><CreditCard className="h-8 w-8 text-green-400" /></div></CardContent></Card>
        <Card className="bg-[#141414] border-white/5"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-white/60">{t('admin.premium_plan', 'Premium Plan')}</p><p className="text-2xl font-bold text-white">{stats.premium}</p></div><TrendingUp className="h-8 w-8 text-purple-400" /></div></CardContent></Card>
        <Card className="bg-[#141414] border-white/5"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-white/60">{t('admin.monthly_revenue', 'Monthly Revenue')}</p><p className="text-2xl font-bold text-white">{formatCurrency(stats.revenue)}</p></div><DollarSign className="h-8 w-8 text-green-400" /></div></CardContent></Card>
      </div>

      <Card className="bg-[#141414] border-white/5">
        <CardHeader>
          <CardTitle className="text-white">{t('admin.subscribers', 'Subscribers')}</CardTitle>
          <CardDescription className="text-white/60">{t('admin.view_manage_subscriptions', 'View and manage all active subscriptions')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <Input placeholder={t('admin.search_by_user', 'Search by user name...')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40" />
              <Button onClick={handleSearch} disabled={loading}><Search className="h-4 w-4 mr-2" />{t('common.search', 'Search')}</Button>
            </div>
            <Select value={typeFilter} onValueChange={(value: any) => { setTypeFilter(value); setCurrentPage(1); }}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white"><SelectValue placeholder={t('admin.filter_by_plan', 'Filter by plan')} /></SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10">
                <SelectItem value="all">{t('admin.all_plans', 'All Plans')}</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="ultimate">Ultimate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12 text-white/60">{t('admin.loading_subscribers', 'Loading subscribers...')}</div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-12 text-white/60">{t('admin.no_subscribers_found', 'No subscribers found')}</div>
          ) : (
            <>
              <div className="rounded-md border border-white/5">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-white/5">
                      <TableHead className="text-white/80">{t('common.user', 'User')}</TableHead>
                      <TableHead className="text-white/80">{t('admin.plan', 'Plan')}</TableHead>
                      <TableHead className="text-white/80">{t('admin.start_date', 'Start Date')}</TableHead>
                      <TableHead className="text-white/80">{t('admin.expires', 'Expires')}</TableHead>
                      <TableHead className="text-right text-white/80">{t('common.actions', 'Actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscribers.map((subscriber) => (
                      <TableRow key={subscriber.id} className="border-white/5 hover:bg-white/5">
                        <TableCell className="font-medium text-white">
                          <div><div>{subscriber.profile?.name || t('admin.unknown', 'Unknown')}</div><div className="text-xs text-white/40">{subscriber.profile?.location || ''}</div></div>
                        </TableCell>
                        <TableCell><Badge className={subscriber.subscription_type === 'ultimate' ? 'bg-purple-500/20 text-purple-300' : subscriber.subscription_type === 'premium' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}>{subscriber.subscription_type}</Badge></TableCell>
                        <TableCell className="text-white/60">{format(new Date(subscriber.created_at), 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="text-white/60">{subscriber.expires_at ? format(new Date(subscriber.expires_at), 'MMM dd, yyyy') : t('admin.never', 'Never')}</TableCell>
                        <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => handleCancel(subscriber.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10" disabled={loading}>{t('common.cancel', 'Cancel')}</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-white/60">{t('common.page_of', 'Page {{current}} of {{total}}', { current: currentPage, total: totalPages })}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1 || loading}>{t('common.previous', 'Previous')}</Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || loading}>{t('common.next', 'Next')}</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscribersPage;
