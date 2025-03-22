
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  Wallet 
} from 'lucide-react';

export const PaymentSettingsTab = () => {
  return (
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
  );
};
