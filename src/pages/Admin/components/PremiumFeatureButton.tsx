
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wand2, Sparkles } from 'lucide-react';
import { createPremiumCheckout } from '@/api/payments';
import { toast } from 'sonner';

interface PremiumFeatureButtonProps {
  label?: string;
}

const PremiumFeatureButton: React.FC<PremiumFeatureButtonProps> = ({ label = 'Premium Only' }) => {
  const [loading, setLoading] = useState(false);
  const handleUpgrade = async () => {
    try {
      setLoading(true);
      await createPremiumCheckout('premium');
    } catch (err) {
      console.error(err);
      toast.error('Unable to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge variant="outline" className="text-xs border-tinder-rose text-tinder-rose cursor-pointer flex items-center gap-1">
          <Wand2 size={12} />
          {label}
        </Badge>
      </DialogTrigger>
      <DialogContent className="neo-card bg-white/90 backdrop-blur-md max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="ai-text-gradient">AI Premium Feature</DialogTitle>
          <DialogDescription>
            This feature is available only to subscribers.
            <div className="mt-4">
              <Button onClick={handleUpgrade} disabled={loading} className="w-full bg-gradient-to-r from-tinder-rose to-tinder-orange hover:from-tinder-rose/90 hover:to-tinder-orange/90 neo-glow">
                <Sparkles size={16} className="mr-2" />
                {loading ? 'Starting checkout...' : 'Upgrade to Premium'}
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumFeatureButton;
