
import React, { useState, useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import StepIndicator from './components/StepIndicator';
import FormNavigation from './components/FormNavigation';
import FormContent from './components/FormContent';
import SocialLogin from './components/SocialLogin';
import { systemQuestions } from '@/pages/SuperAdmin/components/registration-questions/data/systemQuestions';
import { initialQuestions } from '@/pages/SuperAdmin/components/registration-questions/data/sampleQuestions';
import { useRegistrationForm } from './hooks/useRegistrationForm';
import { useStepCategories } from './utils/useStepCategories';

const DynamicRegistrationForm = () => {
  // Get questions
  const [questions, setQuestions] = useState<QuestionItem[]>([...systemQuestions, ...initialQuestions]);
  const enabledQuestions = questions.filter(q => q.enabled);
  
  // Check if this is an OAuth registration flow
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  
  useEffect(() => {
    const oauthFlow = sessionStorage.getItem('oauth_registration_flow') === 'true';
    setIsOAuthUser(oauthFlow);
  }, []);
  
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
        
        {/* Only show social login for non-OAuth users on first step */}
        {currentStep === 0 && !isOAuthUser && <SocialLogin />}
        
        {/* Show welcome message for OAuth users */}
        {isOAuthUser && currentStep === 0 && (
          <div className="text-center p-4 bg-green-900/20 border border-green-700 rounded-lg">
            <p className="text-green-300">
              Welcome! Let's complete your profile to get started.
            </p>
          </div>
        )}
        
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
