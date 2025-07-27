
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLocationManager } from '@/components/my-profile/sections/location/useLocationManager';
import { useAutoSave } from '@/hooks/useAutoSave';
import { registrationSchema, RegistrationFormValues } from '../utils/registrationSchema';
import { registrationSteps } from '../utils/registrationSteps';

export const useRegistrationFormLogic = () => {
  const { toast } = useToast();
  const { signUp } = useSupabaseAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [hasLoadedSavedData, setHasLoadedSavedData] = useState(false);
  
  // Ensure proper default values for all fields
  const defaultValues: RegistrationFormValues = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    height: '',
    bornIn: '',
    languages: [], // Ensure this is always an array
    occupation: '',
    location: '',
    dreamVacation: '',
    photos: [], // Ensure this is always an array
  };

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { formState } = form;
  const isSubmitting = formState.isSubmitting;

  // Auto-save integration
  const { loadSavedData, clearSavedData, getLastSavedTime } = useAutoSave({
    form,
    currentStep: step,
    completedSteps,
    isSubmitting,
  });

  // Location management for step 3
  const { location, handleLocationDetection, isLoading: locationLoading } = useLocationManager('');

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Load saved data on component mount
  useEffect(() => {
    if (!hasLoadedSavedData) {
      try {
        console.log('Loading saved data...');
        const savedData = loadSavedData();
        if (savedData) {
          console.log('Saved data found:', savedData);
          // Ensure languages field is always an array
          const processedData = {
            ...savedData.formData,
            languages: Array.isArray(savedData.formData.languages) ? savedData.formData.languages : [],
            photos: Array.isArray(savedData.formData.photos) ? savedData.formData.photos : []
          };
          
          console.log('Processed data:', processedData);
          
          // Reset form with processed data
          form.reset(processedData);
          setStep(savedData.currentStep);
          setCompletedSteps(savedData.completedSteps);
          
          const lastSavedTime = getLastSavedTime();
          if (lastSavedTime) {
            const timeAgo = Math.round((Date.now() - lastSavedTime) / (1000 * 60));
            toast({
              title: "Welcome back!",
              description: `Resuming your registration from ${timeAgo} minute${timeAgo !== 1 ? 's' : ''} ago.`,
            });
          }
        } else {
          console.log('No saved data found, using defaults');
          form.reset(defaultValues);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        // Ensure form has proper defaults even if loading fails
        form.reset(defaultValues);
      }
      setHasLoadedSavedData(true);
    }
  }, [hasLoadedSavedData, loadSavedData, getLastSavedTime, toast, form]);

  // Auto-detect location when reaching step 3
  useEffect(() => {
    if (step === 3 && !form.getValues('location')) {
      handleLocationDetection();
    }
  }, [step]);

  // Update form when location is detected
  useEffect(() => {
    if (location && step === 3) {
      form.setValue('location', location, { shouldValidate: true });
    }
  }, [location, step, form]);

  // Prevent accidental navigation away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (step > 1 && !isSubmitting) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step, isSubmitting]);

  const validateStep = async (stepIndex: number) => {
    try {
      const currentStepFields = registrationSteps[stepIndex - 1].fields;
      console.log('Validating step', stepIndex, 'with fields:', currentStepFields);
      
      const result = await form.trigger(currentStepFields);
      console.log('Validation result:', result);
      
      if (result) {
        if (!completedSteps.includes(stepIndex)) {
          setCompletedSteps([...completedSteps, stepIndex]);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during validation:', error);
      return false;
    }
  };

  const nextStep = async () => {
    try {
      const isValid = await validateStep(step);
      if (isValid && step < registrationSteps.length) {
        setStep(step + 1);
      }
    } catch (error) {
      console.error('Error in nextStep:', error);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = async (data: RegistrationFormValues) => {
    try {
      console.log('Registration form submitted:', data);
      
      const { data: signUpData, error: signUpError } = await signUp(data.email, data.password);
      if (signUpError) throw signUpError;
      
      if (!signUpData.user) throw new Error("User not created.");
      
      const userId = signUpData.user.id;
      
      // Create profile data
      const profileData = {
        id: userId,
        name: `${data.firstName} ${data.lastName}`,
        age: (() => {
          const birthDate = new Date(data.dateOfBirth);
          if (!isNaN(birthDate.getTime())) {
            const ageDifMs = Date.now() - birthDate.getTime();
            const ageDate = new Date(ageDifMs);
            return Math.abs(ageDate.getUTCFullYear() - 1970);
          }
          return 18;
        })(),
        gender: data.gender,
        height: data.height,
        born_in: data.bornIn,
        languages: data.languages,
        occupation: data.occupation,
        location: data.location,
        dream_vacation: data.dreamVacation || null,
      };
      
      console.log('Creating profile:', profileData);
      
      // Insert profile into database
      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData);
      
      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create profile: ' + profileError.message);
      }
      
      // Handle photo uploads if any
      if (data.photos && data.photos.length > 0) {
        const photoUrls: string[] = [];
        const photoErrors: string[] = [];
        
        for (const [index, fileDataUrl] of data.photos.entries()) {
          try {
            // Validate data URL format
            if (!fileDataUrl.startsWith('data:image/')) {
              const error = `Photo ${index + 1}: Invalid image format`;
              console.error(error);
              photoErrors.push(error);
              continue;
            }

            const response = await fetch(fileDataUrl);
            const blob = await response.blob();
            
            // Validate blob size
            if (blob.size === 0) {
              const error = `Photo ${index + 1}: Empty file`;
              console.error(error);
              photoErrors.push(error);
              continue;
            }
            
            const fileExt = blob.type.split('/')[1] || 'jpg';
            const fileName = `${userId}/profile_${index + 1}_${Date.now()}.${fileExt}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('profile-photos')
              .upload(fileName, blob, { 
                cacheControl: '3600', 
                upsert: false, 
                contentType: blob.type 
              });

            if (uploadError) {
              const error = `Photo ${index + 1} upload failed: ${uploadError.message}`;
              console.error(error);
              photoErrors.push(error);
              continue;
            }

            const { data: urlData } = supabase.storage
              .from('profile-photos')
              .getPublicUrl(uploadData.path);
            
            photoUrls.push(urlData.publicUrl);
            console.log(`Photo ${index + 1} uploaded successfully`);
          } catch (error) {
            const errorMsg = `Error processing photo ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`;
            console.error(errorMsg);
            photoErrors.push(errorMsg);
            continue;
          }
        }
        
        // Show photo upload errors if any
        if (photoErrors.length > 0) {
          console.warn('Photo upload errors:', photoErrors);
          toast({
            title: "Photo Upload Warning",
            description: `${photoErrors.length} photo(s) failed to upload. Your profile was still created successfully.`,
          });
        }
        
        // Insert photos into photos table
        if (photoUrls.length > 0) {
          const photoRecords = photoUrls.map((url, index) => ({
            profile_id: userId,
            url: url,
            is_primary: index === 0,
          }));
          
          const { error: photoInsertError } = await supabase
            .from('photos')
            .insert(photoRecords);
            
          if (photoInsertError) {
            console.error("Failed to save photos:", photoInsertError);
            toast({
              title: "Photo Storage Error",
              description: "Photos uploaded but failed to save to database",
            });
          } else {
            console.log(`${photoUrls.length} photos saved successfully`);
          }
        }
      }
      
      clearSavedData();
      
      toast({
        title: "Success!",
        description: "Your account has been created. Please check your email to verify your account.",
      });

      navigate('/auth');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    step,
    setStep,
    completedSteps,
    isSubmitting,
    location,
    locationLoading,
    nextStep,
    prevStep,
    onSubmit,
  };
};
