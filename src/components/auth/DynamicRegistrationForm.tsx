
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
  
  // Get initial form values
  const getDefaultValues = () => {
    const defaults: Record<string, string> = {};
    
    questions.forEach(q => {
      if (q.enabled) {
        // Skip AI-generated fields (like bio) in form values
        if (q.profileField !== 'bio') {
          defaults[q.id] = '';
        }
      }
    });
    
    return defaults;
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange',
  });

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Generate an AI bio for the user
      const bioQuestion = questions.find(q => q.profileField === 'bio');
      let processedData = { ...data };
      
      if (bioQuestion) {
        // In a real app, this would call an AI service to generate bio
        // For now, simulate an AI-generated bio
        const generatedBio = generateAIBio(data);
        
        // Add the AI-generated bio to the form data
        processedData[bioQuestion.id] = generatedBio;
      }
      
      // In a real app, this would connect to an auth service
      console.log('Registration form submitted with AI bio:', processedData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success!",
        description: "Your account has been created successfully with an AI-generated bio.",
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
    // Get field names for the current step (excluding AI-generated fields)
    const currentFields = steps[currentStep].questions
      .filter(q => q.profileField !== 'bio')
      .map(q => q.id);
    
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

  // Simulate AI bio generation based on form data
  const generateAIBio = (formData: Record<string, string>) => {
    // Find questions for relevant fields to use in bio generation
    const firstNameQ = questions.find(q => q.profileField === 'firstName');
    const occupationQ = questions.find(q => q.profileField === 'occupation');
    const locationQ = questions.find(q => q.profileField === 'location');
    
    // Get values if questions exist
    const firstName = firstNameQ ? formData[firstNameQ.id] || 'there' : 'there';
    const occupation = occupationQ ? formData[occupationQ.id] : '';
    const location = locationQ ? formData[locationQ.id] : '';
    
    // Generate a basic bio template
    let bio = `Hi, I'm ${firstName}`;
    
    if (occupation) {
      bio += `, working as a ${occupation}`;
    }
    
    if (location) {
      bio += ` based in ${location}`;
    }
    
    bio += `. I'm excited to join this community and connect with like-minded people!`;
    
    return bio;
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
