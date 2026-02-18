import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard";
import { useSubscription } from "@/hooks/useSubscription";
import { SUBSCRIPTION_PLANS } from "@/types/subscription";
import { toast } from "sonner";
import { Settings, RefreshCw } from "lucide-react";
import { useTranslations } from '@/hooks/useTranslations';

const Subscription = () => {
  const [searchParams] = useSearchParams();
  const { subscription, isLoading, checkSubscription, createCheckout, openCustomerPortal } = useSubscription();
  const { t } = useTranslations();

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    if (success) { toast.success(t('toast.subscription.activated', 'Your subscription has been activated')); window.history.replaceState({}, "", "/subscription"); }
    if (canceled) { toast.error(t('toast.subscription.cancelled', "You can try again whenever you're ready")); window.history.replaceState({}, "", "/subscription"); }
  }, [searchParams]);

  const handleRefresh = () => { checkSubscription(); toast.info(t('toast.subscription.checking', 'Checking your subscription status')); };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
           <h1 className="text-2xl font-bold text-foreground mb-2">{t('subscription.choose_plan', 'Choose Your Plan')}</h1>
           <p className="text-muted-foreground text-sm max-w-md mx-auto">{t('subscription.unlock_premium', 'Unlock premium features and find your perfect match faster')}</p>
        </div>

        {subscription.subscription_type !== "free" && (
          <Card className="mb-8 bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{t('subscription.current_plan', 'Current Plan')}</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    {SUBSCRIPTION_PLANS.find(p => p.id === subscription.subscription_type)?.name}
                    {subscription.expires_at && <span className="ml-2">• Expires: {new Date(subscription.expires_at).toLocaleDateString()}</span>}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}><RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />{t('subscription.refresh', 'Refresh')}</Button>
                  <Button variant="outline" size="sm" onClick={openCustomerPortal}><Settings className="h-3.5 w-3.5 mr-1.5" />{t('subscription.manage', 'Manage')}</Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {SUBSCRIPTION_PLANS.map(plan => <SubscriptionCard key={plan.id} plan={plan} isCurrentPlan={subscription.subscription_type === plan.id} onSubscribe={createCheckout} isLoading={isLoading} />)}
        </div>

        <Card className="bg-card/50 border-border/30">
          <CardHeader><CardTitle className="text-sm">{t('subscription.details', 'Subscription Details')}</CardTitle></CardHeader>
          <CardContent className="text-muted-foreground text-xs space-y-1.5">
            <p>• {t('subscription.billed_monthly', 'All subscriptions are billed monthly')}</p>
            <p>• {t('subscription.cancel_anytime', 'Cancel anytime through the management portal')}</p>
            <p>• {t('subscription.upgrades_immediate', 'Upgrades take effect immediately')}</p>
            <p>• {t('subscription.secure_payments', 'Secure payments powered by Stripe')}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscription;
