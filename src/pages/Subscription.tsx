import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard";
import { useSubscription } from "@/hooks/useSubscription";
import { SUBSCRIPTION_PLANS } from "@/types/subscription";
import { useToast } from "@/hooks/use-toast";
import { Settings, RefreshCw } from "lucide-react";

const Subscription = () => {
  const [searchParams] = useSearchParams();
  const { subscription, isLoading, checkSubscription, createCheckout, openCustomerPortal } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success) {
      toast({
        title: "Subscription Successful!",
        description: "Your subscription has been activated. Thank you!",
      });
      // Clear params
      window.history.replaceState({}, "", "/subscription");
    }

    if (canceled) {
      toast({
        title: "Checkout Canceled",
        description: "You can try again whenever you're ready.",
        variant: "destructive",
      });
      // Clear params
      window.history.replaceState({}, "", "/subscription");
    }
  }, [searchParams, toast]);

  const handleRefresh = () => {
    checkSubscription();
    toast({
      title: "Refreshing...",
      description: "Checking your subscription status",
    });
  };

  return (
    <div className="min-h-screen bg-[#0E0A17] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Unlock premium features and find your perfect match faster
          </p>
        </div>

        {/* Current Subscription Info */}
        {subscription.subscription_type !== "free" && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Current Subscription</CardTitle>
                  <CardDescription className="text-white/70">
                    {SUBSCRIPTION_PLANS.find(p => p.id === subscription.subscription_type)?.name}
                    {subscription.expires_at && (
                      <span className="ml-2">
                        • Expires: {new Date(subscription.expires_at).toLocaleDateString()}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openCustomerPortal}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Subscription
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={subscription.subscription_type === plan.id}
              onSubscribe={createCheckout}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Additional Info */}
        <Card className="bg-card/50 border-border/30">
          <CardHeader>
            <CardTitle className="text-white">Subscription Details</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-2">
            <p>• All subscriptions are billed monthly</p>
            <p>• Cancel anytime through the subscription management portal</p>
            <p>• Upgrades take effect immediately</p>
            <p>• Downgrades apply at the end of your billing period</p>
            <p>• Secure payments powered by Stripe</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscription;
