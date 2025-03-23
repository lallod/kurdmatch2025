
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AIBanner } from '../components/payments/AIBanner';
import PageHeader from '../components/users/PageHeader';
import UserFilters from '../components/users/UserFilters';
import UsersTable from '../components/users/UsersTable';
import TablePagination from '../components/users/TablePagination';
import UserDetailDialog from '../components/users/UserDetailDialog';
import AddUserDialog from '../components/users/AddUserDialog';
import { User } from '../components/users/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Brain, Users } from 'lucide-react';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailMode, setUserDetailMode] = useState<'view' | 'edit'>('view');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [databaseVerified, setDatabaseVerified] = useState(false);
  const usersPerPage = 10;
  const { toast } = useToast();
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Count total users for pagination
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      if (countError) throw countError;
      setTotalUsers(count || 0);
      setDatabaseVerified(true);
      
      // Fetch profiles with pagination
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .range((currentPage - 1) * usersPerPage, currentPage * usersPerPage - 1);
      
      if (profilesError) throw profilesError;
      
      if (!profiles || profiles.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Fetch roles for the profiles
      const profileIds = profiles.map(profile => profile.id);
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .in('user_id', profileIds);
        
      if (rolesError) throw rolesError;
      
      console.log('Fetched profiles:', profiles);
      console.log('Fetched roles:', userRoles);
      
      // Transform profile data to match User interface
      const userData: User[] = profiles.map(profile => {
        // Find role for this profile
        const userRole = userRoles?.find(role => role.user_id === profile.id);
        
        // Calculate active status based on last_active (active if within 7 days)
        const isActive = profile.last_active && 
          (new Date(profile.last_active).getTime() > Date.now() - 86400000 * 7);
        
        // Generate an email based on the user's name since email isn't stored in the profiles table
        const emailAddress = profile.name ? 
          `${profile.name.toLowerCase().replace(/\s+/g, '.')}@example.com` : 
          `user.${profile.id.substring(0, 8)}@example.com`;
        
        return {
          id: profile.id,
          name: profile.name || 'Unknown User',
          email: emailAddress, // Using generated email based on the name
          role: userRole?.role || 'user',
          status: profile.verified ? (isActive ? 'active' : 'inactive') : 'pending',
          location: profile.location || 'Unknown',
          joinDate: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : 'Unknown',
          lastActive: profile.last_active 
            ? new Date(profile.last_active).toLocaleString('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) 
            : 'Unknown',
          photoCount: 0, // Will be updated in a real app
          messageCount: 0 // Will be updated in a real app
        };
      });
      
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error loading users',
        description: 'Could not load user data. Please try again.',
        variant: 'destructive',
      });
      // Set empty array to avoid undefined error
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, [currentPage]); // Ensure we refetch when page changes
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      user.status === statusFilter;
    
    const matchesRole = 
      roleFilter === 'all' || 
      user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddUser = () => {
    setAddUserDialogOpen(true);
  };

  const handleUserAdded = () => {
    console.log('User added, refreshing...');
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <PageHeader onExport={exportUsers} onAddUser={handleAddUser} />

      <AIBanner type="user" collapsible={true} />
      
      {/* AI-powered User Statistics Banner */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full flex items-center justify-center bg-tinder-rose/10">
            <Users size={24} className="text-tinder-rose" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Database User Verification</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">
                {databaseVerified ? 
                  `Verified ${totalUsers} total registered users in database` : 
                  'Verifying users in database...'}
              </p>
              {!databaseVerified && (
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-tinder-rose animate-spin"></div>
              )}
            </div>
          </div>
          <div className="ml-auto flex gap-4">
            <div className="text-center px-4 py-2 bg-white/50 rounded-md border border-gray-200">
              <p className="text-xs text-gray-500">Active Users</p>
              <p className="text-lg font-semibold text-tinder-rose">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
            <div className="text-center px-4 py-2 bg-white/50 rounded-md border border-gray-200">
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-lg font-semibold text-amber-500">
                {users.filter(u => u.status === 'pending').length}
              </p>
            </div>
            <div className="text-center px-4 py-2 bg-white/50 rounded-md border border-gray-200">
              <p className="text-xs text-gray-500">Inactive</p>
              <p className="text-lg font-semibold text-gray-500">
                {users.filter(u => u.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <UserFilters 
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            roleFilter={roleFilter}
            onSearchChange={setSearchTerm}
            onStatusChange={setStatusFilter}
            onRoleChange={setRoleFilter}
          />

          <UsersTable 
            users={filteredUsers}
            onViewUser={viewUser}
            onEditUser={editUser}
            loading={loading}
          />

          <TablePagination 
            currentPage={currentPage}
            totalPages={Math.ceil(totalUsers / usersPerPage)}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>

      <UserDetailDialog 
        user={selectedUser}
        mode={userDetailMode}
        open={!!selectedUser}
        onClose={closeDialog}
        onModeChange={setUserDetailMode}
      />

      <AddUserDialog
        open={addUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default UsersPage;
