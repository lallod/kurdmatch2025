
import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  isSubmitting: boolean;
}

const FormNavigation = ({ currentStep, totalSteps, onPrevStep, onNextStep, isSubmitting }: FormNavigationProps) => {
  return (
    <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20">
      {currentStep > 1 ? (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevStep}
          className="gap-1 sm:gap-2 bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20 h-9 sm:h-10 px-3 sm:px-4 text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Back</span>
        </Button>
      ) : (
        <div></div>
      )}
      
      {currentStep < totalSteps ? (
        <Button 
          type="button" 
          onClick={onNextStep}
          className="gap-1 sm:gap-2 bg-gradient-to-r from-primary-dark to-primary hover:from-primary-dark/80 hover:to-primary/80 text-primary-foreground shadow-lg h-9 sm:h-10 px-3 sm:px-4 text-sm"
        >
          <span>Continue</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      ) : (
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="gap-1 sm:gap-2 bg-gradient-to-r from-primary-dark to-primary hover:from-primary-dark/80 hover:to-primary/80 text-primary-foreground shadow-lg h-9 sm:h-10 px-3 sm:px-4 text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden xs:inline">Creating Account...</span>
              <span className="xs:hidden">Creating...</span>
            </>
          ) : (
            <>
              <span className="hidden xs:inline">Complete Registration</span>
              <span className="xs:hidden">Complete</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;
