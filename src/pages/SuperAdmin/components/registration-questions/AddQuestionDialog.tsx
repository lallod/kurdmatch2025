
import React from 'react';
import { Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuestionItem, QuestionTranslations } from './types';
import LanguageTranslationTabs from './LanguageTranslationTabs';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

interface AddQuestionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddQuestion: (question: Partial<QuestionItem>) => void;
  questionsCount: number;
}

const AddQuestionDialog: React.FC<AddQuestionDialogProps> = ({ 
  isOpen, onOpenChange, onAddQuestion, questionsCount
}) => {
  const { t } = useTranslations();
  const [newQuestion, setNewQuestion] = React.useState<Partial<QuestionItem>>({
    text: '', category: 'Basics', fieldType: 'text', required: false,
    enabled: true, registrationStep: 'Personal', displayOrder: questionsCount + 1,
    placeholder: '', fieldOptions: [], profileField: '',
    text_en: '', text_no: '', text_ku_sorani: '', text_ku_kurmanci: '', text_de: '',
    placeholder_en: '', placeholder_no: '', placeholder_ku_sorani: '', placeholder_ku_kurmanci: '', placeholder_de: '',
    field_options_en: [], field_options_no: [], field_options_ku_sorani: [], field_options_ku_kurmanci: [], field_options_de: [],
  });

  const handleAddFieldOption = (option: string) => {
    if (!option.trim()) return;
    setNewQuestion({
      ...newQuestion,
      fieldOptions: [...(newQuestion.fieldOptions || []), option.trim()]
    });
  };

  const handleRemoveFieldOption = (index: number) => {
    const newOptions = [...(newQuestion.fieldOptions || [])];
    newOptions.splice(index, 1);
    setNewQuestion({ ...newQuestion, fieldOptions: newOptions });
  };

  const handleTranslationChange = (updates: Partial<QuestionTranslations>) => {
    setNewQuestion({ ...newQuestion, ...updates });
  };

  const handleSubmit = () => {
    if (!newQuestion.text) {
      toast.error(t('admin.question_text_required', 'Question text is required'));
      return;
    }
    // Auto-fill text_en from text if empty
    const toSubmit = {
      ...newQuestion,
      text_en: newQuestion.text_en || newQuestion.text,
      placeholder_en: newQuestion.placeholder_en || newQuestion.placeholder,
      field_options_en: (newQuestion.field_options_en?.length ? newQuestion.field_options_en : newQuestion.fieldOptions) || [],
    };
    onAddQuestion(toSubmit);
    setNewQuestion({
      text: '', category: 'Basics', fieldType: 'text', required: false,
      enabled: true, registrationStep: 'Personal', displayOrder: questionsCount + 2,
      placeholder: '', fieldOptions: [], profileField: '',
      text_en: '', text_no: '', text_ku_sorani: '', text_ku_kurmanci: '', text_de: '',
      placeholder_en: '', placeholder_no: '', placeholder_ku_sorani: '', placeholder_ku_kurmanci: '', placeholder_de: '',
      field_options_en: [], field_options_no: [], field_options_ku_sorani: [], field_options_ku_kurmanci: [], field_options_de: [],
    });
  };

  const showOptions = newQuestion.fieldType === 'select' || newQuestion.fieldType === 'multi-select' || newQuestion.fieldType === 'radio';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t('admin.add_new_registration_question', 'Add New Registration Question')}</DialogTitle>
          <DialogDescription>{t('admin.create_question_desc', 'Create a new question for the registration process')}</DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="question-text">{t('admin.question_text', 'Question Text')} (Default)</Label>
                <Input id="question-text" value={newQuestion.text} onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})} placeholder={t('admin.question_text_placeholder', 'e.g., What are your favorite hobbies?')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{t('admin.category', 'Category')}</Label>
                <Select value={newQuestion.category} onValueChange={(value) => setNewQuestion({...newQuestion, category: value})}>
                  <SelectTrigger id="category"><SelectValue placeholder={t('admin.select_category', 'Select category')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basics">Basics</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="Beliefs">Beliefs</SelectItem>
                    <SelectItem value="Relationships">Relationships</SelectItem>
                    <SelectItem value="Personality">Personality</SelectItem>
                    <SelectItem value="Interests">Interests</SelectItem>
                    <SelectItem value="Physical">Physical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="field-type">{t('admin.field_type', 'Field Type')}</Label>
                <Select value={newQuestion.fieldType} onValueChange={(value) => setNewQuestion({...newQuestion, fieldType: value as any})}>
                  <SelectTrigger id="field-type"><SelectValue placeholder={t('admin.select_field_type', 'Select field type')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="multi-select">Multi Select</SelectItem>
                    <SelectItem value="radio">Radio</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="registration-step">{t('admin.registration_step', 'Registration Step')}</Label>
                <Select value={newQuestion.registrationStep} onValueChange={(value: any) => setNewQuestion({...newQuestion, registrationStep: value})}>
                  <SelectTrigger id="registration-step"><SelectValue placeholder={t('admin.select_registration_step', 'Select registration step')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Account">Account</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Physical">Physical</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="Beliefs">Beliefs</SelectItem>
                    <SelectItem value="Preferences">Preferences</SelectItem>
                    <SelectItem value="Profile">Profile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placeholder">{t('admin.placeholder_text', 'Placeholder Text')} (Default)</Label>
                <Input id="placeholder" value={newQuestion.placeholder} onChange={(e) => setNewQuestion({...newQuestion, placeholder: e.target.value})} placeholder={t('admin.placeholder_example', 'e.g., Enter your hobbies')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-field">{t('admin.profile_field_mapping', 'Profile Field Mapping')}</Label>
                <Input id="profile-field" value={newQuestion.profileField} onChange={(e) => setNewQuestion({...newQuestion, profileField: e.target.value})} placeholder={t('admin.profile_field_example', 'e.g., hobbies')} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="required" checked={newQuestion.required} onCheckedChange={(checked) => setNewQuestion({...newQuestion, required: !!checked})} />
                <Label htmlFor="required">{t('admin.required', 'Required')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="enabled" checked={newQuestion.enabled} onCheckedChange={(checked) => setNewQuestion({...newQuestion, enabled: !!checked})} />
                <Label htmlFor="enabled">{t('admin.enabled', 'Enabled')}</Label>
              </div>
            </div>
            
            {showOptions && (
              <div className="space-y-2">
                <Label>{t('admin.field_options', 'Field Options')} (Default)</Label>
                <div className="flex space-x-2">
                  <Input placeholder={t('admin.add_new_option', 'Add a new option')} id="field-option" onKeyDown={(e) => { if (e.key === 'Enter') { handleAddFieldOption(e.currentTarget.value); e.currentTarget.value = ''; } }} />
                  <Button type="button" variant="outline" onClick={() => { const input = document.getElementById('field-option') as HTMLInputElement; handleAddFieldOption(input.value); input.value = ''; }}>
                    {t('admin.add', 'Add')}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newQuestion.fieldOptions?.map((option, index) => (
                    <Badge key={index} variant="secondary" className="py-1 pl-2 pr-1">
                      {option}
                      <button type="button" className="ml-1 text-muted-foreground hover:text-foreground" onClick={() => handleRemoveFieldOption(index)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Multilingual translations */}
            <LanguageTranslationTabs
              translations={newQuestion as QuestionTranslations}
              onChange={handleTranslationChange}
              showOptions={showOptions}
            />
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('admin.cancel', 'Cancel')}</Button>
          <Button onClick={handleSubmit}>
            <Plus className="mr-2 h-4 w-4" /> {t('admin.add_question', 'Add Question')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestionDialog;
