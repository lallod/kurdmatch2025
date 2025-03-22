
import React from 'react';
import {
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Calendar, 
  Eye, 
  Mail, 
  Wallet, 
  ArrowUpDown 
} from 'lucide-react';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { PaymentMethodDisplay } from './PaymentMethodDisplay';
import { Payment } from '../types/payment';

interface PaymentsTableProps {
  payments: Payment[];
  sortBy: string;
  sortOrder: string;
  formatCurrency: (amount: number) => string;
  handleSort: (column: string) => void;
  onViewReceipt: (payment: Payment) => void;
  onResendReceipt: (payment: Payment) => void;
  onProcessRefund: (payment: Payment) => void;
}

export const PaymentsTable = ({
  payments,
  sortBy,
  sortOrder,
  formatCurrency,
  handleSort,
  onViewReceipt,
  onResendReceipt,
  onProcessRefund
}: PaymentsTableProps) => {
  return (
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
          {payments.length > 0 ? (
            payments.map((payment) => (
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
                  <PaymentMethodDisplay methodId={payment.method} />
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={payment.status} />
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
                        onClick={() => onViewReceipt(payment)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Receipt
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onResendReceipt(payment)}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Resend Receipt
                      </DropdownMenuItem>
                      {payment.status === 'completed' && (
                        <DropdownMenuItem
                          onClick={() => onProcessRefund(payment)}
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
  );
};
