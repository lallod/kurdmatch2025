
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  User, 
  Heart, 
  Coffee, 
  Brain, 
  Star, 
  Activity, 
  Scroll,
  CornerDownRight, 
  Loader2 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { initialQuestions } from '@/pages/SuperAdmin/components/registration-questions/data/sampleQuestions';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';

// Create a schema builder based on the questions
const createDynamicSchema = (questions: QuestionItem[]) => {
  const schemaObject: Record<string, any> = {};
  
  questions.forEach(question => {
    if (question.enabled) {
      let schema = z.string();
      
      // Add validation based on field type and required status
      if (question.required) {
        schema = schema.min(1, { message: `${question.text} is required` });
      } else {
        schema = schema.optional();
      }
      
      // Additional type-specific validation could be added here
      schemaObject[question.id] = schema;
    }
  });
  
  return z.object(schemaObject);
};

const DynamicRegistrationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions);
  
  // Group questions by registration step
  const steps = [
    { name: 'Account', questions: questions.filter(q => q.enabled && q.registrationStep === 'Account') },
    { name: 'Personal', questions: questions.filter(q => q.enabled && q.registrationStep === 'Personal') },
    { name: 'Profile', questions: questions.filter(q => q.enabled && q.registrationStep === 'Profile') },
    { name: 'Preferences', questions: questions.filter(q => q.enabled && q.registrationStep === 'Preferences') }
  ].filter(step => step.questions.length > 0);
  
  // Create dynamic schema
  const dynamicSchema = createDynamicSchema(questions);
  type FormValues = z.infer<typeof dynamicSchema>;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: questions.reduce((acc, q) => {
      if (q.enabled) {
        acc[q.id] = '';
      }
      return acc;
    }, {} as Record<string, string>),
    mode: 'onChange',
  });
  
  const { formState } = form;

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would connect to an auth service
      console.log('Registration form submitted:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success!",
        description: "Your account has been created successfully.",
      });
      
      // Would typically redirect to login page or dashboard
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    // Get field names for the current step
    const currentFields = steps[currentStep].questions.map(q => q.id);
    
    // Validate only the fields in the current step
    const isValid = await form.trigger(currentFields as any);
    
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Basics': return <User className="h-4 w-4" />;
      case 'Relationships': return <Heart className="h-4 w-4" />;
      case 'Lifestyle': return <Coffee className="h-4 w-4" />;
      case 'Beliefs': return <Scroll className="h-4 w-4" />;
      case 'Personality': return <Brain className="h-4 w-4" />;
      case 'Interests': return <Star className="h-4 w-4" />;
      case 'Physical': return <Activity className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  // Render field based on question type
  const renderField = (question: QuestionItem) => {
    return (
      <FormField
        key={question.id}
        control={form.control}
        name={question.id}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="flex items-center space-x-2 text-gray-200">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-900/50 text-purple-400">
                {getCategoryIcon(question.category)}
              </span>
              <span>{question.text}</span>
              {question.required && <span className="text-red-400 text-sm">*</span>}
            </FormLabel>
            
            <FormControl>
              {question.fieldType === 'text' && (
                <Input
                  placeholder={question.placeholder}
                  className="bg-indigo-900/20 border-indigo-800 focus:border-purple-500 text-white"
                  {...field}
                />
              )}
              
              {question.fieldType === 'textarea' && (
                <Textarea
                  placeholder={question.placeholder}
                  className="bg-indigo-900/20 border-indigo-800 focus:border-purple-500 text-white resize-none"
                  {...field}
                />
              )}
              
              {question.fieldType === 'select' && (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="bg-indigo-900/20 border-indigo-800 focus:border-purple-500 text-white">
                    <SelectValue placeholder={question.placeholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-indigo-950 border-indigo-800">
                    {question.fieldOptions.map((option, index) => (
                      <SelectItem key={index} value={option} className="focus:bg-indigo-900">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {question.fieldType === 'radio' && (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  {question.fieldOptions.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${index}`} className="border-indigo-700 text-purple-500" />
                      <label htmlFor={`${question.id}-${index}`} className="text-gray-300">
                        {option}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              
              {question.fieldType === 'checkbox' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={question.id}
                    checked={field.value === 'true'}
                    onCheckedChange={(checked) => {
                      field.onChange(checked ? 'true' : 'false');
                    }}
                    className="border-indigo-700 data-[state=checked]:bg-purple-600"
                  />
                  <label
                    htmlFor={question.id}
                    className="text-sm font-medium leading-none text-gray-300"
                  >
                    {question.placeholder}
                  </label>
                </div>
              )}
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />
    );
  };
  
  // Render step progress indicator
  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center items-center mb-6 relative">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div 
              className={`flex flex-col items-center cursor-pointer z-10 ${
                idx < currentStep 
                  ? "text-purple-400" 
                  : idx === currentStep 
                    ? "text-white" 
                    : "text-gray-600"
              }`}
              onClick={() => idx < currentStep && setCurrentStep(idx)}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center 
                ${idx < currentStep 
                  ? "bg-purple-900/50 border-2 border-purple-500" 
                  : idx === currentStep 
                    ? "bg-indigo-700 border-2 border-indigo-500 animate-pulse" 
                    : "bg-gray-800 border-2 border-gray-700"}
              `}>
                {idx + 1}
              </div>
              <span className={`text-xs mt-1 ${
                idx < currentStep ? "font-medium" : idx === currentStep ? "font-medium" : ""
              }`}>
                {step.name}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-16 h-0.5 ${
                idx < currentStep ? "bg-purple-700" : "bg-gray-800"
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {renderStepIndicator()}
        
        <div className="space-y-4">
          {steps[currentStep]?.questions.map(renderField)}
        </div>
        
        <div className="flex justify-between mt-6">
          {currentStep > 0 ? (
            <Button 
              type="button" 
              variant="outline" 
              onClick={prevStep}
              className="gap-2 text-purple-400 border-purple-800 hover:bg-purple-900/30"
            >
              Back
            </Button>
          ) : (
            <div></div>
          )}
          
          {currentStep < steps.length - 1 ? (
            <Button 
              type="button" 
              onClick={nextStep}
              className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0"
            >
              Next
              <CornerDownRight size={16} />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default DynamicRegistrationForm;
