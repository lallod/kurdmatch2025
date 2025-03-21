
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowRight, 
  Users, 
  DollarSign, 
  CreditCard, 
  Calendar, 
  ChevronDown, 
  CircleUser,
  FileSpreadsheet,
  ExternalLink
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const OverviewDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Revenue and Customers Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Card */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Recurring Revenue
            </CardTitle>
            <div className="flex items-center">
              <span className="text-sm mr-2">Year</span>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold">$94.69</h3>
              <p className="text-sm text-gray-500">All subscribers paid this year</p>
            </div>
            <div className="h-32 mt-4 bg-gradient-to-t from-indigo-600/20 to-indigo-600/5 rounded-md">
              {/* Placeholder for chart */}
            </div>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={18} />
              <CardTitle className="text-sm font-medium">Invoices</CardTitle>
            </div>
            <div className="text-gray-500 text-sm">
              Total Invoices: <span className="font-bold text-black">5,623</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-60 flex items-center justify-center">
              <div className="relative w-48 h-48">
                {/* Circle chart placeholder */}
                <div className="absolute inset-0 rounded-full border-[16px] border-gray-100"></div>
                <div 
                  className="absolute inset-0 rounded-full border-[16px] border-t-indigo-600 border-r-tinder-rose border-b-transparent border-l-transparent"
                  style={{ transform: 'rotate(45deg)' }}
                ></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">$2,024.54</span>
                  <span className="text-sm text-gray-500">Total Amount</span>
                </div>
              </div>
            </div>
            
            {/* Invoice categories */}
            <div className="grid grid-cols-3 gap-4 text-center mt-4">
              <div>
                <div className="font-bold text-lg">1,782</div>
                <div className="text-sm text-gray-500">Paid</div>
                <div className="w-4 h-1 bg-indigo-600 mx-auto mt-1"></div>
              </div>
              <div>
                <div className="font-bold text-lg">3,321</div>
                <div className="text-sm text-gray-500">Past Due</div>
                <div className="w-4 h-1 bg-tinder-rose mx-auto mt-1"></div>
              </div>
              <div>
                <div className="font-bold text-lg">520</div>
                <div className="text-sm text-gray-500">Open Not Due</div>
                <div className="w-4 h-1 bg-gray-200 mx-auto mt-1"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Statistics */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Users size={18} />
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
          </div>
          <div className="flex items-center">
            <span className="text-sm mr-2">Month</span>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full mb-6">
            <div className="h-full w-4/5 bg-indigo-600 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Customer statistics */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-600"></div>
                <span className="text-sm text-gray-500">Current Customers</span>
              </div>
              <h3 className="text-2xl font-bold">32,765</h3>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-600"></div>
                <span className="text-sm text-gray-500">Active Customers</span>
              </div>
              <h3 className="text-2xl font-bold">7,453</h3>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-tinder-rose"></div>
                <span className="text-sm text-gray-500">Cancelled Customers</span>
              </div>
              <h3 className="text-2xl font-bold">234</h3>
            </div>
          </div>
          
          {/* Customer avatars */}
          <div className="mt-8 grid grid-cols-5 sm:grid-cols-10 gap-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <Avatar key={i} className="h-10 w-10">
                <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} />
                <AvatarFallback>{String.fromCharCode(65 + i % 26)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <CreditCard size={18} />
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
            View All <ArrowRight size={16} className="ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>TXN Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { 
                  name: "Peter Pan", 
                  date: "05 Dec 2022", 
                  plan: "Base Plan", 
                  amount: "$99.9", 
                  status: "Succeeded" 
                },
                { 
                  name: "Angus MacGyver", 
                  date: "05 Dec 2022", 
                  plan: "Pro Plan", 
                  amount: "$129.9", 
                  status: "Cancelled" 
                },
                { 
                  name: "Templeton Peck", 
                  date: "05 Dec 2022", 
                  plan: "Perineum Plan", 
                  amount: "$230.0", 
                  status: "Succeeded" 
                },
                { 
                  name: "Mike Torello", 
                  date: "05 Dec 2022", 
                  plan: "Pro Plan", 
                  amount: "$199.9", 
                  status: "Pending" 
                }
              ].map((transaction, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 30}`} />
                        <AvatarFallback>{transaction.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{transaction.name}</div>
                        <div className="text-xs text-gray-500">{transaction.date}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.plan}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === "Succeeded" ? "bg-green-100 text-green-800" : 
                      transaction.status === "Cancelled" ? "bg-red-100 text-red-800" : 
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewDashboard;
