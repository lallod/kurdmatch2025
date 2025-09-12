import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { DynamicRegistrationFormValues } from '@/components/auth/utils/dynamicRegistrationSchema';
import DynamicFieldRenderer from './DynamicFieldRenderer';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/app/LoadingSpinner';
import PhotoUploadComponent from './PhotoUploadComponent';

interface DynamicRegistrationStepRendererProps {
  step: number;
  form: UseFormReturn<DynamicRegistrationFormValues>;
  location: string;
  locationLoading: boolean;
  questions: QuestionItem[];
}

const DynamicRegistrationStepRenderer: React.FC<DynamicRegistrationStepRendererProps> = ({
  step,
  form,
  location,
  locationLoading,
  questions
}) => {
  const getStepQuestions = (stepNumber: number) => {
    return questions.filter(q => {
      if (stepNumber === 1) {
        return ['sys_1', 'sys_2', 'sys_3'].includes(q.id); // email, password, confirmPassword
      }
      if (stepNumber === 2) {
        return q.category === 'Personal' || ['firstName', 'lastName', 'dateOfBirth', 'gender', 'height'].includes(q.profileField || '');
      }
      if (stepNumber === 3) {
        return q.profileField === 'location' || q.profileField === 'dream_vacation';
      }
      if (stepNumber === 4) {
        return q.profileField === 'photos' || q.id === 'sys_6';
      }
      return false;
    });
  };

  const stepQuestions = getStepQuestions(step);

  switch (step) {
    case 1:
      return (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-purple-200 mt-1">Set up your secure login credentials</p>
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="your.email@example.com" 
                    {...field}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
    
    case 2:
      return (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Tell us about yourself</h2>
            <p className="text-purple-200 mt-1">Basic information to create your profile</p>
          </div>
          {stepQuestions.map(question => (
            <DynamicFieldRenderer 
              key={question.id}
              question={question}
              form={form}
            />
          ))}
        </div>
      );
    
    case 3:
      return (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Location</h2>
            <p className="text-purple-200 mt-1">Where are you from?</p>
          </div>
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Current Location</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder={locationLoading ? "Detecting location..." : "Enter your city"}
                      {...field}
                      value={field.value || location}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                    {locationLoading && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <LoadingSpinner />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {stepQuestions.filter(q => q.profileField === 'dream_vacation').map(question => (
            <DynamicFieldRenderer 
              key={question.id}
              question={question}
              form={form}
            />
          ))}
        </div>
      );
    
    case 4:
      return (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Add Photos</h2>
            <p className="text-purple-200 mt-1">Show your best self</p>
          </div>
          
          <PhotoUploadComponent form={form} />
        </div>
      );
    
    default:
      return null;
  }
};

export default DynamicRegistrationStepRenderer;