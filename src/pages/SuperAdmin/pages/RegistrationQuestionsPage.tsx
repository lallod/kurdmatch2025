
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

  // Handle opening dialogs
  const openAddQuestionDialog = () => {
    form.reset();
    setIsAddQuestionOpen(true);
  };

  const openEditQuestionDialog = (question: RegistrationQuestion) => {
    setSelectedQuestion(question);
    editForm.reset({
      questionText: question.questionText,
      description: question.description || '',
      category: question.category,
      step: question.step,
      profileField: question.profileField,
      questionType: question.questionType,
      options: question.options || '',
      required: question.required,
      order: question.order,
      active: question.active,
      aiRecommended: question.aiRecommended,
      conditionalQuestion: question.conditionalQuestion,
      parentQuestion: question.parentQuestion || '',
      conditionalValue: question.conditionalValue || ''
    });
    setIsEditQuestionOpen(true);
  };

  const openDeleteConfirmDialog = (question: RegistrationQuestion) => {
    setSelectedQuestion(question);
    setIsDeleteConfirmOpen(true);
  };

  const openPreviewDialog = (question: RegistrationQuestion) => {
    setSelectedQuestion(question);
    setPreviewStep(question.step);
    setIsPreviewOpen(true);
  };

  // Duplicate question
  const duplicateQuestion = (question: RegistrationQuestion) => {
    const newQuestion: RegistrationQuestion = {
      ...question,
      id: `${questions.length + 1}`,
      questionText: `Copy of ${question.questionText}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: undefined
    };
    
    setQuestions([...questions, newQuestion]);
    toast.success(`Question "${question.questionText}" duplicated successfully`);
  };

  // Toggle question active state
  const toggleQuestionActive = (question: RegistrationQuestion) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === question.id) {
        return {
          ...q,
          active: !q.active,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return q;
    });
    
    setQuestions(updatedQuestions);
    toast.success(`Question "${question.questionText}" ${question.active ? 'deactivated' : 'activated'} successfully`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registration Questions</h1>
          <p className="text-muted-foreground">
            Manage questions used during the user registration process
          </p>
        </div>
        <Button onClick={openAddQuestionDialog} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="w-full lg:w-64 shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-md font-medium">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Categories</Label>
                <Badge variant="outline" className="text-xs font-normal">
                  {categoryCounts.all}
                </Badge>
              </div>
              <div className="space-y-1">
                <Button
                  variant={filterCategory === 'all' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className="justify-between w-full font-normal"
                  onClick={() => setFilterCategory('all')}
                >
                  All Categories
                  <Badge variant="outline" className="ml-2">{categoryCounts.all}</Badge>
                </Button>
                {QUESTION_CATEGORIES.map(category => (
                  categoryCounts[category.value] && (
                    <Button
                      key={category.value}
                      variant={filterCategory === category.value ? 'secondary' : 'ghost'} 
                      size="sm" 
                      className="justify-between w-full font-normal"
                      onClick={() => setFilterCategory(category.value)}
                    >
                      {category.label}
                      <Badge variant="outline" className="ml-2">{categoryCounts[category.value] || 0}</Badge>
                    </Button>
                  )
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Registration Steps</Label>
                <Badge variant="outline" className="text-xs font-normal">
                  {stepCounts.all}
                </Badge>
              </div>
              <div className="space-y-1">
                <Button
                  variant={filterStep === 'all' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className="justify-between w-full font-normal"
                  onClick={() => setFilterStep('all')}
                >
                  All Steps
                  <Badge variant="outline" className="ml-2">{stepCounts.all}</Badge>
                </Button>
                {REGISTRATION_STEPS.map(step => (
                  stepCounts[step.value] && (
                    <Button
                      key={step.value}
                      variant={filterStep === step.value ? 'secondary' : 'ghost'} 
                      size="sm" 
                      className="justify-between w-full font-normal"
                      onClick={() => setFilterStep(step.value)}
                    >
                      {step.label}
                      <Badge variant="outline" className="ml-2">{stepCounts[step.value] || 0}</Badge>
                    </Button>
                  )
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Question Types</Label>
                <Badge variant="outline" className="text-xs font-normal">
                  {typeCounts.all}
                </Badge>
              </div>
              <div className="space-y-1">
                <Button
                  variant={filterType === 'all' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  className="justify-between w-full font-normal"
                  onClick={() => setFilterType('all')}
                >
                  All Types
                  <Badge variant="outline" className="ml-2">{typeCounts.all}</Badge>
                </Button>
                {QUESTION_TYPES.map(type => (
                  typeCounts[type.value] && (
                    <Button
                      key={type.value}
                      variant={filterType === type.value ? 'secondary' : 'ghost'} 
                      size="sm" 
                      className="justify-between w-full font-normal"
                      onClick={() => setFilterType(type.value)}
                    >
                      {type.label}
                      <Badge variant="outline" className="ml-2">{typeCounts[type.value] || 0}</Badge>
                    </Button>
                  )
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-md font-medium">
                  Registration Questions
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search questions..."
                      className="pl-8 w-60"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">
                      <Button 
                        variant="ghost" 
                        className="p-0 font-medium flex items-center"
                        onClick={() => sortQuestions('questionText')}
                      >
                        Question
                        {sortColumn === 'questionText' && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="p-0 font-medium flex items-center"
                        onClick={() => sortQuestions('category')}
                      >
                        Category
                        {sortColumn === 'category' && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="p-0 font-medium flex items-center"
                        onClick={() => sortQuestions('step')}
                      >
                        Step
                        {sortColumn === 'step' && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="p-0 font-medium flex items-center"
                        onClick={() => sortQuestions('questionType')}
                      >
                        Type
                        {sortColumn === 'questionType' && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-center">Required</TableHead>
                    <TableHead className="text-center">Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedQuestions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-32">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <ClipboardList className="h-12 w-12 mb-2" />
                          <h3 className="text-lg font-medium">No questions found</h3>
                          <p>Try changing your filters or add a new question.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedQuestions.map((question) => (
                      <TableRow key={question.id} className={!question.active ? 'opacity-60' : ''}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{question.questionText}</span>
                            {question.description && (
                              <span className="text-sm text-muted-foreground">
                                {question.description.length > 50 
                                  ? `${question.description.slice(0, 50)}...` 
                                  : question.description}
                              </span>
                            )}
                            <div className="flex mt-1 space-x-1">
                              {question.aiRecommended && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200 text-xs">
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  AI Recommended
                                </Badge>
                              )}
                              {question.conditionalQuestion && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 text-xs">
                                  <ArrowRight className="mr-1 h-3 w-3" />
                                  Conditional
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {getCategoryLabel(question.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {getStepLabel(question.step)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">
                            {getTypeLabel(question.questionType)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {question.required ? (
                            <Badge className="bg-green-500 hover:bg-green-500">Yes</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={question.active}
                            onCheckedChange={() => toggleQuestionActive(question)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openPreviewDialog(question)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openEditQuestionDialog(question)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => duplicateQuestion(question)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openDeleteConfirmDialog(question)}
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
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Question Dialog */}
      <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Registration Question</DialogTitle>
            <DialogDescription>
              Create a new question for the registration process.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addNewQuestion)} className="space-y-6">
              <FormField
                control={form.control}
                name="questionText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter question text" {...field} />
                    </FormControl>
                    <FormDescription>
                      The text of the question as it will appear to users.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a description or hint for this question"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Additional information to help users understand what to input.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {QUESTION_CATEGORIES.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The category this question belongs to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="step"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Step</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a step" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {REGISTRATION_STEPS.map((step) => (
                            <SelectItem key={step.value} value={step.value}>
                              {step.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The registration step where this question will appear.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="profileField"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Field</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a profile field" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROFILE_FIELDS.map((profileField) => (
                            <SelectItem key={profileField.value} value={profileField.value}>
                              {profileField.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The profile field this question data will be saved to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="questionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a question type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {QUESTION_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The type of input for this question.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {['select', 'multiselect', 'radio', 'checkbox', 'scale'].includes(watchQuestionType) && (
                <FormField
                  control={form.control}
                  name="options"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Options</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter options, separated by commas"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of options for this question.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="required"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Required</FormLabel>
                        <FormDescription>
                          User must answer this question to proceed.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Question is active and will be shown to users.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aiRecommended"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>AI Recommended</FormLabel>
                        <FormDescription>
                          This is an AI-recommended question.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>
                      Order in which the question appears in its step.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="conditionalQuestion"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Conditional Question</FormLabel>
                      <FormDescription>
                        This question only appears based on an answer to another question.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {watchConditionalQuestion && parentQuestions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="parentQuestion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Question</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent question" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {parentQuestions.map((question) => (
                              <SelectItem key={question.id} value={question.id}>
                                {question.questionText}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Question that controls whether this question appears.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="conditionalValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conditional Value</FormLabel>
                        <FormControl>
                          <Input placeholder="Value that triggers this question" {...field} />
                        </FormControl>
                        <FormDescription>
                          Value from parent question that makes this question appear.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddQuestionOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Question</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog open={isEditQuestionOpen} onOpenChange={setIsEditQuestionOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Registration Question</DialogTitle>
            <DialogDescription>
              Update the registration question.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(updateQuestion)} className="space-y-6">
              {/* Same form fields as Add Question Dialog */}
              <FormField
                control={editForm.control}
                name="questionText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter question text" {...field} />
                    </FormControl>
                    <FormDescription>
                      The text of the question as it will appear to users.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a description or hint for this question"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Additional information to help users understand what to input.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {QUESTION_CATEGORIES.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The category this question belongs to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="step"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Step</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a step" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {REGISTRATION_STEPS.map((step) => (
                            <SelectItem key={step.value} value={step.value}>
                              {step.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The registration step where this question will appear.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="profileField"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Field</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a profile field" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROFILE_FIELDS.map((profileField) => (
                            <SelectItem key={profileField.value} value={profileField.value}>
                              {profileField.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The profile field this question data will be saved to.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="questionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a question type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {QUESTION_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The type of input for this question.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {['select', 'multiselect', 'radio', 'checkbox', 'scale'].includes(editWatchQuestionType) && (
                <FormField
                  control={editForm.control}
                  name="options"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Options</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter options, separated by commas"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Comma-separated list of options for this question.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={editForm.control}
                  name="required"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Required</FormLabel>
                        <FormDescription>
                          User must answer this question to proceed.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Question is active and will be shown to users.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="aiRecommended"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>AI Recommended</FormLabel>
                        <FormDescription>
                          This is an AI-recommended question.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={editForm.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>
                      Order in which the question appears in its step.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="conditionalQuestion"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Conditional Question</FormLabel>
                      <FormDescription>
                        This question only appears based on an answer to another question.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {editWatchConditionalQuestion && parentQuestions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="parentQuestion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Question</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent question" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {parentQuestions.map((question) => (
                              <SelectItem key={question.id} value={question.id}>
                                {question.questionText}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Question that controls whether this question appears.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="conditionalValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conditional Value</FormLabel>
                        <FormControl>
                          <Input placeholder="Value that triggers this question" {...field} />
                        </FormControl>
                        <FormDescription>
                          Value from parent question that makes this question appear.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditQuestionOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Question</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border rounded-md bg-muted/50 my-4">
            <p className="font-medium">{selectedQuestion?.questionText}</p>
            {selectedQuestion?.description && (
              <p className="text-sm text-muted-foreground mt-1">{selectedQuestion.description}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteQuestion}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Question Preview</DialogTitle>
            <DialogDescription>
              Preview how this question will appear to users during registration.
            </DialogDescription>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-6">
              <div className="p-6 border rounded-lg bg-card">
                <h3 className="font-semibold text-lg mb-1">
                  {selectedQuestion.questionText}
                </h3>
                {selectedQuestion.description && (
                  <p className="text-muted-foreground mb-4">{selectedQuestion.description}</p>
                )}
                <div className="pt-2">
                  {(() => {
                    switch(selectedQuestion.questionType) {
                      case 'text':
                        return <Input placeholder="Enter your answer..." />;
                      case 'textarea':
                        return <Textarea placeholder="Enter your answer..." />;
                      case 'select':
                        return (
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedQuestion.options?.split(',').map((option, index) => (
                                <SelectItem key={index} value={option.trim()}>
                                  {option.trim()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        );
                      case 'radio':
                        return (
                          <div className="space-y-2">
                            {selectedQuestion.options?.split(',').map((option, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input type="radio" id={`option-${index}`} name="radio-group" />
                                <Label htmlFor={`option-${index}`}>{option.trim()}</Label>
                              </div>
                            ))}
                          </div>
                        );
                      case 'checkbox':
                        return (
                          <div className="space-y-2">
                            {selectedQuestion.options?.split(',').map((option, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input type="checkbox" id={`checkbox-${index}`} />
                                <Label htmlFor={`checkbox-${index}`}>{option.trim()}</Label>
                              </div>
                            ))}
                          </div>
                        );
                      default:
                        return <div className="text-muted-foreground">Preview not available for this question type.</div>;
                    }
                  })()}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Question Settings</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{getCategoryLabel(selectedQuestion.category)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Registration Step:</span>
                      <span>{getStepLabel(selectedQuestion.step)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Profile Field:</span>
                      <span>{getFieldLabel(selectedQuestion.profileField)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{getTypeLabel(selectedQuestion.questionType)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Required:</span>
                      <span>{selectedQuestion.required ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active:</span>
                      <span>{selectedQuestion.active ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AI Recommended:</span>
                      <span>{selectedQuestion.aiRecommended ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Display Order:</span>
                      <span>{selectedQuestion.order}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Conditional Logic</h4>
                  {selectedQuestion.conditionalQuestion ? (
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Parent Question:</span>
                        <span>{getParentQuestionLabel(selectedQuestion.parentQuestion || '')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Conditional Value:</span>
                        <span>{selectedQuestion.conditionalValue}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">This question is not conditional.</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationQuestionsPage;
