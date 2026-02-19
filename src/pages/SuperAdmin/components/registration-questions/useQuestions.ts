
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { QuestionItem } from './types';
import { supabase } from '@/integrations/supabase/client';
import { fromDbQuestion, toDbQuestion } from './types';
import { filterQuestions, getCategoryCount } from './utils/questionUtils';
import { executeAdminAction } from '@/utils/admin/auditLogger';
import { useTranslations } from '@/hooks/useTranslations';

export const useQuestions = () => {
  const { t } = useTranslations();
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewQuestion, setPreviewQuestion] = useState<QuestionItem | null>(null);

  // Fetch questions from database
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('registration_questions')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      const mapped = (data || []).map(fromDbQuestion);
      setQuestions(mapped);
      if (!previewQuestion && mapped.length > 0) {
        setPreviewQuestion(mapped[0]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error(t('admin.fetch_questions_failed', 'Failed to load questions'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, []);

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

  const handleBulkDelete = async () => {
    if (selectedQuestions.length === 0) return;
    try {
      for (const id of selectedQuestions) {
        await executeAdminAction({ action: 'delete_record', table: 'registration_questions', recordId: id });
      }
      const count = selectedQuestions.length;
      setSelectedQuestions([]);
      setIsSelectAll(false);
      toast.success(t('admin.questions_deleted_success', `${count} questions deleted successfully`, { count: String(count) }));
      await fetchQuestions();
    } catch (error) {
      toast.error(t('admin.delete_failed', 'Failed to delete questions'));
    }
  };

  const handleBulkToggleEnabled = async (enable: boolean) => {
    if (selectedQuestions.length === 0) return;
    try {
      for (const id of selectedQuestions) {
        await executeAdminAction({ action: 'update_record', table: 'registration_questions', recordId: id, data: { enabled: enable } });
      }
      const action = enable ? t('admin.enabled', 'enabled') : t('admin.disabled', 'disabled');
      toast.success(t('admin.questions_toggled_success', `${selectedQuestions.length} questions ${action} successfully`, { count: String(selectedQuestions.length), action }));
      await fetchQuestions();
    } catch (error) {
      toast.error(t('admin.toggle_failed', 'Failed to toggle questions'));
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    const question = questions.find(q => q.id === id);
    if (question?.isSystemField) {
      toast.error(t('admin.system_fields_required', 'System fields are required for user registration'));
      return;
    }
    try {
      await executeAdminAction({ action: 'delete_record', table: 'registration_questions', recordId: id });
      setSelectedQuestions(prev => prev.filter(qId => qId !== id));
      toast.success(t('admin.question_deleted_success', 'Question deleted successfully'));
      await fetchQuestions();
    } catch (error) {
      toast.error(t('admin.delete_failed', 'Failed to delete question'));
    }
  };

  const handleUpdateQuestion = async (updatedQuestion: QuestionItem) => {
    try {
      const dbQ = toDbQuestion(updatedQuestion);
      const { error } = await supabase
        .from('registration_questions')
        .update(dbQ as any)
        .eq('id', updatedQuestion.id);
      if (error) throw error;
      
      if (previewQuestion && previewQuestion.id === updatedQuestion.id) {
        setPreviewQuestion(updatedQuestion);
      }
      toast.success(t('admin.question_updated_success', 'Question updated successfully'));
      await fetchQuestions();
    } catch (error) {
      toast.error(t('admin.update_failed', 'Failed to update question'));
    }
  };

  const handleAddQuestion = async (newQuestionData: Partial<QuestionItem>) => {
    try {
      if (!newQuestionData.text) {
        toast.error(t('admin.question_text_required', 'Question text is required'));
        return false;
      }
      const newQuestion: QuestionItem = {
        id: crypto.randomUUID(),
        text: newQuestionData.text,
        category: newQuestionData.category || 'Basics',
        fieldType: newQuestionData.fieldType || 'text',
        required: newQuestionData.required || false,
        enabled: newQuestionData.enabled !== undefined ? newQuestionData.enabled : true,
        registrationStep: newQuestionData.registrationStep || 'Personal',
        displayOrder: newQuestionData.displayOrder || questions.length + 1,
        placeholder: newQuestionData.placeholder || '',
        fieldOptions: newQuestionData.fieldOptions || [],
        profileField: newQuestionData.profileField || '',
        // Translation fields
        text_en: newQuestionData.text_en || newQuestionData.text,
        text_no: newQuestionData.text_no,
        text_ku_sorani: newQuestionData.text_ku_sorani,
        text_ku_kurmanci: newQuestionData.text_ku_kurmanci,
        text_de: newQuestionData.text_de,
        placeholder_en: newQuestionData.placeholder_en || newQuestionData.placeholder,
        placeholder_no: newQuestionData.placeholder_no,
        placeholder_ku_sorani: newQuestionData.placeholder_ku_sorani,
        placeholder_ku_kurmanci: newQuestionData.placeholder_ku_kurmanci,
        placeholder_de: newQuestionData.placeholder_de,
        field_options_en: newQuestionData.field_options_en || newQuestionData.fieldOptions || [],
        field_options_no: newQuestionData.field_options_no || [],
        field_options_ku_sorani: newQuestionData.field_options_ku_sorani || [],
        field_options_ku_kurmanci: newQuestionData.field_options_ku_kurmanci || [],
        field_options_de: newQuestionData.field_options_de || [],
      };

      const dbQ = toDbQuestion(newQuestion);
      const { error } = await supabase
        .from('registration_questions')
        .insert(dbQ as any);
      if (error) throw error;
      
      toast.success(t('admin.question_added_success', 'New question added successfully'));
      await fetchQuestions();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('admin.add_question_failed', 'Failed to add question'));
      return false;
    }
  };

  return {
    questions, filteredQuestions, selectedQuestions, isSelectAll, loading,
    activeTab, searchQuery, previewQuestion, setPreviewQuestion,
    setActiveTab, setSearchQuery, toggleQuestionSelection, toggleSelectAll,
    handleBulkDelete, handleBulkToggleEnabled, handleDeleteQuestion,
    handleUpdateQuestion, handleAddQuestion,
    getCategoryCount: (categoryName: string) => getCategoryCount(questions, categoryName)
  };
};
