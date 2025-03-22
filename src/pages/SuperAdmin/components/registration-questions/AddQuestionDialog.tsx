
import React from 'react';
import { Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { QuestionItem } from './types';
import { useToast } from "@/hooks/use-toast";

interface AddQuestionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddQuestion: (question: Partial<QuestionItem>) => void;
  questionsCount: number;
}

const AddQuestionDialog: React.FC<AddQuestionDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onAddQuestion,
  questionsCount
}) => {
  const { toast } = useToast();
  const [newQuestion, setNewQuestion] = React.useState<Partial<QuestionItem>>({
    text: '',
    category: 'Basics',
    fieldType: 'text',
    required: false,
    enabled: true,
    registrationStep: 'Personal',
    displayOrder: questionsCount + 1,
    placeholder: '',
    fieldOptions: [],
    profileField: ''
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
    setNewQuestion({
      ...newQuestion,
      fieldOptions: newOptions
    });
  };

  const handleSubmit = () => {
    if (!newQuestion.text) {
      toast({
        title: "Error",
        description: "Question text is required",
        variant: "destructive"
      });
      return;
    }
    
    onAddQuestion(newQuestion);
    
    // Reset form
    setNewQuestion({
      text: '',
      category: 'Basics',
      fieldType: 'text',
      required: false,
      enabled: true,
      registrationStep: 'Personal',
      displayOrder: questionsCount + 2,
      placeholder: '',
      fieldOptions: [],
      profileField: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Registration Question</DialogTitle>
          <DialogDescription>
            Create a new question for the registration process
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="question-text">Question Text</Label>
              <Input
                id="question-text"
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                placeholder="e.g., What are your favorite hobbies?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newQuestion.category}
                onValueChange={(value) => setNewQuestion({...newQuestion, category: value})}
              >
                <SelectTrigger id="category">
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
              <Label htmlFor="field-type">Field Type</Label>
              <Select
                value={newQuestion.fieldType}
                onValueChange={(value) => setNewQuestion({...newQuestion, fieldType: value as any})}
              >
                <SelectTrigger id="field-type">
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
              <Label htmlFor="registration-step">Registration Step</Label>
              <Select
                value={newQuestion.registrationStep}
                onValueChange={(value: 'Account' | 'Personal' | 'Profile' | 'Preferences') => 
                  setNewQuestion({...newQuestion, registrationStep: value})
                }
              >
                <SelectTrigger id="registration-step">
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
              <Label htmlFor="placeholder">Placeholder Text</Label>
              <Input
                id="placeholder"
                value={newQuestion.placeholder}
                onChange={(e) => setNewQuestion({...newQuestion, placeholder: e.target.value})}
                placeholder="e.g., Enter your hobbies"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-field">Profile Field Mapping</Label>
              <Input
                id="profile-field"
                value={newQuestion.profileField}
                onChange={(e) => setNewQuestion({...newQuestion, profileField: e.target.value})}
                placeholder="e.g., hobbies"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={newQuestion.required}
                onCheckedChange={(checked) => 
                  setNewQuestion({...newQuestion, required: !!checked})
                }
              />
              <Label htmlFor="required">Required</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enabled"
                checked={newQuestion.enabled}
                onCheckedChange={(checked) => 
                  setNewQuestion({...newQuestion, enabled: !!checked})
                }
              />
              <Label htmlFor="enabled">Enabled</Label>
            </div>
          </div>
          
          {(newQuestion.fieldType === 'select' || 
            newQuestion.fieldType === 'multi-select' || 
            newQuestion.fieldType === 'radio') && (
            <div className="space-y-2">
              <Label>Field Options</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a new option"
                  id="field-option"
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
                    const input = document.getElementById('field-option') as HTMLInputElement;
                    handleAddFieldOption(input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {newQuestion.fieldOptions?.map((option, index) => (
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
          <Button onClick={handleSubmit}>
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestionDialog;
