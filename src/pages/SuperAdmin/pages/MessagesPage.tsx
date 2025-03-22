
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
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, MessageSquare, Eye, Trash2, Download, Calendar } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Mock message data - in a real app, this would come from an API
  const mockMessages: Message[] = [
    {
      id: '1',
      sender: 'Sarah Johnson',
      recipient: 'Michael Smith',
      content: 'Hey, I saw your profile and thought we might have a lot in common. Would you like to chat sometime?',
      date: '2023-05-15 14:30',
      isRead: true
    },
    {
      id: '2',
      sender: 'David Wilson',
      recipient: 'Emily Brown',
      content: 'Thanks for your message! I would love to meet up for coffee sometime next week if you are free.',
      date: '2023-05-14 09:15',
      isRead: true
    },
    {
      id: '3',
      sender: 'Lisa Anderson',
      recipient: 'Sarah Johnson',
      content: 'I would love to chat more about your travel experiences. I see you visited Japan last year!',
      date: '2023-05-13 18:45',
      isRead: false
    },
    {
      id: '4',
      sender: 'Michael Smith',
      recipient: 'David Wilson',
      content: 'Do you have any recommendations for hiking trails in the area? Looking to go this weekend.',
      date: '2023-05-12 11:20',
      isRead: true
    },
    {
      id: '5',
      sender: 'Emily Brown',
      recipient: 'Lisa Anderson',
      content: "I'm planning to visit your city next month. Any must-see places you would recommend?",
      date: '2023-05-11 16:05',
      isRead: false
    }
  ];

  const filteredMessages = mockMessages.filter(message => {
    // Apply search filter
    const matchesSearch = 
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply read/unread filter
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'read' && message.isRead) || 
      (filterStatus === 'unread' && !message.isRead);
    
    return matchesSearch && matchesStatus;
  });

  const viewMessage = (message: Message) => {
    setSelectedMessage(message);
  };

  const closeDialog = () => {
    setSelectedMessage(null);
  };

  const exportMessages = () => {
    console.log('Exporting messages...');
    // In a real app, this would trigger a download of message data
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <Button onClick={exportMessages} className="gap-2">
          <Download size={16} />
          Export Messages
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
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
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Calendar size={16} />
                Date Range
              </Button>
            </div>
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
                          <Button variant="ghost" size="icon" onClick={() => viewMessage(message)}>
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No messages found
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
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>View the complete message</DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-semibold">From:</div>
                  <div className="col-span-3">{selectedMessage.sender}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-semibold">To:</div>
                  <div className="col-span-3">{selectedMessage.recipient}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-semibold">Date:</div>
                  <div className="col-span-3">{selectedMessage.date}</div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-semibold">Message:</div>
                  <div className="col-span-3 whitespace-pre-wrap">{selectedMessage.content}</div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagesPage;
