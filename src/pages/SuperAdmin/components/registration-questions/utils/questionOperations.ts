
import { QuestionItem } from '../types';
import { generateNewQuestionId, validateRegistrationStep } from './questionUtils';

// Create a new question
export const createQuestion = (
  questions: QuestionItem[],
  newQuestionData: Partial<QuestionItem>
): QuestionItem => {
  if (!newQuestionData.text) {
    throw new Error("Question text is required");
  }
  
  const newId = generateNewQuestionId(questions);
  const registrationStep = validateRegistrationStep(newQuestionData.registrationStep);
  
  return {
    id: newId,
    text: newQuestionData.text,
    category: newQuestionData.category || 'Basics',
    fieldType: newQuestionData.fieldType || 'text',
    required: newQuestionData.required || false,
    enabled: newQuestionData.enabled !== undefined ? newQuestionData.enabled : true,
    registrationStep: registrationStep,
    displayOrder: newQuestionData.displayOrder || questions.length + 1,
    placeholder: newQuestionData.placeholder || '',
    fieldOptions: newQuestionData.fieldOptions || [],
    profileField: newQuestionData.profileField || ''
  };
};

// Update existing questions with toggles for enabled status
export const toggleQuestionsEnabled = (
  questions: QuestionItem[], 
  questionIds: string[], 
  enable: boolean
): QuestionItem[] => {
  return questions.map(q => 
    questionIds.includes(q.id) ? {...q, enabled: enable} : q
  );
};

// Delete questions by ID
export const deleteQuestionsById = (
  questions: QuestionItem[],
  questionIds: string[]
): QuestionItem[] => {
  return questions.filter(q => !questionIds.includes(q.id));
};

// Update a single question
export const updateQuestion = (
  questions: QuestionItem[],
  updatedQuestion: QuestionItem
): QuestionItem[] => {
  return questions.map(q => 
    q.id === updatedQuestion.id ? updatedQuestion : q
  );
};
