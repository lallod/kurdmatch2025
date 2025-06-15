
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
    const defaults: Record<string, any> = {
      photos: []
    };
    
    enabledQuestions.forEach(q => {
      if (q.profileField !== 'bio') {
        if (q.fieldType === 'multi-select') {
          defaults[q.id] = [];
        } else {
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
