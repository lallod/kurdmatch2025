
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import StepIndicator from './components/StepIndicator';
import FormNavigation from './components/FormNavigation';
import FormContent from './components/FormContent';
import { systemQuestions } from '@/pages/SuperAdmin/components/registration-questions/data/systemQuestions';
import { initialQuestions } from '@/pages/SuperAdmin/components/registration-questions/data/sampleQuestions';
import { useRegistrationForm } from './hooks/useRegistrationForm';
import { useStepCategories } from './utils/useStepCategories';

const DynamicRegistrationForm = () => {
  // Get questions
  const [questions, setQuestions] = useState<QuestionItem[]>([...systemQuestions, ...initialQuestions]);
  const enabledQuestions = questions.filter(q => q.enabled);
  
  // Get step categories
  const steps = useStepCategories(enabledQuestions);
  
  // Form handling
  const { 
    form, 
    isSubmitting, 
    currentStep, 
    setCurrentStep, 
    handleSubmit, 
    nextStep, 
    prevStep 
  } = useRegistrationForm(enabledQuestions, steps);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <StepIndicator 
          steps={steps} 
          currentStep={currentStep} 
          setCurrentStep={setCurrentStep} 
        />
        
        <FormContent 
          currentStep={currentStep}
          steps={steps}
          form={form}
        />
        
        <FormNavigation 
          currentStep={currentStep}
          totalSteps={steps.length}
          isSubmitting={isSubmitting}
          onPrevious={prevStep}
          onNext={nextStep}
        />
      </form>
    </Form>
  );
};

export default DynamicRegistrationForm;
