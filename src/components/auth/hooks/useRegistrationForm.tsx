import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { createDynamicSchema } from '../utils/formSchema';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const useRegistrationForm = (enabledQuestions: QuestionItem[], steps: any[]) => {
  const { toast } = useToast();
  const { signUp } = useSupabaseAuth();
  const navigate = useNavigate();
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
      const emailQuestion = enabledQuestions.find(q => q.profileField === 'email');
      const passwordQuestion = enabledQuestions.find(q => q.profileField === 'password');
      if (!emailQuestion || !passwordQuestion) {
        throw new Error("Email or password field is missing in registration form configuration.");
      }
      const email = data[emailQuestion.id];
      const password = data[passwordQuestion.id];

      const { data: signUpData, error: signUpError } = await signUp(email, password);
      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error("User not created.");
      const userId = signUpData.user.id;

      const photoQuestion = enabledQuestions.find(q => q.profileField === 'photos');
      const photoUrls: string[] = [];
      if (photoQuestion && data[photoQuestion.id] && Array.isArray(data[photoQuestion.id])) {
        const photoFiles = data[photoQuestion.id] as string[]; // These are data URLs

        for (const [index, fileDataUrl] of photoFiles.entries()) {
          const response = await fetch(fileDataUrl);
          const blob = await response.blob();
          const fileExt = blob.type.split('/')[1];
          const fileName = `${userId}/profile_${index + 1}_${Date.now()}.${fileExt}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('profile-photos')
            .upload(fileName, blob, { cacheControl: '3600', upsert: false, contentType: blob.type });

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage.from('profile-photos').getPublicUrl(uploadData.path);
          photoUrls.push(urlData.publicUrl);
        }
      }

      const bioQuestion = enabledQuestions.find(q => q.profileField === 'bio');
      let processedData = { ...data };
      if (bioQuestion) {
        const generatedBio = generateAIBio(data, enabledQuestions);
        processedData[bioQuestion.id] = generatedBio;
      }
      
      const profileData: Record<string, any> = {
        id: userId,
        email: email,
        updated_at: new Date().toISOString(),
      };

      enabledQuestions.forEach(q => {
        if (q.profileField && q.profileField !== 'email' && q.profileField !== 'password') {
          const formValue = processedData[q.id];
          if (formValue !== undefined) {
             if (q.profileField === 'photos') {
              profileData.photos = photoUrls;
            } else if (q.profileField === 'full_name') {
              profileData.name = formValue; // Map form field to 'name' column in DB
            } else if (q.profileField === 'date_of_birth' && typeof formValue === 'string' && formValue) {
              const birthDate = new Date(formValue);
              if (!isNaN(birthDate.getTime())) {
                const ageDifMs = Date.now() - birthDate.getTime();
                const ageDate = new Date(ageDifMs);
                profileData.age = Math.abs(ageDate.getUTCFullYear() - 1970);
              }
              // Also store the original date of birth string
              profileData.date_of_birth = formValue;
            } else {
              profileData[q.profileField] = formValue;
            }
          }
        }
      });
      
      // Ensure required fields have defaults to prevent DB errors if not in form
      if (!profileData.name) {
        profileData.name = "New User";
      }
      if (profileData.age === undefined) {
        profileData.age = 18; // Default age if not calculable
      }
      if (!profileData.location) {
        profileData.location = "Not specified";
      }
      
      const { error: profileError } = await supabase.from('profiles').upsert(profileData);
      if (profileError) throw profileError;

      toast({
        title: "Success!",
        description: "Your account has been created. Please check your email to verify your account before logging in.",
      });

      navigate('/auth');

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
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
  const fullNameQ = questions.find(q => q.profileField === 'full_name');
  const occupationQ = questions.find(q => q.profileField === 'occupation');
  const locationQ = questions.find(q => q.profileField === 'location');
  const interestsQ = questions.find(q => q.profileField === 'interests');
  const relationshipGoalsQ = questions.find(q => q.profileField === 'relationshipGoals');
  
  const fullName = fullNameQ ? formData[fullNameQ.id] || '' : '';
  const firstName = fullName.split(' ')[0] || 'there';

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
