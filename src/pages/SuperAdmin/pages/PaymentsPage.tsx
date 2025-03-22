
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ArrowUpDown, 
  Receipt, 
  CreditCard, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronsUpDown,
  Brain,
  Wallet,
  DollarSign,
  Mail,
  FileText,
  Printer
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';

// Payment status options
const paymentStatuses = [
  { id: 'completed', label: 'Completed', color: 'green' },
  { id: 'pending', label: 'Pending', color: 'amber' },
  { id: 'failed', label: 'Failed', color: 'red' },
  { id: 'refunded', label: 'Refunded', color: 'blue' },
  { id: 'disputed', label: 'Disputed', color: 'purple' },
];

// Payment method options
const paymentMethods = [
  { id: 'credit_card', label: 'Credit Card', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'paypal', label: 'PayPal', icon: <Wallet className="h-4 w-4" /> },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: <Wallet className="h-4 w-4" /> },
  { id: 'apple_pay', label: 'Apple Pay', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'google_pay', label: 'Google Pay', icon: <CreditCard className="h-4 w-4" /> },
];

// Interface for payment transaction
interface Payment {
  id: string;
  userId: string;
  userName: string;
  email: string;
  amount: number;
  date: string;
  status: string;
  method: string;
  planName: string;
  description: string;
  invoiceNumber: string;
  billingAddress?: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  cardInfo?: {
    type: string;
    last4: string;
    expiryDate: string;
  };
}

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

// Monthly revenue data for chart
const monthlyRevenue = [
  { month: 'Jan', revenue: 12500 },
  { month: 'Feb', revenue: 14200 },
  { month: 'Mar', revenue: 16800 },
  { month: 'Apr', revenue: 15300 },
  { month: 'May', revenue: 17500 },
  { month: 'Jun', revenue: 19200 },
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

  // Calculate today's revenue
  const calculateTodayRevenue = () => {
    const today = new Date().toISOString().split('T')[0];
    return payments
      .filter(payment => payment.status === 'completed' && payment.date === today)
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

  // Get payment method name and icon
  const getPaymentMethod = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    return method || { id: methodId, label: methodId, icon: <CreditCard className="h-4 w-4" /> };
  };

  // Status badge component
  const getStatusBadge = (status: string) => {
    const statusConfig = paymentStatuses.find(s => s.id === status);
    
    if (!statusConfig) return <Badge>{status}</Badge>;
    
    let className = '';
    
    switch (statusConfig.color) {
      case 'green':
        className = 'bg-green-100 text-green-800 hover:bg-green-100';
        break;
      case 'amber':
        className = 'bg-amber-100 text-amber-800 hover:bg-amber-100';
        break;
      case 'red':
        className = 'bg-red-100 text-red-800 hover:bg-red-100';
        break;
      case 'blue':
        className = 'bg-blue-100 text-blue-800 hover:bg-blue-100';
        break;
      case 'purple':
        className = 'bg-purple-100 text-purple-800 hover:bg-purple-100';
        break;
      default:
        className = 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
    
    return <Badge variant="outline" className={className}>{statusConfig.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payment Processing</h1>
          <p className="text-muted-foreground">Manage payment transactions and billing</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => {
              // Export payment data
              toast.success("Payment data exported successfully");
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <DollarSign className="mr-2 h-4 w-4" />
                Payment Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  toast.success("Sync payment data with external service");
                }}
              >
                Sync Payment Data
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast.success("Generate monthly report");
                }}
              >
                Generate Monthly Report
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast.success("Configure payment gateway");
                }}
              >
                Configure Payment Gateway
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* AI banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">AI-Powered Fraud Detection</h3>
          <p className="text-sm text-gray-600">Our AI system monitors payment patterns and identifies potential fraudulent transactions</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscription Revenue</TabsTrigger>
          <TabsTrigger value="settings">Payment Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(calculateTotalRevenue())}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Today's Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(1250)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  5 successful transactions today
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(59.97)} awaiting processing
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>View and manage all payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or invoice number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {paymentStatuses.map(status => (
                        <SelectItem key={status.id} value={status.id}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={methodFilter} onValueChange={setMethodFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      {paymentMethods.map(method => (
                        <SelectItem key={method.id} value={method.id}>{method.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[160px] justify-between">
                        Date Range
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0" align="end">
                      <div className="p-4 space-y-2">
                        <h4 className="font-medium">Filter by date</h4>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 gap-2">
                            <Button 
                              variant="outline" 
                              className="h-8 col-span-1" 
                              onClick={() => setDateFilter('today')}
                            >
                              Today
                            </Button>
                            <Button 
                              variant="outline" 
                              className="h-8 col-span-1" 
                              onClick={() => setDateFilter('yesterday')}
                            >
                              Yesterday
                            </Button>
                            <Button 
                              variant="outline" 
                              className="h-8 col-span-1" 
                              onClick={() => setDateFilter('thisWeek')}
                            >
                              This Week
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              variant="outline" 
                              className="h-8" 
                              onClick={() => setDateFilter('thisMonth')}
                            >
                              This Month
                            </Button>
                            <Button 
                              variant="outline" 
                              className="h-8" 
                              onClick={() => setDateFilter('lastMonth')}
                            >
                              Last Month
                            </Button>
                          </div>
                          <Button 
                            variant="default" 
                            className="h-8" 
                            onClick={() => setDateFilter('all')}
                          >
                            All Time
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button variant="outline" size="icon" onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setMethodFilter('all');
                    setDateFilter('all');
                  }}>
                    <Filter size={16} />
                  </Button>
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                        <div className="flex items-center">
                          Date
                          {sortBy === 'date' && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('userName')}>
                        <div className="flex items-center">
                          Customer
                          {sortBy === 'userName' && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                        <div className="flex items-center">
                          Amount
                          {sortBy === 'amount' && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                        <div className="flex items-center">
                          Status
                          {sortBy === 'status' && (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPayments.length > 0 ? (
                      sortedPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                              {payment.date}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{payment.userName}</div>
                            <div className="text-sm text-gray-500">{payment.email}</div>
                          </TableCell>
                          <TableCell>{payment.invoiceNumber}</TableCell>
                          <TableCell>
                            <div className="max-w-[180px] truncate" title={payment.description}>
                              {payment.description}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getPaymentMethod(payment.method).icon}
                              <span className="ml-2">{getPaymentMethod(payment.method).label}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                    <circle cx="12" cy="12" r="1"/>
                                    <circle cx="19" cy="12" r="1"/>
                                    <circle cx="5" cy="12" r="1"/>
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedPayment(payment);
                                    setIsViewReceiptOpen(true);
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Receipt
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedPayment(payment);
                                    setIsResendReceiptOpen(true);
                                  }}
                                >
                                  <Mail className="mr-2 h-4 w-4" />
                                  Resend Receipt
                                </DropdownMenuItem>
                                {payment.status === 'completed' && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedPayment(payment);
                                      setIsRefundOpen(true);
                                    }}
                                  >
                                    <Wallet className="mr-2 h-4 w-4" />
                                    Process Refund
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
                          No payment transactions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Revenue Overview</CardTitle>
              <CardDescription>Monthly recurring revenue and subscription metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Monthly Recurring Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(19200)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +8.4% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Subscribers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">926</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +23 new subscribers this month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Average Revenue Per User
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(20.73)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +$1.25 from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Monthly Revenue (2023)</h3>
                  <div className="h-[300px] w-full">
                    {/* Chart placeholder - in a real app, use Recharts */}
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
                    <h3 className="text-lg font-semibold mb-4">Subscription Plans</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 mr-2">Premium</Badge>
                          <span>{formatCurrency(19.99)}/month</span>
                        </div>
                        <span>452 subscribers</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 mr-2">Basic</Badge>
                          <span>{formatCurrency(9.99)}/month</span>
                        </div>
                        <span>321 subscribers</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 mr-2">Ultimate</Badge>
                          <span>{formatCurrency(29.99)}/month</span>
                        </div>
                        <span>153 subscribers</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Churn Rate</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Monthly Churn</span>
                          <span className="text-sm font-semibold">3.2%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '3.2%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Annual Projection</span>
                          <span className="text-sm font-semibold">32.5%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '32.5%' }}></div>
                        </div>
                      </div>
                      <div className="pt-2">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Requires attention
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment gateways and transaction settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Gateways</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <CreditCard className="h-8 w-8 text-blue-500 mr-4" />
                        <div>
                          <h4 className="font-medium">Stripe</h4>
                          <p className="text-sm text-muted-foreground">Primary payment processor</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" /> Active
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <Wallet className="h-8 w-8 text-blue-400 mr-4" />
                        <div>
                          <h4 className="font-medium">PayPal</h4>
                          <p className="text-sm text-muted-foreground">Secondary payment processor</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" /> Active
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <CreditCard className="h-8 w-8 text-gray-400 mr-4" />
                        <div>
                          <h4 className="font-medium">Square</h4>
                          <p className="text-sm text-muted-foreground">Not configured</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        <XCircle className="h-3 w-3 mr-1" /> Inactive
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Invoice Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium">Company Information</h4>
                      <p className="text-sm text-muted-foreground">Information displayed on invoices</p>
                      <Button variant="outline" className="w-full mt-2">
                        Edit Company Information
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Invoice Templates</h4>
                      <p className="text-sm text-muted-foreground">Customize invoice appearance</p>
                      <Button variant="outline" className="w-full mt-2">
                        Manage Templates
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Tax Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Automatic Tax Calculation</h4>
                        <p className="text-sm text-muted-foreground">Calculate taxes based on customer location</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Tax Reports</h4>
                        <p className="text-sm text-muted-foreground">Download tax reports for accounting</p>
                      </div>
                      <Button variant="outline">Generate Report</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Receipt Dialog */}
      <Dialog open={isViewReceiptOpen} onOpenChange={setIsViewReceiptOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
            <DialogDescription>
              Receipt details for transaction
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">RECEIPT</h3>
                    <p className="text-muted-foreground">{selectedPayment.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Company Name</p>
                    <p className="text-sm text-muted-foreground">123 Business St</p>
                    <p className="text-sm text-muted-foreground">Business City, BC 12345</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Billed To</h4>
                  <p className="font-medium">{selectedPayment.userName}</p>
                  <p className="text-sm">{selectedPayment.email}</p>
                  {selectedPayment.billingAddress && (
                    <>
                      <p className="text-sm">{selectedPayment.billingAddress.address}</p>
                      <p className="text-sm">
                        {selectedPayment.billingAddress.city}, {selectedPayment.billingAddress.state} {selectedPayment.billingAddress.postalCode}
                      </p>
                      <p className="text-sm">{selectedPayment.billingAddress.country}</p>
                    </>
                  )}
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-medium text-muted-foreground">Payment Info</h4>
                  <p><strong>Date:</strong> {selectedPayment.date}</p>
                  <p><strong>Status:</strong> {paymentStatuses.find(s => s.id === selectedPayment.status)?.label}</p>
                  <p><strong>Method:</strong> {getPaymentMethod(selectedPayment.method).label}</p>
                  {selectedPayment.cardInfo && (
                    <p><strong>Card:</strong> {selectedPayment.cardInfo.type} ending in {selectedPayment.cardInfo.last4}</p>
                  )}
                </div>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div>
                          <p className="font-medium">{selectedPayment.planName} Subscription</p>
                          <p className="text-sm text-muted-foreground">{selectedPayment.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(selectedPayment.amount)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between border-t pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Thank you for your business!</p>
                </div>
                <div className="text-right">
                  <p className="text-sm"><strong>Subtotal:</strong> {formatCurrency(selectedPayment.amount)}</p>
                  <p className="text-sm"><strong>Tax:</strong> {formatCurrency(0)}</p>
                  <p className="font-bold"><strong>Total:</strong> {formatCurrency(selectedPayment.amount)}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success("Receipt printed successfully");
                  }}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success("Receipt downloaded as PDF");
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setIsViewReceiptOpen(false);
                    setIsResendReceiptOpen(true);
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Resend Receipt Dialog */}
      <Dialog open={isResendReceiptOpen} onOpenChange={setIsResendReceiptOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Resend Receipt</DialogTitle>
            <DialogDescription>
              Resend the receipt to the customer's email address.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="py-4">
              <p>Resend receipt for transaction <strong>{selectedPayment.invoiceNumber}</strong> to:</p>
              <p className="font-medium mt-2">{selectedPayment.email}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsResendReceiptOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              onClick={handleResendReceipt}
            >
              Send Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Refund Dialog */}
      <Dialog open={isRefundOpen} onOpenChange={setIsRefundOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>
              Process a refund for this transaction.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="py-4 space-y-4">
              <div>
                <p>Process refund for:</p>
                <p className="font-medium">{selectedPayment.userName}</p>
                <p className="text-sm">{selectedPayment.email}</p>
              </div>
              
              <div>
                <p><strong>Transaction:</strong> {selectedPayment.invoiceNumber}</p>
                <p><strong>Date:</strong> {selectedPayment.date}</p>
                <p><strong>Amount:</strong> {formatCurrency(selectedPayment.amount)}</p>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-red-600">
                  <AlertTriangle className="inline-block h-4 w-4 mr-1" />
                  This action cannot be undone. The customer will be refunded the full amount.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRefundOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRefund}
            >
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsPage;
