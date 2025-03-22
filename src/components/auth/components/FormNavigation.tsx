
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const FormNavigation = ({
  currentStep,
  totalSteps,
  isSubmitting,
  onPrevious,
  onNext
}: FormNavigationProps) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Previous
      </Button>

      {isLastStep ? (
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
          <Send size={16} />
        </Button>
      ) : (
        <Button 
          type="button" 
          onClick={onNext}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          Next
          <ArrowRight size={16} />
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;
