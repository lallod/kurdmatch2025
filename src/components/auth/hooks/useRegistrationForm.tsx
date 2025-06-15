
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { createDynamicSchema } from '../utils/formSchema';

export const useRegistrationForm = (enabledQuestions: QuestionItem[], steps: any[]) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const dynamicSchema = createDynamicSchema(enabledQuestions);
  type FormValues = typeof dynamicSchema._type;
  
  const getDefaultValues = () => {
    const defaults: Record<string, any> = {};
    
    // Always set photos as an empty array
    defaults['sys_6'] = [];
    defaults['photos'] = [];
    
    enabledQuestions.forEach(q => {
      console.log(`Setting default for question ${q.id}: fieldType=${q.fieldType}, profileField=${q.profileField}`);
      
      if (q.profileField !== 'bio') {
        if (q.fieldType === 'multi-select') {
          defaults[q.id] = [];
        } else if (q.fieldType === 'checkbox') {
          defaults[q.id] = 'false';
        } else if (q.profileField === 'photos') {
          defaults[q.id] = [];
        } else {
          defaults[q.id] = '';
        }
      }
    });
    
    console.log('Form default values:', defaults);
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
    console.log(`Attempting to go from step ${currentStep} to ${currentStep + 1}`);
    console.log('Current form values:', form.getValues());
    
    if (currentStep === steps.length - 1) {
      // On the photos step - check photos validation
      const photos = form.getValues('sys_6') || form.getValues('photos') || [];
      console.log('Photos validation:', photos);
      
      if (!Array.isArray(photos) || photos.length === 0) {
        form.setError('sys_6', { 
          type: 'manual', 
          message: 'Please upload at least one photo' 
        });
        console.log('Photos validation failed');
        return;
      }
    } else {
      // Validate current step fields
      const currentFields = steps[currentStep].questions
        .filter(q => q.profileField !== 'bio')
        .map(q => q.id);
      
      console.log('Validating fields for current step:', currentFields);
      
      const isValid = await form.trigger(currentFields as any);
      console.log('Step validation result:', isValid);
      
      if (!isValid) {
        console.log('Form errors:', form.formState.errors);
        return;
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      console.log(`Successfully moved to step ${currentStep + 1}`);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      console.log(`Moved back to step ${currentStep - 1}`);
    }
  };

  return {
    form,
    isSubmitting,
    currentStep,
    setCurrentStep,
    handleSubmit,
    nextStep,
    prevStep
  };
};

const generateAIBio = (formData: Record<string, any>, questions: QuestionItem[]) => {
  const firstNameQ = questions.find(q => q.profileField === 'firstName');
  const occupationQ = questions.find(q => q.profileField === 'occupation');
  const locationQ = questions.find(q => q.profileField === 'location');
  const interestsQ = questions.find(q => q.profileField === 'interests');
  const relationshipGoalsQ = questions.find(q => q.profileField === 'relationshipGoals');
  
  const firstName = firstNameQ ? formData[firstNameQ.id] || 'there' : 'there';
  const occupation = occupationQ ? formData[occupationQ.id] : '';
  const location = locationQ ? formData[locationQ.id] : '';
  const interests = interestsQ ? (Array.isArray(formData[interestsQ.id]) ? formData[interestsQ.id].join(', ') : formData[interestsQ.id]) : '';
  const relationshipGoals = relationshipGoalsQ ? formData[relationshipGoalsQ.id] : '';
  
  let bio = `Hi, I'm ${firstName}`;
  
  if (occupation) {
    bio += `, working as a ${occupation}`;
  }
  
  if (location) {
    bio += ` based in ${location}`;
  }
  
  bio += `. `;
  
  if (interests) {
    bio += `I enjoy ${interests}. `;
  }
  
  if (relationshipGoals) {
    bio += `I'm looking for ${relationshipGoals}. `;
  }
  
  bio += `I'm excited to connect with like-minded people!`;
  
  return bio;
};
