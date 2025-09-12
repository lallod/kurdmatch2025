import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { DynamicRegistrationFormValues } from '@/components/auth/utils/dynamicRegistrationSchema';
import {
  TextField,
  TextAreaField,
  SelectField,
  MultiSelectField,
  RadioField,
  CheckboxField,
  DateField
} from '@/components/auth/form-fields';

interface DynamicFieldRendererProps {
  question: QuestionItem;
  form: UseFormReturn<DynamicRegistrationFormValues>;
}

const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({
  question,
  form
}) => {
  const commonProps = {
    form,
    name: question.id,
    question
  };

  switch (question.fieldType) {
    case 'text':
      return <TextField {...commonProps} />;
    
    case 'textarea':
      return <TextAreaField {...commonProps} />;
    
    case 'select':
      return (
        <SelectField 
          {...commonProps}
        />
      );
    
    case 'multi-select':
      return (
        <MultiSelectField 
          {...commonProps}
        />
      );
    
    case 'radio':
      return (
        <RadioField 
          {...commonProps}
        />
      );
    
    case 'checkbox':
      return <CheckboxField {...commonProps} />;
    
    case 'date':
      return <DateField {...commonProps} />;
    
    default:
      return <TextField {...commonProps} />;
  }
};

export default DynamicFieldRenderer;