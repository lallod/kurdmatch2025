
import React from 'react';
import { Form } from '@/components/ui/form';
import StepIndicator from '@/components/auth/components/StepIndicator';
import FormNavigation from '@/components/auth/components/FormNavigation';
import AutoSaveIndicator from '@/components/auth/components/AutoSaveIndicator';
import RegistrationStepRenderer from '@/components/auth/components/RegistrationStepRenderer';
import ErrorBoundary from '@/components/auth/components/ErrorBoundary';
import { useRegistrationFormLogic } from '@/components/auth/hooks/useRegistrationFormLogic';
import { registrationSteps } from '@/components/auth/utils/registrationSteps';

const SimpleRegistrationForm = () => {
  const {
    form,
    step,
    completedSteps,
    isSubmitting,
    location,
    locationLoading,
    nextStep,
    prevStep,
    onSubmit,
  } = useRegistrationFormLogic();

  return (
    <ErrorBoundary>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ErrorBoundary>
            <StepIndicator 
              currentStep={step}
              completedSteps={completedSteps}
              steps={registrationSteps}
            />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <AutoSaveIndicator />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <RegistrationStepRenderer
              step={step}
              form={form}
              location={location}
              locationLoading={locationLoading}
            />
          </ErrorBoundary>
          
          <ErrorBoundary>
            <FormNavigation
              currentStep={step}
              totalSteps={registrationSteps.length}
              onPrevStep={prevStep}
              onNextStep={nextStep}
              isSubmitting={isSubmitting}
            />
          </ErrorBoundary>
        </form>
      </Form>
    </ErrorBoundary>
  );
};

export default SimpleRegistrationForm;
