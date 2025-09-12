import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface EnhancedFormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isStepComplete: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const EnhancedFormNavigation: React.FC<EnhancedFormNavigationProps> = ({
  currentStep,
  totalSteps,
  isStepComplete,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between items-center pt-6">
      {/* Previous Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
        className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
      >
        <ChevronLeft size={16} className="mr-1" />
        Previous
      </Button>

      {/* Step Progress */}
      <div className="text-center">
        <div className="text-sm text-purple-200 mb-1">
          Step {currentStep} of {totalSteps}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i + 1 === currentStep
                  ? 'bg-purple-400'
                  : i + 1 < currentStep
                  ? 'bg-green-400'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Next/Submit Button */}
      {isLastStep ? (
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={!isStepComplete || isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white border-0"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Complete Registration'
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={!isStepComplete || isSubmitting}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white border-0"
        >
          Continue
          <ChevronRight size={16} className="ml-1" />
        </Button>
      )}

      {/* Validation Message */}
      {!isStepComplete && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-yellow-400 whitespace-nowrap">
          Complete all required fields to continue
        </div>
      )}
    </div>
  );
};

export default EnhancedFormNavigation;