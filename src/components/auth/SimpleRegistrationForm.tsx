
import React from 'react';
import { Form } from '@/components/ui/form';
import StepIndicator from '@/components/auth/components/StepIndicator';
import FormNavigation from '@/components/auth/components/FormNavigation';
import AutoSaveIndicator from '@/components/auth/components/AutoSaveIndicator';
import RegistrationStepRenderer from '@/components/auth/components/RegistrationStepRenderer';
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <StepIndicator 
          currentStep={step}
          completedSteps={completedSteps}
          steps={registrationSteps}
        />
        
        <AutoSaveIndicator />
        
        <RegistrationStepRenderer
          step={step}
          form={form}
          location={location}
          locationLoading={locationLoading}
        />
        
        <FormNavigation
          currentStep={step}
          totalSteps={registrationSteps.length}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
};

export default SimpleRegistrationForm;
