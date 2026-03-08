import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { SubscriptionStatus, SubscriptionTier } from "@/types/subscription";

// Re-export the hook that uses the shared context provider
// This eliminates duplicate API calls across components
export const useSubscription = () => {
  const context = useSubscriptionContext();
  
  if (context) {
    return context;
  }

  // Fallback for components rendered outside SubscriptionProvider
  return {
    subscription: {
      subscription_type: "free" as const,
      expires_at: null,
      is_active: true,
    } as SubscriptionStatus,
    isLoading: false,
    checkSubscription: async () => {},
    createCheckout: async (_priceId: string) => {},
    openCustomerPortal: async () => {},
    hasFeature: (_tier: SubscriptionTier) => false,
  };
};
