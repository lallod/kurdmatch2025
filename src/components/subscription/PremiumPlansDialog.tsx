
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, Sparkles, Eye, Heart, MessageCircle } from 'lucide-react';

interface PremiumPlansDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPlan: (planId: string) => void;
}

const PremiumPlansDialog = ({ open, onOpenChange, onSelectPlan }: PremiumPlansDialogProps) => {
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$9.99',
      period: '/month',
      popular: false,
      features: [
        'See who likes you',
        'Unlimited likes',
        'Advanced filters',
        '3 Super Likes per day'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19.99',
      period: '/month',
      popular: true,
      features: [
        'All Basic features',
        'See who viewed your profile',
        'Priority support',
        '10 Super Likes per day',
        'Read receipts',
        'Boost your profile'
      ]
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: '$29.99',
      period: '/month',
      popular: false,
      features: [
        'All Premium features',
        'Unlimited Super Likes',
        'Monthly profile boost',
        'Advanced analytics',
        'Premium customer support',
        'Early access to new features'
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 border-white/20 text-white">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-3xl font-bold text-white">
            Choose Your Premium Plan
          </DialogTitle>
          <DialogDescription className="text-purple-200 text-lg">
            Unlock premium features and boost your dating success
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden ${
                plan.popular 
                  ? 'bg-white/20 border-2 border-pink-400' 
                  : 'bg-white/10 border border-white/20'
              } backdrop-blur-sm hover:bg-white/25 transition-all duration-200`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 px-4 py-1">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-white">
                  {plan.name}
                </CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-purple-200">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-purple-100">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full font-semibold py-3 rounded-full transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white'
                      : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                  }`}
                >
                  {plan.popular ? (
                    <>
                      <Crown className="h-4 w-4 mr-2" />
                      Get Premium
                    </>
                  ) : (
                    `Choose ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 justify-center">
              <Eye className="h-5 w-5 text-purple-300" />
              <span className="text-purple-200 text-sm">Profile View Insights</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Heart className="h-5 w-5 text-pink-300" />
              <span className="text-purple-200 text-sm">See Who Likes You</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <MessageCircle className="h-5 w-5 text-blue-300" />
              <span className="text-purple-200 text-sm">Priority Matching</span>
            </div>
          </div>
          <p className="text-purple-300 text-sm">
            Cancel anytime • Secure payment • 30-day money-back guarantee
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumPlansDialog;
