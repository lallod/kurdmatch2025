
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search, Filter, MessageSquare, Eye, Trash2, UserSearch } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  date: string;
  isRead: boolean;
}

const MessagesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Mock message data - in a real app, this would come from an API
  const mockMessages: Message[] = [
    {
      id: '1',
      sender: 'Sarah Johnson',
      recipient: 'Michael Smith',
      content: 'Hey, I saw your profile and thought...',
      date: '2023-05-15 14:30',
      isRead: true
    },
    {
      id: '2',
      sender: 'David Wilson',
      recipient: 'Emily Brown',
      content: 'Thanks for your message! I would...',
      date: '2023-05-14 09:15',
      isRead: true
    },
    {
      id: '3',
      sender: 'Lisa Anderson',
      recipient: 'Sarah Johnson',
      content: 'I would love to chat more about...',
      date: '2023-05-13 18:45',
      isRead: false
    },
    {
      id: '4',
      sender: 'Michael Smith',
      recipient: 'David Wilson',
      content: 'Do you have any recommendations for...',
      date: '2023-05-12 11:20',
      isRead: true
    },
    {
      id: '5',
      sender: 'Emily Brown',
      recipient: 'Lisa Anderson',
      content: "I'm planning to visit your city next...",
      date: '2023-05-11 16:05',
      isRead: false
    }
  ];

  // Apply filters
  let filteredMessages = mockMessages;
  
  // Filter by search term
  if (searchTerm) {
    filteredMessages = filteredMessages.filter(message =>
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Filter by tab
  if (activeTab === "unread") {
    filteredMessages = filteredMessages.filter(message => !message.isRead);
  } else if (activeTab === "read") {
    filteredMessages = filteredMessages.filter(message => message.isRead);
  }
  
  // Filter by date
  if (dateFilter === "today") {
    const today = new Date().toISOString().split('T')[0];
    filteredMessages = filteredMessages.filter(message => 
      message.date.startsWith(today));
  } else if (dateFilter === "week") {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    filteredMessages = filteredMessages.filter(message => 
      new Date(message.date) >= lastWeek);
  }
  
  // Filter by status
  if (statusFilter === "read") {
    filteredMessages = filteredMessages.filter(message => message.isRead);
  } else if (statusFilter === "unread") {
    filteredMessages = filteredMessages.filter(message => !message.isRead);
  }

  const handleViewMessage = (id: string) => {
    console.log(`Viewing message with ID: ${id}`);
    // In a real app, you would open a dialog or navigate to a message detail page
  };

  const handleDeleteMessage = (id: string) => {
    console.log(`Deleting message with ID: ${id}`);
    // In a real app, you would send a delete request to your API
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <div className="text-sm text-gray-500">
          Total: {filteredMessages.length} messages
        </div>
      </div>

      <Card className="p-4">
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Messages</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by sender, recipient or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Messages</DialogTitle>
                <DialogDescription>
                  Set filters to narrow down your message list
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date Range</Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setFilterDialogOpen(false)}>Apply Filters</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">ID</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.id}</TableCell>
                    <TableCell>{message.sender}</TableCell>
                    <TableCell>{message.recipient}</TableCell>
                    <TableCell className="max-w-xs truncate">{message.content}</TableCell>
                    <TableCell>{message.date}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        message.isRead ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {message.isRead ? 'Read' : 'Unread'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewMessage(message.id)}>
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteMessage(message.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No messages found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </div>
  );
};

export default MessagesPage;
