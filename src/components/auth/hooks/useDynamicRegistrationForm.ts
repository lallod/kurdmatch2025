import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLocationManager } from '@/components/my-profile/sections/location/useLocationManager';
import { getRegistrationQuestions } from '@/api/admin';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { createDynamicRegistrationSchema, DynamicRegistrationFormValues } from '../utils/dynamicRegistrationSchema';
import { getFormDefaultValues } from '../utils/formDefaultValues';
import { createEnhancedStepCategories } from '../utils/enhancedStepCategories';
import { mapFormDataToProfile } from '../utils/profileDataMapper';
import { generateAIBio } from '../utils/aiBioGenerator';

export const useDynamicRegistrationForm = () => {
  const { toast } = useToast();
  const { t } = useTranslations();
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
          title: t('common.error', 'Error'),
          description: t('reg.failed_load_form', 'Failed to load registration form. Please refresh the page.'),
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
          title: t('reg.incomplete_fields', 'Incomplete Fields'),
          description: t('reg.complete_required_fields', `Please complete all required fields: ${errorFields.join(', ')}`),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in nextStep:', error);
      toast({
        title: t('reg.validation_error', 'Validation Error'),
        description: t('reg.validation_error_desc', 'There was an error validating the form. Please try again.'),
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
      formData: Object.keys(data),
      allFormValues: data
    });
    
    console.log('📋 Enabled questions:', questions.map(q => ({
      id: q.id,
      profileField: q.profileField,
      enabled: q.enabled
    })));
    
    try {
      // Sign up user
      const { data: signUpData, error: signUpError } = await signUp(data.email, data.password);
      
      if (signUpError) {
        console.error('❌ Sign up error:', signUpError);
        toast({
          title: t('reg.registration_failed', 'Registration Failed'),
          description: signUpError.message,
          variant: "destructive",
        });
        return;
      }

      if (!signUpData?.user) {
        console.error('❌ No user returned from sign up');
        toast({
          title: t('reg.registration_failed', 'Registration Failed'), 
          description: t('reg.user_creation_failed', 'User creation failed. Please try again.'),
          variant: "destructive",
        });
        return;
      }

      const user = signUpData.user;
      console.log('✅ User created successfully:', user.id);

      // Generate AI bio before profile mapping
      const generatedBio = generateAIBio(data, questions);
      console.log('🤖 Generated bio:', generatedBio);

      // Add generated bio to form data
      const bioQuestion = questions.find(q => q.profileField === 'bio');
      const processedData = {
        ...data,
        ...(bioQuestion && { [bioQuestion.id]: generatedBio })
      };

      // Map form data to profile using the comprehensive mapper
      const profileData = mapFormDataToProfile(processedData, user.id, questions);
      console.log('📝 Profile data mapped:', profileData);

      // UPSERT profile - update if exists (from trigger), insert if not
      // This handles the case where handle_new_user() trigger already created a basic profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([profileData as any], { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (profileError) {
        console.error('❌ Profile creation error:', profileError);
        toast({
          title: t('reg.profile_creation_failed', 'Profile Creation Failed'),
          description: t('reg.profile_setup_failed', 'Your account was created but profile setup failed. Please complete your profile.'),
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

      // Clear OAuth registration flow flag if present
      sessionStorage.removeItem('oauth_registration_flow');

      toast({
        title: t('reg.registration_successful', 'Registration Successful!'),
        description: t('reg.welcome_profile_created', 'Welcome to KurdMatch! Your profile has been created.'),
      });

      // Wait for auth state to sync before navigation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to home or discovery feed
      navigate('/', { replace: true });
    } catch (error) {
      console.error('❌ Registration error:', error);
      toast({
        title: t('reg.registration_failed', 'Registration Failed'),
        description: error instanceof Error ? error.message : t('reg.unexpected_error', 'An unexpected error occurred. Please try again.'),
        variant: "destructive",
      });
    }
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
        title: t('reg.photo_upload_warning', 'Photo Upload Warning'),
        description: t('reg.photos_upload_later', "Some photos couldn't be uploaded. You can add them later."),
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