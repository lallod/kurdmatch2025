
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { 
  TextField, 
  TextAreaField, 
  SelectField, 
  RadioField, 
  CheckboxField,
  DateField
} from '../form-fields';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';

interface FieldRendererProps {
  question: QuestionItem;
  form: UseFormReturn<any>;
}

const FieldRenderer = ({ question, form }: FieldRendererProps) => {
  // If this is an AI-generated field (like bio), render a disabled field with AI badge
  if (question.profileField === 'bio') {
    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-200">
            {question.text}
          </label>
          <Badge variant="outline" className="flex items-center gap-1 bg-purple-900/30 text-purple-300 border-purple-700/30">
            <Bot size={12} />
            AI-Generated
          </Badge>
        </div>
        <p className="text-xs text-gray-400">
          Your bio will be automatically generated based on your profile information.
        </p>
      </div>
    );
  }
  
  // Render normal field for non-AI fields
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
    case 'date':
      return <DateField question={question} form={form} />;
    default:
      return <TextField question={question} form={form} />;
  }
};

export default FieldRenderer;
