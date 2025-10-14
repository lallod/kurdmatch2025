import React from 'react';
import { AlertCircle } from 'lucide-react';
import { getMissingFields, MissingFieldInfo } from '@/components/auth/utils/getMissingFields';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';

interface MissingFieldsSummaryProps {
  stepQuestions: QuestionItem[];
  formValues: Record<string, any>;
  currentStep: number;
}

const MissingFieldsSummary: React.FC<MissingFieldsSummaryProps> = ({
  stepQuestions,
  formValues,
  currentStep,
}) => {
  const missingFields = getMissingFields(stepQuestions, formValues);
  
  if (missingFields.length === 0) return null;

  const totalFields = stepQuestions.filter(q => q.required && q.id !== 'zodiac_sign').length;
  const completedFields = totalFields - missingFields.length;

  return (
    <div className="mt-3 p-4 bg-yellow-900/30 border border-yellow-500/30 rounded-lg backdrop-blur-sm">
      {/* Progress Header */}
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-yellow-400">
            Progress: {completedFields}/{totalFields} fields completed
          </p>
          <p className="text-xs text-yellow-300/80 mt-0.5">
            {missingFields.length === 1 
              ? 'Just 1 more field to go!' 
              : `${missingFields.length} fields remaining`}
          </p>
        </div>
      </div>

      {/* Missing Fields List */}
      <div className="space-y-1.5 ml-7">
        {missingFields.map((field) => (
          <div key={field.id} className="text-sm">
            <span className="text-yellow-200 font-medium">• {field.label}</span>
            {field.reason && (
              <span className="text-yellow-300/70 text-xs ml-2">
                ({field.reason})
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissingFieldsSummary;
