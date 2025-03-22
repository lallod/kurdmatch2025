
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
  AlertTriangle, CheckCircle, Filter, PlusCircle, Tag 
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
  FormMessage
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface Category {
  id: string;
  name: string;
  type: string;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}

const categorySchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters."
  }).max(50, {
    message: "Category name must not exceed 50 characters."
  }),
  type: z.string().min(1, {
    message: "Category type is required."
  }),
  isActive: z.boolean().default(true)
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editableCategories, setEditableCategories] = useState<{ [key: string]: boolean }>({});
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Mock categories data - in a real app, this would come from an API
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Sports',
      type: 'interest',
      usageCount: 1245,
      isActive: true,
      createdAt: '2022-01-15'
    },
    {
      id: '2',
      name: 'Travel',
      type: 'interest',
      usageCount: 2356,
      isActive: true,
      createdAt: '2022-01-15'
    },
    {
      id: '3',
      name: 'Music',
      type: 'interest',
      usageCount: 1987,
      isActive: true,
      createdAt: '2022-01-20'
    },
    {
      id: '4',
      name: 'Movies',
      type: 'interest',
      usageCount: 1542,
      isActive: true,
      createdAt: '2022-01-22'
    },
    {
      id: '5',
      name: 'Foodie',
      type: 'lifestyle',
      usageCount: 876,
      isActive: true,
      createdAt: '2022-02-05'
    },
    {
      id: '6',
      name: 'Fitness',
      type: 'lifestyle',
      usageCount: 1324,
      isActive: true,
      createdAt: '2022-02-10'
    },
    {
      id: '7',
      name: 'Photography',
      type: 'hobby',
      usageCount: 765,
      isActive: true,
      createdAt: '2022-02-15'
    },
    {
      id: '8',
      name: 'Gaming',
      type: 'hobby',
      usageCount: 1102,
      isActive: true,
      createdAt: '2022-02-20'
    },
    {
      id: '9',
      name: 'Reading',
      type: 'hobby',
      usageCount: 893,
      isActive: true,
      createdAt: '2022-03-01'
    },
    {
      id: '10',
      name: 'Outdoors',
      type: 'lifestyle',
      usageCount: 654,
      isActive: false,
      createdAt: '2022-03-05'
    }
  ]);

  const [editingValues, setEditingValues] = useState<{
    [key: string]: { name: string; type: string; isActive: boolean }
  }>({});

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: '',
      isActive: true
    }
  });

  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: '',
      isActive: true
    }
  });

  const filteredCategories = categories.filter(category => {
    // Apply search filter
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply type filter
    const matchesType = 
      filterType === 'all' || 
      category.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const toggleEditMode = (category: Category) => {
    const newEditableCategories = { ...editableCategories };
    
    // If already in edit mode, save changes
    if (editableCategories[category.id]) {
      const updatedCategories = categories.map(cat => {
        if (cat.id === category.id && editingValues[category.id]) {
          return {
            ...cat,
            name: editingValues[category.id].name,
            type: editingValues[category.id].type,
            isActive: editingValues[category.id].isActive
          };
        }
        return cat;
      });
      
      setCategories(updatedCategories);
      newEditableCategories[category.id] = false;
      toast.success(`Category "${category.name}" updated successfully`);
    } else {
      // Enter edit mode
      setEditingValues({
        ...editingValues,
        [category.id]: {
          name: category.name,
          type: category.type,
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
    field: 'name' | 'type' | 'isActive', 
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
    const dataToExport = filteredCategories.map(({ id, name, type, usageCount, isActive, createdAt }) => ({
      id, name, type, usageCount, isActive, createdAt
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

  const categoryCounts = countCategoriesByType();

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
                  <SelectItem value="interest">Interest ({categoryCounts.interest || 0})</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle ({categoryCounts.lifestyle || 0})</SelectItem>
                  <SelectItem value="hobby">Hobby ({categoryCounts.hobby || 0})</SelectItem>
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
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
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
                              <SelectItem value="interest">Interest</SelectItem>
                              <SelectItem value="lifestyle">Lifestyle</SelectItem>
                              <SelectItem value="hobby">Hobby</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline" className="capitalize">
                            {category.type}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{category.usageCount}</TableCell>
                      <TableCell>
                        {editableCategories[category.id] ? (
                          <Select 
                            value={editingValues[category.id]?.isActive ? 'active' : 'inactive'} 
                            onValueChange={(value) => handleEditChange(
                              category.id, 
                              'isActive', 
                              value === 'active'
                            )}
                          >
                            <SelectTrigger className="h-8 px-2 py-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
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
                    <TableCell colSpan={8} className="text-center py-6">
                      No categories found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent>
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
                        <SelectItem value="interest">Interest</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="hobby">Hobby</SelectItem>
                      </SelectContent>
                    </Select>
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

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent>
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
                        <SelectItem value="interest">Interest</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="hobby">Hobby</SelectItem>
                      </SelectContent>
                    </Select>
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

      {/* Delete Confirmation Dialog */}
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

      {/* Bulk Action Dialog */}
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
