
import React, { useState } from 'react';
import { useAdminCategories } from '../hooks/useAdminCategories';
import { useTranslations } from '@/hooks/useTranslations';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Brain,
  Tag
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Textarea } from "@/components/ui/textarea";

// Interface for category
interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  order: number;
  active: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

// Mock data for categories
const initialCategories: Category[] = [
  { 
    id: 'cat-1', 
    name: 'Basic Information', 
    description: 'General user information like name, age, location', 
    slug: 'basic-info', 
    order: 1, 
    active: true, 
    itemCount: 8,
    createdAt: '2023-01-15',
    updatedAt: '2023-05-20'
  },
  { 
    id: 'cat-2', 
    name: 'Interests & Hobbies', 
    description: 'User interests, hobbies, and activities', 
    slug: 'interests', 
    order: 2, 
    active: true, 
    itemCount: 12,
    createdAt: '2023-01-15',
    updatedAt: '2023-06-10'
  },
  { 
    id: 'cat-3', 
    name: 'Education & Career', 
    description: 'Educational background and career information', 
    slug: 'education-career', 
    order: 3, 
    active: true, 
    itemCount: 5,
    createdAt: '2023-01-16',
    updatedAt: '2023-04-05'
  },
  { 
    id: 'cat-4', 
    name: 'Lifestyle', 
    description: 'Lifestyle preferences and habits', 
    slug: 'lifestyle', 
    order: 4, 
    active: true, 
    itemCount: 10,
    createdAt: '2023-01-18',
    updatedAt: '2023-05-30'
  },
  { 
    id: 'cat-5', 
    name: 'Relationship Goals', 
    description: 'Relationship preferences and expectations', 
    slug: 'relationship-goals', 
    order: 5, 
    active: true, 
    itemCount: 6,
    createdAt: '2023-01-20',
    updatedAt: '2023-03-15'
  },
  { 
    id: 'cat-6', 
    name: 'Physical Attributes', 
    description: 'Physical characteristics and appearance', 
    slug: 'physical-attributes', 
    order: 6, 
    active: false, 
    itemCount: 7,
    createdAt: '2023-02-05',
    updatedAt: '2023-04-12'
  },
  { 
    id: 'cat-7', 
    name: 'Travel Experience', 
    description: 'Travel history and preferences', 
    slug: 'travel', 
    order: 7, 
    active: true, 
    itemCount: 4,
    createdAt: '2023-02-10',
    updatedAt: '2023-06-01'
  },
];

// Interface for item
interface Item {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  type: string;
  order: number;
  active: boolean;
  options?: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock data for items
const initialItems: Item[] = [
  {
    id: 'item-1',
    categoryId: 'cat-1',
    name: 'Name',
    description: 'User\'s full name',
    type: 'text',
    order: 1,
    active: true,
    createdAt: '2023-01-15',
    updatedAt: '2023-01-15'
  },
  {
    id: 'item-2',
    categoryId: 'cat-1',
    name: 'Age',
    description: 'User\'s age',
    type: 'number',
    order: 2,
    active: true,
    createdAt: '2023-01-15',
    updatedAt: '2023-01-15'
  },
  {
    id: 'item-3',
    categoryId: 'cat-1',
    name: 'Location',
    description: 'User\'s current location',
    type: 'text',
    order: 3,
    active: true,
    createdAt: '2023-01-15',
    updatedAt: '2023-04-10'
  },
  {
    id: 'item-4',
    categoryId: 'cat-2',
    name: 'Hobbies',
    description: 'User\'s hobbies and interests',
    type: 'multi-select',
    order: 1,
    active: true,
    options: ['Reading', 'Travel', 'Cooking', 'Sports', 'Music', 'Movies', 'Art', 'Photography', 'Gaming', 'Hiking'],
    createdAt: '2023-01-15',
    updatedAt: '2023-06-10'
  },
  {
    id: 'item-5',
    categoryId: 'cat-2',
    name: 'Sports',
    description: 'Sports the user enjoys',
    type: 'multi-select',
    order: 2,
    active: true,
    options: ['Football', 'Basketball', 'Tennis', 'Swimming', 'Yoga', 'Running', 'Cycling', 'Golf', 'Volleyball'],
    createdAt: '2023-01-16',
    updatedAt: '2023-05-15'
  },
  {
    id: 'item-6',
    categoryId: 'cat-3',
    name: 'Education Level',
    description: 'Highest level of education completed',
    type: 'select',
    order: 1,
    active: true,
    options: ['High School', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Other'],
    createdAt: '2023-01-16',
    updatedAt: '2023-01-25'
  },
  {
    id: 'item-7',
    categoryId: 'cat-3',
    name: 'Occupation',
    description: 'Current occupation or profession',
    type: 'text',
    order: 2,
    active: true,
    createdAt: '2023-01-16',
    updatedAt: '2023-04-05'
  }
];

// Schema for category form
const categoryFormSchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
  description: z.string().optional(),
  slug: z.string().min(1, { message: "Slug is required" }),
  active: z.boolean().default(true),
});

// Schema for item form
const itemFormSchema = z.object({
  name: z.string().min(1, { message: "Item name is required" }),
  description: z.string().optional(),
  type: z.string().min(1, { message: "Item type is required" }),
  active: z.boolean().default(true),
  options: z.string().optional(),
});

const CategoriesPage = () => {
  const { t } = useTranslations();
  const { 
    categories: dbCategories, 
    items: dbItems, 
    loading, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    createItem,
    updateItem,
    deleteItem 
  } = useAdminCategories();
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  
  // Sync with database data
  React.useEffect(() => {
    setCategories(dbCategories);
  }, [dbCategories]);
  
  React.useEffect(() => {
    setItems(dbItems);
  }, [dbItems]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [activeTab, setActiveTab] = useState<string>("categories");
  const [sortBy, setSortBy] = useState<string>("order");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  
  // Dialog states
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState<boolean>(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState<boolean>(false);
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState<boolean>(false);
  
  const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState<boolean>(false);
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState<boolean>(false);

  // Category form
  const categoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      active: true,
    },
  });

  // Item form
  const itemForm = useForm<z.infer<typeof itemFormSchema>>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "",
      active: true,
      options: "",
    },
  });

  // Filter categories based on search term and status
  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && category.active) ||
      (statusFilter === 'inactive' && !category.active);
    
    return matchesSearch && matchesStatus;
  });

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "order":
        comparison = a.order - b.order;
        break;
      case "itemCount":
        comparison = a.itemCount - b.itemCount;
        break;
      case "updatedAt":
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      default:
        comparison = a.order - b.order;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Filter items based on selected category and search term
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory ? item.categoryId === selectedCategory.id : true;
    
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => a.order - b.order);

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
    toast.success("Categories reordered successfully");
  };

  // Handle drag and drop for items
  const handleDragEndItems = (result: any) => {
    if (!result.destination) return;
    
    const itemsCopy = Array.from(items);
    const categoryItems = itemsCopy.filter(item => item.categoryId === selectedCategory?.id);
    
    const [reorderedItem] = categoryItems.splice(result.source.index, 1);
    categoryItems.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property for items within the category
    const updatedCategoryItems = categoryItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    // Merge updated category items with other items
    const updatedAllItems = itemsCopy.map(item => {
      const updatedItem = updatedCategoryItems.find(i => i.id === item.id);
      return updatedItem || item;
    });
    
    setItems(updatedAllItems);
    toast.success("Items reordered successfully");
  };

  // Handle sort
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Add new category
  const handleAddCategory = async (data: z.infer<typeof categoryFormSchema>) => {
    await createCategory({
      name: data.name,
      description: data.description || "",
      slug: data.slug,
      display_order: categories.length + 1,
      active: data.active,
    });
    
    setIsAddCategoryOpen(false);
    categoryForm.reset();
    toast.success("Category added successfully");
  };

  // Edit category
  const handleEditCategory = async (data: z.infer<typeof categoryFormSchema>) => {
    if (!selectedCategory) return;
    
    await updateCategory(selectedCategory.id, {
      name: data.name,
      description: data.description || "",
      slug: data.slug,
      active: data.active,
    });
    
    setIsEditCategoryOpen(false);
    setSelectedCategory(null);
    toast.success("Category updated successfully");
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    await deleteCategory(selectedCategory.id);
    
    setIsDeleteCategoryOpen(false);
    setSelectedCategory(null);
    toast.success("Category deleted successfully");
  };

  // Add new item
  const handleAddItem = (data: z.infer<typeof itemFormSchema>) => {
    if (!selectedCategory) return;
    
    const newItem: Item = {
      id: `item-${Date.now()}`,
      categoryId: selectedCategory.id,
      name: data.name,
      description: data.description || "",
      type: data.type,
      order: filteredItems.length + 1,
      active: data.active,
      options: data.options ? data.options.split(',').map(opt => opt.trim()) : undefined,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    setItems([...items, newItem]);
    
    // Update item count in the category
    const updatedCategories = categories.map(cat => 
      cat.id === selectedCategory.id 
        ? { ...cat, itemCount: cat.itemCount + 1 } 
        : cat
    );
    
    setCategories(updatedCategories);
    setIsAddItemOpen(false);
    itemForm.reset();
    toast.success("Item added successfully");
  };

  // Edit item
  const handleEditItem = (data: z.infer<typeof itemFormSchema>) => {
    if (!selectedItem) return;
    
    const updatedItems = items.map(item => 
      item.id === selectedItem.id 
        ? { 
            ...item, 
            name: data.name, 
            description: data.description || "", 
            type: data.type,
            active: data.active,
            options: data.options ? data.options.split(',').map(opt => opt.trim()) : undefined,
            updatedAt: new Date().toISOString().split('T')[0],
          } 
        : item
    );
    
    setItems(updatedItems);
    setIsEditItemOpen(false);
    setSelectedItem(null);
    toast.success("Item updated successfully");
  };

  // Delete item
  const handleDeleteItem = () => {
    if (!selectedItem) return;
    
    const updatedItems = items.filter(item => item.id !== selectedItem.id);
    
    // Update item count in the category
    const updatedCategories = categories.map(cat => 
      cat.id === selectedItem.categoryId 
        ? { ...cat, itemCount: cat.itemCount - 1 } 
        : cat
    );
    
    setItems(updatedItems);
    setCategories(updatedCategories);
    setIsDeleteItemOpen(false);
    setSelectedItem(null);
    toast.success("Item deleted successfully");
  };

  // Open edit category dialog
  const openEditCategoryDialog = (category: Category) => {
    setSelectedCategory(category);
    categoryForm.reset({
      name: category.name,
      description: category.description,
      slug: category.slug,
      active: category.active,
    });
    setIsEditCategoryOpen(true);
  };

  // Open edit item dialog
  const openEditItemDialog = (item: Item) => {
    setSelectedItem(item);
    itemForm.reset({
      name: item.name,
      description: item.description,
      type: item.type,
      active: item.active,
      options: item.options?.join(', '),
    });
    setIsEditItemOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.categories_management', 'Categories Management')}</h1>
          <p className="text-muted-foreground">{t('admin.manage_categories_desc', 'Manage profile categories and items')}</p>
        </div>
        <div className="flex space-x-2">
          {activeTab === "categories" ? (
            <Button onClick={() => setIsAddCategoryOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('admin.add_category', 'Add Category')}
            </Button>
          ) : (
            <Button 
              onClick={() => setIsAddItemOpen(true)}
              disabled={!selectedCategory}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('admin.add_item', 'Add Item')}
            </Button>
          )}
        </div>
      </div>

      {/* AI banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">{t('admin.ai_categories', 'AI-Enhanced Categories')}</h3>
          <p className="text-sm text-gray-600">{t('admin.ai_categories_desc', 'Our AI system analyzes user engagement and suggests optimal category organization')}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="categories">{t('admin.categories', 'Categories')}</TabsTrigger>
          <TabsTrigger value="items">{t('admin.items', 'Items')}</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Profile Categories</CardTitle>
                  <CardDescription>Manage and organize profile categories</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                  <Button 
                    variant={statusFilter === 'all' ? 'default' : 'outline'} 
                    onClick={() => setStatusFilter('all')}
                    className="w-24"
                  >
                    All
                  </Button>
                  <Button 
                    variant={statusFilter === 'active' ? 'default' : 'outline'} 
                    onClick={() => setStatusFilter('active')}
                    className="w-24"
                  >
                    Active
                  </Button>
                  <Button 
                    variant={statusFilter === 'inactive' ? 'default' : 'outline'} 
                    onClick={() => setStatusFilter('inactive')}
                    className="w-24"
                  >
                    Inactive
                  </Button>
                </div>
              </div>

              <DragDropContext onDragEnd={handleDragEndCategories}>
                <Droppable droppableId="categories">
                  {(provided) => (
                    <div 
                      {...provided.droppableProps} 
                      ref={provided.innerRef}
                    >
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-10"></TableHead>
                              <TableHead 
                                className="cursor-pointer"
                                onClick={() => handleSort("name")}
                              >
                                <div className="flex items-center">
                                  Name
                                  {sortBy === "name" && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("order")}>
                                <div className="flex items-center">
                                  Order
                                  {sortBy === "order" && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("itemCount")}>
                                <div className="flex items-center">
                                  Items
                                  {sortBy === "itemCount" && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("updatedAt")}>
                                <div className="flex items-center">
                                  Updated
                                  {sortBy === "updatedAt" && (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  )}
                                </div>
                              </TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sortedCategories.length > 0 ? (
                              sortedCategories.map((category, index) => (
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
                                      <TableCell className="font-medium">
                                        <div className="flex items-center">
                                          <Tag className="h-4 w-4 text-tinder-rose mr-2" />
                                          {category.name}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="max-w-[250px] truncate" title={category.description}>
                                          {category.description}
                                        </div>
                                      </TableCell>
                                      <TableCell>{category.order}</TableCell>
                                      <TableCell>
                                        <Badge variant="outline" className="bg-gray-100">
                                          {category.itemCount}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        {category.active ? (
                                          <div className="flex items-center">
                                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                            <span className="text-sm text-green-600">Active</span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center">
                                            <XCircle className="h-4 w-4 text-gray-400 mr-1" />
                                            <span className="text-sm text-gray-500">Inactive</span>
                                          </div>
                                        )}
                                      </TableCell>
                                      <TableCell>{category.updatedAt}</TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                              setSelectedCategory(category);
                                              setActiveTab("items");
                                            }}
                                          >
                                            View Items
                                          </Button>
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
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={8} className="text-center py-6">
                                  No categories found
                                </TableCell>
                              </TableRow>
                            )}
                            {provided.placeholder}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <div className="flex justify-between items-center w-full">
                <p className="text-sm text-muted-foreground">Total categories: {categories.length}</p>
                <p className="text-sm text-muted-foreground">
                  Active: {categories.filter(cat => cat.active).length} | 
                  Inactive: {categories.filter(cat => !cat.active).length}
                </p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    {selectedCategory ? `Items in ${selectedCategory.name}` : 'All Category Items'}
                  </CardTitle>
                  <CardDescription>
                    {selectedCategory 
                      ? `Manage items in the "${selectedCategory.name}" category` 
                      : 'Select a category to manage its items'}
                  </CardDescription>
                </div>
                {selectedCategory && (
                  <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                    View All Categories
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!selectedCategory ? (
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categories.map(category => (
                      <Card 
                        key={category.id} 
                        className={`cursor-pointer hover:border-tinder-rose/50 transition-colors ${
                          !category.active ? 'opacity-60' : ''
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{category.name}</CardTitle>
                            <Badge variant="outline" className="bg-gray-100">
                              {category.itemCount} items
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {category.description}
                          </p>
                          {category.active ? (
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-xs text-green-600">Active</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <XCircle className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500">Inactive</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <DragDropContext onDragEnd={handleDragEndItems}>
                    <Droppable droppableId={`items-${selectedCategory.id}`}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          <div className="rounded-md border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-10"></TableHead>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Description</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Last Updated</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {sortedItems.length > 0 ? (
                                  sortedItems.map((item, index) => (
                                    <Draggable
                                      key={item.id}
                                      draggableId={item.id}
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
                                          <TableCell className="font-medium">{item.name}</TableCell>
                                          <TableCell>
                                            <div className="max-w-[250px] truncate" title={item.description}>
                                              {item.description}
                                            </div>
                                          </TableCell>
                                          <TableCell>
                                            <Badge variant="outline">{item.type}</Badge>
                                          </TableCell>
                                          <TableCell>
                                            {item.active ? (
                                              <div className="flex items-center">
                                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                                <span className="text-sm text-green-600">Active</span>
                                              </div>
                                            ) : (
                                              <div className="flex items-center">
                                                <XCircle className="h-4 w-4 text-gray-400 mr-1" />
                                                <span className="text-sm text-gray-500">Inactive</span>
                                              </div>
                                            )}
                                          </TableCell>
                                          <TableCell>{item.updatedAt}</TableCell>
                                          <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditItemDialog(item)}
                                              >
                                                <Edit size={16} />
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                  setSelectedItem(item);
                                                  setIsDeleteItemOpen(true);
                                                }}
                                              >
                                                <Trash2 size={16} />
                                              </Button>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </Draggable>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6">
                                      No items found in this category
                                    </TableCell>
                                  </TableRow>
                                )}
                                {provided.placeholder}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Category Dialogs */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new profile category
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
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter slug (e.g., basic-info)" />
                    </FormControl>
                    <FormDescription>
                      Used in URLs and as a unique identifier
                    </FormDescription>
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
              Make changes to the selected category
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
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter slug (e.g., basic-info)" />
                    </FormControl>
                    <FormDescription>
                      Used in URLs and as a unique identifier
                    </FormDescription>
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
          <div className="py-4">
            {selectedCategory && (
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedCategory.name}</p>
                <p><strong>Items:</strong> {selectedCategory.itemCount}</p>
                <p className="text-red-600 text-sm mt-4">
                  All items in this category will also be deleted.
                </p>
              </div>
            )}
          </div>
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
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Dialogs */}
      <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
            <DialogDescription>
              {selectedCategory ? `Add a new item to the "${selectedCategory.name}" category` : 'Add a new item'}
            </DialogDescription>
          </DialogHeader>
          <Form {...itemForm}>
            <form onSubmit={itemForm.handleSubmit(handleAddItem)} className="space-y-4">
              <FormField
                control={itemForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter item name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={itemForm.control}
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
                control={itemForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        {...field}
                      >
                        <option value="">Select type</option>
                        <option value="text">Text</option>
                        <option value="textarea">Textarea</option>
                        <option value="number">Number</option>
                        <option value="select">Select (Dropdown)</option>
                        <option value="multi-select">Multi-Select</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="radio">Radio</option>
                        <option value="date">Date</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(itemForm.watch("type") === "select" || 
                itemForm.watch("type") === "multi-select" || 
                itemForm.watch("type") === "checkbox" || 
                itemForm.watch("type") === "radio") && (
                <FormField
                  control={itemForm.control}
                  name="options"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Options</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter options, separated by commas" />
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
                control={itemForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Enable or disable this item
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
                <Button type="submit">Add Item</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Make changes to the selected item
            </DialogDescription>
          </DialogHeader>
          <Form {...itemForm}>
            <form onSubmit={itemForm.handleSubmit(handleEditItem)} className="space-y-4">
              <FormField
                control={itemForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter item name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={itemForm.control}
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
                control={itemForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        {...field}
                      >
                        <option value="">Select type</option>
                        <option value="text">Text</option>
                        <option value="textarea">Textarea</option>
                        <option value="number">Number</option>
                        <option value="select">Select (Dropdown)</option>
                        <option value="multi-select">Multi-Select</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="radio">Radio</option>
                        <option value="date">Date</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(itemForm.watch("type") === "select" || 
                itemForm.watch("type") === "multi-select" || 
                itemForm.watch("type") === "checkbox" || 
                itemForm.watch("type") === "radio") && (
                <FormField
                  control={itemForm.control}
                  name="options"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Options</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter options, separated by commas" />
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
                control={itemForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Enable or disable this item
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
                <Button type="submit">Update Item</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteItemOpen} onOpenChange={setIsDeleteItemOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedItem && (
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedItem.name}</p>
                <p><strong>Type:</strong> {selectedItem.type}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteItemOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteItem}
            >
              Delete Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesPage;
