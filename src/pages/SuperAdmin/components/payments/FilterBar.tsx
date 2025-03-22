
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Search, 
  Filter, 
  ChevronsUpDown 
} from 'lucide-react';
import { paymentStatuses } from './PaymentStatusBadge';
import { paymentMethods } from './PaymentMethodDisplay';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  methodFilter: string;
  setMethodFilter: (method: string) => void;
  dateFilter: string;
  setDateFilter: (date: string) => void;
  resetFilters: () => void;
}

export const FilterBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
  dateFilter,
  setDateFilter,
  resetFilters
}: FilterBarProps) => {
  return (
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
        <Button variant="outline" size="icon" onClick={resetFilters}>
          <Filter size={16} />
        </Button>
      </div>
    </div>
  );
};
