
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
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Mail, 
  Eye, 
  Edit, 
  Trash2, 
  CreditCard,
  Zap,
  CalendarClock,
  ArrowUpDown,
  Wallet,
  Brain
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Define subscriber plan types
const plans = [
  { id: 'free', name: 'Free', price: 0 },
  { id: 'basic', name: 'Basic', price: 9.99 },
  { id: 'premium', name: 'Premium', price: 19.99 },
  { id: 'ultimate', name: 'Ultimate', price: 29.99 },
];

// Define subscriber status types
const statuses = [
  { id: 'active', label: 'Active', color: 'green' },
  { id: 'trial', label: 'Trial', color: 'blue' },
  { id: 'expired', label: 'Expired', color: 'amber' },
  { id: 'cancelled', label: 'Cancelled', color: 'red' },
  { id: 'pending', label: 'Pending', color: 'gray' },
];

// Define payment methods
const paymentMethods = [
  { id: 'credit_card', label: 'Credit Card' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'bank_transfer', label: 'Bank Transfer' },
  { id: 'apple_pay', label: 'Apple Pay' },
  { id: 'google_pay', label: 'Google Pay' },
];

// Interface for subscriber
interface Subscriber {
  id: string;
  userId: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  subscriptionDate: string;
  renewalDate: string;
  paymentMethod: string;
  amount: number;
  autoRenew: boolean;
}

// Mock data for subscribers
const initialSubscribers: Subscriber[] = [
  { 
    id: 'sub-1', 
    userId: 'user-123', 
    name: 'John Smith', 
    email: 'john.smith@example.com', 
    plan: 'premium', 
    status: 'active', 
    subscriptionDate: '2023-01-15', 
    renewalDate: '2024-01-15', 
    paymentMethod: 'credit_card',
    amount: 19.99,
    autoRenew: true
  },
  { 
    id: 'sub-2', 
    userId: 'user-234', 
    name: 'Emily Johnson', 
    email: 'emily.johnson@example.com', 
    plan: 'basic', 
    status: 'trial', 
    subscriptionDate: '2023-05-20', 
    renewalDate: '2023-06-20', 
    paymentMethod: 'paypal',
    amount: 9.99,
    autoRenew: true
  },
  { 
    id: 'sub-3', 
    userId: 'user-345', 
    name: 'Michael Brown', 
    email: 'michael.brown@example.com', 
    plan: 'ultimate', 
    status: 'active', 
    subscriptionDate: '2022-11-05', 
    renewalDate: '2023-11-05', 
    paymentMethod: 'apple_pay',
    amount: 29.99,
    autoRenew: true
  },
  { 
    id: 'sub-4', 
    userId: 'user-456', 
    name: 'Sarah Davis', 
    email: 'sarah.davis@example.com', 
    plan: 'premium', 
    status: 'cancelled', 
    subscriptionDate: '2022-08-12', 
    renewalDate: '2023-08-12', 
    paymentMethod: 'credit_card',
    amount: 19.99,
    autoRenew: false
  },
  { 
    id: 'sub-5', 
    userId: 'user-567', 
    name: 'David Wilson', 
    email: 'david.wilson@example.com', 
    plan: 'basic', 
    status: 'expired', 
    subscriptionDate: '2022-06-30', 
    renewalDate: '2023-06-30', 
    paymentMethod: 'bank_transfer',
    amount: 9.99,
    autoRenew: false
  },
];

// Schema for subscriber form
const subscriberFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  plan: z.string().min(1, { message: "Plan is required" }),
  paymentMethod: z.string().min(1, { message: "Payment method is required" }),
  autoRenew: z.boolean().default(true),
});

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Dialog states
  const [isAddSubscriberOpen, setIsAddSubscriberOpen] = useState(false);
  const [isEditSubscriberOpen, setIsEditSubscriberOpen] = useState(false);
  const [isDeleteSubscriberOpen, setIsDeleteSubscriberOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);

  // Subscriber form
  const subscriberForm = useForm<z.infer<typeof subscriberFormSchema>>({
    resolver: zodResolver(subscriberFormSchema),
    defaultValues: {
      name: "",
      email: "",
      plan: "",
      paymentMethod: "",
      autoRenew: true,
    },
  });

  // Filter subscribers based on search term, status, and plan
  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = 
      subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      subscriber.status === statusFilter;
    
    const matchesPlan = 
      planFilter === 'all' || 
      subscriber.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Sort subscribers
  const sortedSubscribers = [...filteredSubscribers].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'email':
        comparison = a.email.localeCompare(b.email);
        break;
      case 'plan':
        comparison = a.plan.localeCompare(b.plan);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'subscriptionDate':
        comparison = new Date(a.subscriptionDate).getTime() - new Date(b.subscriptionDate).getTime();
        break;
      case 'renewalDate':
        comparison = new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime();
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Add new subscriber
  const handleAddSubscriber = (data: z.infer<typeof subscriberFormSchema>) => {
    const selectedPlan = plans.find(p => p.id === data.plan);
    const planPrice = selectedPlan ? selectedPlan.price : 0;
    
    const newSubscriber: Subscriber = {
      id: `sub-${Date.now()}`,
      userId: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      plan: data.plan,
      status: 'active',
      subscriptionDate: new Date().toISOString().split('T')[0],
      renewalDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      paymentMethod: data.paymentMethod,
      amount: planPrice,
      autoRenew: data.autoRenew,
    };
    
    setSubscribers([...subscribers, newSubscriber]);
    setIsAddSubscriberOpen(false);
    subscriberForm.reset();
    toast.success("Subscriber added successfully");
  };

  // Edit subscriber
  const handleEditSubscriber = (data: z.infer<typeof subscriberFormSchema>) => {
    if (!selectedSubscriber) return;
    
    const selectedPlan = plans.find(p => p.id === data.plan);
    const planPrice = selectedPlan ? selectedPlan.price : selectedSubscriber.amount;
    
    const updatedSubscribers = subscribers.map(sub => 
      sub.id === selectedSubscriber.id 
        ? { 
            ...sub, 
            name: data.name, 
            email: data.email, 
            plan: data.plan,
            paymentMethod: data.paymentMethod,
            amount: planPrice,
            autoRenew: data.autoRenew,
          } 
        : sub
    );
    
    setSubscribers(updatedSubscribers);
    setIsEditSubscriberOpen(false);
    setSelectedSubscriber(null);
    toast.success("Subscriber updated successfully");
  };

  // Delete subscriber
  const handleDeleteSubscriber = () => {
    if (!selectedSubscriber) return;
    
    const updatedSubscribers = subscribers.filter(sub => sub.id !== selectedSubscriber.id);
    
    setSubscribers(updatedSubscribers);
    setIsDeleteSubscriberOpen(false);
    setSelectedSubscriber(null);
    toast.success("Subscriber deleted successfully");
  };

  // Open edit subscriber dialog
  const openEditSubscriberDialog = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    subscriberForm.reset({
      name: subscriber.name,
      email: subscriber.email,
      plan: subscriber.plan,
      paymentMethod: subscriber.paymentMethod,
      autoRenew: subscriber.autoRenew,
    });
    setIsEditSubscriberOpen(true);
  };

  // Get plan name
  const getPlanName = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    return plan ? plan.name : planId;
  };

  // Get payment method name
  const getPaymentMethodName = (methodId: string) => {
    const method = paymentMethods.find(m => m.id === methodId);
    return method ? method.label : methodId;
  };

  // Status badge component
  const getStatusBadge = (status: string) => {
    const statusConfig = statuses.find(s => s.id === status);
    
    if (!statusConfig) return <Badge>{status}</Badge>;
    
    let className = '';
    
    switch (statusConfig.color) {
      case 'green':
        className = 'bg-green-100 text-green-800 hover:bg-green-100';
        break;
      case 'blue':
        className = 'bg-blue-100 text-blue-800 hover:bg-blue-100';
        break;
      case 'amber':
        className = 'bg-amber-100 text-amber-800 hover:bg-amber-100';
        break;
      case 'red':
        className = 'bg-red-100 text-red-800 hover:bg-red-100';
        break;
      default:
        className = 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
    
    return <Badge variant="outline" className={className}>{statusConfig.label}</Badge>;
  };

  // Format price to currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subscriber Management</h1>
          <p className="text-muted-foreground">Manage user subscriptions and billing information</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => {
              // Export subscriber data
              toast.success("Subscriber data exported successfully");
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => {
              // Send email to subscribers
              toast.success("Email dialog would open here");
            }}
          >
            <Mail className="mr-2 h-4 w-4" />
            Email Subscribers
          </Button>
          <Button onClick={() => setIsAddSubscriberOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subscriber
          </Button>
        </div>
      </div>

      {/* AI banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">AI-Powered Retention</h3>
          <p className="text-sm text-gray-600">Our AI system identifies at-risk subscribers and recommends targeted retention actions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscriber Management</CardTitle>
          <CardDescription>View and manage all subscribers in your system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status.id} value={status.id}>{status.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  {plans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter size={16} />
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Name
                      {sortBy === 'name' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                    <div className="flex items-center">
                      Email
                      {sortBy === 'email' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('plan')}>
                    <div className="flex items-center">
                      Plan
                      {sortBy === 'plan' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      Status
                      {sortBy === 'status' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('subscriptionDate')}>
                    <div className="flex items-center">
                      Subscribed
                      {sortBy === 'subscriptionDate' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('renewalDate')}>
                    <div className="flex items-center">
                      Renewal
                      {sortBy === 'renewalDate' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSubscribers.length > 0 ? (
                  sortedSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>
                        <div className="font-medium">{subscriber.name}</div>
                      </TableCell>
                      <TableCell>{subscriber.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Zap className="mr-2 h-4 w-4 text-amber-500" />
                          {getPlanName(subscriber.plan)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(subscriber.status)}</TableCell>
                      <TableCell>{subscriber.subscriptionDate}</TableCell>
                      <TableCell>{subscriber.renewalDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
                          {getPaymentMethodName(subscriber.paymentMethod)}
                        </div>
                      </TableCell>
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
                                setSelectedSubscriber(subscriber);
                                setIsViewDetailsOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditSubscriberDialog(subscriber)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedSubscriber(subscriber);
                                setIsDeleteSubscriberOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      No subscribers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Subscriber Dialog */}
      <Dialog open={isAddSubscriberOpen} onOpenChange={setIsAddSubscriberOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Subscriber</DialogTitle>
            <DialogDescription>
              Add a new subscriber to your system
            </DialogDescription>
          </DialogHeader>
          <Form {...subscriberForm}>
            <form onSubmit={subscriberForm.handleSubmit(handleAddSubscriber)} className="space-y-4">
              <FormField
                control={subscriberForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={subscriberForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter email" type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={subscriberForm.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription Plan</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {plans.map(plan => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name} - {formatCurrency(plan.price)}/month
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={subscriberForm.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map(method => (
                            <SelectItem key={method.id} value={method.id}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={subscriberForm.control}
                name="autoRenew"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Auto-Renewal</FormLabel>
                      <FormDescription>
                        Automatically renew subscription
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add Subscriber</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Subscriber Dialog */}
      <Dialog open={isEditSubscriberOpen} onOpenChange={setIsEditSubscriberOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Subscriber</DialogTitle>
            <DialogDescription>
              Make changes to the subscriber details
            </DialogDescription>
          </DialogHeader>
          <Form {...subscriberForm}>
            <form onSubmit={subscriberForm.handleSubmit(handleEditSubscriber)} className="space-y-4">
              <FormField
                control={subscriberForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={subscriberForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter email" type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={subscriberForm.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription Plan</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {plans.map(plan => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name} - {formatCurrency(plan.price)}/month
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={subscriberForm.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map(method => (
                            <SelectItem key={method.id} value={method.id}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={subscriberForm.control}
                name="autoRenew"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Auto-Renewal</FormLabel>
                      <FormDescription>
                        Automatically renew subscription
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Subscriber</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Subscriber Dialog */}
      <Dialog open={isDeleteSubscriberOpen} onOpenChange={setIsDeleteSubscriberOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Subscriber</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this subscriber? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedSubscriber && (
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedSubscriber.name}</p>
                <p><strong>Email:</strong> {selectedSubscriber.email}</p>
                <p><strong>Plan:</strong> {getPlanName(selectedSubscriber.plan)}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteSubscriberOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteSubscriber}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Subscriber Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Subscriber Details</DialogTitle>
            <DialogDescription>
              View detailed information about this subscriber
            </DialogDescription>
          </DialogHeader>
          {selectedSubscriber && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
                  <div className="mt-2 space-y-2">
                    <p><strong>Name:</strong> {selectedSubscriber.name}</p>
                    <p><strong>Email:</strong> {selectedSubscriber.email}</p>
                    <p><strong>User ID:</strong> {selectedSubscriber.userId}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Subscription Details</h3>
                  <div className="mt-2 space-y-2">
                    <p><strong>Plan:</strong> {getPlanName(selectedSubscriber.plan)}</p>
                    <p><strong>Status:</strong> {getStatusBadge(selectedSubscriber.status)}</p>
                    <p><strong>Amount:</strong> {formatCurrency(selectedSubscriber.amount)}/month</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Dates</h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <CalendarClock className="h-5 w-5 mr-2 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Subscription Date</p>
                      <p className="font-medium">{selectedSubscriber.subscriptionDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CalendarClock className="h-5 w-5 mr-2 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Renewal Date</p>
                      <p className="font-medium">{selectedSubscriber.renewalDate}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Payment Information</h3>
                <div className="mt-2 space-y-2">
                  <p><strong>Payment Method:</strong> {getPaymentMethodName(selectedSubscriber.paymentMethod)}</p>
                  <p><strong>Auto-Renewal:</strong> {selectedSubscriber.autoRenew ? "Enabled" : "Disabled"}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    onClick={() => {
                      setIsViewDetailsOpen(false);
                      openEditSubscriberDialog(selectedSubscriber);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="default"
                    className="flex items-center"
                    onClick={() => {
                      toast.success("Payment history would open here");
                    }}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    View Payment History
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscribersPage;
