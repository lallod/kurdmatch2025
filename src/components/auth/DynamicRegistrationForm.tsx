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
import PhotoUploadStep from './components/PhotoUploadStep';
import { systemQuestions } from '@/pages/SuperAdmin/components/registration-questions/data/systemQuestions';
import { initialQuestions } from '@/pages/SuperAdmin/components/registration-questions/data/sampleQuestions';

const DynamicRegistrationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const [questions, setQuestions] = useState<QuestionItem[]>([...systemQuestions, ...initialQuestions]);
  
  const enabledQuestions = questions.filter(q => q.enabled);
  
  const stepCategories = [
    { name: 'Account', category: 'Account' },
    { name: 'Basics', category: 'Basics' },
    { name: 'Lifestyle', category: 'Lifestyle' },
    { name: 'Beliefs', category: 'Beliefs' },
    { name: 'Physical', category: 'Physical' },
    { name: 'Preferences', category: 'Preferences' },
    { name: 'Photos', category: 'Photos' }
  ];
  
  const steps = stepCategories.map(step => {
    if (step.category === 'Photos') {
      return {
        name: step.name,
        questions: []
      };
    }
    
    return {
      name: step.name,
      questions: enabledQuestions.filter(q => {
        if (step.category === 'Account') {
          return q.registrationStep === 'Account';
        } else if (step.category === 'Basics') {
          return q.category === step.name || q.registrationStep === 'Personal';
        } else if (step.category === 'Lifestyle' || step.category === 'Physical' || step.category === 'Beliefs' || step.category === 'Preferences') {
          return q.category === step.name && (q.registrationStep === 'Profile' || q.registrationStep === 'Preferences');
        }
        return q.category === step.name;
      })
    };
  }).filter(step => step.questions.length > 0 || step.name === 'Photos');
  
  const dynamicSchema = createDynamicSchema(enabledQuestions);
  type FormValues = typeof dynamicSchema._type;
  
  const getDefaultValues = () => {
    const defaults: Record<string, any> = {
      photos: []
    };
    
    enabledQuestions.forEach(q => {
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
      const bioQuestion = enabledQuestions.find(q => q.profileField === 'bio');
      let processedData = { ...data };
      
      if (bioQuestion) {
        const generatedBio = generateAIBio(data, enabledQuestions);
        processedData[bioQuestion.id] = generatedBio;
      }
      
      const dataForLogging = { ...processedData };
      if ('password' in dataForLogging) {
        dataForLogging.password = '********';
      }
      console.log('Registration form submitted with data:', dataForLogging);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success!",
        description: "Your account has been created successfully.",
      });
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
    if (currentStep === steps.length - 1) {
      const photos = form.getValues('photos') || [];
      if (!Array.isArray(photos) || photos.length === 0) {
        form.setError('photos', { 
          type: 'manual', 
          message: 'Please upload at least one photo' 
        });
        return;
      }
    } else {
      const currentFields = steps[currentStep].questions
        .filter(q => q.profileField !== 'bio')
        .map(q => q.id);
      
      const isValid = await form.trigger(currentFields as any);
      
      if (!isValid) return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const generateAIBio = (formData: Record<string, string>, questions: QuestionItem[]) => {
    const firstNameQ = questions.find(q => q.profileField === 'firstName');
    const occupationQ = questions.find(q => q.profileField === 'occupation');
    const locationQ = questions.find(q => q.profileField === 'location');
    const hobbiesQ = questions.find(q => q.profileField === 'exerciseHabits');
    const relationshipGoalsQ = questions.find(q => q.profileField === 'relationshipGoals');
    
    const firstName = firstNameQ ? formData[firstNameQ.id] || 'there' : 'there';
    const occupation = occupationQ ? formData[occupationQ.id] : '';
    const location = locationQ ? formData[locationQ.id] : '';
    const hobbies = hobbiesQ ? formData[hobbiesQ.id] : '';
    const relationshipGoals = relationshipGoalsQ ? formData[relationshipGoalsQ.id] : '';
    
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
          {currentStep === steps.length - 1 ? (
            <PhotoUploadStep form={form} />
          ) : (
            steps[currentStep]?.questions.map((question) => (
              <FieldRenderer 
                key={question.id} 
                question={question} 
                form={form} 
              />
            ))
          )}
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
