
import { useState } from 'react';
import { toast } from 'sonner';
import { QuestionItem } from './types';
import { initialQuestions } from './data/sampleQuestions';
import { systemQuestions } from './data/systemQuestions';
import { filterQuestions, getCategoryCount } from './utils/questionUtils';
import { 
  createQuestion, 
  toggleQuestionsEnabled, 
  deleteQuestionsById, 
  updateQuestion 
} from './utils/questionOperations';
import { useTranslations } from '@/hooks/useTranslations';

export const useQuestions = () => {
  const { t } = useTranslations();
  
  const allQuestions = [...systemQuestions, ...initialQuestions];
  const [questions, setQuestions] = useState<QuestionItem[]>(allQuestions);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewQuestion, setPreviewQuestion] = useState<QuestionItem | null>(questions[0] || null);

  const filteredQuestions = filterQuestions(questions, activeTab, searchQuery);

  const toggleQuestionSelection = (id: string) => {
    const question = questions.find(q => q.id === id);
    if (question?.isSystemField) {
      toast.error(t('admin.system_fields_no_bulk', 'System fields cannot be modified in bulk operations'));
      return;
    }
    setSelectedQuestions(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(filteredQuestions.filter(q => !q.isSystemField).map(q => q.id));
    }
    setIsSelectAll(!isSelectAll);
  };

  const handleBulkDelete = () => {
    if (selectedQuestions.length === 0) return;
    setQuestions(prev => deleteQuestionsById(prev, selectedQuestions));
    const count = selectedQuestions.length;
    setSelectedQuestions([]);
    setIsSelectAll(false);
    toast.success(t('admin.questions_deleted_success', `${count} questions deleted successfully`, { count: String(count) }));
  };

  const handleBulkToggleEnabled = (enable: boolean) => {
    if (selectedQuestions.length === 0) return;
    setQuestions(prev => toggleQuestionsEnabled(prev, selectedQuestions, enable));
    const action = enable ? t('admin.enabled', 'enabled') : t('admin.disabled', 'disabled');
    toast.success(t('admin.questions_toggled_success', `${selectedQuestions.length} questions ${action} successfully`, { count: String(selectedQuestions.length), action }));
  };

  const handleDeleteQuestion = (id: string) => {
    const question = questions.find(q => q.id === id);
    if (question?.isSystemField) {
      toast.error(t('admin.system_fields_required', 'System fields are required for user registration'));
      return;
    }
    setQuestions(prev => deleteQuestionsById(prev, [id]));
    setSelectedQuestions(prev => prev.filter(qId => qId !== id));
    toast.success(t('admin.question_deleted_success', 'Question deleted successfully'));
  };

  const handleUpdateQuestion = (updatedQuestion: QuestionItem) => {
    const existingQuestion = questions.find(q => q.id === updatedQuestion.id);
    if (existingQuestion?.isSystemField) {
      updatedQuestion.isSystemField = true;
    }
    setQuestions(prev => updateQuestion(prev, updatedQuestion));
    if (previewQuestion && previewQuestion.id === updatedQuestion.id) {
      setPreviewQuestion(updatedQuestion);
    }
    toast.success(t('admin.question_updated_success', 'Question updated successfully'));
  };

  const handleAddQuestion = (newQuestionData: Partial<QuestionItem>) => {
    try {
      const newQuestion = createQuestion(questions, newQuestionData);
      setQuestions(prev => [...prev, newQuestion]);
      setPreviewQuestion(newQuestion);
      toast.success(t('admin.question_added_success', 'New question added successfully'));
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('admin.add_question_failed', 'Failed to add question'));
      return false;
    }
  };

  return {
    questions, filteredQuestions, selectedQuestions, isSelectAll,
    activeTab, searchQuery, previewQuestion, setPreviewQuestion,
    setActiveTab, setSearchQuery, toggleQuestionSelection, toggleSelectAll,
    handleBulkDelete, handleBulkToggleEnabled, handleDeleteQuestion,
    handleUpdateQuestion, handleAddQuestion,
    getCategoryCount: (categoryName: string) => getCategoryCount(questions, categoryName)
  };
};
