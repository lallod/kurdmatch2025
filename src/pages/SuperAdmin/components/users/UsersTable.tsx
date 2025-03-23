import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Ban, Trash2, RefreshCw, Users } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { User } from './types';
import { getStatusBadge, getRoleBadge } from './UserUtils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UsersTableProps {
  users: User[];
  loading?: boolean;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onRefresh: () => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ 
  users, 
  loading = false, 
  onViewUser, 
  onEditUser,
  onRefresh 
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { toast } = useToast();

  const handleDeleteUser = async (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete.id);
      
      if (error) throw error;
      
      toast({
        title: "User Deleted",
        description: `${userToDelete.name} has been permanently removed.`,
      });
      
      onRefresh();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error removing this user.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteAllUsers = () => {
    setIsDeleteAllDialogOpen(true);
  };

  const confirmDeleteAllUsers = async () => {
    setIsDeleting(true);
    try {
      // Delete all profiles except the current user (if you want to keep it)
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      
      const { error } = await supabase
        .from('profiles')
        .delete()
        .neq('id', currentUserId || 'no-id-found');
      
      if (error) throw error;
      
      toast({
        title: "All Users Deleted",
        description: "All users have been permanently removed.",
      });
      
      onRefresh();
    } catch (error) {
      console.error("Error deleting all users:", error);
      toast({
        title: "Delete Failed",
        description: "There was an error removing users.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteAllDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button 
            variant="destructive"
            className="gap-2"
            onClick={handleDeleteAllUsers}
            disabled={true}
          >
            <Users size={16} />
            <Trash2 size={16} />
            Remove All Users
          </Button>
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
              {[1, 2, 3, 4, 5].map((index) => (
                <TableRow key={index}>
                  <TableCell colSpan={8}>
                    <div className="h-10 bg-gray-100 animate-pulse rounded-md w-full"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onRefresh}
        >
          <RefreshCw size={14} />
          Refresh
        </Button>
        
        <Button 
          variant="destructive"
          className="gap-2"
          onClick={handleDeleteAllUsers}
          disabled={users.length === 0}
        >
          <Users size={16} />
          <Trash2 size={16} />
          Remove All Users
        </Button>
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
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id.substring(0, 6)}...</TableCell>
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
                        <DropdownMenuItem onClick={() => onViewUser(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user)}>
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

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                confirmDeleteUser();
              }} 
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete All Users Confirmation Dialog */}
      <AlertDialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Users</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all users? This action cannot be undone and will remove {users.length} users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                confirmDeleteAllUsers();
              }} 
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete All Users"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersTable;
