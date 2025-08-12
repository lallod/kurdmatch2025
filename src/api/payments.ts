import { supabase } from '@/integrations/supabase/client';

export type PremiumPlanId = 'basic' | 'premium' | 'ultimate';

export const createPremiumCheckout = async (planId: PremiumPlanId = 'premium') => {
  try {
    const { data, error } = await supabase.functions.invoke('create-payment', {
      body: { planId },
    });

    if (error) throw error;

    const url = (data as any)?.url;
    if (!url) throw new Error('Checkout URL not returned');

    window.location.href = url;
  } catch (err: any) {
    console.error('Failed to start checkout:', err);
    throw err;
  }
};
