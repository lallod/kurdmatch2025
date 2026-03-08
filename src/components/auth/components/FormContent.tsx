
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import FieldRenderer from './FieldRenderer';
import PhotoUploadStep from './PhotoUploadStep';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { useTranslations } from '@/hooks/useTranslations';

interface FormContentProps {
  currentStep: number;
  steps: Array<{ name: string; questions: QuestionItem[] }>;
  form: UseFormReturn<any>;
}

const FormContent = ({ currentStep, steps, form }: FormContentProps) => {
  const { t } = useTranslations();
  const currentStepInfo = steps[currentStep];

  // The last step is always photos, based on useStepCategories
  if (currentStep === steps.length - 1) {
    const photoQuestion = currentStepInfo?.questions.find(q => q.profileField === 'photos');
    if (photoQuestion) {
      return <PhotoUploadStep form={form} question={photoQuestion} />;
    }
    return <div>{t('auth.photo_not_configured', 'Photo question not configured.')}</div>;
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
