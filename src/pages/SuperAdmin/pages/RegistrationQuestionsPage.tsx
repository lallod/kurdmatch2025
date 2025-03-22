
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  AlertCircle, 
  Check
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

// Question types that can be used during registration
type QuestionType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

// Registration steps where questions can be placed
type RegistrationStep = 'basic-info' | 'personal-details' | 'preferences' | 'profile-completion';

// Interface for an individual question option (for select, radio, checkbox)
interface QuestionOption {
  id: string;
  value: string;
  label: string;
}

// Interface for a registration question
interface RegistrationQuestion {
  id: string;
  question: string;
  description?: string;
  type: QuestionType;
  step: RegistrationStep;
  isRequired: boolean;
  options?: QuestionOption[];
  order: number;
  isActive: boolean;
  profileField?: string; // Where the answer will be stored in the user profile
}

const RegistrationQuestionsPage = () => {
  // State for list of questions
  const [questions, setQuestions] = useState<RegistrationQuestion[]>([
    {
      id: '1',
      question: 'What is your name?',
      description: 'Please enter your full name',
      type: 'text',
      step: 'basic-info',
      isRequired: true,
      order: 1,
      isActive: true,
      profileField: 'name'
    },
    {
      id: '2',
      question: 'How old are you?',
      type: 'text',
      step: 'basic-info',
      isRequired: true,
      order: 2,
      isActive: true,
      profileField: 'age'
    },
    {
      id: '3',
      question: 'Tell us about yourself',
      description: 'Share a brief description about who you are',
      type: 'textarea',
      step: 'personal-details',
      isRequired: false,
      order: 1,
      isActive: true,
      profileField: 'bio'
    },
    {
      id: '4',
      question: 'What are you looking for?',
      type: 'radio',
      step: 'preferences',
      isRequired: true,
      options: [
        { id: '1', value: 'friendship', label: 'Friendship' },
        { id: '2', value: 'dating', label: 'Dating' },
        { id: '3', value: 'relationship', label: 'Serious Relationship' }
      ],
      order: 1,
      isActive: true,
      profileField: 'lookingFor'
    },
    {
      id: '5',
      question: 'Which languages do you speak?',
      type: 'checkbox',
      step: 'profile-completion',
      isRequired: false,
      options: [
        { id: '1', value: 'english', label: 'English' },
        { id: '2', value: 'spanish', label: 'Spanish' },
        { id: '3', value: 'french', label: 'French' },
        { id: '4', value: 'german', label: 'German' }
      ],
      order: 1,
      isActive: true,
      profileField: 'languages'
    }
  ]);
  
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for step filter
  const [stepFilter, setStepFilter] = useState<string>('all');
  
  // State for question dialog
  const [questionDialog, setQuestionDialog] = useState<{
    open: boolean;
    mode: 'add' | 'edit';
    currentQuestion: Partial<RegistrationQuestion> | null;
  }>({
    open: false,
    mode: 'add',
    currentQuestion: null
  });
  
  // State for options in the form
  const [optionInputs, setOptionInputs] = useState<QuestionOption[]>([]);

  // Filter questions based on search and step filter
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = 
      question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (question.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStep = stepFilter === 'all' || question.step === stepFilter;
    
    return matchesSearch && matchesStep;
  });

  // Function to get step name for display
  const getStepName = (step: RegistrationStep): string => {
    switch(step) {
      case 'basic-info':
        return 'Basic Info';
      case 'personal-details':
        return 'Personal Details';
      case 'preferences':
        return 'Preferences';
      case 'profile-completion':
        return 'Profile Completion';
      default:
        return step;
    }
  };

  // Function to get step badge color
  const getStepBadge = (step: RegistrationStep) => {
    switch(step) {
      case 'basic-info':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{getStepName(step)}</Badge>;
      case 'personal-details':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{getStepName(step)}</Badge>;
      case 'preferences':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{getStepName(step)}</Badge>;
      case 'profile-completion':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{getStepName(step)}</Badge>;
      default:
        return <Badge>{getStepName(step)}</Badge>;
    }
  };

  // Function to get question type badge
  const getTypeBadge = (type: QuestionType) => {
    switch(type) {
      case 'text':
        return <Badge variant="outline">Text</Badge>;
      case 'textarea':
        return <Badge variant="outline">Text Area</Badge>;
      case 'select':
        return <Badge variant="outline">Dropdown</Badge>;
      case 'radio':
        return <Badge variant="outline">Radio</Badge>;
      case 'checkbox':
        return <Badge variant="outline">Checkbox</Badge>;
      case 'date':
        return <Badge variant="outline">Date</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // Open dialog to add a new question
  const openAddQuestionDialog = () => {
    setOptionInputs([]);
    setQuestionDialog({
      open: true,
      mode: 'add',
      currentQuestion: {
        type: 'text',
        step: 'basic-info',
        isRequired: true,
        isActive: true,
        order: questions.length + 1
      }
    });
  };

  // Open dialog to edit an existing question
  const openEditQuestionDialog = (question: RegistrationQuestion) => {
    setOptionInputs(question.options || []);
    setQuestionDialog({
      open: true,
      mode: 'edit',
      currentQuestion: { ...question }
    });
  };

  // Close the question dialog
  const closeQuestionDialog = () => {
    setQuestionDialog({
      open: false,
      mode: 'add',
      currentQuestion: null
    });
  };

  // Add a new option to the question (for select, radio, checkbox)
  const addOption = () => {
    const newOption: QuestionOption = {
      id: `option-${optionInputs.length + 1}`,
      value: '',
      label: ''
    };
    setOptionInputs([...optionInputs, newOption]);
  };

  // Remove an option
  const removeOption = (index: number) => {
    const updatedOptions = [...optionInputs];
    updatedOptions.splice(index, 1);
    setOptionInputs(updatedOptions);
  };

  // Update an option's value and label
  const updateOption = (index: number, field: 'value' | 'label', value: string) => {
    const updatedOptions = [...optionInputs];
    updatedOptions[index][field] = value;
    setOptionInputs(updatedOptions);
  };

  // Save a question (add or edit)
  const saveQuestion = () => {
    if (!questionDialog.currentQuestion?.question || !questionDialog.currentQuestion.step) {
      // Validation: Require at least question text and step
      return;
    }

    // Prepare the question object
    const questionData: RegistrationQuestion = {
      id: questionDialog.currentQuestion.id || `q-${Date.now()}`,
      question: questionDialog.currentQuestion.question,
      description: questionDialog.currentQuestion.description,
      type: questionDialog.currentQuestion.type as QuestionType,
      step: questionDialog.currentQuestion.step as RegistrationStep,
      isRequired: questionDialog.currentQuestion.isRequired || false,
      isActive: questionDialog.currentQuestion.isActive || true,
      order: questionDialog.currentQuestion.order || questions.length + 1,
      profileField: questionDialog.currentQuestion.profileField,
      options: ['select', 'radio', 'checkbox'].includes(questionDialog.currentQuestion.type || '') 
        ? optionInputs 
        : undefined
    };

    if (questionDialog.mode === 'add') {
      // Add new question
      setQuestions([...questions, questionData]);
    } else {
      // Update existing question
      setQuestions(questions.map(q => 
        q.id === questionData.id ? questionData : q
      ));
    }

    closeQuestionDialog();
  };

  // Delete a question
  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  // Toggle question active status
  const toggleQuestionActive = (id: string) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, isActive: !q.isActive } : q
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Registration Questions</h1>
        <Button onClick={openAddQuestionDialog} className="gap-2">
          <Plus size={16} />
          Add Question
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registration Flow Management</CardTitle>
          <CardDescription>
            Manage questions users see during the registration process. Questions are organized by registration steps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="questions" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="questions">Questions Management</TabsTrigger>
              <TabsTrigger value="preview">Flow Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="questions">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={stepFilter} onValueChange={setStepFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by step" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Steps</SelectItem>
                      <SelectItem value="basic-info">Basic Info</SelectItem>
                      <SelectItem value="personal-details">Personal Details</SelectItem>
                      <SelectItem value="preferences">Preferences</SelectItem>
                      <SelectItem value="profile-completion">Profile Completion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Order</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Registration Step</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions.length > 0 ? (
                      filteredQuestions.map((question) => (
                        <TableRow key={question.id}>
                          <TableCell className="font-medium">{question.order}</TableCell>
                          <TableCell>
                            <div className="font-medium">{question.question}</div>
                            {question.description && (
                              <div className="text-xs text-gray-500 mt-1">{question.description}</div>
                            )}
                          </TableCell>
                          <TableCell>{getTypeBadge(question.type)}</TableCell>
                          <TableCell>{getStepBadge(question.step)}</TableCell>
                          <TableCell>
                            {question.isRequired ? 
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Required</Badge> : 
                              <Badge variant="outline">Optional</Badge>
                            }
                          </TableCell>
                          <TableCell>
                            <Switch 
                              checked={question.isActive} 
                              onCheckedChange={() => toggleQuestionActive(question.id)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditQuestionDialog(question)}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteQuestion(question.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          <div className="flex flex-col items-center gap-2">
                            <AlertCircle className="h-6 w-6 text-gray-400" />
                            <p>No questions found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold mb-2">Registration Flow Preview</h2>
                  <p className="text-gray-500">This shows how the registration process will appear to users</p>
                </div>
                
                {['basic-info', 'personal-details', 'preferences', 'profile-completion'].map((step) => {
                  const stepQuestions = questions.filter(q => q.step === step && q.isActive);
                  
                  if (stepQuestions.length === 0) return null;
                  
                  return (
                    <Card key={step} className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span>Step: {getStepName(step as RegistrationStep)}</span>
                          {getStepBadge(step as RegistrationStep)}
                        </CardTitle>
                        <CardDescription>
                          {step === 'basic-info' && 'Essential information to get started'}
                          {step === 'personal-details' && 'Help others get to know you better'}
                          {step === 'preferences' && 'Tell us what you\'re looking for'}
                          {step === 'profile-completion' && 'Final details to complete your profile'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {stepQuestions.map((question) => (
                            <div key={question.id} className="border p-4 rounded-md space-y-2">
                              <div className="font-medium flex items-center gap-2">
                                {question.question}
                                {question.isRequired && (
                                  <span className="text-red-500 text-sm">*</span>
                                )}
                              </div>
                              {question.description && (
                                <div className="text-sm text-gray-500">{question.description}</div>
                              )}
                              <div className="mt-2">
                                {question.type === 'text' && <Input disabled placeholder="Text input" />}
                                {question.type === 'textarea' && <Textarea disabled placeholder="Text area input" />}
                                {question.type === 'select' && (
                                  <Select disabled>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {question.options?.map(option => (
                                        <SelectItem key={option.id} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                                {question.type === 'radio' && (
                                  <RadioGroup disabled defaultValue="disabled">
                                    <div className="space-y-2">
                                      {question.options?.map(option => (
                                        <div key={option.id} className="flex items-center space-x-2">
                                          <RadioGroupItem value={option.value} id={option.id} />
                                          <Label htmlFor={option.id}>{option.label}</Label>
                                        </div>
                                      ))}
                                    </div>
                                  </RadioGroup>
                                )}
                                {question.type === 'checkbox' && (
                                  <div className="space-y-2">
                                    {question.options?.map(option => (
                                      <div key={option.id} className="flex items-center space-x-2">
                                        <Checkbox id={option.id} disabled />
                                        <Label htmlFor={option.id}>{option.label}</Label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Question Dialog */}
      <Dialog open={questionDialog.open} onOpenChange={(open) => !open && closeQuestionDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {questionDialog.mode === 'add' ? 'Add New Question' : 'Edit Question'}
            </DialogTitle>
            <DialogDescription>
              {questionDialog.mode === 'add' 
                ? 'Add a new question to the registration process.' 
                : 'Modify the existing registration question.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="question">Question Text <span className="text-red-500">*</span></Label>
                  <Input 
                    id="question" 
                    value={questionDialog.currentQuestion?.question || ''}
                    onChange={(e) => setQuestionDialog({
                      ...questionDialog,
                      currentQuestion: {
                        ...questionDialog.currentQuestion!,
                        question: e.target.value
                      }
                    })}
                    placeholder="Enter the question text"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    value={questionDialog.currentQuestion?.description || ''}
                    onChange={(e) => setQuestionDialog({
                      ...questionDialog,
                      currentQuestion: {
                        ...questionDialog.currentQuestion!,
                        description: e.target.value
                      }
                    })}
                    placeholder="Enter additional description or instructions"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Question Type <span className="text-red-500">*</span></Label>
                    <Select 
                      value={questionDialog.currentQuestion?.type || 'text'}
                      onValueChange={(value) => setQuestionDialog({
                        ...questionDialog,
                        currentQuestion: {
                          ...questionDialog.currentQuestion!,
                          type: value as QuestionType
                        }
                      })}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Input</SelectItem>
                        <SelectItem value="textarea">Text Area</SelectItem>
                        <SelectItem value="select">Dropdown</SelectItem>
                        <SelectItem value="radio">Radio Buttons</SelectItem>
                        <SelectItem value="checkbox">Checkboxes</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="step">Registration Step <span className="text-red-500">*</span></Label>
                    <Select 
                      value={questionDialog.currentQuestion?.step || 'basic-info'}
                      onValueChange={(value) => setQuestionDialog({
                        ...questionDialog,
                        currentQuestion: {
                          ...questionDialog.currentQuestion!,
                          step: value as RegistrationStep
                        }
                      })}
                    >
                      <SelectTrigger id="step">
                        <SelectValue placeholder="Select step" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic-info">Basic Info</SelectItem>
                        <SelectItem value="personal-details">Personal Details</SelectItem>
                        <SelectItem value="preferences">Preferences</SelectItem>
                        <SelectItem value="profile-completion">Profile Completion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input 
                      id="order" 
                      type="number"
                      min="1"
                      value={questionDialog.currentQuestion?.order || ''}
                      onChange={(e) => setQuestionDialog({
                        ...questionDialog,
                        currentQuestion: {
                          ...questionDialog.currentQuestion!,
                          order: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="profileField">Profile Field (where to store data)</Label>
                    <Input 
                      id="profileField" 
                      value={questionDialog.currentQuestion?.profileField || ''}
                      onChange={(e) => setQuestionDialog({
                        ...questionDialog,
                        currentQuestion: {
                          ...questionDialog.currentQuestion!,
                          profileField: e.target.value
                        }
                      })}
                      placeholder="e.g., bio, languages, lookingFor"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="required"
                      checked={questionDialog.currentQuestion?.isRequired || false}
                      onCheckedChange={(checked) => setQuestionDialog({
                        ...questionDialog,
                        currentQuestion: {
                          ...questionDialog.currentQuestion!,
                          isRequired: checked
                        }
                      })}
                    />
                    <Label htmlFor="required">Required Question</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="active"
                      checked={questionDialog.currentQuestion?.isActive || false}
                      onCheckedChange={(checked) => setQuestionDialog({
                        ...questionDialog,
                        currentQuestion: {
                          ...questionDialog.currentQuestion!,
                          isActive: checked
                        }
                      })}
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </div>
                
                {/* Options section for select, radio, checkbox types */}
                {['select', 'radio', 'checkbox'].includes(questionDialog.currentQuestion?.type || '') && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <Label>Options <span className="text-red-500">*</span></Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={addOption}
                        className="h-8"
                      >
                        <Plus size={14} className="mr-1" /> Add Option
                      </Button>
                    </div>
                    
                    {optionInputs.length > 0 ? (
                      <div className="space-y-2">
                        {optionInputs.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex items-center">
                              <GripVertical size={16} className="text-gray-400 mr-2" />
                            </div>
                            <Input
                              value={option.value}
                              onChange={(e) => updateOption(index, 'value', e.target.value)}
                              placeholder="Value (stored in database)"
                              className="w-1/3"
                            />
                            <Input
                              value={option.label}
                              onChange={(e) => updateOption(index, 'label', e.target.value)}
                              placeholder="Label (shown to user)"
                              className="flex-1"
                            />
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeOption(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border rounded-md p-4 text-center text-gray-500">
                        <p>No options added yet. Click "Add Option" to add some.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
                      
          <DialogFooter>
            <Button variant="outline" onClick={closeQuestionDialog}>Cancel</Button>
            <Button onClick={saveQuestion}>
              {questionDialog.mode === 'add' ? 'Add Question' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationQuestionsPage;
