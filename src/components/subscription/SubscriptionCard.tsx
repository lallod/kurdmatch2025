import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { SubscriptionPlan } from "@/types/subscription";

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  onSubscribe: (priceId: string) => void;
  isLoading?: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  plan,
  isCurrentPlan,
  onSubscribe,
  isLoading,
}) => {
  return (
    <Card className={`relative ${isCurrentPlan ? "border-primary shadow-lg" : ""}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-tinder-rose to-tinder-orange">
            Most Popular
          </Badge>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <Badge variant="secondary">Your Plan</Badge>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>
          {plan.price === 0 ? (
            <span className="text-3xl font-bold">Free</span>
          ) : (
            <>
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground ml-2">{plan.currency}/month</span>
            </>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        {isCurrentPlan ? (
          <Button variant="outline" className="w-full" disabled>
            Current Plan
          </Button>
        ) : plan.id === "free" ? (
          <Button variant="outline" className="w-full" disabled>
            Downgrade via Portal
          </Button>
        ) : (
          <Button
            className="w-full bg-gradient-to-r from-tinder-rose to-tinder-orange hover:opacity-90"
            onClick={() => onSubscribe(plan.priceId)}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Subscribe"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
