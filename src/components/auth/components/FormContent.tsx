
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import FieldRenderer from './FieldRenderer';
import PhotoUploadStep from './PhotoUploadStep';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';

interface FormContentProps {
  currentStep: number;
  steps: Array<{ name: string; questions: QuestionItem[] }>;
  form: UseFormReturn<any>;
}

const FormContent = ({ currentStep, steps, form }: FormContentProps) => {
  // Display photo upload step for the last step, otherwise display question fields
  if (currentStep === steps.length - 1) {
    return <PhotoUploadStep form={form} />;
  }

  // Display the questions for the current step
  return (
    <div className="space-y-6">
      {steps[currentStep]?.questions.map((question) => (
        <FieldRenderer 
          key={question.id} 
          question={question} 
          form={form} 
        />
      ))}
    </div>
  );
};

export default FormContent;
