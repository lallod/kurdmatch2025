
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { FilterBar } from './FilterBar';
import { PaymentsTable } from './PaymentsTable';
import { StatCards } from './StatCards';
import { Payment } from '../types/payment';

interface TransactionsTabProps {
  payments: Payment[];
  filteredPayments: Payment[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  methodFilter: string;
  setMethodFilter: (method: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
  sortBy: string;
  sortOrder: string;
  handleSort: (column: string) => void;
  calculateTotalRevenue: () => number;
  formatCurrency: (amount: number) => string;
  onViewReceipt: (payment: Payment) => void;
  onResendReceipt: (payment: Payment) => void;
  onProcessRefund: (payment: Payment) => void;
  resetFilters: () => void;
}

export const TransactionsTab = ({
  payments,
  filteredPayments,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
  dateFilter,
  setDateFilter,
  sortBy,
  sortOrder,
  handleSort,
  calculateTotalRevenue,
  formatCurrency,
  onViewReceipt,
  onResendReceipt,
  onProcessRefund,
  resetFilters
}: TransactionsTabProps) => {
  return (
    <>
      <StatCards 
        calculateTotalRevenue={calculateTotalRevenue}
        formatCurrency={formatCurrency}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>View and manage all payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            methodFilter={methodFilter}
            setMethodFilter={setMethodFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            resetFilters={resetFilters}
          />
          
          <PaymentsTable
            payments={filteredPayments}
            sortBy={sortBy}
            sortOrder={sortOrder}
            formatCurrency={formatCurrency}
            handleSort={handleSort}
            onViewReceipt={onViewReceipt}
            onResendReceipt={onResendReceipt}
            onProcessRefund={onProcessRefund}
          />
        </CardContent>
      </Card>
    </>
  );
};
