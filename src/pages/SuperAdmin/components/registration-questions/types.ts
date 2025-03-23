
export interface QuestionItem {
  id: string;
  text: string;
  category: string;
  fieldType: 'text' | 'textarea' | 'select' | 'multi-select' | 'radio' | 'checkbox' | 'date';
  required: boolean;
  enabled: boolean;
  registrationStep: 'Account' | 'Personal' | 'Profile' | 'Preferences';
  displayOrder: number;
  placeholder: string;
  fieldOptions: string[];
  profileField: string;
  isSystemField?: boolean; // New field to identify system fields that should be protected
}

// Database representation of the question (snake_case for Supabase)
export interface QuestionItemDB {
  id: string;
  text: string;
  category: string;
  field_type: string;
  required: boolean;
  enabled: boolean;
  registration_step: string;
  display_order: number;
  placeholder: string;
  field_options: string[];
  profile_field: string;
  is_system_field?: boolean;
}

// Convert QuestionItem (camelCase) to QuestionItemDB (snake_case)
export const toDbQuestion = (question: QuestionItem): QuestionItemDB => ({
  id: question.id,
  text: question.text,
  category: question.category,
  field_type: question.fieldType,
  required: question.required,
  enabled: question.enabled,
  registration_step: question.registrationStep,
  display_order: question.displayOrder,
  placeholder: question.placeholder,
  field_options: question.fieldOptions,
  profile_field: question.profileField,
  is_system_field: question.isSystemField
});

// Convert QuestionItemDB (snake_case) to QuestionItem (camelCase)
export const fromDbQuestion = (dbQuestion: QuestionItemDB): QuestionItem => ({
  id: dbQuestion.id,
  text: dbQuestion.text,
  category: dbQuestion.category,
  fieldType: dbQuestion.field_type as any,
  required: dbQuestion.required,
  enabled: dbQuestion.enabled,
  registrationStep: dbQuestion.registration_step as any,
  displayOrder: dbQuestion.display_order,
  placeholder: dbQuestion.placeholder,
  fieldOptions: dbQuestion.field_options,
  profileField: dbQuestion.profile_field,
  isSystemField: dbQuestion.is_system_field
});
