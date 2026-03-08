import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionStatus, SubscriptionTier } from "@/types/subscription";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";

interface SubscriptionContextValue {
  subscription: SubscriptionStatus;
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
  createCheckout: (priceId: string) => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  hasFeature: (tier: SubscriptionTier) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    subscription_type: "free",
    expires_at: null,
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslations();

  const checkSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setSubscription({ subscription_type: "free", expires_at: null, is_active: true });
        return;
      }

      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error("Error checking subscription:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCheckout = useCallback(async (priceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", { body: { priceId } });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
        setTimeout(() => { checkSubscription(); }, 5000);
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast({ title: t('common.error', 'Error'), description: t('subscription.checkout_failed', 'Failed to start checkout process'), variant: "destructive" });
    }
  }, [checkSubscription, toast, t]);

  const openCustomerPortal = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
        setTimeout(() => { checkSubscription(); }, 5000);
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast({ title: t('common.error', 'Error'), description: t('subscription.portal_failed', 'Failed to open subscription management'), variant: "destructive" });
    }
  }, [checkSubscription, toast, t]);

  const hasFeature = useCallback((tier: SubscriptionTier): boolean => {
    const tierHierarchy: Record<SubscriptionTier, number> = { free: 0, basic: 1, premium: 2, gold: 3 };
    return tierHierarchy[subscription.subscription_type] >= tierHierarchy[tier];
  }, [subscription.subscription_type]);

  useEffect(() => {
    checkSubscription();
    const interval = setInterval(checkSubscription, 60000);
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(() => { checkSubscription(); });
    return () => { clearInterval(interval); authSubscription.unsubscribe(); };
  }, [checkSubscription]);

  return (
    <SubscriptionContext.Provider value={{ subscription, isLoading, checkSubscription, createCheckout, openCustomerPortal, hasFeature }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    // Fallback for components outside provider
    return null;
  }
  return context;
};
