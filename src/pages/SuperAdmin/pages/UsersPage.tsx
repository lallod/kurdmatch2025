
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
import { 
  Search, 
  Filter, 
  Users, 
  Eye, 
  Trash2, 
  Edit, 
  UserPlus,
  Ban,
  Star,
  UserCheck,
  Mail 
} from 'lucide-react';
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
  DialogFooter,
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

interface User {
  id: string;
  name: string;
  email: string;
  registeredDate: string;
  status: 'active' | 'inactive' | 'banned';
  role: 'user' | 'premium' | 'moderator';
  lastActive: string;
  photosCount: number;
}

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  
  // Mock user data - in a real app, this would come from an API
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      registeredDate: '2023-01-15',
      status: 'active',
      role: 'premium',
      lastActive: '2023-05-15 14:30',
      photosCount: 12
    },
    {
      id: '2',
      name: 'David Wilson',
      email: 'david.w@example.com',
      registeredDate: '2023-02-22',
      status: 'active',
      role: 'user',
      lastActive: '2023-05-14 09:15',
      photosCount: 5
    },
    {
      id: '3',
      name: 'Lisa Anderson',
      email: 'lisa.a@example.com',
      registeredDate: '2023-03-10',
      status: 'inactive',
      role: 'user',
      lastActive: '2023-04-30 18:45',
      photosCount: 3
    },
    {
      id: '4',
      name: 'Michael Smith',
      email: 'michael.s@example.com',
      registeredDate: '2023-01-05',
      status: 'banned',
      role: 'user',
      lastActive: '2023-03-12 11:20',
      photosCount: 0
    },
    {
      id: '5',
      name: 'Emily Brown',
      email: 'emily.b@example.com',
      registeredDate: '2023-04-18',
      status: 'active',
      role: 'moderator',
      lastActive: '2023-05-11 16:05',
      photosCount: 8
    }
  ];

  // Apply filters
  let filteredUsers = mockUsers;
  
  // Filter by search term
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Filter by tab
  if (activeTab === "active") {
    filteredUsers = filteredUsers.filter(user => user.status === 'active');
  } else if (activeTab === "inactive") {
    filteredUsers = filteredUsers.filter(user => user.status === 'inactive');
  } else if (activeTab === "banned") {
    filteredUsers = filteredUsers.filter(user => user.status === 'banned');
  }
  
  // Filter by status
  if (statusFilter !== "all") {
    filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
  }
  
  // Filter by role
  if (roleFilter !== "all") {
    filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
  }

  const handleViewUser = (id: string) => {
    console.log(`Viewing user with ID: ${id}`);
    // In a real app, you would navigate to a user detail page
  };

  const handleEditUser = (id: string) => {
    console.log(`Editing user with ID: ${id}`);
    // In a real app, you would open a dialog or navigate to an edit page
  };

  const handleDeleteUser = (id: string) => {
    console.log(`Deleting user with ID: ${id}`);
    // In a real app, you would show a confirmation dialog and send a delete request
  };

  const handleBanUser = (id: string) => {
    console.log(`Banning user with ID: ${id}`);
    // In a real app, you would update the user's status
  };

  const handleUpgradeUser = (id: string) => {
    console.log(`Upgrading user with ID: ${id}`);
    // In a real app, you would change the user's role
  };

  const handleMessageUser = (id: string) => {
    console.log(`Sending message to user with ID: ${id}`);
    // In a real app, you would open a message composer
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="banned">Banned</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
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
                <DialogTitle>Filter Users</DialogTitle>
                <DialogDescription>
                  Set filters to narrow down your user list
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Photos</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.registeredDate}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell>{user.photosCount}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleViewUser(user.id)} title="View User">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditUser(user.id)} title="Edit User">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleBanUser(user.id)} title="Ban User">
                          <Ban size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleUpgradeUser(user.id)} title="Upgrade User">
                          <Star size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleMessageUser(user.id)} title="Message User">
                          <Mail size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    No users found matching your criteria
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

export default UsersPage;
