
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Payment } from '../types/payment';

interface StatCardsProps {
  calculateTotalRevenue: () => number;
  formatCurrency: (amount: number) => string;
}

export const StatCards = ({ calculateTotalRevenue, formatCurrency }: StatCardsProps) => {
  return (
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
  );
};
