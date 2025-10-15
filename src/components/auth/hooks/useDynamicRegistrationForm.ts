import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLocationManager } from '@/components/my-profile/sections/location/useLocationManager';
import { getRegistrationQuestions } from '@/api/admin';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { createDynamicRegistrationSchema, DynamicRegistrationFormValues } from '../utils/dynamicRegistrationSchema';
import { getFormDefaultValues } from '../utils/formDefaultValues';
import { createEnhancedStepCategories } from '../utils/enhancedStepCategories';

export const useDynamicRegistrationForm = () => {
  const { toast } = useToast();
  const { signUp } = useSupabaseAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Location management for step 3
  const { location, handleLocationDetection, isLoading: locationLoading } = useLocationManager('');

  // Create form schema and values dynamically based on questions
  const schema = React.useMemo(() => 
    createDynamicRegistrationSchema(questions), 
    [questions]
  );
  
  const defaultValues = React.useMemo(() => 
    getFormDefaultValues(questions), 
    [questions]
  );
  
  const form = useForm<DynamicRegistrationFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  // Load questions on mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const enabledQuestions = await getRegistrationQuestions();
        const filteredQuestions = enabledQuestions.filter(q => q.enabled);
        setQuestions(filteredQuestions);
        
        // Reset form with new default values once questions are loaded
        const newDefaultValues = getFormDefaultValues(filteredQuestions);
        form.reset(newDefaultValues);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading registration questions:', error);
        toast({
          title: "Error",
          description: "Failed to load registration form. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    loadQuestions();
  }, []);

  const { formState } = form;
  const isSubmitting = formState.isSubmitting;

  // Step navigation with validation
  const nextStep = async () => {
    try {
      // Create dynamic step categories to get current step's questions
      const categories = createEnhancedStepCategories(questions);
      const currentCategory = categories.find(cat => cat.step === step);
      
      if (!currentCategory) {
        console.error('No category found for step:', step);
        return;
      }
      
      // Get all required field IDs from current step
      const requiredFields = currentCategory.questions
        .filter(q => q.required)
        .map(q => q.id);
      
      console.log('Step validation check:', { 
        step, 
        stepName: currentCategory.name,
        requiredFields,
        totalQuestions: currentCategory.questions.length
      });
      
      // Trigger validation for required fields
      const isValid = requiredFields.length > 0 
        ? await form.trigger(requiredFields as any)
        : true;
      
      // Get form values for required fields to log
      const fieldValues = requiredFields.reduce((acc, field) => ({
        ...acc,
        [field]: form.getValues(field as any)
      }), {});
      
      console.log('Validation result:', { 
        isValid, 
        fieldValues,
        errors: form.formState.errors
      });
      
      if (isValid) {
        // Calculate max step dynamically
        const maxStep = categories.length;
        if (step < maxStep) {
          setStep(step + 1);
          
          // Scroll to top immediately
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
          }, 0);
          
          if (!completedSteps.includes(step)) {
            setCompletedSteps([...completedSteps, step]);
          }
        }
      } else {
        const errorFields = Object.keys(form.formState.errors);
        toast({
          title: "Incomplete Fields",
          description: `Please complete all required fields: ${errorFields.join(', ')}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in nextStep:', error);
      toast({
        title: "Validation Error",
        description: "There was an error validating the form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      
      // Scroll to top immediately
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 0);
    }
  };

  // Form submission
  const onSubmit = async (data: DynamicRegistrationFormValues) => {
    console.log('🚀 Starting registration submission...', { 
      email: data.email,
      hasPhotos: data.photos?.length || 0,
      formData: Object.keys(data)
    });
    
    try {
      // Sign up user
      const { error: signUpError, user } = await signUp(data.email, data.password);
      
      if (signUpError) {
        console.error('❌ Sign up error:', signUpError);
        toast({
          title: "Registration Failed",
          description: signUpError.message,
          variant: "destructive",
        });
        return;
      }

      if (!user) {
        console.error('❌ No user returned from sign up');
        toast({
          title: "Registration Failed", 
          description: "User creation failed. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ User created successfully:', user.id);

      // Map form data to profile
      const profileData = mapFormDataToProfile(data, questions);
      console.log('📝 Profile data mapped:', profileData);
      
      // Ensure required fields are present
      const completeProfileData = {
        ...profileData,
        age: profileData.age || 18,
        name: profileData.name || 'User',
        location: profileData.location || 'Unknown'
      };

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          ...completeProfileData
        });

      if (profileError) {
        console.error('❌ Profile creation error:', profileError);
        toast({
          title: "Profile Creation Failed",
          description: "Your account was created but profile setup failed. Please complete your profile.",
          variant: "destructive",
        });
        navigate('/complete-profile');
        return;
      }

      console.log('✅ Profile created successfully');

      // Handle photo uploads
      if (data.photos && data.photos.length > 0) {
        console.log(`📸 Uploading ${data.photos.length} photos...`);
        await handlePhotoUploads(data.photos, user.id);
      }

      console.log('🎉 Registration completed successfully!');

      toast({
        title: "Registration Successful!",
        description: "Welcome to KurdMatch! Your profile has been created.",
      });

      // Wait for auth state to sync before navigation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to discovery feed
      navigate('/discovery', { replace: true });
    } catch (error) {
      console.error('❌ Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const mapFormDataToProfile = (data: DynamicRegistrationFormValues, questions: QuestionItem[]) => {
    const profile: Record<string, any> = {};
    
    questions.forEach(question => {
      if (question.profileField && data[question.id] !== undefined) {
        let value = data[question.id];
        
        // Convert single-selection arrays to strings for database
        if (Array.isArray(value) && (question.id === 'occupation' || question.id === 'education')) {
          value = value.length > 0 ? value[0] : null;
        }
        
        profile[question.profileField] = value;
      }
    });

    // Ensure required fields have values
    if (!profile.name && (data.firstName || data.lastName)) {
      profile.name = `${data.firstName || ''} ${data.lastName || ''}`.trim();
    }
    
    if (!profile.age && data.dateOfBirth) {
      const birthDate = new Date(data.dateOfBirth);
      const today = new Date();
      profile.age = today.getFullYear() - birthDate.getFullYear();
    }

    return profile;
  };

  const handlePhotoUploads = async (photoDataUrls: string[], userId: string) => {
    try {
      const uploadPromises = photoDataUrls.map(async (dataUrl, index) => {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const fileName = `photo-${index + 1}-${Date.now()}.jpg`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filePath, blob);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath);

        return {
          profile_id: userId,
          url: publicUrl,
          is_primary: index === 0
        };
      });

      const photoRecords = await Promise.all(uploadPromises);
      
      const { error: insertError } = await supabase
        .from('photos')
        .insert(photoRecords);

      if (insertError) throw insertError;
    } catch (error) {
      console.error('Photo upload error:', error);
      toast({
        title: "Photo Upload Warning",
        description: "Some photos couldn't be uploaded. You can add them later.",
        variant: "destructive",
      });
    }
  };

  return {
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
  };
};