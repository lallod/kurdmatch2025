
import React, { useState } from 'react';
import { Search, Plus, Filter, Download, Trash2, Edit, Eye, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QuestionCategoriesSection from '../components/registration-questions/QuestionCategoriesSection';
import QuestionPreviewCard from '../components/registration-questions/QuestionPreviewCard';
import { useToast } from "@/hooks/use-toast";

const RegistrationQuestionsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  // Dummy data for questions based on profile details
  const [questions, setQuestions] = useState<QuestionItem[]>([
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
  ]);

  // New question form state
  const [newQuestion, setNewQuestion] = useState<Partial<QuestionItem>>({
    text: '',
    category: 'Basics',
    fieldType: 'text',
    required: false,
    enabled: true,
    registrationStep: 'Personal',
    displayOrder: questions.length + 1,
    placeholder: '',
    fieldOptions: [],
    profileField: ''
  });

  // Filter questions by tab and search query
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

  // Toggle question selection for bulk actions
  const toggleQuestionSelection = (id: string) => {
    setSelectedQuestions(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  // Toggle select all questions
  const toggleSelectAll = () => {
    if (isSelectAll) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(filteredQuestions.map(q => q.id));
    }
    setIsSelectAll(!isSelectAll);
  };

  // Handle bulk delete of selected questions
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

  // Handle bulk enable/disable of selected questions
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

  // Handle question edit submission
  const handleEditSubmit = () => {
    if (!editingQuestion) return;
    
    setQuestions(prev => 
      prev.map(q => q.id === editingQuestion.id ? editingQuestion : q)
    );
    
    setEditingQuestion(null);
    
    toast({
      title: "Success",
      description: "Question updated successfully",
    });
  };

  // Handle new question submission
  const handleNewQuestionSubmit = () => {
    if (!newQuestion.text) {
      toast({
        title: "Error",
        description: "Question text is required",
        variant: "destructive"
      });
      return;
    }
    
    const newId = (Math.max(...questions.map(q => parseInt(q.id))) + 1).toString();
    
    setQuestions(prev => [...prev, {
      id: newId,
      text: newQuestion.text!,
      category: newQuestion.category || 'Basics',
      fieldType: newQuestion.fieldType || 'text',
      required: newQuestion.required || false,
      enabled: newQuestion.enabled !== undefined ? newQuestion.enabled : true,
      registrationStep: newQuestion.registrationStep || 'Personal',
      displayOrder: newQuestion.displayOrder || prev.length + 1,
      placeholder: newQuestion.placeholder || '',
      fieldOptions: newQuestion.fieldOptions || [],
      profileField: newQuestion.profileField || ''
    }]);
    
    setIsAddDialogOpen(false);
    
    // Reset new question form
    setNewQuestion({
      text: '',
      category: 'Basics',
      fieldType: 'text',
      required: false,
      enabled: true,
      registrationStep: 'Personal',
      displayOrder: questions.length + 2, // +1 for the question we just added
      placeholder: '',
      fieldOptions: [],
      profileField: ''
    });
    
    toast({
      title: "Success",
      description: "New question added successfully",
    });
  };

  // Handle adding a field option
  const handleAddFieldOption = (option: string, isEdit = false) => {
    if (!option.trim()) return;
    
    if (isEdit && editingQuestion) {
      setEditingQuestion({
        ...editingQuestion,
        fieldOptions: [...(editingQuestion.fieldOptions || []), option.trim()]
      });
    } else {
      setNewQuestion({
        ...newQuestion,
        fieldOptions: [...(newQuestion.fieldOptions || []), option.trim()]
      });
    }
  };

  // Handle removing a field option
  const handleRemoveFieldOption = (index: number, isEdit = false) => {
    if (isEdit && editingQuestion) {
      const newOptions = [...(editingQuestion.fieldOptions || [])];
      newOptions.splice(index, 1);
      setEditingQuestion({
        ...editingQuestion,
        fieldOptions: newOptions
      });
    } else {
      const newOptions = [...(newQuestion.fieldOptions || [])];
      newOptions.splice(index, 1);
      setNewQuestion({
        ...newQuestion,
        fieldOptions: newOptions
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Registration Questions</h1>
          <p className="text-muted-foreground">
            Manage the questions users are asked during the registration process
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              // Export questions logic
              toast({
                title: "Export Started",
                description: "Questions exported to CSV successfully",
              });
            }}
          >
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="w-2/3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Registration Questions</CardTitle>
                  <CardDescription>
                    Configure questions users will answer during registration
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search questions..."
                      className="pl-8 w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Filter Questions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setActiveTab('required')}>
                        Required Questions
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActiveTab('optional')}>
                        Optional Questions
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActiveTab('enabled')}>
                        Enabled Questions
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActiveTab('disabled')}>
                        Disabled Questions
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-7 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="basic">Basics</TabsTrigger>
                  <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
                  <TabsTrigger value="beliefs">Beliefs</TabsTrigger>
                  <TabsTrigger value="relationships">Relationships</TabsTrigger>
                  <TabsTrigger value="personality">Personality</TabsTrigger>
                  <TabsTrigger value="interests">Interests</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  {selectedQuestions.length > 0 && (
                    <div className="bg-secondary/30 p-2 rounded-lg flex items-center justify-between">
                      <span className="text-sm">{selectedQuestions.length} questions selected</span>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleBulkToggleEnabled(true)}
                        >
                          Enable
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleBulkToggleEnabled(false)}
                        >
                          Disable
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={handleBulkDelete}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40px]">
                            <Checkbox 
                              checked={isSelectAll} 
                              onCheckedChange={toggleSelectAll} 
                            />
                          </TableHead>
                          <TableHead className="w-[200px]">Question</TableHead>
                          <TableHead className="w-[120px]">Category</TableHead>
                          <TableHead className="w-[100px]">Field Type</TableHead>
                          <TableHead className="w-[100px]">Required</TableHead>
                          <TableHead className="w-[100px]">Status</TableHead>
                          <TableHead className="w-[120px]">Registration Step</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredQuestions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                              No questions found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredQuestions.map((question) => (
                            <TableRow key={question.id}>
                              <TableCell>
                                <Checkbox 
                                  checked={selectedQuestions.includes(question.id)} 
                                  onCheckedChange={() => toggleQuestionSelection(question.id)} 
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                {question.text}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {question.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="capitalize">
                                  {question.fieldType}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {question.required ? (
                                  <Badge className="bg-primary/10 text-primary">Required</Badge>
                                ) : (
                                  <Badge variant="outline">Optional</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {question.enabled ? (
                                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800">Disabled</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {question.registrationStep}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditingQuestion(question)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      // Preview question logic
                                      toast({
                                        title: "Preview",
                                        description: `Previewing: ${question.text}`,
                                      });
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                    onClick={() => {
                                      setQuestions(prev => prev.filter(q => q.id !== question.id));
                                      toast({
                                        title: "Success",
                                        description: "Question deleted successfully",
                                      });
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="w-1/3 space-y-6">
          <QuestionCategoriesSection />
          <QuestionPreviewCard />
        </div>
      </div>

      {/* Edit Question Dialog */}
      <Dialog open={!!editingQuestion} onOpenChange={(open) => !open && setEditingQuestion(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Registration Question</DialogTitle>
            <DialogDescription>
              Make changes to the registration question below
            </DialogDescription>
          </DialogHeader>
          
          {editingQuestion && (
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
                    onValueChange={(value) => setEditingQuestion({...editingQuestion, registrationStep: value})}
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
                          handleAddFieldOption(input.value, true);
                          input.value = '';
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.getElementById('edit-field-option') as HTMLInputElement;
                        handleAddFieldOption(input.value, true);
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
                          onClick={() => handleRemoveFieldOption(index, true)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingQuestion(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Question Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                  onValueChange={(value) => setNewQuestion({...newQuestion, registrationStep: value})}
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
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleNewQuestionSubmit}>
              <Plus className="mr-2 h-4 w-4" /> Add Question
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationQuestionsPage;
