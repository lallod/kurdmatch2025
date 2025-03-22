
import { QuestionItem } from '../types';

// Filter questions based on active tab and search query
export const filterQuestions = (
  questions: QuestionItem[], 
  activeTab: string, 
  searchQuery: string
): QuestionItem[] => {
  return questions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          question.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'basic') return question.category === 'Basics' && matchesSearch;
    if (activeTab === 'lifestyle') return question.category === 'Lifestyle' && matchesSearch;
    if (activeTab === 'beliefs') return question.category === 'Beliefs' && matchesSearch;
    if (activeTab === 'relationships') return question.category === 'Relationships' && matchesSearch;
    if (activeTab === 'personality') return question.category === 'Personality' && matchesSearch;
    if (activeTab === 'interests') return question.category === 'Interests' && matchesSearch;
    if (activeTab === 'physical') return question.category === 'Physical' && matchesSearch;
    if (activeTab === 'required') return question.required && matchesSearch;
    if (activeTab === 'optional') return !question.required && matchesSearch;
    if (activeTab === 'enabled') return question.enabled && matchesSearch;
    if (activeTab === 'disabled') return !question.enabled && matchesSearch;
    
    return false;
  });
};

// Get count of questions per category
export const getCategoryCount = (questions: QuestionItem[], categoryName: string): number => {
  return questions.filter(q => q.category === categoryName).length;
};

// Generate a new question ID
export const generateNewQuestionId = (questions: QuestionItem[]): string => {
  return (Math.max(...questions.map(q => parseInt(q.id))) + 1).toString();
};

// Validate registration step
export const validateRegistrationStep = (
  step?: string
): 'Account' | 'Personal' | 'Profile' | 'Preferences' => {
  return (step === 'Account' || 
          step === 'Personal' || 
          step === 'Profile' || 
          step === 'Preferences') 
            ? step as 'Account' | 'Personal' | 'Profile' | 'Preferences'
            : 'Personal';
};
