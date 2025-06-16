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
      
      // Get total count of profiles
      const { count: totalCount, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      if (countError) throw countError;
      
      setTotalUsers(totalCount || 0);
      setDatabaseVerified(true);
      
      // Fetch paginated profiles
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
      
      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .in('user_id', profileIds);
        
      if (rolesError) throw rolesError;
      
      // Fetch real email addresses from auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) console.warn('Could not fetch auth users:', authError);
      
      // Fetch photo counts from photos table using profile_id
      const { data: photoCounts, error: photoError } = await supabase
        .from('photos')
        .select('profile_id')
        .in('profile_id', profileIds);
      
      if (photoError) console.warn('Could not fetch photo counts:', photoError);
      
      // Count photos per user
      const photoCountMap = photoCounts?.reduce((acc, photo) => {
        acc[photo.profile_id] = (acc[photo.profile_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};
      
      // Fetch message counts from messages table
      const { data: messageCounts, error: messageError } = await supabase
        .from('messages')
        .select('sender_id')
        .in('sender_id', profileIds);
      
      if (messageError) console.warn('Could not fetch message counts:', messageError);
      
      // Count messages per user
      const messageCountMap = messageCounts?.reduce((acc, message) => {
        acc[message.sender_id] = (acc[message.sender_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};
      
      // Map profiles to User objects with real data
      const userData: User[] = profiles.map(profile => {
        const userRole = userRoles?.find(role => role.user_id === profile.id);
        const authUser = authUsers?.users?.find(user => user.id === profile.id);
        const realEmail = authUser?.email || `user-${profile.id.substring(0, 8)}@unknown.com`;
        
        const isActive = profile.last_active && 
          (new Date(profile.last_active).getTime() > Date.now() - 86400000 * 7);
        
        // Determine status based on profile verification and activity
        let status = 'pending';
        if (profile.verified) {
          status = isActive ? 'active' : 'inactive';
        }
        
        return {
          id: profile.id,
          name: profile.name || 'Unknown User',
          email: realEmail,
          role: userRole?.role || 'user',
          status,
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
            : 'Never',
          photoCount: photoCountMap[profile.id] || 0,
          messageCount: messageCountMap[profile.id] || 0
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

  // Calculate status counts based on all users, not just current page
  const [userStats, setUserStats] = useState({
    totalUsers,
    databaseVerified,
    activeUsers: 0,
    pendingUsers: 0,
    inactiveUsers: 0
  });

  // Fetch stats separately for accurate counts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: allProfiles, error } = await supabase
          .from('profiles')
          .select('verified, last_active');
        
        if (error) throw error;
        
        const activeCount = allProfiles?.filter(p => 
          p.verified && p.last_active && 
          (new Date(p.last_active).getTime() > Date.now() - 86400000 * 7)
        ).length || 0;
        
        const pendingCount = allProfiles?.filter(p => !p.verified).length || 0;
        const inactiveCount = allProfiles?.filter(p => 
          p.verified && (!p.last_active || 
          (new Date(p.last_active).getTime() <= Date.now() - 86400000 * 7))
        ).length || 0;
        
        setUserStats({
          totalUsers,
          databaseVerified,
          activeUsers: activeCount,
          pendingUsers: pendingCount,
          inactiveUsers: inactiveCount
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };
    
    if (databaseVerified) {
      fetchStats();
    }
  }, [totalUsers, databaseVerified]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setDatabaseVerified(false);
    fetchUsers();
  };

  const handleUsersPerPageChange = (count: number) => {
    setUsersPerPage(count);
    setCurrentPage(1);
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
