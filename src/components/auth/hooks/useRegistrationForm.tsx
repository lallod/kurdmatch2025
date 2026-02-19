
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from '@/hooks/useTranslations';
import { useToast } from '@/hooks/use-toast';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { createDynamicSchema } from '../utils/formSchema';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { TablesInsert } from '@/integrations/supabase/types';
import { generateAIBio } from '../utils/aiBioGenerator';
import { handlePhotoUploads } from '../utils/photoUploadHandler';
import { mapFormDataToProfile } from '../utils/profileDataMapper';
import { getFormDefaultValues } from '../utils/formDefaultValues';

export const useRegistrationForm = (enabledQuestions: QuestionItem[], steps: any[]) => {
  const { toast } = useToast();
  const { t } = useTranslations();
  const { signUp } = useSupabaseAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const dynamicSchema = createDynamicSchema(enabledQuestions);
  type FormValues = typeof dynamicSchema._type;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: getFormDefaultValues(enabledQuestions),
    mode: 'onChange',
  });

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Check if this is an OAuth user (already authenticated)
      const { data: sessionData } = await supabase.auth.getSession();
      const isOAuthUser = sessionData?.session?.user && sessionStorage.getItem('oauth_registration_flow') === 'true';
      
      let userId: string;
      
      if (isOAuthUser) {
        // OAuth user - already authenticated, just complete profile
        userId = sessionData.session.user.id;
        // Completing profile for OAuth user
      } else {
        // Manual registration - create new account
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
        userId = signUpData.user.id;
      }

      // Handle photo uploads
      const { photoUrls, errors: photoErrors } = await handlePhotoUploads(data, userId, enabledQuestions);
      
      // Show photo upload errors if any
      if (photoErrors.length > 0) {
        console.warn('Photo upload errors:', photoErrors);
        toast({
          title: t('reg.photo_upload_warning', 'Photo Upload Warning'),
          description: t('reg.photos_failed_profile_created', `${photoErrors.length} photo(s) failed to upload. Your profile was still created successfully.`),
        });
      }

      // Generate AI bio if bio question exists
      const bioQuestion = enabledQuestions.find(q => q.profileField === 'bio');
      let processedData = { ...data };
      if (bioQuestion) {
        const generatedBio = generateAIBio(data, enabledQuestions);
        processedData[bioQuestion.id] = generatedBio;
      }
      
      // Prepare profile data with proper typing
      const profileInsertData = mapFormDataToProfile(processedData, userId, enabledQuestions);
      
      // Inserting profile data
      
      // Insert profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileInsertData as TablesInsert<'profiles'>);
      
      if (profileError) {
        console.error('Profile insert error:', profileError);
        throw profileError;
      }

      // Insert photos into separate photos table
      if (photoUrls.length > 0) {
        const photoRecords: TablesInsert<'photos'>[] = photoUrls.map((url, index) => ({
          profile_id: userId,
          url: url,
          is_primary: index === 0,
        }));
        
        const { error: photoInsertError } = await supabase
          .from('photos')
          .insert(photoRecords);
          
        if (photoInsertError) {
          console.error("Failed to save photos:", photoInsertError);
          // Let registration succeed even if photos fail
        }
      }

      // Clear OAuth registration flag
      sessionStorage.removeItem('oauth_registration_flow');

      if (isOAuthUser) {
        toast({
          title: t('reg.profile_complete', 'Profile Complete!'),
          description: t('reg.profile_completed_successfully', 'Your profile has been completed successfully.'),
        });
        navigate('/discovery');
      } else {
        toast({
          title: t('common.success', 'Success!'),
          description: t('reg.check_email_verify', 'Your account has been created. Please check your email to verify your account before logging in.'),
        });
        navigate('/auth');
      }

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: t('common.error', 'Error'),
        description: error.message || t('reg.failed_create_account', 'Failed to create account. Please try again.'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    // Moving to next step
    
    if (currentStep === steps.length - 1) {
      // On the photos step - check photos validation
      const photos = form.getValues('sys_6') || form.getValues('photos') || [];
      // Validating photos
      
      if (!Array.isArray(photos) || photos.length === 0) {
        form.setError('sys_6', { 
          type: 'manual', 
          message: 'Please upload at least one photo' 
        });
        // Photos validation failed
        return;
      }
    } else {
      // Validate current step fields
      const currentFields = steps[currentStep].questions
        .filter(q => q.profileField !== 'bio')
        .map(q => q.id);
      
      // Validating current step fields
      
      const isValid = await form.trigger(currentFields as any);
      // Step validation completed
      
      if (!isValid) {
        // Form validation failed
        return;
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      // Successfully moved to next step
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      // Moved back to previous step
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
