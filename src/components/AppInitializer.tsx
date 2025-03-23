
import { useEffect } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useToast } from '@/hooks/use-toast';
import { setupSupabase } from '@/utils/setupSupabase';

const AppInitializer = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await setupSupabase();
        console.log('Supabase setup completed');
      } catch (error) {
        console.error('Error during Supabase setup:', error);
        toast({
          title: 'Setup Error',
          description: 'There was an error setting up the application',
          variant: 'destructive'
        });
      }
    };
    
    initializeApp();
  }, [toast]);

  return null;
};

export default AppInitializer;
