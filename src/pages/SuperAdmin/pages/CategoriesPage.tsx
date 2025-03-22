
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
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, Plus, Edit, Trash2, Save, X, FileUp, FileDown, 
  AlertTriangle, CheckCircle, Filter, PlusCircle, Tag, User
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
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface Category {
  id: string;
  name: string;
  type: string;
  profileField: string;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}

// Comprehensive list of all profile fields based on the provided images
const PROFILE_FIELDS = [
  // Basic Info & Personal Details
  { value: 'basics', label: 'Basics', group: 'Personal' },
  { value: 'height', label: 'Height', group: 'Personal' },
  { value: 'bodyType', label: 'Body Type', group: 'Personal' },
  { value: 'ethnicity', label: 'Ethnicity', group: 'Personal' },
  { value: 'education', label: 'Education', group: 'Personal' },
  { value: 'occupation', label: 'Occupation', group: 'Personal' },
  { value: 'company', label: 'Company', group: 'Personal' },
  { value: 'zodiacSign', label: 'Zodiac Sign', group: 'Personal' },
  { value: 'personalityType', label: 'Personality Type', group: 'Personal' },
  
  // Beliefs & Values
  { value: 'religion', label: 'Religion', group: 'Beliefs' },
  { value: 'politicalViews', label: 'Political Views', group: 'Beliefs' },
  { value: 'values', label: 'Values', group: 'Beliefs' },
  
  // Lifestyle
  { value: 'lifestyle', label: 'Lifestyle', group: 'Lifestyle' },
  { value: 'drinking', label: 'Drinking', group: 'Lifestyle' },
  { value: 'smoking', label: 'Smoking', group: 'Lifestyle' },
  { value: 'exerciseHabits', label: 'Exercise Habits', group: 'Lifestyle' },
  { value: 'sleepSchedule', label: 'Sleep Schedule', group: 'Lifestyle' },
  { value: 'financialHabits', label: 'Financial Habits', group: 'Lifestyle' },
  { value: 'weekendActivities', label: 'Weekend Activities', group: 'Lifestyle' },
  { value: 'workLifeBalance', label: 'Work-Life Balance', group: 'Lifestyle' },
  { value: 'dietaryPreferences', label: 'Dietary Preferences', group: 'Lifestyle' },
  { value: 'morningRoutine', label: 'Morning Routine', group: 'Lifestyle' },
  { value: 'eveningRoutine', label: 'Evening Routine', group: 'Lifestyle' },
  
  // Relationships
  { value: 'relationships', label: 'Relationships', group: 'Relationships' },
  { value: 'relationshipGoals', label: 'Relationship Goals', group: 'Relationships' },
  { value: 'wantChildren', label: 'Want Children', group: 'Relationships' },
  { value: 'childrenStatus', label: 'Children Status', group: 'Relationships' },
  { value: 'familyCloseness', label: 'Family Closeness', group: 'Relationships' },
  { value: 'friendshipStyle', label: 'Friendship Style', group: 'Relationships' },
  { value: 'loveLanguage', label: 'Love Language', group: 'Relationships' },
  { value: 'idealDate', label: 'Ideal Date', group: 'Relationships' },
  { value: 'petPeeves', label: 'Pet Peeves', group: 'Relationships' },
  { value: 'havePets', label: 'Have Pets', group: 'Relationships' },
  
  // Communication
  { value: 'languages', label: 'Languages', group: 'Communication' },
  { value: 'communicationStyle', label: 'Communication Style', group: 'Communication' },
  { value: 'decisionMakingStyle', label: 'Decision Making Style', group: 'Communication' },
  
  // Interests & Hobbies
  { value: 'interests', label: 'Interests', group: 'Interests' },
  { value: 'hobbies', label: 'Hobbies', group: 'Interests' },
  { value: 'creativePursuits', label: 'Creative Pursuits', group: 'Interests' },
  { value: 'careerAmbitions', label: 'Career Ambitions', group: 'Interests' },
  { value: 'musicInstruments', label: 'Music Instruments', group: 'Interests' },
  { value: 'techSkills', label: 'Tech Skills', group: 'Interests' },
  
  // Favorites
  { value: 'favoriteBooks', label: 'Favorite Books', group: 'Favorites' },
  { value: 'favoriteMovies', label: 'Favorite Movies', group: 'Favorites' },
  { value: 'favoriteMusic', label: 'Favorite Music', group: 'Favorites' },
  { value: 'favoriteFoods', label: 'Favorite Foods', group: 'Favorites' },
  { value: 'favoriteGames', label: 'Favorite Games', group: 'Favorites' },
  { value: 'favoritePodcasts', label: 'Favorite Podcasts', group: 'Favorites' },
  { value: 'favoriteSeason', label: 'Favorite Season', group: 'Favorites' },
  { value: 'favoriteQuote', label: 'Favorite Quote', group: 'Favorites' },
  { value: 'favoriteMemory', label: 'Favorite Memory', group: 'Favorites' },
  
  // Travel & Location
  { value: 'travelFrequency', label: 'Travel Frequency', group: 'Travel' },
  { value: 'dreamVacation', label: 'Dream Vacation', group: 'Travel' },
  { value: 'transportationPreference', label: 'Transportation Preference', group: 'Travel' },
  
  // Growth & Development
  { value: 'growthGoals', label: 'Growth Goals', group: 'Growth' },
  { value: 'hiddenTalents', label: 'Hidden Talents', group: 'Growth' },
  { value: 'stressRelievers', label: 'Stress Relievers', group: 'Growth' },
  { value: 'charityInvolvement', label: 'Charity Involvement', group: 'Growth' },
  
  // Living Preferences
  { value: 'dreamHome', label: 'Dream Home', group: 'Living' },
  { value: 'workEnvironment', label: 'Work Environment', group: 'Living' },
  { value: 'idealWeather', label: 'Ideal Weather', group: 'Living' }
];

const CATEGORY_TYPES = [
  { value: 'basic', label: 'Basic Info' },
  { value: 'interest', label: 'Interest' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'hobby', label: 'Hobby' },
  { value: 'relationship', label: 'Relationship' },
  { value: 'value', label: 'Value' },
  { value: 'preference', label: 'Preference' },
  { value: 'skill', label: 'Skill' },
  { value: 'trait', label: 'Personality Trait' },
  { value: 'favorite', label: 'Favorite' },
  { value: 'goal', label: 'Goal' },
  { value: 'habit', label: 'Habit' }
];

const categorySchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters."
  }).max(50, {
    message: "Category name must not exceed 50 characters."
  }),
  type: z.string().min(1, {
    message: "Category type is required."
  }),
  profileField: z.string().min(1, {
    message: "Profile field is required."
  }),
  isActive: z.boolean().default(true)
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterField, setFilterField] = useState('all');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editableCategories, setEditableCategories] = useState<{ [key: string]: boolean }>({});
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Expanded initial categories data that covers all the profile sections shown in the images
  const [categories, setCategories] = useState<Category[]>([
    // Basics
    {
      id: '1',
      name: 'Height (170 cm)',
      type: 'basic',
      profileField: 'height',
      usageCount: 1845,
      isActive: true,
      createdAt: '2022-01-15'
    },
    {
      id: '2',
      name: 'Athletic',
      type: 'basic',
      profileField: 'bodyType',
      usageCount: 1356,
      isActive: true,
      createdAt: '2022-01-16'
    },
    {
      id: '3',
      name: 'Mixed',
      type: 'basic',
      profileField: 'ethnicity',
      usageCount: 987,
      isActive: true,
      createdAt: '2022-01-17'
    },
    // Interests & Hobbies
    {
      id: '4',
      name: 'Hiking',
      type: 'interest',
      profileField: 'interests',
      usageCount: 2456,
      isActive: true,
      createdAt: '2022-01-18'
    },
    {
      id: '5',
      name: 'Photography',
      type: 'hobby',
      profileField: 'hobbies',
      usageCount: 1876,
      isActive: true,
      createdAt: '2022-01-19'
    },
    {
      id: '6',
      name: 'Cooking',
      type: 'interest',
      profileField: 'interests',
      usageCount: 2134,
      isActive: true,
      createdAt: '2022-01-20'
    },
    // Values & Beliefs
    {
      id: '7',
      name: 'Spiritual but not religious',
      type: 'value',
      profileField: 'religion',
      usageCount: 765,
      isActive: true,
      createdAt: '2022-01-21'
    },
    {
      id: '8',
      name: 'Moderate',
      type: 'value',
      profileField: 'politicalViews',
      usageCount: 653,
      isActive: true,
      createdAt: '2022-01-22'
    },
    // Lifestyle
    {
      id: '9',
      name: 'Social drinker',
      type: 'lifestyle',
      profileField: 'drinking',
      usageCount: 1432,
      isActive: true,
      createdAt: '2022-01-23'
    },
    {
      id: '10',
      name: 'Never',
      type: 'lifestyle',
      profileField: 'smoking',
      usageCount: 1876,
      isActive: true,
      createdAt: '2022-01-24'
    },
    {
      id: '11',
      name: 'Regular - 4-5 times per week',
      type: 'lifestyle',
      profileField: 'exerciseHabits',
      usageCount: 934,
      isActive: true,
      createdAt: '2022-01-25'
    },
    // Relationships
    {
      id: '12',
      name: 'Looking for a serious relationship',
      type: 'relationship',
      profileField: 'relationshipGoals',
      usageCount: 2345,
      isActive: true,
      createdAt: '2022-01-26'
    },
    {
      id: '13',
      name: 'Open to children',
      type: 'relationship',
      profileField: 'wantChildren',
      usageCount: 1654,
      isActive: true,
      createdAt: '2022-01-27'
    },
    // Favorites
    {
      id: '14',
      name: 'The Alchemist',
      type: 'favorite',
      profileField: 'favoriteBooks',
      usageCount: 743,
      isActive: true,
      createdAt: '2022-01-28'
    },
    {
      id: '15',
      name: 'Japanese',
      type: 'favorite',
      profileField: 'favoriteFoods',
      usageCount: 1231,
      isActive: true,
      createdAt: '2022-01-29'
    }
  ]);

  const [editingValues, setEditingValues] = useState<{
    [key: string]: { name: string; type: string; profileField: string; isActive: boolean }
  }>({});

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: '',
      profileField: '',
      isActive: true
    }
  });

  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: '',
      profileField: '',
      isActive: true
    }
  });

  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      filterType === 'all' || 
      category.type === filterType;
    
    const matchesField = 
      filterField === 'all' || 
      category.profileField === filterField;
    
    return matchesSearch && matchesType && matchesField;
  });

  const toggleEditMode = (category: Category) => {
    const newEditableCategories = { ...editableCategories };
    
    if (editableCategories[category.id]) {
      const updatedCategories = categories.map(cat => {
        if (cat.id === category.id && editingValues[category.id]) {
          return {
            ...cat,
            name: editingValues[category.id].name,
            type: editingValues[category.id].type,
            profileField: editingValues[category.id].profileField,
            isActive: editingValues[category.id].isActive
          };
        }
        return cat;
      });
      
      setCategories(updatedCategories);
      newEditableCategories[category.id] = false;
      toast.success(`Category "${category.name}" updated successfully`);
    } else {
      setEditingValues({
        ...editingValues,
        [category.id]: {
          name: category.name,
          type: category.type,
          profileField: category.profileField,
          isActive: category.isActive
        }
      });
      newEditableCategories[category.id] = true;
    }
    
    setEditableCategories(newEditableCategories);
  };

  const cancelEdit = (categoryId: string) => {
    const newEditableCategories = { ...editableCategories };
    newEditableCategories[categoryId] = false;
    setEditableCategories(newEditableCategories);
  };

  const handleEditChange = (
    categoryId: string, 
    field: 'name' | 'type' | 'profileField' | 'isActive', 
    value: string | boolean
  ) => {
    setEditingValues({
      ...editingValues,
      [categoryId]: {
        ...editingValues[categoryId],
        [field]: value
      }
    });
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    editForm.reset({
      name: category.name,
      type: category.type,
      profileField: category.profileField,
      isActive: category.isActive
    });
    setIsEditCategoryOpen(true);
  };

  const confirmDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteConfirmOpen(true);
  };

  const addNewCategory = (data: CategoryFormValues) => {
    const newCategory: Category = {
      id: `${categories.length + 1}`,
      name: data.name,
      type: data.type,
      profileField: data.profileField,
      usageCount: 0,
      isActive: data.isActive,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setCategories([...categories, newCategory]);
    setIsAddCategoryOpen(false);
    form.reset();
    toast.success(`Category "${data.name}" added successfully`);
  };

  const updateCategory = (data: CategoryFormValues) => {
    if (!selectedCategory) return;
    
    const updatedCategories = categories.map(category => {
      if (category.id === selectedCategory.id) {
        return {
          ...category,
          name: data.name,
          type: data.type,
          profileField: data.profileField,
          isActive: data.isActive
        };
      }
      return category;
    });
    
    setCategories(updatedCategories);
    setIsEditCategoryOpen(false);
    toast.success(`Category "${data.name}" updated successfully`);
  };

  const deleteCategory = () => {
    if (!selectedCategory) return;
    
    setCategories(categories.filter(category => category.id !== selectedCategory.id));
    setIsDeleteConfirmOpen(false);
    toast.success(`Category "${selectedCategory.name}" deleted successfully`);
  };

  const toggleCategorySelection = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map(category => category.id));
    }
    setSelectAll(!selectAll);
  };

  const bulkDelete = () => {
    setCategories(categories.filter(category => !selectedCategories.includes(category.id)));
    setSelectedCategories([]);
    setIsBulkActionOpen(false);
    toast.success(`${selectedCategories.length} categories deleted successfully`);
  };

  const bulkToggleActive = (active: boolean) => {
    const updatedCategories = categories.map(category => {
      if (selectedCategories.includes(category.id)) {
        return { ...category, isActive: active };
      }
      return category;
    });
    
    setCategories(updatedCategories);
    setIsBulkActionOpen(false);
    toast.success(`${selectedCategories.length} categories updated successfully`);
  };

  const exportCategories = () => {
    const dataToExport = filteredCategories.map(({ id, name, type, profileField, usageCount, isActive, createdAt }) => ({
      id, name, type, profileField, usageCount, isActive, createdAt
    }));
    
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'categories-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Categories exported successfully');
  };

  const countCategoriesByType = () => {
    const counts: Record<string, number> = { all: 0 };
    
    categories.forEach(category => {
      counts.all += 1;
      counts[category.type] = (counts[category.type] || 0) + 1;
    });
    
    return counts;
  };

  const countCategoriesByField = () => {
    const counts: Record<string, number> = { all: 0 };
    
    categories.forEach(category => {
      counts.all += 1;
      counts[category.profileField] = (counts[category.profileField] || 0) + 1;
    });
    
    return counts;
  };

  const categoryCounts = countCategoriesByType();
  const fieldCounts = countCategoriesByField();

  const getProfileFieldLabel = (fieldValue: string) => {
    const field = PROFILE_FIELDS.find(f => f.value === fieldValue);
    return field ? field.label : fieldValue;
  };

  const getCategoryTypeLabel = (typeValue: string) => {
    const type = CATEGORY_TYPES.find(t => t.value === typeValue);
    return type ? type.label : typeValue.charAt(0).toUpperCase() + typeValue.slice(1);
  };

  const getProfileFieldGroup = (fieldValue: string) => {
    const field = PROFILE_FIELDS.find(f => f.value === fieldValue);
    return field ? field.group : 'Other';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => exportCategories()}
          >
            <FileDown size={16} />
            Export
          </Button>
          <Button onClick={() => setIsAddCategoryOpen(true)} className="gap-2">
            <Plus size={16} />
            Add New Category
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types ({categoryCounts.all || 0})</SelectItem>
                  {CATEGORY_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label} ({categoryCounts[type.value] || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterField} onValueChange={setFilterField}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by profile field" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all">All Fields ({fieldCounts.all || 0})</SelectItem>
                  
                  {/* Group the fields for better organization */}
                  {Array.from(new Set(PROFILE_FIELDS.map(f => f.group))).map(group => (
                    <React.Fragment key={group}>
                      <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                        {group}
                      </div>
                      {PROFILE_FIELDS.filter(f => f.group === group).map(field => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label} ({fieldCounts[field.value] || 0})
                        </SelectItem>
                      ))}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedCategories.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsBulkActionOpen(true)}
                  className="gap-2"
                >
                  <Tag size={16} />
                  Bulk Actions ({selectedCategories.length})
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px] text-center">
                    <input 
                      type="checkbox" 
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead className="w-[60px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Profile Field</TableHead>
                  <TableHead>Field Group</TableHead>
                  <TableHead>Usage Count</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategorySelection(category.id)}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{category.id}</TableCell>
                      <TableCell>
                        {editableCategories[category.id] ? (
                          <Input
                            value={editingValues[category.id]?.name || ''}
                            onChange={(e) => handleEditChange(category.id, 'name', e.target.value)}
                            className="h-8 py-1"
                          />
                        ) : (
                          category.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editableCategories[category.id] ? (
                          <Select 
                            value={editingValues[category.id]?.type} 
                            onValueChange={(value) => handleEditChange(category.id, 'type', value)}
                          >
                            <SelectTrigger className="h-8 px-2 py-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORY_TYPES.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline" className="capitalize">
                            {getCategoryTypeLabel(category.type)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {editableCategories[category.id] ? (
                          <Select 
                            value={editingValues[category.id]?.profileField} 
                            onValueChange={(value) => handleEditChange(category.id, 'profileField', value)}
                          >
                            <SelectTrigger className="h-8 px-2 py-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {Array.from(new Set(PROFILE_FIELDS.map(f => f.group))).map(group => (
                                <React.Fragment key={group}>
                                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                                    {group}
                                  </div>
                                  {PROFILE_FIELDS.filter(f => f.group === group).map(field => (
                                    <SelectItem key={field.value} value={field.value}>
                                      {field.label}
                                    </SelectItem>
                                  ))}
                                </React.Fragment>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                            <User size={12} className="mr-1" />
                            {getProfileFieldLabel(category.profileField)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-50">
                          {getProfileFieldGroup(category.profileField)}
                        </Badge>
                      </TableCell>
                      <TableCell>{category.usageCount}</TableCell>
                      <TableCell>
                        {editableCategories[category.id] ? (
                          <div className="flex items-center">
                            <Switch 
                              checked={editingValues[category.id]?.isActive} 
                              onCheckedChange={(checked) => handleEditChange(
                                category.id, 
                                'isActive', 
                                checked
                              )}
                              className="h-5 w-9"
                            />
                          </div>
                        ) : (
                          <Badge className={`${
                            category.isActive 
                              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                              : 'bg-red-100 text-red-800 hover:bg-red-100'
                          }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{category.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {editableCategories[category.id] ? (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => toggleEditMode(category)}
                              >
                                <Save size={16} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => cancelEdit(category.id)}
                              >
                                <X size={16} />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openEditDialog(category)}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => confirmDeleteCategory(category)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-6">
                      No categories found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for users to select in their profiles.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addNewCategory)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter category name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORY_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                          <SelectValue placeholder="Select profile field" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[300px]">
                        {Array.from(new Set(PROFILE_FIELDS.map(f => f.group))).map(group => (
                          <React.Fragment key={group}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                              {group}
                            </div>
                            {PROFILE_FIELDS.filter(f => f.group === group).map(field => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </React.Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select which profile section this category will appear in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>
                        Set whether this category is active and visible to users
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
                <Button variant="outline" type="button" onClick={() => setIsAddCategoryOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Category</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Make changes to the category details.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(updateCategory)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter category name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORY_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                          <SelectValue placeholder="Select profile field" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[300px]">
                        {Array.from(new Set(PROFILE_FIELDS.map(f => f.group))).map(group => (
                          <React.Fragment key={group}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                              {group}
                            </div>
                            {PROFILE_FIELDS.filter(f => f.group === group).map(field => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </React.Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select which profile section this category will appear in
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>
                        Set whether this category is active and visible to users
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
                <Button variant="outline" type="button" onClick={() => setIsEditCategoryOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center p-4 my-4 text-sm text-amber-800 rounded-lg bg-amber-50">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <p>This category is used in {selectedCategory?.usageCount} user profiles. Deleting it may affect their experience.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBulkActionOpen} onOpenChange={setIsBulkActionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
            <DialogDescription>
              Apply actions to {selectedCategories.length} selected categories.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-medium">Status Actions</h3>
              <Button 
                variant="outline" 
                className="justify-start gap-2" 
                onClick={() => bulkToggleActive(true)}
              >
                <CheckCircle size={16} />
                Set All Active
              </Button>
              <Button 
                variant="outline" 
                className="justify-start gap-2" 
                onClick={() => bulkToggleActive(false)}
              >
                <X size={16} />
                Set All Inactive
              </Button>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-medium">Danger Zone</h3>
              <Button 
                variant="destructive" 
                className="justify-start gap-2" 
                onClick={bulkDelete}
              >
                <Trash2 size={16} />
                Delete Selected
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkActionOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesPage;
