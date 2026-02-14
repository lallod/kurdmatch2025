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
      toast({ title: "Subscription Successful!", description: "Your subscription has been activated. Thank you!" });
      window.history.replaceState({}, "", "/subscription");
    }
    if (canceled) {
      toast({ title: "Checkout Canceled", description: "You can try again whenever you're ready.", variant: "destructive" });
      window.history.replaceState({}, "", "/subscription");
    }
  }, [searchParams, toast]);

  const handleRefresh = () => {
    checkSubscription();
    toast({ title: "Refreshing...", description: "Checking your subscription status" });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Clean header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-foreground mb-2">Choose Your Plan</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Unlock premium features and find your perfect match faster
          </p>
        </div>

        {/* Current subscription */}
        {subscription.subscription_type !== "free" && (
          <Card className="mb-8 bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Current Plan</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    {SUBSCRIPTION_PLANS.find(p => p.id === subscription.subscription_type)?.name}
                    {subscription.expires_at && <span className="ml-2">• Expires: {new Date(subscription.expires_at).toLocaleDateString()}</span>}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                    <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />Refresh
                  </Button>
                  <Button variant="outline" size="sm" onClick={openCustomerPortal}>
                    <Settings className="h-3.5 w-3.5 mr-1.5" />Manage
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {SUBSCRIPTION_PLANS.map(plan => (
            <SubscriptionCard key={plan.id} plan={plan} isCurrentPlan={subscription.subscription_type === plan.id} onSubscribe={createCheckout} isLoading={isLoading} />
          ))}
        </div>

        {/* Info */}
        <Card className="bg-card/50 border-border/30">
          <CardHeader>
            <CardTitle className="text-sm">Subscription Details</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-xs space-y-1.5">
            <p>• All subscriptions are billed monthly</p>
            <p>• Cancel anytime through the management portal</p>
            <p>• Upgrades take effect immediately</p>
            <p>• Secure payments powered by Stripe</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscription;
