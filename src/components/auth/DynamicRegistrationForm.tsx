
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { createDynamicSchema } from './utils/formSchema';
import StepIndicator from './components/StepIndicator';
import FormNavigation from './components/FormNavigation';
import FieldRenderer from './components/FieldRenderer';
import { systemQuestions } from '@/pages/SuperAdmin/components/registration-questions/data/systemQuestions';
import { initialQuestions } from '@/pages/SuperAdmin/components/registration-questions/data/sampleQuestions';

const DynamicRegistrationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Combine system questions with custom questions (in a real app, this would come from an API)
  const [questions, setQuestions] = useState<QuestionItem[]>([...systemQuestions, ...initialQuestions]);
  
  // Filter only enabled questions
  const enabledQuestions = questions.filter(q => q.enabled);
  
  // Define the 6 steps based on categories in Super Admin dashboard
  const stepCategories = [
    { name: 'Account', category: 'Account' },
    { name: 'Basics', category: 'Basics' },
    { name: 'Lifestyle', category: 'Lifestyle' },
    { name: 'Beliefs', category: 'Beliefs' },
    { name: 'Physical', category: 'Physical' },
    { name: 'Preferences', category: 'Preferences' }
  ];
  
  // Group questions by category for the 6 steps
  const steps = stepCategories.map(step => {
    return {
      name: step.name,
      questions: enabledQuestions.filter(q => {
        if (step.category === 'Account') {
          return q.registrationStep === 'Account';
        }
        return q.category === step.name;
      })
    };
  }).filter(step => step.questions.length > 0);
  
  // Create dynamic schema
  const dynamicSchema = createDynamicSchema(enabledQuestions);
  type FormValues = typeof dynamicSchema._type;
  
  // Get initial form values
  const getDefaultValues = () => {
    const defaults: Record<string, string> = {};
    
    enabledQuestions.forEach(q => {
      // Skip AI-generated fields (like bio) in form values
      if (q.profileField !== 'bio') {
        defaults[q.id] = '';
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
      // Generate an AI bio for the user if bio question exists
      const bioQuestion = enabledQuestions.find(q => q.profileField === 'bio');
      let processedData = { ...data };
      
      if (bioQuestion) {
        // In a real app, this would call an AI service to generate bio
        const generatedBio = generateAIBio(data, enabledQuestions);
        
        // Add the AI-generated bio to the form data
        processedData[bioQuestion.id] = generatedBio;
      }
      
      // Remove password from console log in real apps
      const dataForLogging = { ...processedData };
      if ('password' in dataForLogging) {
        dataForLogging.password = '********';
      }
      console.log('Registration form submitted with data:', dataForLogging);
      
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
  const generateAIBio = (formData: Record<string, string>, questions: QuestionItem[]) => {
    // Find questions for relevant fields to use in bio generation
    const firstNameQ = questions.find(q => q.profileField === 'firstName');
    const occupationQ = questions.find(q => q.profileField === 'occupation');
    const locationQ = questions.find(q => q.profileField === 'location');
    const hobbiesQ = questions.find(q => q.profileField === 'exerciseHabits');
    const relationshipGoalsQ = questions.find(q => q.profileField === 'relationshipGoals');
    
    // Get values if questions exist
    const firstName = firstNameQ ? formData[firstNameQ.id] || 'there' : 'there';
    const occupation = occupationQ ? formData[occupationQ.id] : '';
    const location = locationQ ? formData[locationQ.id] : '';
    const hobbies = hobbiesQ ? formData[hobbiesQ.id] : '';
    const relationshipGoals = relationshipGoalsQ ? formData[relationshipGoalsQ.id] : '';
    
    // Generate a more comprehensive bio template
    let bio = `Hi, I'm ${firstName}`;
    
    if (occupation) {
      bio += `, working as a ${occupation}`;
    }
    
    if (location) {
      bio += ` based in ${location}`;
    }
    
    bio += `. `;
    
    if (hobbies) {
      bio += `I enjoy ${hobbies}. `;
    }
    
    if (relationshipGoals) {
      bio += `I'm looking for ${relationshipGoals}. `;
    }
    
    bio += `I'm excited to connect with like-minded people!`;
    
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
        
        <div className="space-y-6">
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
