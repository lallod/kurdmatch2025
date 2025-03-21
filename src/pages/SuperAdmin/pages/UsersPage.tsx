
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
import { Search, UserPlus, Edit, Trash2, User, Filter } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from '@/components/ui/pagination';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  region: string;
  registrationDate: string;
  lastActive: string;
}

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock user data - in a real app, this would come from an API
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      status: 'active',
      region: 'South-Kurdistan',
      registrationDate: '2023-01-15',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Michael Smith',
      email: 'michael@example.com',
      status: 'active',
      region: 'North-Kurdistan',
      registrationDate: '2023-02-21',
      lastActive: '5 days ago'
    },
    {
      id: '3',
      name: 'Emily Brown',
      email: 'emily@example.com',
      status: 'inactive',
      region: 'East-Kurdistan',
      registrationDate: '2023-03-18',
      lastActive: '1 month ago'
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david@example.com',
      status: 'suspended',
      region: 'West-Kurdistan',
      registrationDate: '2023-01-09',
      lastActive: '2 months ago'
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      status: 'active',
      region: 'South-Kurdistan',
      registrationDate: '2023-04-12',
      lastActive: '1 day ago'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        <Button className="gap-2">
          <UserPlus size={16} />
          Add New User
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by name, email, or region..."
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={16} className="text-gray-600" />
                      </div>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{user.region}</TableCell>
                  <TableCell>{user.registrationDate}</TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit size={16} />
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

export default UsersPage;
