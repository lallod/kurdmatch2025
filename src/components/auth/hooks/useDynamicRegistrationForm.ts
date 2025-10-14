import { useState, useEffect } from 'react';
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

  // Load questions and create form
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const enabledQuestions = await getRegistrationQuestions();
        const filteredQuestions = enabledQuestions.filter(q => q.enabled);
        setQuestions(filteredQuestions);
        
        // Create dynamic schema and form
        const schema = createDynamicRegistrationSchema(filteredQuestions);
        const defaultValues = getFormDefaultValues(filteredQuestions);
        
        form.reset(defaultValues);
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

  // Create form with dynamic schema
  const schema = createDynamicRegistrationSchema(questions);
  const defaultValues = getFormDefaultValues(questions);
  
  const form = useForm<DynamicRegistrationFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const { formState } = form;
  const isSubmitting = formState.isSubmitting;

  // Step navigation with validation
  const nextStep = async () => {
    try {
      // Get current step's field names for validation
      const stepFieldMap: Record<number, string[]> = {
        1: ['email', 'password', 'confirmPassword'],
        2: ['full_name', 'age', 'gender'],
        3: ['location', 'dreamVacation', 'height', 'body_type', 'kurdistan_region', 'ethnicity', 'religion', 'political_views', 'personality_type'],
        4: ['interests', 'hobbies', 'values'],
        5: ['dietary_preferences', 'smoking', 'drinking', 'sleep_schedule', 'have_pets', 'family_closeness', 'love_language', 'communication_style', 'ideal_date', 'relationship_goals', 'want_children', 'exercise_habits'],
        6: ['occupation', 'education', 'languages'],
        7: ['photos']
      };

      const fieldsToValidate = stepFieldMap[step] || [];
      
      // Get current step questions to check which fields are required
      const currentStepQuestions = questions.filter(q => {
        return fieldsToValidate.includes(q.id);
      });
      
      // Only validate required fields that exist in the current step
      const requiredFields = currentStepQuestions
        .filter(q => q.required)
        .map(q => q.id);
      
      // Trigger validation only for required fields in this step
      const isValid = requiredFields.length > 0 
        ? await form.trigger(requiredFields as any)
        : true;
      
      console.log('Step validation:', { 
        step, 
        isValid, 
        requiredFields,
        values: requiredFields.reduce((acc, field) => ({
          ...acc,
          [field]: form.getValues(field as any)
        }), {})
      });
      
      if (isValid) {
        const maxStep = 7; // Maximum number of steps
        if (step < maxStep) {
          setStep(step + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          
          if (!completedSteps.includes(step)) {
            setCompletedSteps([...completedSteps, step]);
          }
        }
      } else {
        toast({
          title: "Incomplete Fields",
          description: "Please complete all required fields before continuing.",
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

      navigate('/discovery');
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
        profile[question.profileField] = data[question.id];
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