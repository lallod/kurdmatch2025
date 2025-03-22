
import React from 'react';
import { Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { QuestionItem } from './types';

interface EditQuestionDialogProps {
  question: QuestionItem | null;
  onOpenChange: (open: boolean) => void;
  onSave: (question: QuestionItem) => void;
}

const EditQuestionDialog: React.FC<EditQuestionDialogProps> = ({ 
  question, 
  onOpenChange, 
  onSave 
}) => {
  const [editingQuestion, setEditingQuestion] = React.useState<QuestionItem | null>(question);

  React.useEffect(() => {
    setEditingQuestion(question);
  }, [question]);

  const handleAddFieldOption = (option: string) => {
    if (!option.trim() || !editingQuestion) return;
    
    setEditingQuestion({
      ...editingQuestion,
      fieldOptions: [...(editingQuestion.fieldOptions || []), option.trim()]
    });
  };

  const handleRemoveFieldOption = (index: number) => {
    if (!editingQuestion) return;
    
    const newOptions = [...(editingQuestion.fieldOptions || [])];
    newOptions.splice(index, 1);
    setEditingQuestion({
      ...editingQuestion,
      fieldOptions: newOptions
    });
  };

  if (!editingQuestion) return null;

  return (
    <Dialog open={!!question} onOpenChange={(open) => !open && onOpenChange(false)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Registration Question</DialogTitle>
          <DialogDescription>
            Make changes to the registration question below
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-question-text">Question Text</Label>
              <Input
                id="edit-question-text"
                value={editingQuestion.text}
                onChange={(e) => setEditingQuestion({...editingQuestion, text: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={editingQuestion.category}
                onValueChange={(value) => setEditingQuestion({...editingQuestion, category: value})}
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
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
              <Label htmlFor="edit-field-type">Field Type</Label>
              <Select
                value={editingQuestion.fieldType}
                onValueChange={(value) => setEditingQuestion({...editingQuestion, fieldType: value as any})}
              >
                <SelectTrigger id="edit-field-type">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
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
              <Label htmlFor="edit-registration-step">Registration Step</Label>
              <Select
                value={editingQuestion.registrationStep}
                onValueChange={(value: 'Account' | 'Personal' | 'Profile' | 'Preferences') => 
                  setEditingQuestion({...editingQuestion, registrationStep: value})
                }
              >
                <SelectTrigger id="edit-registration-step">
                  <SelectValue placeholder="Select registration step" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Account">Account</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Profile">Profile</SelectItem>
                  <SelectItem value="Preferences">Preferences</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-placeholder">Placeholder Text</Label>
              <Input
                id="edit-placeholder"
                value={editingQuestion.placeholder}
                onChange={(e) => setEditingQuestion({...editingQuestion, placeholder: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-profile-field">Profile Field Mapping</Label>
              <Input
                id="edit-profile-field"
                value={editingQuestion.profileField}
                onChange={(e) => setEditingQuestion({...editingQuestion, profileField: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-required"
                checked={editingQuestion.required}
                onCheckedChange={(checked) => 
                  setEditingQuestion({...editingQuestion, required: !!checked})
                }
              />
              <Label htmlFor="edit-required">Required</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-enabled"
                checked={editingQuestion.enabled}
                onCheckedChange={(checked) => 
                  setEditingQuestion({...editingQuestion, enabled: !!checked})
                }
              />
              <Label htmlFor="edit-enabled">Enabled</Label>
            </div>
          </div>
          
          {(editingQuestion.fieldType === 'select' || 
            editingQuestion.fieldType === 'multi-select' || 
            editingQuestion.fieldType === 'radio') && (
            <div className="space-y-2">
              <Label>Field Options</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a new option"
                  id="edit-field-option"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget;
                      handleAddFieldOption(input.value);
                      input.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.getElementById('edit-field-option') as HTMLInputElement;
                    handleAddFieldOption(input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {editingQuestion.fieldOptions?.map((option, index) => (
                  <Badge key={index} variant="secondary" className="py-1 pl-2 pr-1">
                    {option}
                    <button
                      type="button"
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemoveFieldOption(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(editingQuestion)}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuestionDialog;
