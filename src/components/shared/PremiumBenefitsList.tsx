import React from 'react';
import { Sparkles } from 'lucide-react';

const benefits = [
  'Unlimited likes every day',
  '10 Super Likes daily',
  '5 Rewinds daily',
  '3 Boosts daily',
  'See who liked you',
  'Priority support',
];

interface PremiumBenefitsListProps {
  title?: string;
}

const PremiumBenefitsList: React.FC<PremiumBenefitsListProps> = ({ title = 'Why Upgrade?' }) => (
  <div className="space-y-2">
    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-warning" />
      {title}
    </h4>
    <ul className="space-y-1.5 text-muted-foreground text-sm">
      {benefits.map((benefit) => (
        <li key={benefit} className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
          {benefit}
        </li>
      ))}
    </ul>
  </div>
);

export default PremiumBenefitsList;
