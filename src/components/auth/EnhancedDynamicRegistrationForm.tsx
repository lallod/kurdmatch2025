import React, { useState, useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { LoadingSpinner } from '@/components/app/LoadingSpinner';
import { useDynamicRegistrationForm } from './hooks/useDynamicRegistrationForm';
import { createEnhancedStepCategories, getStepCompletionStatus } from './utils/enhancedStepCategories';
import EnhancedStepIndicator from './components/EnhancedStepIndicator';
import EnhancedStepRenderer from './components/EnhancedStepRenderer';
import EnhancedFormNavigation from './components/EnhancedFormNavigation';
import SocialLogin from './components/SocialLogin';

const EnhancedDynamicRegistrationForm: React.FC = () => {
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

  // Enhanced navigation handlers with validation
  const handleNext = () => {
    if (isCurrentStepComplete && step < categories.length) {
      nextStep();
    }
  };

  const handleSubmit = () => {
    // Check ALL steps before allowing submission
    const allStepsComplete = categories.every((cat, index) => {
      const stepNum = index + 1;
      return completionStatus[stepNum] === true;
    });
    
    if (!allStepsComplete) {
      // Find first incomplete step
      const firstIncompleteStep = categories.findIndex((cat, index) => {
        const stepNum = index + 1;
        return completionStatus[stepNum] !== true;
      });
      
      console.error('Cannot submit: Not all steps are complete. First incomplete step:', firstIncompleteStep + 1);
      return;
    }
    
    if (isCurrentStepComplete) {
      form.handleSubmit(onSubmit)();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Registration Error</h2>
          <p className="text-purple-200">Unable to load registration form. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 py-4 sm:py-8 px-0 sm:px-4">
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
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2 sm:space-y-6">
              {/* OAuth Welcome Message */}
              {isOAuthUser && step === 1 && (
                <div className="text-center mb-2 sm:mb-6 p-2 sm:p-4 bg-green-900/30 rounded-lg border border-green-500/30">
                  <h3 className="text-lg font-semibold text-green-300 mb-2">Welcome!</h3>
                  <p className="text-green-200 text-sm">
                    Your social account has been connected. Please complete the registration to finish setting up your profile.
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
                      <span className="px-2 bg-purple-800 text-purple-200">or continue with email</span>
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
        <div className="mt-3 sm:mt-6 text-center text-sm text-white/60 px-3">
          <p>
            Complete all required information to create your perfect profile. 
            Your data is secure and only visible to potential matches.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDynamicRegistrationForm;