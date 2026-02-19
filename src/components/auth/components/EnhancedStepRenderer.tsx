import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { StepCategory } from '../utils/enhancedStepCategories';
import { DynamicRegistrationFormValues } from '../utils/dynamicRegistrationSchema';
import DynamicFieldRenderer from './DynamicFieldRenderer';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/app/LoadingSpinner';
import PhotoUploadComponent from './PhotoUploadComponent';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';
import AccountStep from './AccountStep';
import LocationStep from './LocationStep';
import { useTranslations } from '@/hooks/useTranslations';

interface EnhancedStepRendererProps {
  category: StepCategory;
  form: UseFormReturn<DynamicRegistrationFormValues>;
  location?: string;
  locationLoading?: boolean;
  isStepComplete: boolean;
}

const EnhancedStepRenderer: React.FC<EnhancedStepRendererProps> = ({
  category,
  form,
  location,
  locationLoading,
  isStepComplete
}) => {
  const { t } = useTranslations();
  const { name, title, description, questions, step } = category;

  // Render step header with completion status
  const renderStepHeader = () => (
    <div className="text-center mb-3 sm:mb-6">
      <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
        <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
        {isStepComplete ? (
          <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-500/30 flex-shrink-0">
            <CheckCircle size={12} className="mr-1" />
            {t('reg.complete', 'Complete')}
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-yellow-900/30 text-yellow-300 border-yellow-500/30 flex-shrink-0">
            <AlertCircle size={12} className="mr-1" />
            {t('reg.incomplete', 'Incomplete')}
          </Badge>
        )}
      </div>
      <p className="text-purple-200 mt-1 text-sm sm:text-base px-2">{description}</p>
    </div>
  );

  // Account setup step (step 1)
  if (step === 1) {
    return (
      <div className="space-y-2 sm:space-y-4">
        {renderStepHeader()}
        <AccountStep form={form} />
      </div>
    );
  }

  // Location step (step 3) - Use enhanced LocationStep with worldwide search
  if (step === 3) {
    const remainingQuestions = questions.filter(
      q => q.profileField !== 'location' && q.id !== 'dreamVacation'
    );

    return (
      <div className="space-y-2 sm:space-y-4">
        {renderStepHeader()}
        <LocationStep 
          form={form} 
          location={location || ''} 
          locationLoading={locationLoading || false} 
        />
        
        {remainingQuestions.map(question => (
          <DynamicFieldRenderer 
            key={question.id}
            question={question}
            form={form}
          />
        ))}
      
      <div className="mt-2 sm:mt-6 p-2 sm:p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 text-sm">
            {isStepComplete ? (
              <>
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-green-300">{t('reg.all_fields_completed', 'All required fields completed')}</span>
              </>
            ) : (
              <>
                <AlertCircle size={16} className="text-yellow-400" />
                <span className="text-yellow-300">{t('reg.complete_required_fields', 'Please complete all required fields to continue')}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Photos step (step 7)
  if (name === 'Photos') {
    return (
      <div className="space-y-2 sm:space-y-4">
        {renderStepHeader()}
        <PhotoUploadComponent form={form} />
      </div>
    );
  }

  // Regular question-based steps
  return (
    <div className="space-y-2 sm:space-y-4">
      {renderStepHeader()}
      
      {step === 2 && location !== undefined && (
        <FormField
          control={form.control}
          name="location"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-white flex items-center gap-2">
                {t('reg.current_location', 'Current Location')}
                {field.value && !fieldState.error && (
                  <CheckCircle size={16} className="text-green-400" />
                )}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    placeholder={locationLoading ? t('reg.detecting_location', 'Detecting location...') : t('reg.enter_city', 'Enter your city')}
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
      )}
      
      {questions.map(question => (
        <DynamicFieldRenderer 
          key={question.id}
          question={question}
          form={form}
        />
      ))}
      
      <div className="mt-2 sm:mt-6 p-2 sm:p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center gap-2 text-sm">
          {isStepComplete ? (
            <>
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-green-300">{t('reg.all_fields_completed', 'All required fields completed')}</span>
            </>
          ) : (
            <>
              <AlertCircle size={16} className="text-yellow-400" />
              <span className="text-yellow-300">{t('reg.complete_required_fields', 'Please complete all required fields to continue')}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedStepRenderer;
