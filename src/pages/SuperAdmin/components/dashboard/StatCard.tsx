
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
    <Card className="transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm border border-gray-100 overflow-hidden neo-card fancy-shine">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100/50">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="p-2 rounded-full bg-gradient-to-br from-tinder-rose/10 to-tinder-orange/10 text-tinder-rose">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold bg-gradient-to-r from-tinder-rose to-tinder-orange bg-clip-text text-transparent">{value}</div>
        <div className="flex items-center mt-1">
          {trend === 'positive' && (
            <ArrowUpIcon className="w-4 h-4 mr-1 text-green-500" />
          )}
          {trend === 'negative' && (
            <ArrowDownIcon className="w-4 h-4 mr-1 text-red-500" />
          )}
          <Badge variant={trend === 'positive' ? 'default' : trend === 'negative' ? 'destructive' : 'secondary'} className={`font-normal ${trend === 'positive' ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' : trend === 'negative' ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20' : ''}`}>
            {change}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
