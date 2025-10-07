import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionStatus, SubscriptionTier } from "@/types/subscription";
import { useToast } from "@/hooks/use-toast";

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    subscription_type: "free",
    expires_at: null,
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const checkSubscription = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setSubscription({
          subscription_type: "free",
          expires_at: null,
          is_active: true,
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke("check-subscription");

      if (error) throw error;

      setSubscription(data);
    } catch (error) {
      console.error("Error checking subscription:", error);
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckout = async (priceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
        
        // Refresh subscription after a delay
        setTimeout(() => {
          checkSubscription();
        }, 5000);
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Error",
        description: "Failed to start checkout process",
        variant: "destructive",
      });
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
        
        // Refresh subscription after returning
        setTimeout(() => {
          checkSubscription();
        }, 5000);
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast({
        title: "Error",
        description: "Failed to open subscription management",
        variant: "destructive",
      });
    }
  };

  const hasFeature = (tier: SubscriptionTier): boolean => {
    const tierHierarchy: Record<SubscriptionTier, number> = {
      free: 0,
      basic: 1,
      premium: 2,
      gold: 3,
    };

    return tierHierarchy[subscription.subscription_type] >= tierHierarchy[tier];
  };

  useEffect(() => {
    checkSubscription();

    // Check subscription status every minute
    const interval = setInterval(checkSubscription, 60000);

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    return () => {
      clearInterval(interval);
      authSubscription.unsubscribe();
    };
  }, []);

  return {
    subscription,
    isLoading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
    hasFeature,
  };
};
