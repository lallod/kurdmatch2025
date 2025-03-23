
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useUsers = (initialUsersPerPage: number = 10) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [databaseVerified, setDatabaseVerified] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [usersPerPage, setUsersPerPage] = useState(initialUsersPerPage);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // First get the total count of profiles for the stats banner
      const { count: totalCount, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      if (countError) throw countError;
      
      // Store the total count in state - this should remain consistent
      setTotalUsers(totalCount || 0);
      setDatabaseVerified(true);
      
      // Fetch paginated users for the current page
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
      
      const profileIds = profiles.map(profile => profile.id);
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .in('user_id', profileIds);
        
      if (rolesError) throw rolesError;
      
      // Map profiles to User objects with roles
      const userData: User[] = profiles.map(profile => {
        const userRole = userRoles?.find(role => role.user_id === profile.id);
        const isActive = profile.last_active && 
          (new Date(profile.last_active).getTime() > Date.now() - 86400000 * 7);
        const emailAddress = profile.name ? 
          `${profile.name.toLowerCase().replace(/\s+/g, '.')}@example.com` : 
          `user.${profile.id.substring(0, 8)}@example.com`;
        return {
          id: profile.id,
          name: profile.name || 'Unknown User',
          email: emailAddress,
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
          photoCount: 0,
          messageCount: 0
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
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, usersPerPage]);

  // Apply filters to the current page of users only
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

  // Calculate status counts based on loaded users
  // This ensures counts are based on the same dataset as totalUsers
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;

  const userStats = {
    totalUsers,
    databaseVerified,
    activeUsers,
    pendingUsers,
    inactiveUsers
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    // Reset verification state to show loading indicator
    setDatabaseVerified(false);
    fetchUsers();
  };

  const handleUsersPerPageChange = (count: number) => {
    setUsersPerPage(count);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return {
    users,
    filteredUsers,
    loading,
    currentPage,
    totalUsers,
    userStats,
    searchTerm,
    statusFilter,
    roleFilter,
    usersPerPage,
    setSearchTerm,
    setStatusFilter,
    setRoleFilter,
    setUsersPerPage: handleUsersPerPageChange,
    handlePageChange,
    handleRefresh,
    fetchUsers
  };
};
