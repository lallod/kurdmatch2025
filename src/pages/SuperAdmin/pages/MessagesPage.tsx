
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
import { Search, Filter, MessageSquare, Eye, Trash2 } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from '@/components/ui/pagination';

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
      content: 'I'm planning to visit your city next...',
      date: '2023-05-11 16:05',
      isRead: false
    }
  ];

  const filteredMessages = mockMessages.filter(message =>
    message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
      </div>

      <Card className="p-4">
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
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            Filters
          </Button>
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
              {filteredMessages.map((message) => (
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
                      <Button variant="ghost" size="icon">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
