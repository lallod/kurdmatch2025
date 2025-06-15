
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
  const currentStepInfo = steps[currentStep];

  // The last step is always photos, based on useStepCategories
  if (currentStep === steps.length - 1) {
    const photoQuestion = currentStepInfo?.questions.find(q => q.profileField === 'photos');
    // If for some reason there's no photo question, show nothing or an error.
    if (photoQuestion) {
      return <PhotoUploadStep form={form} question={photoQuestion} />;
    }
    return <div>Photo question not configured.</div>;
  }

  // Display the questions for other steps
  return (
    <div className="space-y-6">
      {currentStepInfo?.questions.map((question) => (
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
