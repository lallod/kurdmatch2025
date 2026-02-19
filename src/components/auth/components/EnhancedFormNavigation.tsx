import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import MissingFieldsSummary from './MissingFieldsSummary';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { useTranslations } from '@/hooks/useTranslations';

interface EnhancedFormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isStepComplete: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  stepQuestions?: QuestionItem[];
  formValues?: Record<string, any>;
}

const EnhancedFormNavigation: React.FC<EnhancedFormNavigationProps> = ({
  currentStep,
  totalSteps,
  isStepComplete,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit,
  stepQuestions = [],
  formValues = {}
}) => {
  const { t } = useTranslations();
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="relative">
      <div className="flex justify-between items-center gap-2 pt-4 md:pt-6">
        {/* Previous Button */}
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep || isSubmitting}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50 text-sm md:text-base px-3 md:px-4 py-2 h-auto"
        >
          <ChevronLeft size={16} className="md:mr-1" />
          <span className="hidden sm:inline">{t('reg.previous', 'Previous')}</span>
        </Button>

        {/* Step Progress - Hidden on small mobile */}
        <div className="hidden sm:block text-center flex-shrink-0">
          <div className="text-xs md:text-sm text-purple-200 mb-1">
            {t('reg.step_of', `Step ${currentStep} of ${totalSteps}`, { current: currentStep, total: totalSteps })}
          </div>
          <div className="flex gap-1 justify-center">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
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
            type="button"
            onClick={onSubmit}
            disabled={!isStepComplete || isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white border-0 text-sm md:text-base px-3 md:px-4 py-2 h-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="md:mr-2 animate-spin" />
                <span className="hidden sm:inline">{t('reg.creating_account', 'Creating Account...')}</span>
                <span className="sm:hidden">{t('reg.creating', 'Creating...')}</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">{t('reg.complete_registration', 'Complete Registration')}</span>
                <span className="sm:hidden">{t('reg.complete', 'Complete')}</span>
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={!isStepComplete || isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white border-0 text-sm md:text-base px-3 md:px-4 py-2 h-auto"
          >
            {t('reg.continue', 'Continue')}
            <ChevronRight size={16} className="md:ml-1" />
          </Button>
        )}
      </div>

      {/* Missing Fields Summary */}
      {!isStepComplete && stepQuestions.length > 0 && (
        <MissingFieldsSummary
          stepQuestions={stepQuestions}
          formValues={formValues}
          currentStep={currentStep}
        />
      )}
    </div>
  );
};

export default EnhancedFormNavigation;
