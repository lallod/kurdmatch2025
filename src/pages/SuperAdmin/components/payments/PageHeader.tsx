
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  DollarSign 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export const PageHeader = () => {
  return (
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
  );
};
