
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
  Check,
  User,
  GraduationCap,
  Briefcase,
  Heart,
  Star,
  Wind,
  MessageCircle,
  Sparkles,
  Palette,
  Plane,
  BookOpen
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
type QuestionType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'listInput';

// Registration steps where questions can be placed
type RegistrationStep = 'basics' | 'lifestyle' | 'relationships' | 'interests-hobbies' | 'favorites' | 'communication' | 'personality-growth' | 'creative-lifestyle' | 'travel';

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
  category?: string;
  isRequired: boolean;
  options?: QuestionOption[];
  order: number;
  isActive: boolean;
  profileField?: string; // Where the answer will be stored in the user profile
}

// Definition of categories and their corresponding icons
interface CategoryInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const categories: Record<string, CategoryInfo> = {
  'education': { id: 'education', name: 'Education', icon: <GraduationCap size={18} />, description: 'Educational background information' },
  'work': { id: 'work', name: 'Work', icon: <Briefcase size={18} />, description: 'Professional and career details' },
  'basic-info': { id: 'basic-info', name: 'Basic Info', icon: <User size={18} />, description: 'Height, body type, ethnicity, etc.' },
  'beliefs': { id: 'beliefs', name: 'Beliefs', icon: <AlertCircle size={18} />, description: 'Religious and political beliefs' },
  'values': { id: 'values', name: 'Values', icon: <Check size={18} />, description: 'Personal values and principles' },
  'drinking': { id: 'drinking', name: 'Drinking', icon: <Wind size={18} />, description: 'Alcohol consumption habits' },
  'smoking': { id: 'smoking', name: 'Smoking', icon: <Wind size={18} />, description: 'Smoking habits' },
  'exercise': { id: 'exercise', name: 'Exercise', icon: <Wind size={18} />, description: 'Exercise and fitness routine' },
  'sleep-schedule': { id: 'sleep-schedule', name: 'Sleep Schedule', icon: <Wind size={18} />, description: 'Sleep patterns and preferences' },
  'financial-habits': { id: 'financial-habits', name: 'Financial Habits', icon: <Wind size={18} />, description: 'Money management style' },
  'weekend-activities': { id: 'weekend-activities', name: 'Weekend Activities', icon: <Wind size={18} />, description: 'How you spend your free time' },
  'work-life-balance': { id: 'work-life-balance', name: 'Work-Life Balance', icon: <Wind size={18} />, description: 'Approach to balancing work and personal life' },
  'dietary-preferences': { id: 'dietary-preferences', name: 'Dietary Preferences', icon: <Wind size={18} />, description: 'Food preferences and restrictions' },
  'morning-routine': { id: 'morning-routine', name: 'Morning Routine', icon: <Wind size={18} />, description: 'How you start your day' },
  'evening-routine': { id: 'evening-routine', name: 'Evening Routine', icon: <Wind size={18} />, description: 'How you end your day' },
  'relationship-goals': { id: 'relationship-goals', name: 'Relationship Goals', icon: <Heart size={18} />, description: 'What you\'re looking for in relationships' },
  'children': { id: 'children', name: 'Children', icon: <Heart size={18} />, description: 'Plans and status regarding children' },
  'pets': { id: 'pets', name: 'Pets', icon: <Heart size={18} />, description: 'Pet ownership and preferences' },
  'family-friends': { id: 'family-friends', name: 'Family & Friends', icon: <Heart size={18} />, description: 'Relationships with family and friends' },
  'communication-style': { id: 'communication-style', name: 'Communication Style', icon: <MessageCircle size={18} />, description: 'How you communicate with others' },
  'love-language': { id: 'love-language', name: 'Love Language', icon: <Heart size={18} />, description: 'How you express and receive love' },
  'pet-peeves': { id: 'pet-peeves', name: 'Pet Peeves', icon: <Heart size={18} />, description: 'Things that annoy you' },
  'interests': { id: 'interests', name: 'Interests', icon: <Star size={18} />, description: 'Hobbies and activities you enjoy' },
  'ideal-date': { id: 'ideal-date', name: 'Ideal Date', icon: <Heart size={18} />, description: 'Your idea of a perfect date' },
  'career-ambitions': { id: 'career-ambitions', name: 'Career Ambitions', icon: <Briefcase size={18} />, description: 'Professional goals' },
  'music-instruments': { id: 'music-instruments', name: 'Music Instruments', icon: <Star size={18} />, description: 'Instruments you play' },
  'favorite-games': { id: 'favorite-games', name: 'Favorite Games', icon: <Star size={18} />, description: 'Games you enjoy playing' },
  'books': { id: 'books', name: 'Books', icon: <BookOpen size={18} />, description: 'Books you like' },
  'movies': { id: 'movies', name: 'Movies', icon: <Star size={18} />, description: 'Movies you enjoy' },
  'music': { id: 'music', name: 'Music', icon: <Star size={18} />, description: 'Music genres you like' },
  'food': { id: 'food', name: 'Food', icon: <Star size={18} />, description: 'Favorite cuisines and dishes' },
  'podcasts': { id: 'podcasts', name: 'Podcasts', icon: <Star size={18} />, description: 'Podcasts you listen to' },
  'languages': { id: 'languages', name: 'Languages', icon: <MessageCircle size={18} />, description: 'Languages you speak' },
  'decision-making': { id: 'decision-making', name: 'Decision Making', icon: <Sparkles size={18} />, description: 'How you make decisions' },
  'growth-goals': { id: 'growth-goals', name: 'Growth Goals', icon: <Sparkles size={18} />, description: 'Personal development goals' },
  'hidden-talents': { id: 'hidden-talents', name: 'Hidden Talents', icon: <Sparkles size={18} />, description: 'Special abilities or skills' },
  'favorite-memory': { id: 'favorite-memory', name: 'Favorite Memory', icon: <Sparkles size={18} />, description: 'A special memory that stands out' },
  'stress-relievers': { id: 'stress-relievers', name: 'Stress Relievers', icon: <Sparkles size={18} />, description: 'How you cope with stress' },
  'charity-involvement': { id: 'charity-involvement', name: 'Charity Involvement', icon: <Sparkles size={18} />, description: 'Volunteer work and causes' },
  'creative-pursuits': { id: 'creative-pursuits', name: 'Creative Pursuits', icon: <Palette size={18} />, description: 'Creative hobbies and activities' },
  'dream-home': { id: 'dream-home', name: 'Dream Home', icon: <Palette size={18} />, description: 'Your ideal living space' },
  'transportation': { id: 'transportation', name: 'Transportation', icon: <Palette size={18} />, description: 'How you get around' },
  'tech-skills': { id: 'tech-skills', name: 'Tech Skills', icon: <Palette size={18} />, description: 'Technical abilities' },
  'work-environment': { id: 'work-environment', name: 'Work Environment', icon: <Briefcase size={18} />, description: 'Preferred working conditions' },
  'favorite-season': { id: 'favorite-season', name: 'Favorite Season', icon: <Palette size={18} />, description: 'Preferred time of year' },
  'ideal-weather': { id: 'ideal-weather', name: 'Ideal Weather', icon: <Palette size={18} />, description: 'Weather conditions you enjoy most' },
  'travel-frequency': { id: 'travel-frequency', name: 'Travel Frequency', icon: <Plane size={18} />, description: 'How often you travel' },
  'dream-vacation': { id: 'dream-vacation', name: 'Dream Vacation', icon: <Plane size={18} />, description: 'Your ideal trip' },
  'zodiac': { id: 'zodiac', name: 'Zodiac Sign', icon: <Star size={18} />, description: 'Astrological sign' },
};

// Common options for various question types
const commonOptions = {
  bodyType: [
    { id: 'athletic', value: 'athletic', label: 'Athletic' },
    { id: 'average', value: 'average', label: 'Average' },
    { id: 'slim', value: 'slim', label: 'Slim' },
    { id: 'muscular', value: 'muscular', label: 'Muscular' },
    { id: 'curvy', value: 'curvy', label: 'Curvy' },
    { id: 'full-figured', value: 'full-figured', label: 'Full Figured' },
  ],
  ethnicity: [
    { id: 'white', value: 'white', label: 'White' },
    { id: 'black', value: 'black', label: 'Black' },
    { id: 'hispanic', value: 'hispanic', label: 'Hispanic' },
    { id: 'asian', value: 'asian', label: 'Asian' },
    { id: 'middle-eastern', value: 'middle-eastern', label: 'Middle Eastern' },
    { id: 'mixed', value: 'mixed', label: 'Mixed' },
    { id: 'other', value: 'other', label: 'Other' },
  ],
  zodiacSign: [
    { id: 'aries', value: 'aries', label: 'Aries' },
    { id: 'taurus', value: 'taurus', label: 'Taurus' },
    { id: 'gemini', value: 'gemini', label: 'Gemini' },
    { id: 'cancer', value: 'cancer', label: 'Cancer' },
    { id: 'leo', value: 'leo', label: 'Leo' },
    { id: 'virgo', value: 'virgo', label: 'Virgo' },
    { id: 'libra', value: 'libra', label: 'Libra' },
    { id: 'scorpio', value: 'scorpio', label: 'Scorpio' },
    { id: 'sagittarius', value: 'sagittarius', label: 'Sagittarius' },
    { id: 'capricorn', value: 'capricorn', label: 'Capricorn' },
    { id: 'aquarius', value: 'aquarius', label: 'Aquarius' },
    { id: 'pisces', value: 'pisces', label: 'Pisces' },
  ],
  relationshipGoals: [
    { id: 'casual', value: 'casual', label: 'Casual dating' },
    { id: 'long-term', value: 'long-term', label: 'Long-term relationship' },
    { id: 'marriage', value: 'marriage', label: 'Marriage' },
    { id: 'not-sure', value: 'not-sure', label: 'Not sure yet' },
    { id: 'friends', value: 'friends', label: 'Just making friends' },
    { id: 'serious', value: 'serious', label: 'Looking for a serious relationship' },
  ],
  drinking: [
    { id: 'never', value: 'never', label: 'Never' },
    { id: 'rarely', value: 'rarely', label: 'Rarely' },
    { id: 'socially', value: 'socially', label: 'Social drinker' },
    { id: 'regularly', value: 'regularly', label: 'Regularly' },
  ],
  smoking: [
    { id: 'never', value: 'never', label: 'Never' },
    { id: 'socially', value: 'socially', label: 'Socially' },
    { id: 'regularly', value: 'regularly', label: 'Regularly' },
    { id: 'quitting', value: 'quitting', label: 'Trying to quit' },
  ],
  exercise: [
    { id: 'regular', value: 'regular', label: 'Regular - 4-5 times per week' },
    { id: 'occasional', value: 'occasional', label: 'Occasional - 1-3 times per week' },
    { id: 'rarely', value: 'rarely', label: 'Rarely' },
    { id: 'never', value: 'never', label: 'Never' },
  ],
  sleepSchedule: [
    { id: 'early-bird', value: 'early-bird', label: 'Early bird' },
    { id: 'night-owl', value: 'night-owl', label: 'Night owl' },
    { id: 'regular', value: 'regular', label: 'Regular schedule' },
    { id: 'irregular', value: 'irregular', label: 'Irregular schedule' },
  ],
  financialHabits: [
    { id: 'saver', value: 'saver', label: 'Saver' },
    { id: 'spender', value: 'spender', label: 'Spender' },
    { id: 'balanced', value: 'balanced', label: 'Balanced' },
    { id: 'saver-with-splurges', value: 'saver-with-splurges', label: 'Saver with occasional splurges' },
    { id: 'planner', value: 'planner', label: 'Financial planner' },
  ],
  communicationStyle: [
    { id: 'direct', value: 'direct', label: 'Direct and thoughtful' },
    { id: 'emotional', value: 'emotional', label: 'Emotionally expressive' },
    { id: 'reserved', value: 'reserved', label: 'Reserved and thoughtful' },
    { id: 'open', value: 'open', label: 'Open and honest' },
    { id: 'analytical', value: 'analytical', label: 'Analytical' },
  ],
  loveLanguage: [
    { id: 'quality-time', value: 'quality-time', label: 'Quality Time' },
    { id: 'physical-touch', value: 'physical-touch', label: 'Physical Touch' },
    { id: 'words', value: 'words', label: 'Words of Affirmation' },
    { id: 'acts', value: 'acts', label: 'Acts of Service' },
    { id: 'gifts', value: 'gifts', label: 'Receiving Gifts' },
  ],
  religion: [
    { id: 'christian', value: 'christian', label: 'Christian' },
    { id: 'catholic', value: 'catholic', label: 'Catholic' },
    { id: 'jewish', value: 'jewish', label: 'Jewish' },
    { id: 'muslim', value: 'muslim', label: 'Muslim' },
    { id: 'hindu', value: 'hindu', label: 'Hindu' },
    { id: 'buddhist', value: 'buddhist', label: 'Buddhist' },
    { id: 'spiritual', value: 'spiritual', label: 'Spiritual but not religious' },
    { id: 'agnostic', value: 'agnostic', label: 'Agnostic' },
    { id: 'atheist', value: 'atheist', label: 'Atheist' },
    { id: 'other', value: 'other', label: 'Other' },
  ],
  politicalViews: [
    { id: 'liberal', value: 'liberal', label: 'Liberal' },
    { id: 'moderate', value: 'moderate', label: 'Moderate' },
    { id: 'conservative', value: 'conservative', label: 'Conservative' },
    { id: 'not-political', value: 'not-political', label: 'Not political' },
    { id: 'other', value: 'other', label: 'Other' },
  ],
  wantChildren: [
    { id: 'want', value: 'want', label: 'Want children' },
    { id: 'dont-want', value: 'dont-want', label: 'Don\'t want children' },
    { id: 'have', value: 'have', label: 'Have children' },
    { id: 'open', value: 'open', label: 'Open to children' },
  ],
  childrenStatus: [
    { id: 'no-children', value: 'no-children', label: 'No children' },
    { id: 'have-children', value: 'have-children', label: 'Have children' },
    { id: 'want-more', value: 'want-more', label: 'Have children and want more' },
  ],
  pets: [
    { id: 'dog-owner', value: 'dog-owner', label: 'Dog owner' },
    { id: 'cat-owner', value: 'cat-owner', label: 'Cat owner' },
    { id: 'both', value: 'both', label: 'Both dog and cat owner' },
    { id: 'other-pets', value: 'other-pets', label: 'Other pets' },
    { id: 'no-pets', value: 'no-pets', label: 'No pets' },
    { id: 'allergic', value: 'allergic', label: 'Allergic to pets' },
  ],
  familyCloseness: [
    { id: 'very-close', value: 'very-close', label: 'Very close with family' },
    { id: 'somewhat-close', value: 'somewhat-close', label: 'Somewhat close with family' },
    { id: 'not-close', value: 'not-close', label: 'Not close with family' },
  ],
  favoriteSeason: [
    { id: 'spring', value: 'spring', label: 'Spring' },
    { id: 'summer', value: 'summer', label: 'Summer' },
    { id: 'fall', value: 'fall', label: 'Fall' },
    { id: 'winter', value: 'winter', label: 'Winter' },
  ],
};

const RegistrationQuestionsPage = () => {
  // State for list of questions
  const [questions, setQuestions] = useState<RegistrationQuestion[]>([
    {
      id: '1',
      question: 'What\'s your education level?',
      category: 'education',
      type: 'select',
      step: 'basics',
      isRequired: true,
      options: [
        { id: '1', value: 'high-school', label: 'High School' },
        { id: '2', value: 'bachelors', label: 'Bachelor\'s Degree' },
        { id: '3', value: 'masters', label: 'Master\'s Degree' },
        { id: '4', value: 'phd', label: 'PhD or Doctorate' },
        { id: '5', value: 'other', label: 'Other' }
      ],
      order: 1,
      isActive: true,
      profileField: 'education'
    },
    {
      id: '2',
      question: 'What do you do for work?',
      category: 'work',
      type: 'text',
      step: 'basics',
      isRequired: true,
      order: 2,
      isActive: true,
      profileField: 'occupation'
    },
    {
      id: '3',
      question: 'What are you looking for in a relationship?',
      category: 'relationship-goals',
      type: 'radio',
      step: 'relationships',
      isRequired: true,
      options: commonOptions.relationshipGoals,
      order: 1,
      isActive: true,
      profileField: 'relationshipGoals'
    },
    {
      id: '4',
      question: 'What\'s your zodiac sign?',
      category: 'zodiac',
      type: 'select',
      step: 'basics',
      isRequired: false,
      options: commonOptions.zodiacSign,
      order: 3,
      isActive: true,
      profileField: 'zodiacSign'
    },
    {
      id: '5',
      question: 'What\'s your height?',
      category: 'basic-info',
      type: 'text',
      step: 'basics',
      isRequired: true,
      order: 4,
      isActive: true,
      profileField: 'height'
    },
    {
      id: '6',
      question: 'How would you describe your body type?',
      category: 'basic-info',
      type: 'select',
      step: 'basics',
      isRequired: false,
      options: commonOptions.bodyType,
      order: 5,
      isActive: true,
      profileField: 'bodyType'
    },
    {
      id: '7',
      question: 'What\'s your ethnicity?',
      category: 'basic-info',
      type: 'select',
      step: 'basics',
      isRequired: false,
      options: commonOptions.ethnicity,
      order: 6,
      isActive: true,
      profileField: 'ethnicity'
    },
    {
      id: '8',
      question: 'What are your religious beliefs?',
      category: 'beliefs',
      type: 'select',
      step: 'basics',
      isRequired: false,
      options: commonOptions.religion,
      order: 7,
      isActive: true,
      profileField: 'religion'
    },
    {
      id: '9',
      question: 'What are your political views?',
      category: 'beliefs',
      type: 'select',
      step: 'basics',
      isRequired: false,
      options: commonOptions.politicalViews,
      order: 8,
      isActive: true,
      profileField: 'politicalViews'
    },
    {
      id: '10',
      question: 'Select the values that are important to you',
      category: 'values',
      type: 'checkbox',
      step: 'basics',
      isRequired: false,
      options: [
        { id: '1', value: 'authenticity', label: 'Authenticity' },
        { id: '2', value: 'kindness', label: 'Kindness' },
        { id: '3', value: 'growth', label: 'Growth' },
        { id: '4', value: 'adventure', label: 'Adventure' },
        { id: '5', value: 'balance', label: 'Balance' },
        { id: '6', value: 'independence', label: 'Independence' },
        { id: '7', value: 'creativity', label: 'Creativity' },
        { id: '8', value: 'honesty', label: 'Honesty' }
      ],
      order: 9,
      isActive: true,
      profileField: 'values'
    },
    {
      id: '11',
      question: 'What are your drinking habits?',
      category: 'drinking',
      type: 'select',
      step: 'lifestyle',
      isRequired: false,
      options: commonOptions.drinking,
      order: 1,
      isActive: true,
      profileField: 'drinking'
    },
    {
      id: '12',
      question: 'What are your smoking habits?',
      category: 'smoking',
      type: 'select',
      step: 'lifestyle',
      isRequired: false,
      options: commonOptions.smoking,
      order: 2,
      isActive: true,
      profileField: 'smoking'
    },
    {
      id: '13',
      question: 'How often do you exercise?',
      category: 'exercise',
      type: 'select',
      step: 'lifestyle',
      isRequired: false,
      options: commonOptions.exercise,
      order: 3,
      isActive: true,
      profileField: 'exerciseHabits'
    },
    {
      id: '14',
      question: 'What\'s your sleep schedule like?',
      category: 'sleep-schedule',
      type: 'select',
      step: 'lifestyle',
      isRequired: false,
      options: commonOptions.sleepSchedule,
      order: 4,
      isActive: true,
      profileField: 'sleepSchedule'
    },
    {
      id: '15',
      question: 'How would you describe your financial habits?',
      category: 'financial-habits',
      type: 'select',
      step: 'lifestyle',
      isRequired: false,
      options: commonOptions.financialHabits,
      order: 5,
      isActive: true,
      profileField: 'financialHabits'
    },
    {
      id: '16',
      question: 'What are your typical weekend activities?',
      category: 'weekend-activities',
      type: 'textarea',
      step: 'lifestyle',
      isRequired: false,
      order: 6,
      isActive: true,
      profileField: 'weekendActivities'
    },
    {
      id: '17',
      question: 'How do you approach work-life balance?',
      category: 'work-life-balance',
      type: 'textarea',
      step: 'lifestyle',
      isRequired: false,
      order: 7,
      isActive: true,
      profileField: 'workLifeBalance'
    },
    {
      id: '18',
      question: 'What are your dietary preferences?',
      category: 'dietary-preferences',
      type: 'textarea',
      step: 'lifestyle',
      isRequired: false,
      order: 8,
      isActive: true,
      profileField: 'dietaryPreferences'
    },
    {
      id: '19',
      question: 'Describe your morning routine',
      category: 'morning-routine',
      type: 'textarea',
      step: 'lifestyle',
      isRequired: false,
      order: 9,
      isActive: true,
      profileField: 'morningRoutine'
    },
    {
      id: '20',
      question: 'Describe your evening routine',
      category: 'evening-routine',
      type: 'textarea',
      step: 'lifestyle',
      isRequired: false,
      order: 10,
      isActive: true,
      profileField: 'eveningRoutine'
    },
    {
      id: '21',
      question: 'What\'s your stance on having children?',
      category: 'children',
      type: 'select',
      step: 'relationships',
      isRequired: false,
      options: commonOptions.wantChildren,
      order: 2,
      isActive: true,
      profileField: 'wantChildren'
    },
    {
      id: '22',
      question: 'Do you have pets?',
      category: 'pets',
      type: 'select',
      step: 'relationships',
      isRequired: false,
      options: commonOptions.pets,
      order: 3,
      isActive: true,
      profileField: 'havePets'
    },
    {
      id: '23',
      question: 'How close are you with your family?',
      category: 'family-friends',
      type: 'select',
      step: 'relationships',
      isRequired: false,
      options: commonOptions.familyCloseness,
      order: 4,
      isActive: true,
      profileField: 'familyCloseness'
    },
    {
      id: '24',
      question: 'How would you describe your communication style?',
      category: 'communication-style',
      type: 'select',
      step: 'communication',
      isRequired: false,
      options: commonOptions.communicationStyle,
      order: 1,
      isActive: true,
      profileField: 'communicationStyle'
    },
    {
      id: '25',
      question: 'What are your love languages?',
      category: 'love-language',
      type: 'checkbox',
      step: 'relationships',
      isRequired: false,
      options: commonOptions.loveLanguage,
      order: 5,
      isActive: true,
      profileField: 'loveLanguage'
    },
    {
      id: '26',
      question: 'What are your pet peeves?',
      category: 'pet-peeves',
      type: 'listInput',
      step: 'relationships',
      isRequired: false,
      order: 6,
      isActive: true,
      profileField: 'petPeeves'
    },
    {
      id: '27',
      question: 'What languages do you speak?',
      category: 'languages',
      type: 'listInput',
      step: 'communication',
      isRequired: false,
      order: 2,
      isActive: true,
      profileField: 'languages'
    },
    {
      id: '28',
      question: 'What are your interests and hobbies?',
      category: 'interests',
      type: 'listInput',
      step: 'interests-hobbies',
      isRequired: true,
      order: 1,
      isActive: true,
      profileField: 'interests'
    },
    {
      id: '29',
      question: 'Describe your ideal date',
      category: 'ideal-date',
      type: 'textarea',
      step: 'interests-hobbies',
      isRequired: false,
      order: 2,
      isActive: true,
      profileField: 'idealDate'
    },
    {
      id: '30',
      question: 'What are your career ambitions?',
      category: 'career-ambitions',
      type: 'textarea',
      step: 'interests-hobbies',
      isRequired: false,
      order: 3,
      isActive: true,
      profileField: 'careerAmbitions'
    },
    {
      id: '31',
      question: 'Do you play any musical instruments?',
      category: 'music-instruments',
      type: 'listInput',
      step: 'interests-hobbies',
      isRequired: false,
      order: 4,
      isActive: true,
      profileField: 'musicInstruments'
    },
    {
      id: '32',
      question: 'What are your favorite games?',
      category: 'favorite-games',
      type: 'listInput',
      step: 'interests-hobbies',
      isRequired: false,
      order: 5,
      isActive: true,
      profileField: 'favoriteGames'
    },
    {
      id: '33',
      question: 'What are your favorite books?',
      category: 'books',
      type: 'listInput',
      step: 'favorites',
      isRequired: false,
      order: 1,
      isActive: true,
      profileField: 'favoriteBooks'
    },
    {
      id: '34',
      question: 'What are your favorite movies?',
      category: 'movies',
      type: 'listInput',
      step: 'favorites',
      isRequired: false,
      order: 2,
      isActive: true,
      profileField: 'favoriteMovies'
    },
    {
      id: '35',
      question: 'What kind of music do you like?',
      category: 'music',
      type: 'listInput',
      step: 'favorites',
      isRequired: false,
      order: 3,
      isActive: true,
      profileField: 'favoriteMusic'
    },
    {
      id: '36',
      question: 'What are your favorite foods or cuisines?',
      category: 'food',
      type: 'listInput',
      step: 'favorites',
      isRequired: false,
      order: 4,
      isActive: true,
      profileField: 'favoriteFoods'
    },
    {
      id: '37',
      question: 'What podcasts do you listen to?',
      category: 'podcasts',
      type: 'listInput',
      step: 'favorites',
      isRequired: false,
      order: 5,
      isActive: true,
      profileField: 'favoritePodcasts'
    },
    {
      id: '38',
      question: 'How would you describe your decision making style?',
      category: 'decision-making',
      type: 'textarea',
      step: 'personality-growth',
      isRequired: false,
      order: 1,
      isActive: true,
      profileField: 'decisionMakingStyle'
    },
    {
      id: '39',
      question: 'What are your personal growth goals?',
      category: 'growth-goals',
      type: 'listInput',
      step: 'personality-growth',
      isRequired: false,
      order: 2,
      isActive: true,
      profileField: 'growthGoals'
    },
    {
      id: '40',
      question: 'Do you have any hidden talents?',
      category: 'hidden-talents',
      type: 'listInput',
      step: 'personality-growth',
      isRequired: false,
      order: 3,
      isActive: true,
      profileField: 'hiddenTalents'
    },
    {
      id: '41',
      question: 'What\'s your favorite memory?',
      category: 'favorite-memory',
      type: 'textarea',
      step: 'personality-growth',
      isRequired: false,
      order: 4,
      isActive: true,
      profileField: 'favoriteMemory'
    },
    {
      id: '42',
      question: 'How do you relieve stress?',
      category: 'stress-relievers',
      type: 'listInput',
      step: 'personality-growth',
      isRequired: false,
      order: 5,
      isActive: true,
      profileField: 'stressRelievers'
    },
    {
      id: '43',
      question: 'Are you involved in any charitable work?',
      category: 'charity-involvement',
      type: 'textarea',
      step: 'personality-growth',
      isRequired: false,
      order: 6,
      isActive: true,
      profileField: 'charityInvolvement'
    },
    {
      id: '44',
      question: 'What creative activities do you enjoy?',
      category: 'creative-pursuits',
      type: 'listInput',
      step: 'creative-lifestyle',
      isRequired: false,
      order: 1,
      isActive: true,
      profileField: 'creativePursuits'
    },
    {
      id: '45',
      question: 'Describe your dream home',
      category: 'dream-home',
      type: 'textarea',
      step: 'creative-lifestyle',
      isRequired: false,
      order: 2,
      isActive: true,
      profileField: 'dreamHome'
    },
    {
      id: '46',
      question: 'What\'s your preferred mode of transportation?',
      category: 'transportation',
      type: 'textarea',
      step: 'creative-lifestyle',
      isRequired: false,
      order: 3,
      isActive: true,
      profileField: 'transportationPreference'
    },
    {
      id: '47',
      question: 'What tech skills do you have?',
      category: 'tech-skills',
      type: 'listInput',
      step: 'creative-lifestyle',
      isRequired: false,
      order: 4,
      isActive: true,
      profileField: 'techSkills'
    },
    {
      id: '48',
      question: 'Describe your ideal work environment',
      category: 'work-environment',
      type: 'textarea',
      step: 'creative-lifestyle',
      isRequired: false,
      order: 5,
      isActive: true,
      profileField: 'workEnvironment'
    },
    {
      id: '49',
      question: 'What\'s your favorite season?',
      category: 'favorite-season',
      type: 'select',
      step: 'creative-lifestyle',
      isRequired: false,
      options: commonOptions.favoriteSeason,
      order: 6,
      isActive: true,
      profileField: 'favoriteSeason'
    },
    {
      id: '50',
      question: 'What\'s your ideal weather?',
      category: 'ideal-weather',
      type: 'textarea',
      step: 'creative-lifestyle',
      isRequired: false,
      order: 7,
      isActive: true,
      profileField: 'idealWeather'
    },
    {
      id: '51',
      question: 'How often do you travel?',
      category: 'travel-frequency',
      type: 'textarea',
      step: 'travel',
      isRequired: false,
      order: 1,
      isActive: true,
      profileField: 'travelFrequency'
    },
    {
      id: '52',
      question: 'What\'s your dream vacation?',
      category: 'dream-vacation',
      type: 'textarea',
      step: 'travel',
      isRequired: false,
      order: 2,
      isActive: true,
      profileField: 'dreamVacation'
    }
  ]);
  
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for step filter
  const [stepFilter, setStepFilter] = useState<string>('all');
  
  // State for category filter
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
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

  // Filter questions based on search, step filter, and category filter
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = 
      question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (question.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStep = stepFilter === 'all' || question.step === stepFilter;
    
    const matchesCategory = categoryFilter === 'all' || question.category === categoryFilter;
    
    return matchesSearch && matchesStep && matchesCategory;
  });

  // Function to get step name for display
  const getStepName = (step: RegistrationStep): string => {
    switch(step) {
      case 'basics':
        return 'Basics';
      case 'lifestyle':
        return 'Lifestyle';
      case 'relationships':
        return 'Relationships';
      case 'interests-hobbies':
        return 'Interests & Hobbies';
      case 'favorites':
        return 'Favorites';
      case 'communication':
        return 'Communication';
      case 'personality-growth':
        return 'Personality & Growth';
      case 'creative-lifestyle':
        return 'Creative & Lifestyle';
      case 'travel':
        return 'Travel';
      default:
        return step;
    }
  };

  // Function to get step badge color
  const getStepBadge = (step: RegistrationStep) => {
    switch(step) {
      case 'basics':
        return <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100">{getStepName(step)}</Badge>;
      case 'lifestyle':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{getStepName(step)}</Badge>;
      case 'relationships':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{getStepName(step)}</Badge>;
      case 'interests-hobbies':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">{getStepName(step)}</Badge>;
      case 'favorites':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">{getStepName(step)}</Badge>;
      case 'communication':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{getStepName(step)}</Badge>;
      case 'personality-growth':
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">{getStepName(step)}</Badge>;
      case 'creative-lifestyle':
        return <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100">{getStepName(step)}</Badge>;
      case 'travel':
        return <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">{getStepName(step)}</Badge>;
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
      case 'listInput':
        return <Badge variant="outline">List Input</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // Function to get category display
  const getCategoryDisplay = (categoryId?: string) => {
    if (!categoryId) return null;
    const category = categories[categoryId];
    if (!category) return null;
    
    return (
      <div className="flex items-center gap-1">
        <span className="text-gray-500">{category.icon}</span>
        <span>{category.name}</span>
      </div>
    );
  };

  // Open dialog to add a new question
  const openAddQuestionDialog = () => {
    setOptionInputs([]);
    setQuestionDialog({
      open: true,
      mode: 'add',
      currentQuestion: {
        type: 'text',
        step: 'basics',
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
      category: questionDialog.currentQuestion.category,
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
            Manage questions users see during the registration process. Questions are organized by registration steps and categories.
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
                      <SelectItem value="basics">Basics</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="relationships">Relationships</SelectItem>
                      <SelectItem value="interests-hobbies">Interests & Hobbies</SelectItem>
                      <SelectItem value="favorites">Favorites</SelectItem>
                      <SelectItem value="communication">Communication</SelectItem>
                      <SelectItem value="personality-growth">Personality & Growth</SelectItem>
                      <SelectItem value="creative-lifestyle">Creative & Lifestyle</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto">
                      <SelectItem value="all">All Categories</SelectItem>
                      {Object.values(categories).map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
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
                      <TableHead>Category</TableHead>
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
                          <TableCell>{getCategoryDisplay(question.category)}</TableCell>
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
                        <TableCell colSpan={8} className="text-center py-6">
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
                
                {['basics', 'lifestyle', 'relationships', 'interests-hobbies', 'favorites', 'communication', 'personality-growth', 'creative-lifestyle', 'travel'].map((step) => {
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
                          {step === 'basics' && 'Essential information to get started'}
                          {step === 'lifestyle' && 'Tell us about your lifestyle and daily habits'}
                          {step === 'relationships' && 'Help us understand what you\'re looking for in relationships'}
                          {step === 'interests-hobbies' && 'Share your interests and what you enjoy doing'}
                          {step === 'favorites' && 'Your favorite books, movies, music, and more'}
                          {step === 'communication' && 'How you communicate and connect with others'}
                          {step === 'personality-growth' && 'Insights into your personality and personal growth'}
                          {step === 'creative-lifestyle' && 'Your creative pursuits and lifestyle preferences'}
                          {step === 'travel' && 'Your travel habits and dream destinations'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {stepQuestions.map((question) => (
                            <div key={question.id} className="border p-4 rounded-md space-y-2">
                              <div className="flex items-center gap-2 mb-1">
                                {question.category && categories[question.category] && (
                                  <span className="text-gray-500">{categories[question.category].icon}</span>
                                )}
                                <div className="font-medium flex items-center gap-2">
                                  {question.question}
                                  {question.isRequired && (
                                    <span className="text-red-500 text-sm">*</span>
                                  )}
                                </div>
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
                                {question.type === 'listInput' && (
                                  <div className="space-y-2">
                                    <div className="flex space-x-2">
                                      <Input disabled placeholder="Add an item" className="flex-1" />
                                      <Button disabled variant="outline" size="sm">Add</Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      <Badge className="bg-pink-100 text-pink-800 rounded-full px-3 py-1">Sample item <Button disabled variant="ghost" size="icon" className="h-4 w-4 ml-1 text-pink-800">×</Button></Badge>
                                    </div>
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
                        <SelectItem value="listInput">List Input</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="step">Registration Step <span className="text-red-500">*</span></Label>
                    <Select 
                      value={questionDialog.currentQuestion?.step || 'basics'}
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
                        <SelectItem value="basics">Basics</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="relationships">Relationships</SelectItem>
                        <SelectItem value="interests-hobbies">Interests & Hobbies</SelectItem>
                        <SelectItem value="favorites">Favorites</SelectItem>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="personality-growth">Personality & Growth</SelectItem>
                        <SelectItem value="creative-lifestyle">Creative & Lifestyle</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                  <Select 
                    value={questionDialog.currentQuestion?.category}
                    onValueChange={(value) => setQuestionDialog({
                      ...questionDialog,
                      currentQuestion: {
                        ...questionDialog.currentQuestion!,
                        category: value
                      }
                    })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto">
                      {Object.values(categories).map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">{category.icon}</span>
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
