
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bot, User, Sparkles } from 'lucide-react';
import PremiumFeatureButton from './PremiumFeatureButton';
import PremiumFeatureOverlay from './PremiumFeatureOverlay';

const ProfileAboutSection = () => {
  const [isSubscriber] = useState(false); // Mock subscription status

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="about" className="flex items-center">
          <User size={14} className="mr-1 text-tinder-rose" />
          About
        </Label>
        <div className="flex items-center gap-2">
          <div className="text-xs bg-gradient-to-r from-tinder-rose to-tinder-orange bg-clip-text text-transparent font-medium flex items-center">
            <Sparkles size={14} className="mr-1 text-tinder-orange" />
            AI Generated
          </div>
          
          <PremiumFeatureButton label="Subscribers Only" />
        </div>
      </div>
      <div className="relative">
        <Textarea 
          id="about" 
          rows={6} 
          defaultValue="Hi there! I'm Sophia, a UX designer with a passion for creating beautiful and functional digital experiences. When I'm not designing, you'll find me hiking in the mountains, trying new restaurants, or curling up with a good book. I believe in living life to the fullest and finding beauty in the small moments. Looking for someone who shares my sense of adventure and appreciation for both the outdoors and quiet evenings at home." 
          disabled={!isSubscriber}
          className={`neo-border ${!isSubscriber ? "opacity-70 cursor-not-allowed" : "focus-within:neo-glow transition-shadow"}`}
        />
        {!isSubscriber && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-tinder-rose/20 shadow-sm">
              <p className="text-sm font-medium text-tinder-rose flex items-center">
                <Bot size={16} className="mr-2" />
                Subscribe to premium to edit AI-generated content
              </p>
            </div>
          </div>
        )}
      </div>
      {!isSubscriber && (
        <p className="text-xs text-tinder-rose mt-1 flex items-center">
          <Bot size={12} className="mr-1" />
          Subscribe to premium to edit AI-generated content
        </p>
      )}
    </div>
  );
};

export default ProfileAboutSection;
