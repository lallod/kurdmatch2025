export type SubscriptionTier = "free" | "basic" | "premium" | "gold";

export interface SubscriptionStatus {
  subscription_type: SubscriptionTier;
  expires_at: string | null;
  is_active: boolean;
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  currency: string;
  priceId: string;
  productId: string;
  features: string[];
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "NOK",
    priceId: "",
    productId: "",
    features: [
      "Basic profile",
      "Limited swipes per day",
      "Standard matching",
      "Basic messaging",
    ],
  },
  {
    id: "basic",
    name: "Premium Basic",
    price: 199,
    currency: "NOK",
    priceId: "price_1RK4pqDY8qZ9eNdMPGHK0Rw5",
    productId: "prod_SEXvI0ivqA0Yyf",
    features: [
      "Unlimited swipes",
      "See who liked you",
      "Advanced filters",
      "Ad-free experience",
      "AI-powered bio generation",
    ],
  },
  {
    id: "premium",
    name: "Pro Premium",
    price: 299,
    currency: "NOK",
    priceId: "price_1RK4rLDY8qZ9eNdMZiI5XTrO",
    productId: "prod_SEXxVvh07LbZIy",
    popular: true,
    features: [
      "Everything in Basic",
      "Priority matching",
      "AI conversation insights",
      "Smart icebreakers",
      "Advanced photo moderation",
      "Read receipts",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: 499,
    currency: "NOK",
    priceId: "price_1RK4sIDY8qZ9eNdMvrimk1w5",
    productId: "prod_SEXyD9PPXeVVbM",
    features: [
      "Everything in Premium",
      "Profile boost (weekly)",
      "Super likes (5 per day)",
      "Travel mode",
      "VIP support",
      "Profile verification badge",
    ],
  },
];
