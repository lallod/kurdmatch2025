
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
import { Mail, User, MapPin, Camera, LucideIcon } from 'lucide-react';

// Define the Step interface to match what StepIndicator expects
interface Step {
  title: string;
  icon: LucideIcon;
  description: string;
}

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
  const stepCategories = useStepCategories(enabledQuestions);
  
  // Convert step categories to Step format for StepIndicator
  const steps: Step[] = stepCategories.map(category => {
    // Map category names to appropriate icons and descriptions
    let icon: LucideIcon = Mail;
    let description = '';
    
    switch (category.name) {
      case 'Account':
        icon = Mail;
        description = 'Create your secure account';
        break;
      case 'Personal':
      case 'Basics':
        icon = User;
        description = 'Tell us about yourself';
        break;
      case 'Location':
        icon = MapPin;
        description = 'Where are you from?';
        break;
      case 'Photos':
        icon = Camera;
        description = 'Add your best photos';
        break;
    }
    
    return {
      title: category.name,
      icon,
      description
    };
  });
  
  // Form handling
  const { 
    form, 
    isSubmitting, 
    currentStep, 
    setCurrentStep, 
    handleSubmit, 
    nextStep, 
    prevStep 
  } = useRegistrationForm(enabledQuestions, stepCategories);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <StepIndicator 
          steps={steps} 
          currentStep={currentStep} 
          completedSteps={[]} 
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
          steps={stepCategories}
          form={form}
        />
        
        <FormNavigation 
          currentStep={currentStep}
          totalSteps={steps.length}
          isSubmitting={isSubmitting}
          onPrevStep={prevStep}
          onNextStep={nextStep}
        />
      </form>
    </Form>
  );
};

export default DynamicRegistrationForm;
