
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, X } from 'lucide-react';

interface WizardLayoutProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  canProceed: boolean;
  isLoading?: boolean;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({
  currentStep,
  totalSteps,
  stepTitle,
  children,
  onNext,
  onBack,
  onSkip,
  canProceed,
  isLoading = false
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">Step {currentStep + 1} of {totalSteps}</p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="flex items-center gap-2 text-gray-500"
            >
              <X className="w-4 h-4" />
              Skip
            </Button>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-center">{stepTitle}</h1>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[500px]">
          {children}
        </div>
      </div>

      {/* Footer Navigation - Fixed with proper spacing */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={currentStep === 0}
              className="flex-1 h-12"
            >
              Back
            </Button>
            <Button
              onClick={onNext}
              disabled={!canProceed || isLoading}
              className="flex-1 h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {isLoading ? 'Saving...' : currentStep === totalSteps - 1 ? 'Complete Profile' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
