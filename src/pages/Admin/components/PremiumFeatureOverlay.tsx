
import React from 'react';
import { Lock } from 'lucide-react';

interface PremiumFeatureOverlayProps {
  children: React.ReactNode;
}

const PremiumFeatureOverlay: React.FC<PremiumFeatureOverlayProps> = ({ children }) => (
  <div className="relative">
    {children}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-tinder-rose/20 shadow-sm">
        <p className="text-sm font-medium text-tinder-rose flex items-center">
          <Lock size={16} className="mr-2" />
          Premium feature only
        </p>
      </div>
    </div>
  </div>
);

export default PremiumFeatureOverlay;
