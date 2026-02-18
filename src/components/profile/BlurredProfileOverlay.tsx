import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPremiumCheckout } from '@/api/payments';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

interface BlurredProfileOverlayProps {
  onClose?: () => void;
}

const BlurredProfileOverlay: React.FC<BlurredProfileOverlayProps> = ({ onClose }) => {
  const { t } = useTranslations();
  const handleUpgrade = async () => {
    try {
      await createPremiumCheckout('premium');
    } catch {
      toast.error(t('toast.checkout.failed', 'Failed to start checkout'));
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center">
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-xs">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Premium Profile</h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Upgrade to see full dating details, compatibility scores, and advanced filters
        </p>
        <Button
          onClick={handleUpgrade}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Unlock Premium
        </Button>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Maybe later
          </button>
        )}
      </div>
    </div>
  );
};

export default BlurredProfileOverlay;
