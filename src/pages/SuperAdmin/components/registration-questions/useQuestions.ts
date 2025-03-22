
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { QuestionItem } from './types';
import { initialQuestions } from './data/sampleQuestions';
import { filterQuestions, getCategoryCount } from './utils/questionUtils';
import { 
  createQuestion, 
  toggleQuestionsEnabled, 
  deleteQuestionsById, 
  updateQuestion 
} from './utils/questionOperations';

export const useQuestions = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewQuestion, setPreviewQuestion] = useState<QuestionItem | null>(questions[0] || null);

  // Get filtered questions based on active tab and search query
  const filteredQuestions = filterQuestions(questions, activeTab, searchQuery);

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
    
    setQuestions(prev => deleteQuestionsById(prev, selectedQuestions));
    setSelectedQuestions([]);
    setIsSelectAll(false);
    
    toast({
      title: "Success",
      description: `${selectedQuestions.length} questions deleted successfully`,
    });
  };

  const handleBulkToggleEnabled = (enable: boolean) => {
    if (selectedQuestions.length === 0) return;
    
    setQuestions(prev => toggleQuestionsEnabled(prev, selectedQuestions, enable));
    
    toast({
      title: "Success",
      description: `${selectedQuestions.length} questions ${enable ? 'enabled' : 'disabled'} successfully`,
    });
  };

  // Individual operations
  const handleDeleteQuestion = (id: string) => {
    setQuestions(prev => deleteQuestionsById(prev, [id]));
    
    // Also remove from selected if it was selected
    setSelectedQuestions(prev => prev.filter(qId => qId !== id));
    
    toast({
      title: "Success",
      description: "Question deleted successfully",
    });
  };

  const handleUpdateQuestion = (updatedQuestion: QuestionItem) => {
    setQuestions(prev => updateQuestion(prev, updatedQuestion));
    
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
    try {
      const newQuestion = createQuestion(questions, newQuestionData);
      setQuestions(prev => [...prev, newQuestion]);
      
      // Set the new question as the preview
      setPreviewQuestion(newQuestion);
      
      toast({
        title: "Success",
        description: "New question added successfully",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add question",
        variant: "destructive"
      });
      return false;
    }
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
    getCategoryCount: (categoryName: string) => getCategoryCount(questions, categoryName)
  };
};
