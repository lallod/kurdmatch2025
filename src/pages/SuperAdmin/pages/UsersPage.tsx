
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AIBanner } from '../components/payments/AIBanner';
import PageHeader from '../components/users/PageHeader';
import UserFilters from '../components/users/UserFilters';
import UsersTable from '../components/users/UsersTable';
import TablePagination from '../components/users/TablePagination';
import UserDetailDialog from '../components/users/UserDetailDialog';
import { User } from '../components/users/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailMode, setUserDetailMode] = useState<'view' | 'edit'>('view');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch profiles and join with user_roles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) throw profilesError;
        
        // Fetch roles for the profiles
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('*');
          
        if (rolesError) throw rolesError;
        
        // Fetch photos count for each profile
        const { data: photos, error: photosError } = await supabase
          .from('photos')
          .select('profile_id, count')
          .select('profile_id');
          
        if (photosError) throw photosError;
        
        // Fetch messages count for each profile
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('sender_id, count')
          .select('sender_id');
          
        if (messagesError) throw messagesError;
        
        // Create a map of profile_id to photo count
        const photoCountMap = {};
        photos.forEach(photo => {
          photoCountMap[photo.profile_id] = (photoCountMap[photo.profile_id] || 0) + 1;
        });
        
        // Create a map of profile_id to message count
        const messageCountMap = {};
        messages.forEach(message => {
          messageCountMap[message.sender_id] = (messageCountMap[message.sender_id] || 0) + 1;
        });
        
        // Create a map of profile_id to role
        const roleMap = {};
        roles.forEach(role => {
          roleMap[role.user_id] = role.role;
        });
        
        // Transform profile data to match User interface
        const userData: User[] = profiles.map(profile => ({
          id: profile.id,
          name: profile.name || 'Unknown User',
          email: `${profile.name.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Placeholder email
          role: roleMap[profile.id] || 'user',
          status: profile.last_active && (new Date(profile.last_active).getTime() > Date.now() - 86400000 * 7) 
            ? 'active' 
            : 'inactive',
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
          photoCount: photoCountMap[profile.id] || 0,
          messageCount: messageCountMap[profile.id] || 0
        }));
        
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
    
    fetchUsers();
  }, [toast]);
  
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

  return (
    <div className="space-y-6">
      <PageHeader onExport={exportUsers} />

      <AIBanner type="user" collapsible={true} />

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

          <TablePagination />
        </CardContent>
      </Card>

      <UserDetailDialog 
        user={selectedUser}
        mode={userDetailMode}
        open={!!selectedUser}
        onClose={closeDialog}
        onModeChange={setUserDetailMode}
      />
    </div>
  );
};

export default UsersPage;
