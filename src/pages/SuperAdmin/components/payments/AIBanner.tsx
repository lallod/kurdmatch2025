
import React from 'react';
import { Brain } from 'lucide-react';

export const AIBanner = () => {
  return (
    <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
      <Brain size={24} className="text-tinder-rose mr-3" />
      <div>
        <h3 className="font-semibold text-gray-800">AI-Powered Fraud Detection</h3>
        <p className="text-sm text-gray-600">Our AI system monitors payment patterns and identifies potential fraudulent transactions</p>
      </div>
    </div>
  );
};
