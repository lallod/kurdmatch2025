import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import { DynamicRegistrationFormValues } from '@/components/auth/utils/dynamicRegistrationSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Heart, Coffee, Sparkles } from 'lucide-react';
import HeightSelector from './enhanced-fields/HeightSelector';
import DateOfBirthSelector from './enhanced-fields/DateOfBirthSelector';
import LocationSearchSelector from './enhanced-fields/LocationSearchSelector';
import GroupedEthnicitySelector from './enhanced-fields/GroupedEthnicitySelector';
import PersonalityTypeSelector from './enhanced-fields/PersonalityTypeSelector';
import ButtonGridSelector from './enhanced-fields/ButtonGridSelector';
import LanguageButtonGrid from './enhanced-fields/LanguageButtonGrid';
import OccupationButtonGrid from './enhanced-fields/OccupationButtonGrid';
import OccupationChoiceButtons from './enhanced-fields/OccupationChoiceButtons';

interface DynamicFieldRendererProps {
  question: QuestionItem;
  form: UseFormReturn<DynamicRegistrationFormValues>;
}

const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({
  question,
  form
}) => {
  const { id, text, fieldType, required, fieldOptions, placeholder } = question;
  const fieldValue = form.watch(id);
  const fieldState = form.getFieldState(id);
  
  // Check if field is complete
  const isFieldComplete = () => {
    if (!required) return true;
    
    const isMultiSelect = fieldType === 'multi-select' || 
                          (fieldType as string) === 'multi_select';
    
    if (isMultiSelect) {
      let minSelections = 1;
      if (id === 'interests') minSelections = 3;
      else if (id === 'hobbies') minSelections = 2;
      else if (id === 'values') minSelections = 3;
      else if (id === 'languages') minSelections = 1;
      return Array.isArray(fieldValue) && fieldValue.length >= minSelections;
    }
    
    if (fieldType === 'checkbox') {
      return fieldValue === true;
    }
    
    if (id === 'age') {
      const numValue = typeof fieldValue === 'string' ? parseFloat(fieldValue) : fieldValue;
      return numValue >= 18;
    }
    
    return fieldValue && fieldValue.toString().trim().length > 0;
  };

  const isComplete = isFieldComplete();

  // Render badges
  const renderBadges = () => (
    <div className="flex gap-2">
      {required && (
        <Badge variant="outline" className="bg-pink-900/30 text-pink-300 border-pink-500/30 text-xs">
          Required
        </Badge>
      )}
      {isComplete && (
        <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-500/30 text-xs">
          <CheckCircle size={10} className="mr-1" />
          Complete
        </Badge>
      )}
    </div>
  );

  // Render field label with completion indicator
  const renderLabel = () => (
    <FormLabel className="text-white flex items-center justify-between">
      <span className="flex items-center gap-2">
        {text}
        {isComplete && <CheckCircle size={16} className="text-green-400" />}
        {required && !isComplete && <AlertCircle size={16} className="text-yellow-400" />}
      </span>
      {renderBadges()}
    </FormLabel>
  );

  const commonFieldProps = {
    className: "bg-white/10 border-white/20 text-white placeholder:text-white/60"
  };

  // Enhanced field components for specific fields
  if (id === 'height') {
    return (
      <FormField
        control={form.control}
        name={id}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <HeightSelector value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (id === 'age') {
    return (
      <FormField
        control={form.control}
        name={id}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <DateOfBirthSelector
                day={form.watch('birthDay')}
                month={form.watch('birthMonth')}
                year={form.watch('birthYear')}
                onDateChange={(day, month, year, zodiac) => {
                  form.setValue('birthDay', day);
                  form.setValue('birthMonth', month);
                  form.setValue('birthYear', year);
                  form.setValue('zodiac_sign', zodiac);
                  
                  if (day && month && year) {
                    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                      age--;
                    }
                    field.onChange(age.toString());
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (id === 'location') {
    return (
      <FormField
        control={form.control}
        name={id}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <LocationSearchSelector value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (id === 'ethnicity') {
    return (
      <FormField
        control={form.control}
        name={id}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <GroupedEthnicitySelector value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (id === 'personality_type') {
    return (
      <FormField
        control={form.control}
        name={id}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <PersonalityTypeSelector value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (id === 'interests') {
    return (
      <FormField
        control={form.control}
        name={id}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ButtonGridSelector
                label="Your Interests"
                icon={Heart}
                options={fieldOptions || []}
                selectedValues={field.value || []}
                onChange={field.onChange}
                minSelections={3}
                maxSelections={8}
                maxColumns={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (id === 'hobbies') {
    return (
      <FormField
        control={form.control}
        name={id}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ButtonGridSelector
                label="Your Hobbies"
                icon={Coffee}
                options={fieldOptions || []}
                selectedValues={field.value || []}
                onChange={field.onChange}
                minSelections={2}
                maxSelections={6}
                maxColumns={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (id === 'values') {
    return (
      <FormField
        control={form.control}
        name={id}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ButtonGridSelector
                label="Your Core Values"
                icon={Sparkles}
                options={fieldOptions || []}
                selectedValues={field.value || []}
                onChange={field.onChange}
                minSelections={3}
                maxSelections={5}
                maxColumns={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // Languages with visual button grid
  if (id === 'languages') {
    return (
      <FormField
        control={form.control}
        name={id}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <LanguageButtonGrid
                selectedValues={field.value || []}
                onChange={field.onChange}
                minSelections={1}
                maxSelections={10}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // Occupation field with max 2 selections
  if (id === 'occupation') {
    return (
      <FormField
        control={form.control}
        name={id}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <OccupationChoiceButtons
                value={field.value || []}
                onChange={field.onChange}
                maxSelections={2}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // Enhanced education field with categorized grid
  if (id === 'education') {
    return (
      <FormField
        control={form.control}
        name={id}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <OccupationButtonGrid
                selectedValues={field.value || []}
                onChange={field.onChange}
                minSelections={1}
                maxSelections={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // Skip zodiac_sign field as it's auto-calculated
  if (id === 'zodiac_sign') {
    return null;
  }

  switch (fieldType) {
    case 'text':
      return (
        <FormField
          control={form.control}
          name={id}
          render={({ field }) => (
            <FormItem>
              {renderLabel()}
              <FormControl>
                <Input 
                  placeholder={placeholder || `Enter ${text.toLowerCase()}`}
                  {...field}
                  {...commonFieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case 'textarea':
      return (
        <FormField
          control={form.control}
          name={id}
          render={({ field }) => (
            <FormItem>
              {renderLabel()}
              <FormControl>
                <Textarea 
                  placeholder={placeholder || `Enter ${text.toLowerCase()}`}
                  {...field}
                  {...commonFieldProps}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case 'select':
      return (
        <FormField
          control={form.control}
          name={id}
          render={({ field }) => (
            <FormItem>
              {renderLabel()}
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger {...commonFieldProps}>
                    <SelectValue placeholder={placeholder || `Select ${text.toLowerCase()}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {fieldOptions?.map((option) => (
                    <SelectItem key={option} value={option} className="text-white hover:bg-gray-700">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case 'multi-select':
      return (
        <FormField
          control={form.control}
          name={id}
          render={({ field }) => (
            <FormItem>
              {renderLabel()}
              <FormDescription className="text-purple-200 text-sm">
                {id === 'interests' && 'Select at least 3 interests'}
                {id === 'hobbies' && 'Select at least 2 hobbies'}
                {id === 'values' && 'Select at least 3 core values'}
                {id === 'languages' && 'Select at least 1 language'}
                {!['interests', 'hobbies', 'values', 'languages'].includes(id) && 'Select one or more options'}
              </FormDescription>
              <FormControl>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-white/5 rounded-lg border border-white/10">
                  {fieldOptions?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${id}-${option}`}
                        checked={field.value?.includes(option) || false}
                        onCheckedChange={(checked) => {
                          const currentValue = field.value || [];
                          if (checked) {
                            field.onChange([...currentValue, option]);
                          } else {
                            field.onChange(currentValue.filter((v: string) => v !== option));
                          }
                        }}
                        className="border-white/30 text-white"
                      />
                      <label
                        htmlFor={`${id}-${option}`}
                        className="text-sm text-white cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case 'checkbox':
      return (
        <FormField
          control={form.control}
          name={id}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-white/30 text-white"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-white">
                  {text}
                </FormLabel>
                {renderBadges()}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case 'date':
      return (
        <FormField
          control={form.control}
          name={id}
          render={({ field }) => (
            <FormItem>
              {renderLabel()}
              <FormControl>
                <Input 
                  type="date"
                  {...field}
                  {...commonFieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    default:
      return (
        <FormField
          control={form.control}
          name={id}
          render={({ field }) => (
            <FormItem>
              {renderLabel()}
              <FormControl>
                <Input 
                  placeholder={placeholder || `Enter ${text.toLowerCase()}`}
                  {...field}
                  {...commonFieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
  }
};

export default DynamicFieldRenderer;