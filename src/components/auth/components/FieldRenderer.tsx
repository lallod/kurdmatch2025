
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { 
  TextField, 
  TextAreaField, 
  SelectField, 
  RadioField, 
  CheckboxField 
} from '../form-fields';

interface FieldRendererProps {
  question: QuestionItem;
  form: UseFormReturn<any>;
}

const FieldRenderer = ({ question, form }: FieldRendererProps) => {
  switch (question.fieldType) {
    case 'text':
      return <TextField question={question} form={form} />;
    case 'textarea':
      return <TextAreaField question={question} form={form} />;
    case 'select':
      return <SelectField question={question} form={form} />;
    case 'radio':
      return <RadioField question={question} form={form} />;
    case 'checkbox':
      return <CheckboxField question={question} form={form} />;
    default:
      return <TextField question={question} form={form} />;
  }
};

export default FieldRenderer;
