
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Search, 
  Filter, 
  UserPlus, 
  MoreHorizontal, 
  Mail, 
  Eye, 
  AlertTriangle, 
  Lock, 
  UserX,
  Database,
  Download,
  UserCog,
  Check,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  role: string;
  subscriptionType: 'free' | 'premium' | 'none';
  location: string;
  lastActive: string;
  joinDate: string;
  avatar: string;
}

const UserListPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [users, setUsers] = useState<UserData[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      status: 'active',
      role: 'User',
      subscriptionType: 'premium',
      location: 'New York, USA',
      lastActive: '2023-06-12',
      joinDate: '2022-03-15',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.c@example.com',
      status: 'active',
      role: 'User',
      subscriptionType: 'free',
      location: 'Toronto, Canada',
      lastActive: '2023-06-11',
      joinDate: '2022-05-20',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: 3,
      name: 'Aisha Patel',
      email: 'aisha.p@example.com',
      status: 'inactive',
      role: 'User',
      subscriptionType: 'none',
      location: 'London, UK',
      lastActive: '2023-05-30',
      joinDate: '2022-02-10',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      id: 4,
      name: 'Carlos Rodriguez',
      email: 'carlos.r@example.com',
      status: 'suspended',
      role: 'User',
      subscriptionType: 'free',
      location: 'Madrid, Spain',
      lastActive: '2023-04-15',
      joinDate: '2022-01-05',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    {
      id: 5,
      name: 'Emma Wilson',
      email: 'emma.w@example.com',
      status: 'active',
      role: 'Moderator',
      subscriptionType: 'premium',
      location: 'Sydney, Australia',
      lastActive: '2023-06-12',
      joinDate: '2021-11-20',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: 6,
      name: 'Omar Hassan',
      email: 'omar.h@example.com',
      status: 'banned',
      role: 'User',
      subscriptionType: 'none',
      location: 'Cairo, Egypt',
      lastActive: '2023-02-10',
      joinDate: '2022-04-18',
      avatar: 'https://i.pravatar.cc/150?img=6',
    },
    {
      id: 7,
      name: 'Sofia Bergman',
      email: 'sofia.b@example.com',
      status: 'active',
      role: 'User',
      subscriptionType: 'premium',
      location: 'Stockholm, Sweden',
      lastActive: '2023-06-10',
      joinDate: '2022-06-01',
      avatar: 'https://i.pravatar.cc/150?img=7',
    },
  ]);

  const handleStatusChange = (userId: number, newStatus: 'active' | 'inactive' | 'suspended' | 'banned') => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    
    toast({
      title: "Status Updated",
      description: `User status has been updated to ${newStatus}.`,
    });
  };
  
  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No Users Selected",
        description: "Please select users to perform this action.",
        variant: "destructive",
      });
      return;
    }
    
    let updatedUsers = [...users];
    
    if (action === 'activate') {
      updatedUsers = users.map(user => 
        selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user
      );
    } else if (action === 'suspend') {
      updatedUsers = users.map(user => 
        selectedUsers.includes(user.id) ? { ...user, status: 'suspended' } : user
      );
    } else if (action === 'delete') {
      updatedUsers = users.filter(user => !selectedUsers.includes(user.id));
    }
    
    setUsers(updatedUsers);
    setSelectedUsers([]);
    
    toast({
      title: "Bulk Action Completed",
      description: `Action "${action}" applied to ${selectedUsers.length} users.`,
    });
  };
  
  const handleSelectUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };
  
  const filteredUsers = users.filter(user => {
    // Filter by search query
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'active' && user.status === 'active') ||
      (activeTab === 'inactive' && user.status === 'inactive') ||
      (activeTab === 'suspended' && user.status === 'suspended') ||
      (activeTab === 'banned' && user.status === 'banned') ||
      (activeTab === 'premium' && user.subscriptionType === 'premium');
    
    return matchesSearch && matchesTab;
  });
  
  const statusBadgeStyles = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-yellow-100 text-yellow-800',
    banned: 'bg-red-100 text-red-800',
  };
  
  const subscriptionBadgeStyles = {
    free: 'bg-blue-100 text-blue-800',
    premium: 'bg-purple-100 text-purple-800',
    none: 'bg-gray-100 text-gray-800',
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">User Management</h1>
          <p className="text-gray-500">View and manage all registered users</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleBulkAction('export')}>
            <Download size={16} className="mr-2" /> Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-tinder-rose hover:bg-tinder-rose/90">
                <UserPlus size={16} className="mr-2" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account.</DialogDescription>
              </DialogHeader>
              {/* Add user form would go here */}
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first-name" className="text-sm font-medium">First Name</label>
                    <Input id="first-name" placeholder="Enter first name" />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="text-sm font-medium">Last Name</label>
                    <Input id="last-name" placeholder="Enter last name" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div>
                  <label htmlFor="role" className="text-sm font-medium">Role</label>
                  <Select defaultValue="user">
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Create User</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search users by name or email" 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-fit">
              <div className="flex items-center">
                <Filter size={16} className="mr-2" />
                Filter
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active Users</SelectItem>
              <SelectItem value="inactive">Inactive Users</SelectItem>
              <SelectItem value="premium">Premium Users</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Bulk Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                <Check size={16} className="mr-2 text-green-500" />
                Activate Selected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('suspend')}>
                <AlertTriangle size={16} className="mr-2 text-yellow-500" />
                Suspend Selected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction('delete')}>
                <X size={16} className="mr-2 text-red-500" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="suspended">Suspended</TabsTrigger>
          <TabsTrigger value="banned">Banned</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Users Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium flex items-center">
            <User size={18} className="mr-2" /> Users
            <Badge variant="outline" className="ml-2">{filteredUsers.length} users</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                    />
                  </div>
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No users found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <input 
                        type="checkbox" 
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusBadgeStyles[user.status]}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={subscriptionBadgeStyles[user.subscriptionType]}>
                        {user.subscriptionType}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.location}</TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye size={16} className="mr-2" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail size={16} className="mr-2" /> Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserCog size={16} className="mr-2" /> Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Database size={16} className="mr-2" /> User Data
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(user.id, 'active')}
                            disabled={user.status === 'active'}
                          >
                            <Check size={16} className="mr-2 text-green-500" /> Activate
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(user.id, 'suspended')}
                            disabled={user.status === 'suspended'}
                          >
                            <AlertTriangle size={16} className="mr-2 text-yellow-500" /> Suspend
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(user.id, 'banned')}
                            disabled={user.status === 'banned'}
                          >
                            <Lock size={16} className="mr-2 text-red-500" /> Ban User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserListPage;
