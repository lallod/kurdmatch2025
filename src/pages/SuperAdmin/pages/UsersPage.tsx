
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
import { Search, Filter, Edit, Trash2, Eye, Download, UserPlus, MoreHorizontal, Ban } from 'lucide-react';
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
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  location: string;
  joinDate: string;
  lastActive: string;
  photoCount: number;
  messageCount: number;
}

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailMode, setUserDetailMode] = useState<'view' | 'edit'>('view');
  
  // Mock user data - in a real app, this would come from an API
  const mockUsers: User[] = [
    {
      id: '001',
      name: 'Emma Johnson',
      email: 'emma.johnson@example.com',
      role: 'user',
      status: 'active',
      location: 'New York, USA',
      joinDate: '2023-01-15',
      lastActive: '2023-05-18 09:32',
      photoCount: 12,
      messageCount: 68
    },
    {
      id: '002',
      name: 'James Smith',
      email: 'james.smith@example.com',
      role: 'premium',
      status: 'active',
      location: 'London, UK',
      joinDate: '2022-11-23',
      lastActive: '2023-05-17 15:47',
      photoCount: 24,
      messageCount: 129
    },
    {
      id: '003',
      name: 'Sophia Martinez',
      email: 'sophia.martinez@example.com',
      role: 'moderator',
      status: 'active',
      location: 'Barcelona, Spain',
      joinDate: '2022-08-05',
      lastActive: '2023-05-18 11:20',
      photoCount: 8,
      messageCount: 215
    },
    {
      id: '004',
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      role: 'user',
      status: 'inactive',
      location: 'Sydney, Australia',
      joinDate: '2023-02-28',
      lastActive: '2023-04-30 16:05',
      photoCount: 5,
      messageCount: 27
    },
    {
      id: '005',
      name: 'Olivia Brown',
      email: 'olivia.brown@example.com',
      role: 'premium',
      status: 'suspended',
      location: 'Toronto, Canada',
      joinDate: '2022-07-14',
      lastActive: '2023-05-10 08:15',
      photoCount: 18,
      messageCount: 93
    },
    {
      id: '006',
      name: 'Daniel Lee',
      email: 'daniel.lee@example.com',
      role: 'admin',
      status: 'active',
      location: 'Seoul, South Korea',
      joinDate: '2022-05-30',
      lastActive: '2023-05-18 10:45',
      photoCount: 15,
      messageCount: 187
    },
    {
      id: '007',
      name: 'Charlotte Garcia',
      email: 'charlotte.garcia@example.com',
      role: 'user',
      status: 'active',
      location: 'Paris, France',
      joinDate: '2023-03-12',
      lastActive: '2023-05-17 22:30',
      photoCount: 7,
      messageCount: 45
    }
  ];

  const filteredUsers = mockUsers.filter(user => {
    // Apply search filter
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      user.status === statusFilter;
    
    // Apply role filter
    const matchesRole = 
      roleFilter === 'all' || 
      user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Moderator</Badge>;
      case 'premium':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Premium</Badge>;
      case 'user':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">User</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const viewUser = (user: User) => {
    setSelectedUser(user);
    setUserDetailMode('view');
  };

  const editUser = (user: User) => {
    setSelectedUser(user);
    setUserDetailMode('edit');
  };

  const closeDialog = () => {
    setSelectedUser(null);
  };

  const exportUsers = () => {
    console.log('Exporting users...');
    // In a real app, this would trigger a download of user data
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportUsers} className="gap-2">
            <Download size={16} />
            Export
          </Button>
          <Button className="gap-2">
            <UserPlus size={16} />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.location}</TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => viewUser(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      No users found
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

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {userDetailMode === 'view' ? 'User Details' : 'Edit User'}
            </DialogTitle>
            <DialogDescription>
              {userDetailMode === 'view' 
                ? 'View complete information about this user.' 
                : 'Make changes to the user profile.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <>
              {userDetailMode === 'view' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div className="text-sm font-medium">Name:</div>
                        <div className="col-span-2 text-sm">{selectedUser.name}</div>
                        
                        <div className="text-sm font-medium">Email:</div>
                        <div className="col-span-2 text-sm">{selectedUser.email}</div>
                        
                        <div className="text-sm font-medium">Role:</div>
                        <div className="col-span-2 text-sm">{getRoleBadge(selectedUser.role)}</div>
                        
                        <div className="text-sm font-medium">Status:</div>
                        <div className="col-span-2 text-sm">{getStatusBadge(selectedUser.status)}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location Information</h3>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div className="text-sm font-medium">Location:</div>
                        <div className="col-span-2 text-sm">{selectedUser.location}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Account Information</h3>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div className="text-sm font-medium">Join Date:</div>
                        <div className="col-span-2 text-sm">{selectedUser.joinDate}</div>
                        
                        <div className="text-sm font-medium">Last Active:</div>
                        <div className="col-span-2 text-sm">{selectedUser.lastActive}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Activity Statistics</h3>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div className="text-sm font-medium">Photos:</div>
                        <div className="col-span-2 text-sm">{selectedUser.photoCount}</div>
                        
                        <div className="text-sm font-medium">Messages:</div>
                        <div className="col-span-2 text-sm">{selectedUser.messageCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue={selectedUser.name} />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={selectedUser.email} />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select defaultValue={selectedUser.role}>
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select defaultValue={selectedUser.status}>
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" defaultValue={selectedUser.location} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                {userDetailMode === 'view' ? (
                  <>
                    <Button variant="outline" onClick={closeDialog}>Close</Button>
                    <Button onClick={() => setUserDetailMode('edit')}>Edit User</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setUserDetailMode('view')}>Cancel</Button>
                    <Button>Save Changes</Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
