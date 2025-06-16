
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
    <div className="flex justify-between mt-8 pt-6 border-t border-white/20">
      {currentStep > 1 ? (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevStep}
          className="gap-2 bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
        >
          <ChevronLeft size={16} />
          Back
        </Button>
      ) : (
        <div></div>
      )}
      
      {currentStep < totalSteps ? (
        <Button 
          type="button" 
          onClick={onNextStep}
          className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
        >
          Continue
          <ChevronRight size={16} />
        </Button>
      ) : (
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Complete Registration"
          )}
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;
