
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

export type Role = 'super_admin' | 'admin' | 'moderator' | 'user';

export const useRoleCheck = (userId: string | undefined, requiredRole: Role) => {
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkRole = async () => {
      // Reset checking state when user ID changes
      setIsChecking(true);
      
      if (!userId) {
        setHasRole(false);
        setIsChecking(false);
        return;
      }
      
      try {
        console.log(`Checking if user ${userId} has role: ${requiredRole}`);
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', requiredRole);
        
        if (error) {
          console.error('Error checking role:', error);
          throw error;
        }
        
        const roleExists = data && data.length > 0;
        console.log(`Role check result for ${requiredRole}:`, roleExists, data);
        
        setHasRole(roleExists);
      } catch (err) {
        console.error(`Error checking ${requiredRole} role:`, err);
        setHasRole(false);
        toast({
          title: 'Permission Error',
          description: 'Could not verify your access permissions',
          variant: 'destructive'
        });
      } finally {
        setIsChecking(false);
      }
    };
    
    checkRole();
  }, [userId, requiredRole, toast]);
  
  return { hasRole, isChecking };
};
