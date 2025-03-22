
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
import { Bot, Lock } from 'lucide-react';

interface FieldRendererProps {
  question: QuestionItem;
  form: UseFormReturn<any>;
}

const FieldRenderer = ({ question, form }: FieldRendererProps) => {
  // Generate the appropriate badge based on question properties
  const renderBadges = () => {
    const badges = [];
    
    // System field badge (takes precedence over regular required badge)
    if (question.isSystemField) {
      badges.push(
        <Badge key="system" variant="outline" className="flex items-center gap-0.5 bg-blue-900/30 text-blue-300 border-blue-700/30 text-[10px] px-1.5 py-0">
          <Lock size={10} />
          Required
        </Badge>
      );
    }
    // Only show regular required badge if not a system field
    else if (question.required) {
      badges.push(
        <Badge key="required" variant="outline" className="bg-amber-900/30 text-amber-300 border-amber-700/30 text-[10px] px-1.5 py-0">
          Required
        </Badge>
      );
    }
    
    // AI-Generated badge
    if (question.profileField === 'bio') {
      badges.push(
        <Badge key="ai" variant="outline" className="flex items-center gap-0.5 bg-purple-900/30 text-purple-300 border-purple-700/30 text-[10px] px-1.5 py-0">
          <Bot size={10} />
          AI-Generated
        </Badge>
      );
    }
    
    return badges.length > 0 ? (
      <div className="flex gap-1">{badges}</div>
    ) : null;
  };
  
  // If this is an AI-generated field (like bio), render a disabled field with AI badge
  if (question.profileField === 'bio') {
    return (
      <div className="space-y-3">
        <div className="flex justify-end items-center">
          {renderBadges()}
        </div>
        <p className="text-xs text-muted-foreground">
          Your bio will be automatically generated based on your profile information.
        </p>
      </div>
    );
  }
  
  // Render normal field for non-AI fields
  return (
    <div className="space-y-3">
      <div className="flex justify-end items-center">
        {renderBadges()}
      </div>
      
      {renderField(question, form)}
    </div>
  );
};

// Helper function to render the appropriate field based on type
const renderField = (question: QuestionItem, form: UseFormReturn<any>) => {
  switch (question.fieldType) {
    case 'text':
      return <TextField question={question} form={form} />;
    case 'textarea':
      return <TextAreaField question={question} form={form} />;
    case 'select':
      return <SelectField question={question} form={form} />;
    case 'multi-select':
      // For multi-select, we use the Select component but it would need to be enhanced
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
