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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, Plus, Edit, Trash2, Save, Eye, 
  AlertTriangle, ClipboardList, Filter, ArrowUpDown, 
  Copy, ArrowRight, CheckCircle2
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { OPTIONS } from '@/components/DetailEditor/constants';

// Extended from profile types
const QUESTION_CATEGORIES = [
  { value: 'basics', label: 'Basics', description: 'Essential profile information' },
  { value: 'appearance', label: 'Appearance', description: 'Physical appearance details' },
  { value: 'lifestyle', label: 'Lifestyle', description: 'Daily habits and preferences' },
  { value: 'relationships', label: 'Relationships', description: 'Relationship goals and preferences' },
  { value: 'personality', label: 'Personality', description: 'Character traits and attitudes' },
  { value: 'interests', label: 'Interests & Hobbies', description: 'Activities and passions' },
  { value: 'values', label: 'Values & Beliefs', description: 'Personal values and beliefs' },
  { value: 'communication', label: 'Communication', description: 'Communication style and languages' },
  { value: 'preferences', label: 'Preferences', description: 'Dating and partner preferences' },
  { value: 'cultural', label: 'Cultural', description: 'Cultural background and traditions' },
  { value: 'favorites', label: 'Favorites', description: 'Favorite things and activities' },
  { value: 'growth', label: 'Growth & Goals', description: 'Personal development and ambitions' },
  { value: 'living', label: 'Living & Home', description: 'Living situation and preferences' },
  { value: 'travel', label: 'Travel', description: 'Travel experiences and preferences' },
  { value: 'career', label: 'Career', description: 'Professional life and ambitions' },
];

// Comprehensive question field mapping based on profile details
const PROFILE_FIELDS = [
  // Basic Info
  { value: 'firstName', label: 'First Name', category: 'basics', recommended: true },
  { value: 'lastName', label: 'Last Name', category: 'basics', recommended: true },
  { value: 'age', label: 'Age', category: 'basics', recommended: true },
  { value: 'birthdate', label: 'Date of Birth', category: 'basics', recommended: true },
  { value: 'gender', label: 'Gender', category: 'basics', recommended: true },
  { value: 'interestedIn', label: 'Interested In', category: 'basics', recommended: true },
  { value: 'location', label: 'Location', category: 'basics', recommended: true },
  { value: 'kurdistanRegion', label: 'Kurdistan Region', category: 'basics', recommended: true },
  
  // Appearance
  { value: 'height', label: 'Height', category: 'appearance', recommended: true },
  { value: 'bodyType', label: 'Body Type', category: 'appearance', recommended: false },
  { value: 'ethnicity', label: 'Ethnicity', category: 'appearance', recommended: false },
  { value: 'eyeColor', label: 'Eye Color', category: 'appearance', recommended: false },
  { value: 'hairColor', label: 'Hair Color', category: 'appearance', recommended: false },
  { value: 'hairStyle', label: 'Hair Style', category: 'appearance', recommended: false },
  
  // Lifestyle
  { value: 'drinking', label: 'Drinking', category: 'lifestyle', recommended: true },
  { value: 'smoking', label: 'Smoking', category: 'lifestyle', recommended: true },
  { value: 'exerciseHabits', label: 'Exercise Habits', category: 'lifestyle', recommended: false },
  { value: 'dietaryPreferences', label: 'Dietary Preferences', category: 'lifestyle', recommended: false },
  { value: 'sleepSchedule', label: 'Sleep Schedule', category: 'lifestyle', recommended: false },
  { value: 'morningRoutine', label: 'Morning Routine', category: 'lifestyle', recommended: false },
  { value: 'eveningRoutine', label: 'Evening Routine', category: 'lifestyle', recommended: false },
  { value: 'workLifeBalance', label: 'Work-Life Balance', category: 'lifestyle', recommended: false },
  { value: 'financialHabits', label: 'Financial Habits', category: 'lifestyle', recommended: false },
  { value: 'weekendActivities', label: 'Weekend Activities', category: 'lifestyle', recommended: false },
  
  // Relationships
  { value: 'relationshipGoals', label: 'Relationship Goals', category: 'relationships', recommended: true },
  { value: 'relationshipStatus', label: 'Relationship Status', category: 'relationships', recommended: true },
  { value: 'wantChildren', label: 'Want Children', category: 'relationships', recommended: false },
  { value: 'childrenStatus', label: 'Children Status', category: 'relationships', recommended: false },
  { value: 'familyCloseness', label: 'Family Closeness', category: 'relationships', recommended: false },
  { value: 'friendshipStyle', label: 'Friendship Style', category: 'relationships', recommended: false },
  { value: 'loveLanguage', label: 'Love Language', category: 'relationships', recommended: true },
  { value: 'idealDate', label: 'Ideal Date', category: 'relationships', recommended: false },
  { value: 'petPeeves', label: 'Pet Peeves', category: 'relationships', recommended: false },
  { value: 'havePets', label: 'Have Pets', category: 'relationships', recommended: false },
  
  // Personality
  { value: 'personalityType', label: 'Personality Type', category: 'personality', recommended: true },
  { value: 'zodiacSign', label: 'Zodiac Sign', category: 'personality', recommended: true },
  { value: 'communicationStyle', label: 'Communication Style', category: 'personality', recommended: true },
  { value: 'decisionMakingStyle', label: 'Decision Making Style', category: 'personality', recommended: false },
  { value: 'stressRelievers', label: 'Stress Relievers', category: 'personality', recommended: false },
  { value: 'growthGoals', label: 'Growth Goals', category: 'personality', recommended: false },
  { value: 'hiddenTalents', label: 'Hidden Talents', category: 'personality', recommended: false },
  
  // Interests & Hobbies
  { value: 'interests', label: 'Interests', category: 'interests', recommended: true },
  { value: 'hobbies', label: 'Hobbies', category: 'interests', recommended: true },
  { value: 'creativePursuits', label: 'Creative Pursuits', category: 'interests', recommended: false },
  { value: 'sports', label: 'Sports', category: 'interests', recommended: false },
  { value: 'musicInstruments', label: 'Music Instruments', category: 'interests', recommended: false },
  { value: 'outdoorActivities', label: 'Outdoor Activities', category: 'interests', recommended: false },
  
  // Values & Beliefs
  { value: 'religion', label: 'Religion', category: 'values', recommended: true },
  { value: 'politicalViews', label: 'Political Views', category: 'values', recommended: true },
  { value: 'values', label: 'Values', category: 'values', recommended: true },
  { value: 'lifeMotto', label: 'Life Motto', category: 'values', recommended: false },
  { value: 'charityInvolvement', label: 'Charity Involvement', category: 'values', recommended: false },
  
  // Communication
  { value: 'languages', label: 'Languages', category: 'communication', recommended: true },
  { value: 'textingStyle', label: 'Texting Style', category: 'communication', recommended: false },
  { value: 'conflictResolution', label: 'Conflict Resolution', category: 'communication', recommended: false },
  
  // Preferences
  { value: 'partnerAgeRange', label: 'Partner Age Range', category: 'preferences', recommended: true },
  { value: 'partnerHeightRange', label: 'Partner Height Range', category: 'preferences', recommended: false },
  { value: 'partnerDistanceRange', label: 'Partner Distance Range', category: 'preferences', recommended: true },
  { value: 'dealBreakers', label: 'Deal Breakers', category: 'preferences', recommended: true },
  { value: 'mustHaves', label: 'Must Haves', category: 'preferences', recommended: true },
  
  // Favorites
  { value: 'favoriteBooks', label: 'Favorite Books', category: 'favorites', recommended: false },
  { value: 'favoriteMovies', label: 'Favorite Movies', category: 'favorites', recommended: false },
  { value: 'favoriteMusic', label: 'Favorite Music', category: 'favorites', recommended: false },
  { value: 'favoriteFoods', label: 'Favorite Foods', category: 'favorites', recommended: false },
  { value: 'favoriteGames', label: 'Favorite Games', category: 'favorites', recommended: false },
  { value: 'favoritePodcasts', label: 'Favorite Podcasts', category: 'favorites', recommended: false },
  { value: 'favoriteSeason', label: 'Favorite Season', category: 'favorites', recommended: false },
  { value: 'favoriteQuote', label: 'Favorite Quote', category: 'favorites', recommended: false },
  { value: 'favoriteMemory', label: 'Favorite Memory', category: 'favorites', recommended: false },
  
  // Growth & Goals
  { value: 'careerAmbitions', label: 'Career Ambitions', category: 'growth', recommended: false },
  { value: 'personalGoals', label: 'Personal Goals', category: 'growth', recommended: false },
  { value: 'learningInterests', label: 'Learning Interests', category: 'growth', recommended: false },
  { value: 'selfImprovementAreas', label: 'Self-Improvement Areas', category: 'growth', recommended: false },
  
  // Living
  { value: 'livingArrangement', label: 'Living Arrangement', category: 'living', recommended: false },
  { value: 'dreamHome', label: 'Dream Home', category: 'living', recommended: false },
  { value: 'workEnvironment', label: 'Work Environment', category: 'living', recommended: false },
  { value: 'idealWeather', label: 'Ideal Weather', category: 'living', recommended: false },
  
  // Travel
  { value: 'travelFrequency', label: 'Travel Frequency', category: 'travel', recommended: false },
  { value: 'dreamVacation', label: 'Dream Vacation', category: 'travel', recommended: false },
  { value: 'travelStyle', label: 'Travel Style', category: 'travel', recommended: false },
  { value: 'transportationPreference', label: 'Transportation Preference', category: 'travel', recommended: false },
  
  // Career
  { value: 'occupation', label: 'Occupation', category: 'career', recommended: true },
  { value: 'company', label: 'Company', category: 'career', recommended: false },
  { value: 'education', label: 'Education', category: 'career', recommended: true },
  { value: 'techSkills', label: 'Tech Skills', category: 'career', recommended: false },
  { value: 'workSchedule', label: 'Work Schedule', category: 'career', recommended: false },
];

// Question input types
const QUESTION_TYPES = [
  { value: 'text', label: 'Text Input', description: 'Short text answer' },
  { value: 'textarea', label: 'Text Area', description: 'Long text answer' },
  { value: 'select', label: 'Dropdown Select', description: 'Choose one option from a list' },
  { value: 'multiselect', label: 'Multi-Select', description: 'Choose multiple options from a list' },
  { value: 'radio', label: 'Radio Buttons', description: 'Choose one option with radio buttons' },
  { value: 'checkbox', label: 'Checkboxes', description: 'Choose multiple options with checkboxes' },
  { value: 'slider', label: 'Slider', description: 'Select a value within a range' },
  { value: 'range', label: 'Range Selector', description: 'Select a range of values (min/max)' },
  { value: 'date', label: 'Date Picker', description: 'Select a date' },
  { value: 'number', label: 'Number Input', description: 'Enter a numeric value' },
  { value: 'boolean', label: 'Yes/No', description: 'Simple yes or no choice' },
  { value: 'scale', label: 'Scale Rating', description: 'Rate on a scale (e.g., 1-5)' },
  { value: 'avatar', label: 'Profile Picture', description: 'Upload profile photo' },
  { value: 'gallery', label: 'Photo Gallery', description: 'Upload multiple photos' }
];

// Comprehensive list of registration steps
const REGISTRATION_STEPS = [
  { value: 'welcome', label: 'Welcome', description: 'Introduction to the registration process' },
  { value: 'basics', label: 'Basic Info', description: 'Essential information collection' },
  { value: 'photos', label: 'Photos', description: 'Photo upload and management' },
  { value: 'appearance', label: 'Appearance', description: 'Physical traits and appearance' },
  { value: 'profile', label: 'Create Profile', description: 'Profile customization' },
  { value: 'lifestyle', label: 'Lifestyle', description: 'Daily habits and preferences' },
  { value: 'interests', label: 'Interests', description: 'Hobbies and activities' },
  { value: 'preferences', label: 'Preferences', description: 'Partner and matching preferences' },
  { value: 'personality', label: 'Personality', description: 'Personality traits assessment' },
  { value: 'values', label: 'Values', description: 'Personal values and beliefs' },
  { value: 'verification', label: 'Verification', description: 'Identity verification' },
  { value: 'matching', label: 'Matching', description: 'Matching algorithm customization' },
  { value: 'notification', label: 'Notifications', description: 'Notification preferences' },
  { value: 'complete', label: 'Complete', description: 'Registration completion' }
];

// Form schema for registration questions
const questionSchema = z.object({
  questionText: z.string().min(3, {
    message: "Question text must be at least 3 characters."
  }).max(200, {
    message: "Question text must not exceed 200 characters."
  }),
  description: z.string().max(500, {
    message: "Description must not exceed 500 characters."
  }).optional(),
  category: z.string().min(1, {
    message: "Category is required."
  }),
  step: z.string().min(1, {
    message: "Registration step is required."
  }),
  profileField: z.string().min(1, {
    message: "Profile field is required."
  }),
  questionType: z.string().min(1, {
    message: "Question type is required."
  }),
  options: z.string().optional(),
  required: z.boolean().default(false),
  order: z.number().int().positive().default(1),
  active: z.boolean().default(true),
  aiRecommended: z.boolean().default(false),
  conditionalQuestion: z.boolean().default(false),
  parentQuestion: z.string().optional(),
  conditionalValue: z.string().optional(),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

interface RegistrationQuestion {
  id: string;
  questionText: string;
  description?: string;
  category: string;
  step: string;
  profileField: string;
  questionType: string;
  options?: string;
  required: boolean;
  order: number;
  active: boolean;
  aiRecommended: boolean;
  conditionalQuestion: boolean;
  parentQuestion?: string;
  conditionalValue?: string;
  createdAt: string;
  updatedAt?: string;
}

// Sample question examples based on the detailed fields
const demoQuestions: RegistrationQuestion[] = [
  {
    id: '1',
    questionText: 'What is your first name?',
    description: 'Your first name will be shown on your profile',
    category: 'basics',
    step: 'basics',
    profileField: 'firstName',
    questionType: 'text',
    required: true,
    order: 1,
    active: true,
    aiRecommended: false,
    conditionalQuestion: false,
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    questionText: 'What is your height?',
    category: 'appearance',
    step: 'appearance',
    profileField: 'height',
    questionType: 'select',
    options: OPTIONS.height.join(','),
    required: true,
    order: 1,
    active: true,
    aiRecommended: true,
    conditionalQuestion: false,
    createdAt: '2023-01-15'
  },
  {
    id: '3',
    questionText: 'What type of relationship are you looking for?',
    description: 'This helps us find better matches for you',
    category: 'relationships',
    step: 'preferences',
    profileField: 'relationshipGoals',
    questionType: 'radio',
    options: OPTIONS.relationshipGoals.join(','),
    required: true,
    order: 1,
    active: true,
    aiRecommended: true,
    conditionalQuestion: false,
    createdAt: '2023-01-16'
  },
  {
    id: '4',
    questionText: 'Select your interests',
    description: 'Choose activities you enjoy',
    category: 'interests',
    step: 'interests',
    profileField: 'interests',
    questionType: 'multiselect',
    options: 'Hiking,Photography,Travel,Reading,Cooking,Art,Music,Sports,Dancing,Technology,Fashion,Gaming,Movies,Fitness,Meditation,Wine Tasting,Volunteering,Nature,History,Science',
    required: true,
    order: 1,
    active: true,
    aiRecommended: true,
    conditionalQuestion: false,
    createdAt: '2023-01-17'
  },
  {
    id: '5',
    questionText: 'Do you drink alcohol?',
    category: 'lifestyle',
    step: 'lifestyle',
    profileField: 'drinking',
    questionType: 'select',
    options: OPTIONS.drinking.join(','),
    required: true,
    order: 1,
    active: true,
    aiRecommended: false,
    conditionalQuestion: false,
    createdAt: '2023-01-18'
  },
  {
    id: '6',
    questionText: 'What\'s your body type?',
    category: 'appearance',
    step: 'appearance',
    profileField: 'bodyType',
    questionType: 'select',
    options: OPTIONS.bodyType.join(','),
    required: false,
    order: 2,
    active: true,
    aiRecommended: false,
    conditionalQuestion: false,
    createdAt: '2023-01-19'
  },
  {
    id: '7',
    questionText: 'What languages do you speak?',
    description: 'Select all that apply',
    category: 'communication',
    step: 'profile',
    profileField: 'languages',
    questionType: 'multiselect',
    options: 'English,Kurdish,Arabic,Persian,Turkish,German,French,Spanish,Italian,Russian,Chinese,Japanese',
    required: true,
    order: 1,
    active: true,
    aiRecommended: true,
    conditionalQuestion: false,
    createdAt: '2023-01-20'
  },
  {
    id: '8',
    questionText: 'Tell us about yourself',
    description: 'This will appear as your bio',
    category: 'basics',
    step: 'profile',
    profileField: 'bio',
    questionType: 'textarea',
    required: true,
    order: 3,
    active: true,
    aiRecommended: false,
    conditionalQuestion: false,
    createdAt: '2023-01-21'
  },
  {
    id: '9',
    questionText: 'What are your deal breakers?',
    description: 'Qualities you absolutely don\'t want in a partner',
    category: 'preferences',
    step: 'preferences',
    profileField: 'dealBreakers',
    questionType: 'multiselect',
    options: 'Smoking,Drinking,Having children,Not wanting children,Distance,Religious differences,Political differences,Pets,Career focus',
    required: false,
    order: 2,
    active: true,
    aiRecommended: true,
    conditionalQuestion: false,
    createdAt: '2023-01-22'
  },
  {
    id: '10',
    questionText: 'What\'s your love language?',
    category: 'relationships',
    step: 'personality',
    profileField: 'loveLanguage',
    questionType: 'select',
    options: OPTIONS.loveLanguage.join(','),
    required: false,
    order: 2,
    active: true,
    aiRecommended: true,
    conditionalQuestion: false,
    createdAt: '2023-01-23'
  },
  {
    id: '11',
    questionText: 'What is your occupation?',
    category: 'career',
    step: 'basics',
    profileField: 'occupation',
    questionType: 'text',
    required: true,
    order: 4,
    active: true,
    aiRecommended: false,
    conditionalQuestion: false,
    createdAt: '2023-01-24'
  },
  {
    id: '12',
    questionText: 'What is your education level?',
    category: 'career',
    step: 'basics',
    profileField: 'education',
    questionType: 'select',
    options: 'High School,Some College,Associate\'s Degree,Bachelor\'s Degree,Master\'s Degree,PhD,Professional Degree,Trade School',
    required: false,
    order: 5,
    active: true,
    aiRecommended: false,
    conditionalQuestion: false,
    createdAt: '2023-01-25'
  },
  {
    id: '13',
    questionText: 'Do you want children?',
    category: 'relationships',
    step: 'preferences',
    profileField: 'wantChildren',
    questionType: 'select',
    options: OPTIONS.wantChildren.join(','),
    required: false,
    order: 3,
    active: true,
    aiRecommended: false,
    conditionalQuestion: false,
    createdAt: '2023-01-26'
  },
  {
    id: '14',
    questionText: 'Do you have children?',
    category: 'relationships',
    step: 'basics',
    profileField: 'childrenStatus',
    questionType: 'select',
    options: OPTIONS.childrenStatus.join(','),
    required: false,
    order: 6,
    active: true,
    aiRecommended: false,
    conditionalQuestion: false,
    createdAt: '2023-01-27'
  },
  {
    id: '15',
    questionText: 'What\'s your communication style?',
    category: 'personality',
    step: 'personality',
    profileField: 'communicationStyle',
    questionType: 'select',
    options: OPTIONS.communicationStyle.join(','),
    required: false,
    order: 1,
    active: true,
    aiRecommended: true,
    conditionalQuestion: false,
    createdAt: '2023-01-28'
  }
];

const RegistrationQuestionsPage = () => {
  const [questions, setQuestions] = useState<RegistrationQuestion[]>(demoQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStep, setFilterStep] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [isEditQuestionOpen, setIsEditQuestionOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<RegistrationQuestion | null>(null);
  const [parentQuestions, setParentQuestions] = useState<RegistrationQuestion[]>([]);
  const [previewStep, setPreviewStep] = useState<string>('basics');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionText: '',
      description: '',
      category: '',
      step: '',
      profileField: '',
      questionType: '',
      options: '',
      required: false,
      order: 1,
      active: true,
      aiRecommended: false,
      conditionalQuestion: false,
      parentQuestion: '',
      conditionalValue: ''
    }
  });

  const editForm = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionText: '',
      description: '',
      category: '',
      step: '',
      profileField: '',
      questionType: '',
      options: '',
      required: false,
      order: 1,
      active: true,
      aiRecommended: false,
      conditionalQuestion: false,
      parentQuestion: '',
      conditionalValue: ''
    }
  });

  // Form watch functions
  const watchQuestionType = form.watch('questionType');
  const watchConditionalQuestion = form.watch('conditionalQuestion');
  const editWatchQuestionType = editForm.watch('questionType');
  const editWatchConditionalQuestion = editForm.watch('conditionalQuestion');

  // Effect to update parent questions list
  React.useEffect(() => {
    const potentialParents = questions.filter(q => 
      ['select', 'radio', 'boolean', 'multiselect', 'checkbox'].includes(q.questionType)
    );
    setParentQuestions(potentialParents);
  }, [questions]);

  // Sort function
  const sortQuestions = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filter and sort questions
  const filteredAndSortedQuestions = React.useMemo(() => {
    let filtered = questions.filter(question => {
      const matchesSearch = 
        question.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (question.description && question.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = 
        filterCategory === 'all' || 
        question.category === filterCategory;
      
      const matchesStep = 
        filterStep === 'all' || 
        question.step === filterStep;
      
      const matchesType = 
        filterType === 'all' || 
        question.questionType === filterType;
      
      return matchesSearch && matchesCategory && matchesStep && matchesType;
    });

    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const valueA = a[sortColumn as keyof RegistrationQuestion];
        const valueB = b[sortColumn as keyof RegistrationQuestion];
        
        let comparison = 0;
        if (valueA < valueB) {
          comparison = -1;
        } else if (valueA > valueB) {
          comparison = 1;
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [questions, searchTerm, filterCategory, filterStep, filterType, sortColumn, sortDirection]);

  // Get counts for filter badges
  const getCategoryCounts = () => {
    const counts: Record<string, number> = { all: 0 };
    
    questions.forEach(question => {
      counts.all += 1;
      counts[question.category] = (counts[question.category] || 0) + 1;
    });
    
    return counts;
  };

  const getStepCounts = () => {
    const counts: Record<string, number> = { all: 0 };
    
    questions.forEach(question => {
      counts.all += 1;
      counts[question.step] = (counts[question.step] || 0) + 1;
    });
    
    return counts;
  };

  const getTypeCounts = () => {
    const counts: Record<string, number> = { all: 0 };
    
    questions.forEach(question => {
      counts.all += 1;
      counts[question.questionType] = (counts[question.questionType] || 0) + 1;
    });
    
    return counts;
  };

  const categoryCounts = getCategoryCounts();
  const stepCounts = getStepCounts();
  const typeCounts = getTypeCounts();

  // Helper functions
  const getCategoryLabel = (value: string) => {
    const category = QUESTION_CATEGORIES.find(c => c.value === value);
    return category ? category.label : value;
  };

  const getStepLabel = (value: string) => {
    const step = REGISTRATION_STEPS.find(s => s.value === value);
    return step ? step.label : value;
  };

  const getTypeLabel = (value: string) => {
    const type = QUESTION_TYPES.find(t => t.value === value);
    return type ? type.label : value;
  };

  const getFieldLabel = (value: string) => {
    const field = PROFILE_FIELDS.find(f => f.value === value);
    return field ? field.label : value;
  };

  const getParentQuestionLabel = (id: string) => {
    const question = questions.find(q => q.id === id);
    return question ? question.questionText : id;
  };

  // Form handlers
  const addNewQuestion = (data: QuestionFormValues) => {
    const newQuestion: RegistrationQuestion = {
      id: `${questions.length + 1}`,
      questionText: data.questionText,
      description: data.description,
      category: data.category,
      step: data.step,
      profileField: data.profileField,
      questionType: data.questionType,
      options: data.options,
      required: data.required,
      order: data.order,
      active: data.active,
      aiRecommended: data.aiRecommended,
      conditionalQuestion: data.conditionalQuestion,
      parentQuestion: data.conditionalQuestion ? data.parentQuestion : undefined,
      conditionalValue: data.conditionalQuestion ? data.conditionalValue : undefined,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setQuestions([...questions, newQuestion]);
    setIsAddQuestionOpen(false);
    form.reset();
    toast.success(`Question "${data.questionText}" added successfully`);
  };

  const updateQuestion = (data: QuestionFormValues) => {
    if (!selectedQuestion) return;
    
    const updatedQuestions = questions.map(question => {
      if (question.id === selectedQuestion.id) {
        return {
          ...question,
          questionText: data.questionText,
          description: data.description,
          category: data.category,
          step: data.step,
          profileField: data.profileField,
          questionType: data.questionType,
          options: data.options,
          required: data.required,
          order: data.order,
          active: data.active,
          aiRecommended: data.aiRecommended,
          conditionalQuestion: data.conditionalQuestion,
          parentQuestion: data.conditionalQuestion ? data.parentQuestion : undefined,
          conditionalValue: data.conditionalQuestion ? data.conditionalValue : undefined,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return question;
    });
    
    setQuestions(updatedQuestions);
    setIsEditQuestionOpen(false);
    toast.success(`Question "${data.questionText}" updated successfully`);
  };

  const deleteQuestion = () => {
    if (!selectedQuestion) return;
    
    setQuestions(questions.filter(question => question.id !== selectedQuestion.id));
    setIsDeleteConfirmOpen(false);
    toast.success(`Question "${selectedQuestion.questionText}" deleted successfully`);
  };
