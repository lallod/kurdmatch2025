
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoveVertical,
  Eye,
  Check,
  X,
  SlidersHorizontal,
  ArrowUpDown
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Define question types
const questionTypes = [
  { id: 'text', label: 'Text Input' },
  { id: 'textarea', label: 'Text Area' },
  { id: 'number', label: 'Number Input' },
  { id: 'select', label: 'Select Dropdown' },
  { id: 'multiselect', label: 'Multi-Select Dropdown' },
  { id: 'radio', label: 'Radio Buttons' },
  { id: 'checkbox', label: 'Checkboxes' },
  { id: 'date', label: 'Date Picker' },
  { id: 'time', label: 'Time Picker' },
  { id: 'email', label: 'Email Input' },
  { id: 'phone', label: 'Phone Number' },
  { id: 'url', label: 'URL Input' },
  { id: 'range', label: 'Range Slider' },
  { id: 'color', label: 'Color Picker' },
  { id: 'file', label: 'File Upload' },
  { id: 'imageSelect', label: 'Image Selection' },
  { id: 'rating', label: 'Rating Scale' },
  { id: 'likert', label: 'Likert Scale' },
  { id: 'matrix', label: 'Matrix Questions' },
  { id: 'ranking', label: 'Ranking Questions' }
];

// Define interface for question category
interface QuestionCategory {
  id: string;
  name: string;
  description: string;
  order: number;
  active: boolean;
}

// Define interface for registration question
interface RegistrationQuestion {
  id: string;
  categoryId: string;
  text: string;
  type: string;
  required: boolean;
  order: number;
  active: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  validation?: string;
}

// Mock data for categories
const initialCategories: QuestionCategory[] = [
  { id: 'basic', name: 'Basic Information', description: 'Basic user information', order: 1, active: true },
  { id: 'preferences', name: 'User Preferences', description: 'Preferences for matching', order: 2, active: true },
  { id: 'interests', name: 'Interests & Hobbies', description: 'User interests and hobbies', order: 3, active: true },
];

// Mock data for questions
const initialQuestions: RegistrationQuestion[] = [
  { 
    id: 'q1', 
    categoryId: 'basic', 
    text: 'What is your name?', 
    type: 'text', 
    required: true, 
    order: 1, 
    active: true,
    placeholder: 'Enter your full name',
    helpText: 'Please provide your full name as it appears on your ID'
  },
  { 
    id: 'q2', 
    categoryId: 'basic', 
    text: 'What is your age?', 
    type: 'number', 
    required: true, 
    order: 2, 
    active: true,
    validation: 'min:18,max:100'
  },
  { 
    id: 'q3', 
    categoryId: 'preferences', 
    text: 'What are you looking for?', 
    type: 'radio', 
    required: true, 
    order: 1, 
    active: true,
    options: ['Friendship', 'Dating', 'Long-term relationship']
  },
  { 
    id: 'q4', 
    categoryId: 'interests', 
    text: 'Select your interests', 
    type: 'checkbox', 
    required: false, 
    order: 1, 
    active: true,
    options: ['Sports', 'Music', 'Movies', 'Books', 'Travel', 'Food']
  }
];

// Schema for category form
const categoryFormSchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  description: z.string().optional(),
  active: z.boolean().default(true),
});

// Schema for question form
const questionFormSchema = z.object({
  categoryId: z.string().min(1, { message: "Category is required" }),
  text: z.string().min(1, { message: "Question text is required" }),
  type: z.string().min(1, { message: "Question type is required" }),
  required: z.boolean().default(false),
  active: z.boolean().default(true),
  options: z.string().optional(),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  validation: z.string().optional(),
});

const RegistrationQuestionsPage = () => {
  const [categories, setCategories] = useState<QuestionCategory[]>(initialCategories);
  const [questions, setQuestions] = useState<RegistrationQuestion[]>(initialQuestions);
  const [activeTab, setActiveTab] = useState<string>("categories");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  
  // Dialog states
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState<boolean>(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState<boolean>(false);
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | null>(null);
  
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState<boolean>(false);
  const [isEditQuestionOpen, setIsEditQuestionOpen] = useState<boolean>(false);
  const [isDeleteQuestionOpen, setIsDeleteQuestionOpen] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<RegistrationQuestion | null>(null);

  // Category form
  const categoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      active: true,
    },
  });

  // Question form
  const questionForm = useForm<z.infer<typeof questionFormSchema>>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      categoryId: "",
      text: "",
      type: "",
      required: false,
      active: true,
      options: "",
      placeholder: "",
      helpText: "",
      validation: "",
    },
  });

  // Handle drag and drop for categories
  const handleDragEndCategories = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    setCategories(updatedItems);
    toast.success("Categories order updated successfully");
  };
  
  // Handle drag and drop for questions
  const handleDragEndQuestions = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property for questions within the same category
    const categoryId = reorderedItem.categoryId;
    const categoryQuestions = items.filter(q => q.categoryId === categoryId);
    
    const updatedItems = items.map(item => {
      if (item.categoryId === categoryId) {
        const index = categoryQuestions.findIndex(q => q.id === item.id);
        return {
          ...item,
          order: index + 1
        };
      }
      return item;
    });
    
    setQuestions(updatedItems);
    toast.success("Questions order updated successfully");
  };

  // Filter questions by category and search term
  const getFilteredQuestions = (categoryId: string) => {
    return questions
      .filter(q => q.categoryId === categoryId)
      .filter(q => q.text.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.order - b.order);
  };

  // Add new category
  const handleAddCategory = (data: z.infer<typeof categoryFormSchema>) => {
    const newCategory: QuestionCategory = {
      id: `category-${Date.now()}`,
      name: data.name,
      description: data.description || "",
      order: categories.length + 1,
      active: data.active,
    };
    
    setCategories([...categories, newCategory]);
    setIsAddCategoryOpen(false);
    categoryForm.reset();
    toast.success("Category added successfully");
  };

  // Edit category
  const handleEditCategory = (data: z.infer<typeof categoryFormSchema>) => {
    if (!selectedCategory) return;
    
    const updatedCategories = categories.map(cat => 
      cat.id === selectedCategory.id 
        ? { 
            ...cat, 
            name: data.name, 
            description: data.description || "", 
            active: data.active 
          } 
        : cat
    );
    
    setCategories(updatedCategories);
    setIsEditCategoryOpen(false);
    setSelectedCategory(null);
    toast.success("Category updated successfully");
  };

  // Delete category
  const handleDeleteCategory = () => {
    if (!selectedCategory) return;
    
    const updatedCategories = categories.filter(cat => cat.id !== selectedCategory.id);
    // Remove questions in this category or assign them to another category
    const updatedQuestions = questions.filter(q => q.categoryId !== selectedCategory.id);
    
    setCategories(updatedCategories);
    setQuestions(updatedQuestions);
    setIsDeleteCategoryOpen(false);
    setSelectedCategory(null);
    toast.success("Category deleted successfully");
  };

  // Add new question
  const handleAddQuestion = (data: z.infer<typeof questionFormSchema>) => {
    const newQuestion: RegistrationQuestion = {
      id: `question-${Date.now()}`,
      categoryId: data.categoryId,
      text: data.text,
      type: data.type,
      required: data.required,
      active: data.active,
      order: questions.filter(q => q.categoryId === data.categoryId).length + 1,
      options: data.options ? data.options.split(',').map(opt => opt.trim()) : undefined,
      placeholder: data.placeholder,
      helpText: data.helpText,
      validation: data.validation,
    };
    
    setQuestions([...questions, newQuestion]);
    setIsAddQuestionOpen(false);
    questionForm.reset();
    toast.success("Question added successfully");
  };

  // Edit question
  const handleEditQuestion = (data: z.infer<typeof questionFormSchema>) => {
    if (!selectedQuestion) return;
    
    const updatedQuestions = questions.map(q => 
      q.id === selectedQuestion.id 
        ? { 
            ...q, 
            categoryId: data.categoryId,
            text: data.text,
            type: data.type,
            required: data.required,
            active: data.active,
            options: data.options ? data.options.split(',').map(opt => opt.trim()) : undefined,
            placeholder: data.placeholder,
            helpText: data.helpText,
            validation: data.validation,
          } 
        : q
    );
    
    setQuestions(updatedQuestions);
    setIsEditQuestionOpen(false);
    setSelectedQuestion(null);
    toast.success("Question updated successfully");
  };

  // Delete question
  const handleDeleteQuestion = () => {
    if (!selectedQuestion) return;
    
    const updatedQuestions = questions.filter(q => q.id !== selectedQuestion.id);
    
    setQuestions(updatedQuestions);
    setIsDeleteQuestionOpen(false);
    setSelectedQuestion(null);
    toast.success("Question deleted successfully");
  };

  // Open edit category dialog
  const openEditCategoryDialog = (category: QuestionCategory) => {
    setSelectedCategory(category);
    categoryForm.reset({
      name: category.name,
      description: category.description,
      active: category.active,
    });
    setIsEditCategoryOpen(true);
  };

  // Open edit question dialog
  const openEditQuestionDialog = (question: RegistrationQuestion) => {
    setSelectedQuestion(question);
    questionForm.reset({
      categoryId: question.categoryId,
      text: question.text,
      type: question.type,
      required: question.required,
      active: question.active,
      options: question.options?.join(', '),
      placeholder: question.placeholder,
      helpText: question.helpText,
      validation: question.validation,
    });
    setIsEditQuestionOpen(true);
  };

  // Dynamic form component for preview
  const DynamicFormField = ({ question }: { question: RegistrationQuestion }) => {
    switch (question.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'phone':
        return (
          <Input 
            placeholder={question.placeholder} 
            type={question.type === 'email' ? 'email' : 
                 question.type === 'url' ? 'url' : 'text'} 
          />
        );
      case 'textarea':
        return <Textarea placeholder={question.placeholder} />;
      case 'number':
        return <Input type="number" placeholder={question.placeholder} />;
      case 'select':
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, i) => (
                <SelectItem key={i} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'radio':
        return (
          <RadioGroup>
            {question.options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${i}`} />
                <Label htmlFor={`${question.id}-${i}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Checkbox id={`${question.id}-${i}`} />
                <Label htmlFor={`${question.id}-${i}`}>{option}</Label>
              </div>
            ))}
          </div>
        );
      case 'date':
        return <Input type="date" />;
      case 'time':
        return <Input type="time" />;
      case 'range':
        return <Input type="range" min="0" max="100" />;
      case 'color':
        return <Input type="color" />;
      case 'file':
        return <Input type="file" />;
      case 'rating':
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map(rating => (
              <Button 
                key={rating} 
                variant="outline" 
                size="sm"
                className="h-10 w-10"
              >
                {rating}
              </Button>
            ))}
          </div>
        );
      default:
        return <Input />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Registration Questions Management</h1>
          <p className="text-muted-foreground">Manage questions and categories for user registration</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center"
          >
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main management interface */}
        <div className={`${showPreview ? 'md:w-1/2' : 'w-full'}`}>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Registration Questions Configuration</CardTitle>
                  <CardDescription>Add, edit, and organize registration questions and categories</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search questions..."
                      className="pl-8 w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {activeTab === "categories" && (
                    <Button onClick={() => setIsAddCategoryOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Category
                    </Button>
                  )}
                  {activeTab === "questions" && (
                    <Button onClick={() => setIsAddQuestionOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Question
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                </TabsList>

                <TabsContent value="categories">
                  <DragDropContext onDragEnd={handleDragEndCategories}>
                    <Droppable droppableId="categories">
                      {(provided) => (
                        <div 
                          {...provided.droppableProps} 
                          ref={provided.innerRef}
                        >
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-10"></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {categories
                                .sort((a, b) => a.order - b.order)
                                .map((category, index) => (
                                  <Draggable 
                                    key={category.id} 
                                    draggableId={category.id} 
                                    index={index}
                                  >
                                    {(provided) => (
                                      <TableRow 
                                        ref={provided.innerRef} 
                                        {...provided.draggableProps}
                                      >
                                        <TableCell>
                                          <div {...provided.dragHandleProps} className="cursor-move">
                                            <MoveVertical size={16} />
                                          </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>{category.description}</TableCell>
                                        <TableCell>{category.order}</TableCell>
                                        <TableCell>
                                          <span className={`px-2 py-1 rounded-full text-xs ${category.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {category.active ? 'Active' : 'Inactive'}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <div className="flex justify-end space-x-2">
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              onClick={() => openEditCategoryDialog(category)}
                                            >
                                              <Edit size={16} />
                                            </Button>
                                            <Button 
                                              variant="ghost" 
                                              size="icon"
                                              onClick={() => {
                                                setSelectedCategory(category);
                                                setIsDeleteCategoryOpen(true);
                                              }}
                                            >
                                              <Trash2 size={16} />
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </Draggable>
                                ))}
                              {provided.placeholder}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </TabsContent>

                <TabsContent value="questions">
                  <Tabs defaultValue={categories[0]?.id}>
                    <TabsList className="mb-4">
                      {categories.map(category => (
                        <TabsTrigger key={category.id} value={category.id}>
                          {category.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {categories.map(category => (
                      <TabsContent key={category.id} value={category.id}>
                        <DragDropContext onDragEnd={handleDragEndQuestions}>
                          <Droppable droppableId={`questions-${category.id}`}>
                            {(provided) => (
                              <div 
                                {...provided.droppableProps} 
                                ref={provided.innerRef}
                              >
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-10"></TableHead>
                                      <TableHead>Question</TableHead>
                                      <TableHead>Type</TableHead>
                                      <TableHead>Required</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {getFilteredQuestions(category.id).map((question, index) => (
                                      <Draggable 
                                        key={question.id} 
                                        draggableId={question.id} 
                                        index={index}
                                      >
                                        {(provided) => (
                                          <TableRow 
                                            ref={provided.innerRef} 
                                            {...provided.draggableProps}
                                          >
                                            <TableCell>
                                              <div {...provided.dragHandleProps} className="cursor-move">
                                                <MoveVertical size={16} />
                                              </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{question.text}</TableCell>
                                            <TableCell>
                                              {questionTypes.find(t => t.id === question.type)?.label || question.type}
                                            </TableCell>
                                            <TableCell>
                                              {question.required ? 
                                                <Check className="h-4 w-4 text-green-600" /> : 
                                                <X className="h-4 w-4 text-gray-400" />
                                              }
                                            </TableCell>
                                            <TableCell>
                                              <span className={`px-2 py-1 rounded-full text-xs ${question.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {question.active ? 'Active' : 'Inactive'}
                                              </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                              <div className="flex justify-end space-x-2">
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
                                                  onClick={() => {
                                                    setSelectedQuestion(question);
                                                    setIsDeleteQuestionOpen(true);
                                                  }}
                                                >
                                                  <Trash2 size={16} />
                                                </Button>
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </TabsContent>
                    ))}
                  </Tabs>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Preview panel */}
        {showPreview && (
          <div className="md:w-1/2">
            <Card>
              <CardHeader>
                <CardTitle>Registration Form Preview</CardTitle>
                <CardDescription>Live preview of the registration form</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 p-4 border rounded-md bg-white">
                  {categories
                    .filter(cat => cat.active)
                    .sort((a, b) => a.order - b.order)
                    .map(category => (
                      <div key={category.id} className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">{category.name}</h3>
                        
                        {questions
                          .filter(q => q.categoryId === category.id && q.active)
                          .sort((a, b) => a.order - b.order)
                          .map(question => (
                            <div key={question.id} className="space-y-2">
                              <div className="flex items-center">
                                <Label className="text-sm font-medium">{question.text}</Label>
                                {question.required && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </div>
                              
                              {question.helpText && (
                                <p className="text-xs text-muted-foreground">{question.helpText}</p>
                              )}
                              
                              <DynamicFormField question={question} />
                            </div>
                          ))}
                      </div>
                    ))}
                    
                  <div className="pt-4">
                    <Button className="w-full">Submit Registration</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Category Dialogs */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category for registration questions.
            </DialogDescription>
          </DialogHeader>
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(handleAddCategory)} className="space-y-4">
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter category name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={categoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={categoryForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Enable or disable this category
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Add Category</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Make changes to the selected category.
            </DialogDescription>
          </DialogHeader>
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(handleEditCategory)} className="space-y-4">
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter category name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={categoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={categoryForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Enable or disable this category
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Update Category</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteCategoryOpen} onOpenChange={setIsDeleteCategoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            All questions in this category will be permanently deleted.
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteCategoryOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCategory}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Question Dialogs */}
      <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Question</DialogTitle>
            <DialogDescription>
              Create a new registration question.
            </DialogDescription>
          </DialogHeader>
          <Form {...questionForm}>
            <form onSubmit={questionForm.handleSubmit(handleAddQuestion)} className="space-y-4">
              <FormField
                control={questionForm.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={questionForm.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter question text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={questionForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                        <SelectContent>
                          {questionTypes.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {questionForm.watch("type") && ["select", "multiselect", "radio", "checkbox", "imageSelect"].includes(questionForm.watch("type")) && (
                <FormField
                  control={questionForm.control}
                  name="options"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Options</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter options separated by commas" />
                      </FormControl>
                      <FormDescription>
                        Enter options separated by commas (e.g., Option 1, Option 2, Option 3)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={questionForm.control}
                name="placeholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholder</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter placeholder text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={questionForm.control}
                name="helpText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Help Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter help text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={questionForm.control}
                name="validation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validation Rules</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., min:5,max:100" />
                    </FormControl>
                    <FormDescription>
                      Enter validation rules in format: rule:value (e.g., min:5,max:100)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={questionForm.control}
                  name="required"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Required</FormLabel>
                        <FormDescription>
                          Is this question required?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={questionForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Enable or disable this question
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit">Add Question</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditQuestionOpen} onOpenChange={setIsEditQuestionOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Make changes to the selected question.
            </DialogDescription>
          </DialogHeader>
          <Form {...questionForm}>
            <form onSubmit={questionForm.handleSubmit(handleEditQuestion)} className="space-y-4">
              <FormField
                control={questionForm.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={questionForm.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter question text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={questionForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                        <SelectContent>
                          {questionTypes.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {questionForm.watch("type") && ["select", "multiselect", "radio", "checkbox", "imageSelect"].includes(questionForm.watch("type")) && (
                <FormField
                  control={questionForm.control}
                  name="options"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Options</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter options separated by commas" />
                      </FormControl>
                      <FormDescription>
                        Enter options separated by commas (e.g., Option 1, Option 2, Option 3)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={questionForm.control}
                name="placeholder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholder</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter placeholder text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={questionForm.control}
                name="helpText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Help Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter help text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={questionForm.control}
                name="validation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validation Rules</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., min:5,max:100" />
                    </FormControl>
                    <FormDescription>
                      Enter validation rules in format: rule:value (e.g., min:5,max:100)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={questionForm.control}
                  name="required"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Required</FormLabel>
                        <FormDescription>
                          Is this question required?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={questionForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Enable or disable this question
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit">Update Question</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteQuestionOpen} onOpenChange={setIsDeleteQuestionOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteQuestionOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteQuestion}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationQuestionsPage;
