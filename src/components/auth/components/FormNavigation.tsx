
import React from 'react';
import { Button } from '@/components/ui/button';
import { CornerDownRight, Loader2 } from 'lucide-react';

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
  return (
    <div className="flex justify-between mt-6">
      {currentStep > 0 ? (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
          className="gap-2 text-purple-400 border-purple-800 hover:bg-purple-900/30"
        >
          Back
        </Button>
      ) : (
        <div></div>
      )}
      
      {currentStep < totalSteps - 1 ? (
        <Button 
          type="button" 
          onClick={onNext}
          className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0"
        >
          Next
          <CornerDownRight size={16} />
        </Button>
      ) : (
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;
