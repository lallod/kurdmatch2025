import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/app/LoadingSpinner';
import { useDynamicRegistrationForm } from './hooks/useDynamicRegistrationForm';
import { createEnhancedStepCategories, getStepCompletionStatus } from './utils/enhancedStepCategories';
import EnhancedStepIndicator from './components/EnhancedStepIndicator';
import EnhancedStepRenderer from './components/EnhancedStepRenderer';
import EnhancedFormNavigation from './components/EnhancedFormNavigation';
import SocialLogin from './components/SocialLogin';

const EnhancedDynamicRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
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
    setStep,
    totalSteps
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
  let currentCategory = categories.find(cat => cat.step === step);
  
  // Fallback: if current step doesn't have a category, use the first available category
  if (!currentCategory && categories.length > 0) {
    currentCategory = categories[0];
    // Also update the step to match the first available category
    if (step !== currentCategory.step) {
      setStep(currentCategory.step);
    }
  }
  
  const isCurrentStepComplete = completionStatus[step] || false;

  // Enhanced navigation handlers with validation
  const handleNext = () => {
    if (isCurrentStepComplete && step < totalSteps) {
      nextStep();
    }
  };

  const handleSubmit = () => {
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
    console.error('No current category found', { 
      step, 
      categoriesLength: categories.length,
      questionsLength: questions.length,
      categories: categories.map(c => ({ name: c.name, step: c.step, questionCount: c.questions.length }))
    });
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-4 text-white">Registration Setup Required</h2>
            <p className="text-purple-200 mb-6">
              The registration form needs to be configured by an administrator. Please contact support or try again later.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Enhanced Step Indicator */}
        <EnhancedStepIndicator
          categories={categories}
          currentStep={step}
          completionStatus={completionStatus}
        />

        {/* Main Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* OAuth Welcome Message */}
              {isOAuthUser && step === 1 && (
                <div className="text-center mb-6 p-4 bg-green-900/30 rounded-lg border border-green-500/30">
                  <h3 className="text-lg font-semibold text-green-300 mb-2">Welcome!</h3>
                  <p className="text-green-200 text-sm">
                    Your social account has been connected. Please complete the registration to finish setting up your profile.
                  </p>
                </div>
              )}

              {/* Social Login for Step 1 */}
              {step === 1 && !isOAuthUser && (
                <div className="mb-6">
                  <SocialLogin />
                  <div className="relative my-6">
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
                  totalSteps={totalSteps}
                  isStepComplete={isCurrentStepComplete}
                  isSubmitting={isSubmitting}
                  onPrevious={prevStep}
                  onNext={handleNext}
                  onSubmit={handleSubmit}
                />
              </div>
            </form>
          </Form>
        </div>

        {/* Progress Summary */}
        <div className="mt-6 text-center text-sm text-white/60">
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