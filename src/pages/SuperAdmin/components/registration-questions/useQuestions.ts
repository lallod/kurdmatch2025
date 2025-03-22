
import { useState } from 'react';
import { QuestionItem } from './types';
import { useToast } from "@/hooks/use-toast";

// Sample initial data
const initialQuestions: QuestionItem[] = [
  {
    id: '1', 
    text: 'What is your height?', 
    category: 'Basics',
    fieldType: 'text', 
    required: true,
    enabled: true,
    registrationStep: 'Personal',
    displayOrder: 1,
    placeholder: 'e.g., 175 cm',
    fieldOptions: [],
    profileField: 'height'
  },
  {
    id: '2', 
    text: 'What are your hobbies?', 
    category: 'Interests',
    fieldType: 'multi-select', 
    required: false,
    enabled: true,
    registrationStep: 'Profile',
    displayOrder: 2,
    placeholder: 'Select your hobbies',
    fieldOptions: ['Photography', 'Reading', 'Sports', 'Music', 'Travel', 'Cooking', 'Gaming', 'Art'],
    profileField: 'hobbies'
  },
  {
    id: '3', 
    text: 'What is your body type?', 
    category: 'Physical',
    fieldType: 'select', 
    required: true,
    enabled: true,
    registrationStep: 'Personal',
    displayOrder: 3,
    placeholder: 'Select your body type',
    fieldOptions: ['Athletic', 'Average', 'Slim', 'Muscular', 'Curvy', 'Plus Size'],
    profileField: 'bodyType'
  },
  {
    id: '4', 
    text: 'What is your ethnicity?', 
    category: 'Basics',
    fieldType: 'select', 
    required: false,
    enabled: true,
    registrationStep: 'Personal',
    displayOrder: 4,
    placeholder: 'Select your ethnicity',
    fieldOptions: ['Asian', 'Black/African', 'Caucasian', 'Hispanic/Latino', 'Middle Eastern', 'Mixed', 'Other'],
    profileField: 'ethnicity'
  },
  {
    id: '5', 
    text: 'What is your religion?', 
    category: 'Beliefs',
    fieldType: 'select', 
    required: false,
    enabled: true,
    registrationStep: 'Profile',
    displayOrder: 5,
    placeholder: 'Select your religion',
    fieldOptions: ['Christian', 'Muslim', 'Jewish', 'Hindu', 'Buddhist', 'Spiritual but not religious', 'Atheist', 'Agnostic', 'Other'],
    profileField: 'religion'
  },
  {
    id: '6', 
    text: 'What are your political views?', 
    category: 'Beliefs',
    fieldType: 'select', 
    required: false,
    enabled: true,
    registrationStep: 'Profile',
    displayOrder: 6,
    placeholder: 'Select your political views',
    fieldOptions: ['Conservative', 'Moderate', 'Liberal', 'Progressive', 'Libertarian', 'Apolitical', 'Other'],
    profileField: 'politicalViews'
  },
  {
    id: '7', 
    text: 'What are your values?', 
    category: 'Beliefs',
    fieldType: 'multi-select', 
    required: false,
    enabled: true,
    registrationStep: 'Profile',
    displayOrder: 7,
    placeholder: 'Select your values',
    fieldOptions: ['Family', 'Honesty', 'Loyalty', 'Ambition', 'Compassion', 'Freedom', 'Adventure', 'Creativity', 'Growth', 'Authenticity'],
    profileField: 'values'
  },
  {
    id: '8', 
    text: 'What languages do you speak?', 
    category: 'Basics',
    fieldType: 'multi-select', 
    required: true,
    enabled: true,
    registrationStep: 'Personal',
    displayOrder: 8,
    placeholder: 'Select languages',
    fieldOptions: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Russian', 'Portuguese', 'Italian'],
    profileField: 'languages'
  },
  {
    id: '9', 
    text: 'What are your relationship goals?', 
    category: 'Relationships',
    fieldType: 'select', 
    required: true,
    enabled: true,
    registrationStep: 'Profile',
    displayOrder: 9,
    placeholder: 'Select your relationship goals',
    fieldOptions: ['Long-term relationship', 'Marriage', 'Casual dating', 'Making friends', 'Still figuring it out'],
    profileField: 'relationshipGoals'
  },
  {
    id: '10', 
    text: 'Do you want children?', 
    category: 'Relationships',
    fieldType: 'select', 
    required: false,
    enabled: true,
    registrationStep: 'Profile',
    displayOrder: 10,
    placeholder: 'Select your preference',
    fieldOptions: ['Want children', 'Don\'t want children', 'Have children already', 'Open to children', 'Not sure yet'],
    profileField: 'wantChildren'
  },
  {
    id: '11', 
    text: 'Do you have pets?', 
    category: 'Lifestyle',
    fieldType: 'select', 
    required: false,
    enabled: true,
    registrationStep: 'Profile',
    displayOrder: 11,
    placeholder: 'Select pet status',
    fieldOptions: ['Dog owner', 'Cat owner', 'Both dog and cat', 'Other pets', 'No pets but love them', 'No pets and prefer none'],
    profileField: 'havePets'
  },
  {
    id: '12', 
    text: 'What are your exercise habits?', 
    category: 'Lifestyle',
    fieldType: 'select', 
    required: false,
    enabled: true,
    registrationStep: 'Profile',
    displayOrder: 12,
    placeholder: 'Select exercise frequency',
    fieldOptions: ['Daily', 'Several times a week', 'Once a week', 'Occasionally', 'Rarely', 'Never'],
    profileField: 'exerciseHabits'
  },
  {
    id: '13', 
    text: 'What is your zodiac sign?', 
    category: 'Beliefs',
    fieldType: 'select', 
    required: false,
    enabled: true,
    registrationStep: 'Profile',
    displayOrder: 13,
    placeholder: 'Select your zodiac sign',
    fieldOptions: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
    profileField: 'zodiacSign'
  },
  {
    id: '14', 
    text: 'What is your personality type?', 
    category: 'Personality',
    fieldType: 'select', 
    required: false,
    enabled: true,
    registrationStep: 'Profile',
    displayOrder: 14,
    placeholder: 'Select your personality type',
    fieldOptions: ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'],
    profileField: 'personalityType'
  }
];

export const useQuestions = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewQuestion, setPreviewQuestion] = useState<QuestionItem | null>(questions[0] || null);

  // Filter questions based on active tab and search query
  const filteredQuestions = questions.filter(question => {
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

  // Get count of questions per category
  const getCategoryCount = (categoryName: string) => {
    return questions.filter(q => q.category === categoryName).length;
  };

  // Toggle selection of a question
  const toggleQuestionSelection = (id: string) => {
    setSelectedQuestions(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(filteredQuestions.map(q => q.id));
    }
    setIsSelectAll(!isSelectAll);
  };

  // Bulk operations
  const handleBulkDelete = () => {
    if (selectedQuestions.length === 0) return;
    
    setQuestions(prev => prev.filter(q => !selectedQuestions.includes(q.id)));
    setSelectedQuestions([]);
    setIsSelectAll(false);
    
    toast({
      title: "Success",
      description: `${selectedQuestions.length} questions deleted successfully`,
    });
  };

  const handleBulkToggleEnabled = (enable: boolean) => {
    if (selectedQuestions.length === 0) return;
    
    setQuestions(prev => 
      prev.map(q => selectedQuestions.includes(q.id) ? {...q, enabled: enable} : q)
    );
    
    toast({
      title: "Success",
      description: `${selectedQuestions.length} questions ${enable ? 'enabled' : 'disabled'} successfully`,
    });
  };

  // Individual operations
  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    
    // Also remove from selected if it was selected
    setSelectedQuestions(prev => prev.filter(qId => qId !== id));
    
    toast({
      title: "Success",
      description: "Question deleted successfully",
    });
  };

  const handleUpdateQuestion = (updatedQuestion: QuestionItem) => {
    setQuestions(prev => 
      prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
    );
    
    // Update preview question if it's the one being edited
    if (previewQuestion && previewQuestion.id === updatedQuestion.id) {
      setPreviewQuestion(updatedQuestion);
    }
    
    toast({
      title: "Success",
      description: "Question updated successfully",
    });
  };

  const handleAddQuestion = (newQuestionData: Partial<QuestionItem>) => {
    if (!newQuestionData.text) {
      toast({
        title: "Error",
        description: "Question text is required",
        variant: "destructive"
      });
      return;
    }
    
    const newId = (Math.max(...questions.map(q => parseInt(q.id))) + 1).toString();
    
    const registrationStep: 'Account' | 'Personal' | 'Profile' | 'Preferences' = 
      (newQuestionData.registrationStep === 'Account' || 
       newQuestionData.registrationStep === 'Personal' || 
       newQuestionData.registrationStep === 'Profile' || 
       newQuestionData.registrationStep === 'Preferences') 
        ? newQuestionData.registrationStep 
        : 'Personal';
    
    const newQuestion: QuestionItem = {
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
    
    setQuestions(prev => [...prev, newQuestion]);
    
    // Set the new question as the preview
    setPreviewQuestion(newQuestion);
    
    toast({
      title: "Success",
      description: "New question added successfully",
    });
    
    return true;
  };

  return {
    questions,
    filteredQuestions,
    selectedQuestions,
    isSelectAll,
    activeTab,
    searchQuery,
    previewQuestion,
    setPreviewQuestion,
    setActiveTab,
    setSearchQuery,
    toggleQuestionSelection,
    toggleSelectAll,
    handleBulkDelete,
    handleBulkToggleEnabled,
    handleDeleteQuestion,
    handleUpdateQuestion,
    handleAddQuestion,
    getCategoryCount
  };
};
