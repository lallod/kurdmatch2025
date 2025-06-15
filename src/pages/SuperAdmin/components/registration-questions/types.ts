
export interface QuestionItem {
  id: string;
  text: string;
  category: string;
  fieldType: 'text' | 'textarea' | 'select' | 'multi-select' | 'checkbox' | 'radio' | 'date';
  required: boolean;
  enabled: boolean;
  registrationStep: 'Account' | 'Personal' | 'Physical' | 'Lifestyle' | 'Beliefs' | 'Preferences' | 'Profile';
  displayOrder: number;
  placeholder?: string;
  fieldOptions: string[];
  profileField?: string;
  isSystemField?: boolean;
}

export interface QuestionCategory {
  name: string;
  questions: QuestionItem[];
}

// Database representation of a question
export interface QuestionItemDB {
  id: string;
  text: string;
  category: string;
  field_type: string;
  required: boolean;
  enabled: boolean;
  registration_step: string;
  display_order: number;
  placeholder?: string;
  field_options: string[];
  profile_field?: string;
  is_system_field?: boolean;
}

// Convert from database format to frontend format
export const fromDbQuestion = (dbQuestion: QuestionItemDB): QuestionItem => {
  return {
    id: dbQuestion.id,
    text: dbQuestion.text,
    category: dbQuestion.category,
    fieldType: dbQuestion.field_type as QuestionItem['fieldType'],
    required: dbQuestion.required,
    enabled: dbQuestion.enabled,
    registrationStep: dbQuestion.registration_step as QuestionItem['registrationStep'],
    displayOrder: dbQuestion.display_order,
    placeholder: dbQuestion.placeholder,
    fieldOptions: dbQuestion.field_options || [],
    profileField: dbQuestion.profile_field,
    isSystemField: dbQuestion.is_system_field
  };
};

// Convert from frontend format to database format
export const toDbQuestion = (question: QuestionItem): QuestionItemDB => {
  return {
    id: question.id,
    text: question.text,
    category: question.category,
    field_type: question.fieldType,
    required: question.required,
    enabled: question.enabled,
    registration_step: question.registrationStep,
    display_order: question.displayOrder,
    placeholder: question.placeholder,
    field_options: question.fieldOptions || [],
    profile_field: question.profileField,
    is_system_field: question.isSystemField
  };
};
