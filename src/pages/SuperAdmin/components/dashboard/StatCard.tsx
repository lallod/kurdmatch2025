
import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend?: 'positive' | 'negative' | 'neutral';
}

const StatCard = ({ title, value, change, icon, trend = 'neutral' }: StatCardProps) => {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <div className="p-2 bg-gray-100 rounded-full">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          {trend === 'positive' && (
            <ArrowUpIcon className="w-4 h-4 mr-1 text-green-500" />
          )}
          {trend === 'negative' && (
            <ArrowDownIcon className="w-4 h-4 mr-1 text-red-500" />
          )}
          <Badge variant={trend === 'positive' ? 'default' : trend === 'negative' ? 'destructive' : 'secondary'} className="font-normal">
            {change}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
