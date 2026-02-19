import React, { useState, useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { LoadingSpinner } from '@/components/app/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { useDynamicRegistrationForm } from './hooks/useDynamicRegistrationForm';
import { createEnhancedStepCategories, getStepCompletionStatus } from './utils/enhancedStepCategories';
import EnhancedStepIndicator from './components/EnhancedStepIndicator';
import EnhancedStepRenderer from './components/EnhancedStepRenderer';
import EnhancedFormNavigation from './components/EnhancedFormNavigation';
import SocialLogin from './components/SocialLogin';
import { useTranslations } from '@/hooks/useTranslations';

const EnhancedDynamicRegistrationForm: React.FC = () => {
  const { toast } = useToast();
  const { t } = useTranslations();
  const {
    form,
    step,
    completedSteps,
    isSubmitting,
    location,
    locationLoading,
    questions,
    loading,
    nextStep,
    prevStep,
    onSubmit,
    setStep
  } = useDynamicRegistrationForm();

  // Check if this is an OAuth registration flow
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  
  useEffect(() => {
    const oauthFlow = sessionStorage.getItem('oauth_registration_flow') === 'true';
    setIsOAuthUser(oauthFlow);
  }, []);

  // Create enhanced step categories
  const categories = createEnhancedStepCategories(questions);
  
  // Get real-time form values for validation
  const formValues = form.watch();
  
  // Get step completion status
  const completionStatus = getStepCompletionStatus(categories, formValues);
  
  // Get current category and check if current step is complete
  const currentCategory = categories.find(cat => cat.step === step);
  const isCurrentStepComplete = completionStatus[step] || false;
  
  // Debug: Log form values when they change
  React.useEffect(() => {
    console.log('📝 Form values changed:', {
      step,
      values: formValues,
      fields: Object.keys(formValues),
      categories: categories.map(c => ({
        step: c.step,
        name: c.name,
        questions: c.questions.map(q => q.id)
      }))
    });
  }, [formValues, step, categories]);
  
  // Debug: Log completion status
  React.useEffect(() => {
    console.log('✅ Step completion status:', {
      step,
      isComplete: completionStatus[step],
      allStatus: completionStatus,
      currentCategory: currentCategory?.name,
      requiredQuestions: currentCategory?.questions.filter(q => q.required).map(q => ({
        id: q.id,
        text: q.text,
        value: formValues[q.id],
        hasValue: !!formValues[q.id],
        valueType: typeof formValues[q.id]
      }))
    });
  }, [completionStatus, step, currentCategory, formValues]);

  // Enhanced navigation handlers with validation
  const handleNext = () => {
    if (isCurrentStepComplete && step < categories.length) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    console.log('🔍 Submit button clicked, checking all required fields...');
    
    // Get all form values
    const formValues = form.getValues();
    console.log('📝 Current form values:', formValues);
    
    // Check which steps are incomplete
    const incompleteSteps = categories.filter((cat, index) => {
      const stepNum = index + 1;
      return !completionStatus[stepNum];
    });
    
    if (incompleteSteps.length > 0) {
      const firstIncompleteStep = incompleteSteps[0];
      console.error('❌ Cannot submit: Incomplete steps:', incompleteSteps.map(s => s.name));
      
      toast({
        title: t('reg.incomplete_registration', 'Incomplete Registration'),
        description: t('reg.complete_step_before_submit', `Please complete "${firstIncompleteStep.name}" step before submitting.`, { step: firstIncompleteStep.name }),
        variant: "destructive",
      });
      
      // Navigate to first incomplete step
      setStep(firstIncompleteStep.step);
      return;
    }
    
    console.log('✅ All steps complete, submitting form...');
    
    // Trigger form validation and submission
    await form.handleSubmit(
      (data) => {
        console.log('✅ Form validation passed, calling onSubmit...');
        onSubmit(data);
      }, 
      (errors) => {
        console.error('❌ Form validation errors:', errors);
        const errorFields = Object.keys(errors);
        toast({
          title: t('reg.validation_error', 'Validation Error'),
          description: t('reg.fix_errors_in', `Please fix errors in: ${errorFields.join(', ')}`),
          variant: "destructive",
        });
      }
    )();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark/80 to-primary flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark/80 to-primary flex items-center justify-center">
        <div className="text-primary-foreground text-center">
          <h2 className="text-2xl font-bold mb-2">{t('reg.registration_error', 'Registration Error')}</h2>
          <p className="text-primary-foreground/80">{t('reg.unable_to_load', 'Unable to load registration form. Please refresh the page.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark/80 to-primary py-4 sm:py-8 px-0 sm:px-4">
      <div className="max-w-2xl mx-auto">
        {/* Enhanced Step Indicator */}
        <EnhancedStepIndicator
          categories={categories}
          currentStep={step}
          completionStatus={completionStatus}
        />

        {/* Main Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-3 sm:p-8 border border-white/20 shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 sm:space-y-6">
              {/* OAuth Welcome Message */}
              {isOAuthUser && step === 1 && (
                <div className="text-center mb-2 sm:mb-6 p-2 sm:p-4 bg-success/20 rounded-lg border border-success/30">
                   <h3 className="text-lg font-semibold text-success-foreground mb-2">{t('reg.welcome', 'Welcome!')}</h3>
                   <p className="text-success-foreground/90 text-sm">
                     {t('reg.social_connected', 'Your social account has been connected. Please complete the registration to finish setting up your profile.')}
                   </p>
                </div>
              )}

              {/* Social Login for Step 1 */}
              {step === 1 && !isOAuthUser && (
                <div className="mb-2 sm:mb-6">
                  <SocialLogin />
                  <div className="relative my-2 sm:my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-primary-dark text-primary-foreground/80">{t('reg.or_continue_email', 'or continue with email')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Step Content */}
              <EnhancedStepRenderer
                category={currentCategory}
                form={form}
                location={location}
                locationLoading={locationLoading}
                isStepComplete={isCurrentStepComplete}
              />

              {/* Enhanced Navigation */}
              <div className="relative">
                <EnhancedFormNavigation
                  currentStep={step}
                  totalSteps={categories.length}
                  isStepComplete={isCurrentStepComplete}
                  isSubmitting={isSubmitting}
                  onPrevious={prevStep}
                  onNext={handleNext}
                  onSubmit={handleSubmit}
                  stepQuestions={currentCategory.questions}
                  formValues={formValues}
                />
              </div>
            </form>
          </Form>
        </div>

        {/* Progress Summary */}
        <div className="mt-3 sm:mt-6 text-center text-sm text-primary-foreground/60 px-3">
          <p>
            {t('reg.complete_info_note', 'Complete all required information to create your perfect profile. Your data is secure and only visible to potential matches.')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDynamicRegistrationForm;