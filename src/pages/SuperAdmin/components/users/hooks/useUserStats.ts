
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserStats {
  totalUsers: number;
  databaseVerified: boolean;
  activeUsers: number;
  pendingUsers: number;
  inactiveUsers: number;
}

export const useUserStats = (totalUsers: number, databaseVerified: boolean) => {
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers,
    databaseVerified,
    activeUsers: 0,
    pendingUsers: 0,
    inactiveUsers: 0
  });

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

  return userStats;
};
