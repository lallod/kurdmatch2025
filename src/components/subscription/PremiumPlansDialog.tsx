
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
import { useTranslations } from '@/hooks/useTranslations';

interface PremiumPlansDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPlan: (planId: string) => void;
}

const PremiumPlansDialog = ({ open, onOpenChange, onSelectPlan }: PremiumPlansDialogProps) => {
  const { t } = useTranslations();
  const plans = [
    {
      id: 'basic',
      name: t('premium.basic', 'Basic'),
      price: '$9.99',
      period: t('premium.per_month', '/month'),
      popular: false,
      features: [
        t('premium.see_who_likes', 'See who likes you'),
        t('premium.unlimited_likes', 'Unlimited likes'),
        t('premium.advanced_filters', 'Advanced filters'),
        t('premium.super_likes_day', '3 Super Likes per day')
      ]
    },
    {
      id: 'premium',
      name: t('premium.premium', 'Premium'),
      price: '$19.99',
      period: t('premium.per_month', '/month'),
      popular: true,
      features: [
        t('premium.all_basic', 'All Basic features'),
        t('premium.profile_views', 'See who viewed your profile'),
        t('premium.priority_support', 'Priority support'),
        t('premium.super_likes_10', '10 Super Likes per day'),
        t('premium.read_receipts', 'Read receipts'),
        t('premium.boost_profile', 'Boost your profile')
      ]
    },
    {
      id: 'ultimate',
      name: t('premium.ultimate', 'Ultimate'),
      price: '$29.99',
      period: t('premium.per_month', '/month'),
      popular: false,
      features: [
        t('premium.all_premium', 'All Premium features'),
        t('premium.unlimited_super_likes', 'Unlimited Super Likes'),
        t('premium.monthly_boost', 'Monthly profile boost'),
        t('premium.advanced_analytics', 'Advanced analytics'),
        t('premium.premium_support', 'Premium customer support'),
        t('premium.early_access', 'Early access to new features')
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border text-foreground mx-3 sm:mx-4">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-3 sm:mb-4 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-pink-400 rounded-full flex items-center justify-center">
            <Crown className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground">
            {t('premium.choose_plan', 'Choose Your Premium Plan')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-base sm:text-lg">
            {t('premium.unlock_features', 'Unlock premium features and boost your dating success')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden ${
                plan.popular 
                  ? 'bg-accent/20 border-2 border-primary' 
                  : 'bg-accent/10 border border-border'
              } backdrop-blur-sm hover:bg-accent/25 transition-all duration-200`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 px-3 sm:px-4 py-0.5 sm:py-1 text-xs sm:text-sm">
                    <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                    {t('premium.most_popular', 'Most Popular')}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-3 sm:pb-4">
                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                  {plan.name}
                </CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-sm sm:text-base text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 sm:space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full h-10 sm:h-11 font-semibold text-sm sm:text-base rounded-full transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-600 text-primary-foreground'
                      : 'bg-accent/20 hover:bg-accent/30 text-foreground border border-border'
                  }`}
                >
                  {plan.popular ? (
                    <>
                      <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                      {t('premium.get_premium', 'Get Premium')}
                    </>
                  ) : (
                    t('premium.choose_plan_name', 'Choose {{name}}', { name: plan.name })
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 justify-center">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <span className="text-muted-foreground text-xs sm:text-sm">{t('premium.profile_view_insights', 'Profile View Insights')}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 justify-center">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-muted-foreground text-xs sm:text-sm">{t('premium.see_who_likes', 'See Who Likes You')}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 justify-center">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300" />
              <span className="text-muted-foreground text-xs sm:text-sm">{t('premium.priority_matching', 'Priority Matching')}</span>
            </div>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {t('premium.cancel_anytime', 'Cancel anytime • Secure payment • 30-day money-back guarantee')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumPlansDialog;
