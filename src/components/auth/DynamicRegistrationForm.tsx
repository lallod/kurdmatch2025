
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { initialQuestions } from '@/pages/SuperAdmin/components/registration-questions/data/sampleQuestions';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { createDynamicSchema } from './utils/formSchema';
import StepIndicator from './components/StepIndicator';
import FormNavigation from './components/FormNavigation';
import FieldRenderer from './components/FieldRenderer';

const DynamicRegistrationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions);
  
  // Group questions by registration step
  const steps = [
    { name: 'Account', questions: questions.filter(q => q.enabled && q.registrationStep === 'Account') },
    { name: 'Personal', questions: questions.filter(q => q.enabled && q.registrationStep === 'Personal') },
    { name: 'Profile', questions: questions.filter(q => q.enabled && q.registrationStep === 'Profile') },
    { name: 'Preferences', questions: questions.filter(q => q.enabled && q.registrationStep === 'Preferences') }
  ].filter(step => step.questions.length > 0);
  
  // Create dynamic schema
  const dynamicSchema = createDynamicSchema(questions);
  type FormValues = typeof dynamicSchema._type;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: questions.reduce((acc, q) => {
      if (q.enabled) {
        acc[q.id] = '';
      }
      return acc;
    }, {} as Record<string, string>),
    mode: 'onChange',
  });

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would connect to an auth service
      console.log('Registration form submitted:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success!",
        description: "Your account has been created successfully.",
      });
      
      // Would typically redirect to login page or dashboard
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    // Get field names for the current step
    const currentFields = steps[currentStep].questions.map(q => q.id);
    
    // Validate only the fields in the current step
    const isValid = await form.trigger(currentFields as any);
    
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <StepIndicator 
          steps={steps} 
          currentStep={currentStep} 
          setCurrentStep={setCurrentStep} 
        />
        
        <div className="space-y-4">
          {steps[currentStep]?.questions.map((question) => (
            <FieldRenderer 
              key={question.id} 
              question={question} 
              form={form} 
            />
          ))}
        </div>
        
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
