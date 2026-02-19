import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAdminPayments } from '../hooks/useAdminPayments';
import { useTranslations } from '@/hooks/useTranslations';

// Import our refactored components
import { PageHeader } from '../components/payments/PageHeader';
import { AIBanner } from '../components/payments/AIBanner';
import { TransactionsTab } from '../components/payments/TransactionsTab';
import { SubscriptionRevenueTab } from '../components/payments/SubscriptionRevenueTab';
import { PaymentSettingsTab } from '../components/payments/PaymentSettingsTab';
import { ViewReceiptDialog } from '../components/payments/ViewReceiptDialog';
import { ResendReceiptDialog } from '../components/payments/ResendReceiptDialog';
import { RefundDialog } from '../components/payments/RefundDialog';
import { Payment } from '../components/types/payment';

const PaymentsPage = () => {
  const { t } = useTranslations();
  const { payments: adminPayments, loading, totalCount, stats, fetchPayments, refundPayment } = useAdminPayments();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeTab, setActiveTab] = useState('transactions');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPayments(currentPage, 10, statusFilter);
  }, [currentPage, statusFilter]);

  // Convert AdminPayment to Payment type for compatibility
  const payments: Payment[] = adminPayments.map(p => ({
    id: p.id,
    userId: p.user_id,
    userName: p.profile?.name || 'Unknown',
    email: '',
    amount: p.amount,
    date: p.created_at,
    status: p.status as any,
    method: p.payment_method || 'credit_card',
    planName: p.subscription_type || 'N/A',
    description: p.description || '',
    invoiceNumber: `INV-${p.id.slice(0, 8)}`,
  }));
  
  // Dialog states
  const [isViewReceiptOpen, setIsViewReceiptOpen] = useState(false);
  const [isResendReceiptOpen, setIsResendReceiptOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Filter payments based on search term and method
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethod = 
      methodFilter === 'all' || 
      payment.method === methodFilter;
    
    return matchesSearch && matchesMethod;
  });

  // Sort payments  
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'userName':
        comparison = a.userName.localeCompare(b.userName);
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // Format price to currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate total revenue from stats
  const calculateTotalRevenue = () => {
    return stats.totalRevenue;
  };

  // Process refund
  const handleRefund = async () => {
    if (!selectedPayment) return;
    
    const success = await refundPayment(selectedPayment.id);
    if (success) {
      toast.success(t('admin.payment_refunded_success', 'Payment refunded successfully'));
      setIsRefundOpen(false);
      setSelectedPayment(null);
    } else {
      toast.error(t('admin.payment_refund_failed', 'Failed to refund payment'));
    }
  };

  // Resend receipt
  const handleResendReceipt = () => {
    if (!selectedPayment) return;
    
    setIsResendReceiptOpen(false);
    setSelectedPayment(null);
    toast.success(t('admin.receipt_resent_to', 'Receipt resent to {{email}}', { email: selectedPayment.email }));
  };

  // Event handlers for dialogs
  const handleViewReceipt = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsViewReceiptOpen(true);
  };

  const handleResendReceiptClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsResendReceiptOpen(true);
  };

  const handleProcessRefund = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsRefundOpen(true);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setMethodFilter('all');
    setDateFilter('all');
  };

  return (
    <div className="space-y-6">
      <PageHeader />
      <AIBanner />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">{t('admin.transactions', 'Transactions')}</TabsTrigger>
          <TabsTrigger value="subscriptions">{t('admin.subscription_revenue', 'Subscription Revenue')}</TabsTrigger>
          <TabsTrigger value="settings">{t('admin.payment_settings', 'Payment Settings')}</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <TransactionsTab 
            payments={payments}
            filteredPayments={sortedPayments}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            methodFilter={methodFilter}
            setMethodFilter={setMethodFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            handleSort={handleSort}
            calculateTotalRevenue={calculateTotalRevenue}
            formatCurrency={formatCurrency}
            onViewReceipt={handleViewReceipt}
            onResendReceipt={handleResendReceiptClick}
            onProcessRefund={handleProcessRefund}
            resetFilters={resetFilters}
          />
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubscriptionRevenueTab formatCurrency={formatCurrency} />
        </TabsContent>

        <TabsContent value="settings">
          <PaymentSettingsTab />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ViewReceiptDialog 
        isOpen={isViewReceiptOpen}
        setIsOpen={setIsViewReceiptOpen}
        payment={selectedPayment}
        formatCurrency={formatCurrency}
        onResendReceipt={() => {
          setIsViewReceiptOpen(false);
          setIsResendReceiptOpen(true);
        }}
      />
      
      <ResendReceiptDialog 
        isOpen={isResendReceiptOpen}
        setIsOpen={setIsResendReceiptOpen}
        payment={selectedPayment}
        onResend={handleResendReceipt}
      />
      
      <RefundDialog 
        isOpen={isRefundOpen}
        setIsOpen={setIsRefundOpen}
        payment={selectedPayment}
        formatCurrency={formatCurrency}
        onRefund={handleRefund}
      />
    </div>
  );
};

export default PaymentsPage;
