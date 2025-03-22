
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
import { Search, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Category {
  id: string;
  name: string;
  type: string;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}

const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editableCategories, setEditableCategories] = useState<{ [key: string]: boolean }>({});
  
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

  const addNewCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    
    if (name && type) {
      const newCategory: Category = {
        id: `${categories.length + 1}`,
        name,
        type,
        usageCount: 0,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setCategories([...categories, newCategory]);
      setIsAddCategoryOpen(false);
    }
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter(category => category.id !== categoryId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
        <Button onClick={() => setIsAddCategoryOpen(true)} className="gap-2">
          <Plus size={16} />
          Add New Category
        </Button>
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
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="interest">Interest</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="hobby">Hobby</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
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
                                onClick={() => toggleEditMode(category)}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => deleteCategory(category.id)}
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
                    <TableCell colSpan={7} className="text-center py-6">
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
          
          <form onSubmit={addNewCategory}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter category name"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select name="type" required>
                  <SelectTrigger id="type" className="col-span-3">
                    <SelectValue placeholder="Select category type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interest">Interest</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="hobby">Hobby</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsAddCategoryOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesPage;
