
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

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

// Mock data for payment transactions
const initialPayments: Payment[] = [
  {
    id: 'pay-001',
    userId: 'user-123',
    userName: 'John Smith',
    email: 'john.smith@example.com',
    amount: 19.99,
    date: '2023-06-15',
    status: 'completed',
    method: 'credit_card',
    planName: 'Premium',
    description: 'Monthly subscription payment',
    invoiceNumber: 'INV-2023-001',
    billingAddress: {
      name: 'John Smith',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
    },
    cardInfo: {
      type: 'Visa',
      last4: '4242',
      expiryDate: '05/25',
    }
  },
  {
    id: 'pay-002',
    userId: 'user-234',
    userName: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    amount: 9.99,
    date: '2023-06-14',
    status: 'completed',
    method: 'paypal',
    planName: 'Basic',
    description: 'Monthly subscription payment',
    invoiceNumber: 'INV-2023-002',
    billingAddress: {
      name: 'Emily Johnson',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      postalCode: '90001',
      country: 'USA',
    }
  },
  {
    id: 'pay-003',
    userId: 'user-345',
    userName: 'Michael Brown',
    email: 'michael.brown@example.com',
    amount: 29.99,
    date: '2023-06-13',
    status: 'pending',
    method: 'bank_transfer',
    planName: 'Ultimate',
    description: 'Monthly subscription payment',
    invoiceNumber: 'INV-2023-003',
    billingAddress: {
      name: 'Michael Brown',
      address: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60007',
      country: 'USA',
    }
  },
  {
    id: 'pay-004',
    userId: 'user-456',
    userName: 'Sarah Davis',
    email: 'sarah.davis@example.com',
    amount: 19.99,
    date: '2023-06-12',
    status: 'failed',
    method: 'credit_card',
    planName: 'Premium',
    description: 'Monthly subscription payment failed due to expired card',
    invoiceNumber: 'INV-2023-004',
    billingAddress: {
      name: 'Sarah Davis',
      address: '321 Elm St',
      city: 'Miami',
      state: 'FL',
      postalCode: '33101',
      country: 'USA',
    },
    cardInfo: {
      type: 'Mastercard',
      last4: '5678',
      expiryDate: '03/23',
    }
  },
  {
    id: 'pay-005',
    userId: 'user-567',
    userName: 'David Wilson',
    email: 'david.wilson@example.com',
    amount: 9.99,
    date: '2023-06-11',
    status: 'refunded',
    method: 'apple_pay',
    planName: 'Basic',
    description: 'Refund processed due to customer request',
    invoiceNumber: 'INV-2023-005',
    billingAddress: {
      name: 'David Wilson',
      address: '555 Maple Dr',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'USA',
    }
  },
  {
    id: 'pay-006',
    userId: 'user-678',
    userName: 'Jennifer Lee',
    email: 'jennifer.lee@example.com',
    amount: 29.99,
    date: '2023-06-10',
    status: 'completed',
    method: 'google_pay',
    planName: 'Ultimate',
    description: 'Monthly subscription payment',
    invoiceNumber: 'INV-2023-006',
    billingAddress: {
      name: 'Jennifer Lee',
      address: '777 Cedar Ln',
      city: 'Boston',
      state: 'MA',
      postalCode: '02108',
      country: 'USA',
    }
  },
  {
    id: 'pay-007',
    userId: 'user-789',
    userName: 'Robert Taylor',
    email: 'robert.taylor@example.com',
    amount: 19.99,
    date: '2023-06-09',
    status: 'disputed',
    method: 'credit_card',
    planName: 'Premium',
    description: 'Payment disputed by customer',
    invoiceNumber: 'INV-2023-007',
    billingAddress: {
      name: 'Robert Taylor',
      address: '999 Birch Ave',
      city: 'Denver',
      state: 'CO',
      postalCode: '80201',
      country: 'USA',
    },
    cardInfo: {
      type: 'Amex',
      last4: '9876',
      expiryDate: '12/24',
    }
  }
];

const PaymentsPage = () => {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeTab, setActiveTab] = useState('transactions');
  
  // Dialog states
  const [isViewReceiptOpen, setIsViewReceiptOpen] = useState(false);
  const [isResendReceiptOpen, setIsResendReceiptOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Filter payments based on search term, status, method, and date
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      payment.status === statusFilter;
    
    const matchesMethod = 
      methodFilter === 'all' || 
      payment.method === methodFilter;
    
    // Date filtering (simplified for demo)
    const matchesDate = dateFilter === 'all' || true;
    
    return matchesSearch && matchesStatus && matchesMethod && matchesDate;
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

  // Calculate total revenue
  const calculateTotalRevenue = () => {
    return payments
      .filter(payment => payment.status === 'completed')
      .reduce((total, payment) => total + payment.amount, 0);
  };

  // Process refund
  const handleRefund = () => {
    if (!selectedPayment) return;
    
    const updatedPayments = payments.map(payment => 
      payment.id === selectedPayment.id 
        ? { ...payment, status: 'refunded' } 
        : payment
    );
    
    setPayments(updatedPayments);
    setIsRefundOpen(false);
    setSelectedPayment(null);
    toast.success("Payment refunded successfully");
  };

  // Resend receipt
  const handleResendReceipt = () => {
    if (!selectedPayment) return;
    
    // In a real app, this would call an API to resend the receipt
    setIsResendReceiptOpen(false);
    setSelectedPayment(null);
    toast.success(`Receipt resent to ${selectedPayment.email}`);
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
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscription Revenue</TabsTrigger>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
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
