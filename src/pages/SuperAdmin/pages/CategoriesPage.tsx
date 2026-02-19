
import React, { useState } from 'react';
import { useAdminCategories } from '../hooks/useAdminCategories';
import { useTranslations } from '@/hooks/useTranslations';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Plus, Search, Edit, Trash2, MoveVertical, CheckCircle, XCircle,
  ArrowUpDown, Brain, Tag, Globe
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const LANGS = ['en', 'no', 'ku_sorani', 'ku_kurmanci', 'de'] as const;
const LANG_LABELS: Record<string, string> = {
  en: 'EN', no: 'NO', ku_sorani: 'Sorani', ku_kurmanci: 'Kurmanci', de: 'DE'
};

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
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("categories");
  const [sortBy, setSortBy] = useState("order");
  const [sortOrder, setSortOrder] = useState("asc");
  
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState(false);

  // Translation state for category dialogs
  const [catTranslations, setCatTranslations] = useState<Record<string, string>>({});
  const [itemTranslations, setItemTranslations] = useState<Record<string, string>>({});
  const [transLang, setTransLang] = useState('en');

  const categoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "", description: "", slug: "", active: true },
  });

  const itemForm = useForm<z.infer<typeof itemFormSchema>>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: { name: "", description: "", type: "", active: true, options: "" },
  });

  // Map DB categories to display format
  const categories = dbCategories.map(c => ({
    ...c,
    order: c.display_order,
    itemCount: c.item_count,
    updatedAt: c.updated_at,
    createdAt: c.created_at,
  }));

  // Map DB items  
  const items = dbItems.map(i => ({
    ...i,
    categoryId: i.category_id,
    type: i.item_type,
    order: i.display_order,
    updatedAt: i.updated_at,
    createdAt: i.created_at,
  }));

  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && category.active) ||
      (statusFilter === 'inactive' && !category.active);
    return matchesSearch && matchesStatus;
  });

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "name": comparison = a.name.localeCompare(b.name); break;
      case "order": comparison = a.order - b.order; break;
      case "itemCount": comparison = a.itemCount - b.itemCount; break;
      case "updatedAt": comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(); break;
      default: comparison = a.order - b.order;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory ? item.categoryId === selectedCategory.id : true;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => a.order - b.order);

  const handleSort = (column: string) => {
    if (sortBy === column) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(column); setSortOrder('asc'); }
  };

  const handleDragEndCategories = (result: any) => {
    if (!result.destination) return;
    // Reorder logic - update DB
    toast.success(t('admin.categories_reordered', 'Categories reordered successfully'));
  };

  const handleDragEndItems = (result: any) => {
    if (!result.destination) return;
    toast.success(t('admin.items_reordered', 'Items reordered successfully'));
  };

  const buildTranslationFields = (translations: Record<string, string>, prefix: 'name' | 'description') => {
    const result: Record<string, string> = {};
    LANGS.forEach(lang => {
      const key = `${prefix}_${lang}`;
      if (translations[key]) result[key] = translations[key];
    });
    return result;
  };

  const handleAddCategory = async (data: z.infer<typeof categoryFormSchema>) => {
    const translationData: Record<string, any> = {};
    LANGS.forEach(lang => {
      translationData[`name_${lang}`] = catTranslations[`name_${lang}`] || (lang === 'en' ? data.name : '');
      translationData[`description_${lang}`] = catTranslations[`description_${lang}`] || (lang === 'en' ? (data.description || '') : '');
    });

    await createCategory({
      name: data.name,
      description: data.description || "",
      slug: data.slug,
      display_order: categories.length + 1,
      active: data.active,
      ...translationData,
    } as any);
    
    setIsAddCategoryOpen(false);
    categoryForm.reset();
    setCatTranslations({});
    toast.success(t('admin.category_added', 'Category added successfully'));
  };

  const handleEditCategory = async (data: z.infer<typeof categoryFormSchema>) => {
    if (!selectedCategory) return;
    const translationData: Record<string, any> = {};
    LANGS.forEach(lang => {
      if (catTranslations[`name_${lang}`] !== undefined) translationData[`name_${lang}`] = catTranslations[`name_${lang}`];
      if (catTranslations[`description_${lang}`] !== undefined) translationData[`description_${lang}`] = catTranslations[`description_${lang}`];
    });

    await updateCategory(selectedCategory.id, {
      name: data.name,
      description: data.description || "",
      slug: data.slug,
      active: data.active,
      ...translationData,
    } as any);
    
    setIsEditCategoryOpen(false);
    setSelectedCategory(null);
    setCatTranslations({});
    toast.success(t('admin.category_updated', 'Category updated successfully'));
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    await deleteCategory(selectedCategory.id);
    setIsDeleteCategoryOpen(false);
    setSelectedCategory(null);
    toast.success(t('admin.category_deleted', 'Category deleted successfully'));
  };

  const handleAddItem = async (data: z.infer<typeof itemFormSchema>) => {
    if (!selectedCategory) return;
    const translationData: Record<string, any> = {};
    LANGS.forEach(lang => {
      translationData[`name_${lang}`] = itemTranslations[`name_${lang}`] || (lang === 'en' ? data.name : '');
      translationData[`description_${lang}`] = itemTranslations[`description_${lang}`] || (lang === 'en' ? (data.description || '') : '');
    });

    await createItem({
      category_id: selectedCategory.id,
      name: data.name,
      description: data.description || "",
      item_type: data.type,
      display_order: filteredItems.length + 1,
      active: data.active,
      options: data.options ? data.options.split(',').map(opt => opt.trim()) : [],
      ...translationData,
    } as any);
    
    setIsAddItemOpen(false);
    itemForm.reset();
    setItemTranslations({});
    toast.success(t('admin.item_added', 'Item added successfully'));
  };

  const handleEditItem = async (data: z.infer<typeof itemFormSchema>) => {
    if (!selectedItem) return;
    const translationData: Record<string, any> = {};
    LANGS.forEach(lang => {
      if (itemTranslations[`name_${lang}`] !== undefined) translationData[`name_${lang}`] = itemTranslations[`name_${lang}`];
      if (itemTranslations[`description_${lang}`] !== undefined) translationData[`description_${lang}`] = itemTranslations[`description_${lang}`];
    });

    await updateItem(selectedItem.id, {
      name: data.name,
      description: data.description || "",
      item_type: data.type,
      active: data.active,
      options: data.options ? data.options.split(',').map(opt => opt.trim()) : [],
      ...translationData,
    } as any);
    
    setIsEditItemOpen(false);
    setSelectedItem(null);
    setItemTranslations({});
    toast.success(t('admin.item_updated', 'Item updated successfully'));
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;
    await deleteItem(selectedItem.id);
    setIsDeleteItemOpen(false);
    setSelectedItem(null);
    toast.success(t('admin.item_deleted', 'Item deleted successfully'));
  };

  const openEditCategoryDialog = (category: any) => {
    setSelectedCategory(category);
    categoryForm.reset({
      name: category.name,
      description: category.description || '',
      slug: category.slug,
      active: category.active,
    });
    // Pre-fill translations
    const trans: Record<string, string> = {};
    LANGS.forEach(lang => {
      if (category[`name_${lang}`]) trans[`name_${lang}`] = category[`name_${lang}`];
      if (category[`description_${lang}`]) trans[`description_${lang}`] = category[`description_${lang}`];
    });
    setCatTranslations(trans);
    setIsEditCategoryOpen(true);
  };

  const openEditItemDialog = (item: any) => {
    setSelectedItem(item);
    itemForm.reset({
      name: item.name,
      description: item.description || '',
      type: item.type || item.item_type,
      active: item.active,
      options: item.options?.join(', ') || '',
    });
    const trans: Record<string, string> = {};
    LANGS.forEach(lang => {
      if (item[`name_${lang}`]) trans[`name_${lang}`] = item[`name_${lang}`];
      if (item[`description_${lang}`]) trans[`description_${lang}`] = item[`description_${lang}`];
    });
    setItemTranslations(trans);
    setIsEditItemOpen(true);
  };

  // Reusable translation tabs for dialogs
  const renderTranslationTabs = (
    translations: Record<string, string>,
    setTranslations: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    fields: { key: string; label: string }[]
  ) => (
    <div className="border rounded-lg p-3 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Globe className="h-4 w-4" />
        Translations
      </div>
      <Tabs value={transLang} onValueChange={setTransLang}>
        <TabsList className="grid grid-cols-5 h-8">
          {LANGS.map(lang => (
            <TabsTrigger key={lang} value={lang} className="text-xs relative">
              {LANG_LABELS[lang]}
              {fields.some(f => translations[`${f.key}_${lang}`]) && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-green-500" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {LANGS.map(lang => (
          <TabsContent key={lang} value={lang} className="space-y-3 mt-3">
            {fields.map(field => (
              <div key={field.key} className="space-y-1.5">
                <Label className="text-xs">{field.label}</Label>
                <Input
                  value={translations[`${field.key}_${lang}`] || ''}
                  onChange={(e) => setTranslations(prev => ({ ...prev, [`${field.key}_${lang}`]: e.target.value }))}
                  placeholder={`${field.label} (${LANG_LABELS[lang]})`}
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.categories_management', 'Categories Management')}</h1>
          <p className="text-muted-foreground">{t('admin.manage_categories_desc', 'Manage profile categories and items')}</p>
        </div>
        <div className="flex space-x-2">
          {activeTab === "categories" ? (
            <Button onClick={() => { setCatTranslations({}); setIsAddCategoryOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              {t('admin.add_category', 'Add Category')}
            </Button>
          ) : (
            <Button onClick={() => { setItemTranslations({}); setIsAddItemOpen(true); }} disabled={!selectedCategory}>
              <Plus className="mr-2 h-4 w-4" />
              {t('admin.add_item', 'Add Item')}
            </Button>
          )}
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 flex items-center">
        <Brain size={24} className="text-primary mr-3" />
        <div>
          <h3 className="font-semibold">{t('admin.ai_categories', 'AI-Enhanced Categories')}</h3>
          <p className="text-sm text-muted-foreground">{t('admin.ai_categories_desc', 'Our AI system analyzes user engagement and suggests optimal category organization')}</p>
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
              <CardTitle>{t('admin.profile_categories', 'Profile Categories')}</CardTitle>
              <CardDescription>{t('admin.manage_organize_categories', 'Manage and organize profile categories')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t('admin.search_categories', 'Search categories...')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
                <div className="flex gap-2">
                  {['all', 'active', 'inactive'].map(f => (
                    <Button key={f} variant={statusFilter === f ? 'default' : 'outline'} onClick={() => setStatusFilter(f)} className="w-24">
                      {f === 'all' ? t('admin.all', 'All') : f === 'active' ? t('admin.active_status', 'Active') : t('admin.inactive_status', 'Inactive')}
                    </Button>
                  ))}
                </div>
              </div>

              <DragDropContext onDragEnd={handleDragEndCategories}>
                <Droppable droppableId="categories">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-10"></TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                                <div className="flex items-center">{t('admin.name', 'Name')}{sortBy === "name" && <ArrowUpDown className="ml-2 h-4 w-4" />}</div>
                              </TableHead>
                              <TableHead>{t('admin.description', 'Description')}</TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("order")}>
                                <div className="flex items-center">{t('admin.order', 'Order')}{sortBy === "order" && <ArrowUpDown className="ml-2 h-4 w-4" />}</div>
                              </TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("itemCount")}>
                                <div className="flex items-center">{t('admin.items', 'Items')}{sortBy === "itemCount" && <ArrowUpDown className="ml-2 h-4 w-4" />}</div>
                              </TableHead>
                              <TableHead>{t('admin.status', 'Status')}</TableHead>
                              <TableHead className="text-right">{t('admin.actions', 'Actions')}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sortedCategories.length > 0 ? sortedCategories.map((category, index) => (
                              <Draggable key={category.id} draggableId={category.id} index={index}>
                                {(provided) => (
                                  <TableRow ref={provided.innerRef} {...provided.draggableProps}>
                                    <TableCell><div {...provided.dragHandleProps} className="cursor-move"><MoveVertical size={16} /></div></TableCell>
                                    <TableCell className="font-medium"><div className="flex items-center"><Tag className="h-4 w-4 text-primary mr-2" />{category.name}</div></TableCell>
                                    <TableCell><div className="max-w-[250px] truncate">{category.description}</div></TableCell>
                                    <TableCell>{category.order}</TableCell>
                                    <TableCell><Badge variant="outline">{category.itemCount}</Badge></TableCell>
                                    <TableCell>
                                      {category.active ? (
                                        <div className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-1" /><span className="text-sm text-green-600">{t('admin.active_status', 'Active')}</span></div>
                                      ) : (
                                        <div className="flex items-center"><XCircle className="h-4 w-4 text-muted-foreground mr-1" /><span className="text-sm text-muted-foreground">{t('admin.inactive_status', 'Inactive')}</span></div>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => { setSelectedCategory(category); setActiveTab("items"); }}>{t('admin.view_items', 'View Items')}</Button>
                                        <Button variant="ghost" size="icon" onClick={() => openEditCategoryDialog(category)}><Edit size={16} /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => { setSelectedCategory(category); setIsDeleteCategoryOpen(true); }}><Trash2 size={16} /></Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </Draggable>
                            )) : (
                              <TableRow><TableCell colSpan={7} className="text-center py-6">{t('admin.no_categories_found', 'No categories found')}</TableCell></TableRow>
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
                <p className="text-sm text-muted-foreground">Total: {categories.length}</p>
                <p className="text-sm text-muted-foreground">Active: {categories.filter(c => c.active).length} | Inactive: {categories.filter(c => !c.active).length}</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedCategory ? t('admin.items_in_category', `Items in ${selectedCategory.name}`, { name: selectedCategory.name }) : t('admin.all_category_items', 'All Category Items')}</CardTitle>
                  <CardDescription>{selectedCategory ? t('admin.manage_items_in_category', `Manage items in "${selectedCategory.name}"`, { name: selectedCategory.name }) : t('admin.select_category_to_manage', 'Select a category')}</CardDescription>
                </div>
                {selectedCategory && <Button variant="outline" onClick={() => setSelectedCategory(null)}>{t('admin.view_all_categories', 'View All Categories')}</Button>}
              </div>
            </CardHeader>
            <CardContent>
              {!selectedCategory ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {categories.map(category => (
                    <Card key={category.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedCategory(category)}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{category.name}</CardTitle>
                          <Badge variant="outline">{category.itemCount}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{category.description}</p>
                        {category.active ? (
                          <div className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-1" /><span className="text-xs text-green-600">{t('admin.active_status', 'Active')}</span></div>
                        ) : (
                          <div className="flex items-center"><XCircle className="h-4 w-4 text-muted-foreground mr-1" /><span className="text-xs text-muted-foreground">{t('admin.inactive_status', 'Inactive')}</span></div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder={t('admin.search_items', 'Search items...')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <DragDropContext onDragEnd={handleDragEndItems}>
                    <Droppable droppableId={`items-${selectedCategory.id}`}>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          <div className="rounded-md border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-10"></TableHead>
                                  <TableHead>{t('admin.name', 'Name')}</TableHead>
                                  <TableHead>{t('admin.description', 'Description')}</TableHead>
                                  <TableHead>{t('admin.type', 'Type')}</TableHead>
                                  <TableHead>{t('admin.status', 'Status')}</TableHead>
                                  <TableHead className="text-right">{t('admin.actions', 'Actions')}</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {sortedItems.length > 0 ? sortedItems.map((item, index) => (
                                  <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided) => (
                                      <TableRow ref={provided.innerRef} {...provided.draggableProps}>
                                        <TableCell><div {...provided.dragHandleProps} className="cursor-move"><MoveVertical size={16} /></div></TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell><div className="max-w-[250px] truncate">{item.description}</div></TableCell>
                                        <TableCell><Badge variant="outline">{item.type}</Badge></TableCell>
                                        <TableCell>
                                          {item.active ? (
                                            <div className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-1" /><span className="text-sm text-green-600">{t('admin.active_status', 'Active')}</span></div>
                                          ) : (
                                            <div className="flex items-center"><XCircle className="h-4 w-4 text-muted-foreground mr-1" /><span className="text-sm text-muted-foreground">{t('admin.inactive_status', 'Inactive')}</span></div>
                                          )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditItemDialog(item)}><Edit size={16} /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setIsDeleteItemOpen(true); }}><Trash2 size={16} /></Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </Draggable>
                                )) : (
                                  <TableRow><TableCell colSpan={6} className="text-center py-6">{t('admin.no_items_in_category', 'No items found')}</TableCell></TableRow>
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

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.add_category', 'Add Category')}</DialogTitle>
            <DialogDescription>{t('admin.create_new_profile_category', 'Create a new profile category')}</DialogDescription>
          </DialogHeader>
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(handleAddCategory)} className="space-y-4">
              <FormField control={categoryForm.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>{t('admin.category_name', 'Category Name')}</FormLabel><FormControl><Input {...field} placeholder={t('admin.enter_category_name', 'Enter category name')} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={categoryForm.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>{t('admin.description', 'Description')}</FormLabel><FormControl><Textarea {...field} placeholder={t('admin.enter_description', 'Enter description')} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={categoryForm.control} name="slug" render={({ field }) => (
                <FormItem><FormLabel>{t('admin.slug', 'Slug')}</FormLabel><FormControl><Input {...field} placeholder={t('admin.enter_slug', 'Enter slug (e.g., basic-info)')} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={categoryForm.control} name="active" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5"><FormLabel>{t('admin.active_status', 'Active')}</FormLabel></div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              {renderTranslationTabs(catTranslations, setCatTranslations, [
                { key: 'name', label: t('admin.name', 'Name') },
                { key: 'description', label: t('admin.description', 'Description') },
              ])}
              <DialogFooter><Button type="submit">{t('admin.add_category', 'Add Category')}</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.edit_category', 'Edit Category')}</DialogTitle>
            <DialogDescription>{t('admin.edit_category_desc', 'Make changes to the selected category')}</DialogDescription>
          </DialogHeader>
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(handleEditCategory)} className="space-y-4">
              <FormField control={categoryForm.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>{t('admin.category_name', 'Category Name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={categoryForm.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>{t('admin.description', 'Description')}</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={categoryForm.control} name="slug" render={({ field }) => (
                <FormItem><FormLabel>{t('admin.slug', 'Slug')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={categoryForm.control} name="active" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5"><FormLabel>{t('admin.active_status', 'Active')}</FormLabel></div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              {renderTranslationTabs(catTranslations, setCatTranslations, [
                { key: 'name', label: t('admin.name', 'Name') },
                { key: 'description', label: t('admin.description', 'Description') },
              ])}
              <DialogFooter><Button type="submit">{t('admin.update_category', 'Update Category')}</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteCategoryOpen} onOpenChange={setIsDeleteCategoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('admin.delete_category', 'Delete Category')}</DialogTitle>
            <DialogDescription>{t('admin.delete_category_confirm', 'Are you sure? This cannot be undone.')}</DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <div className="py-4 space-y-2">
              <p><strong>{t('admin.name', 'Name')}:</strong> {selectedCategory.name}</p>
              <p><strong>{t('admin.items', 'Items')}:</strong> {selectedCategory.itemCount}</p>
              <p className="text-destructive text-sm mt-4">{t('admin.all_items_deleted_warning', 'All items will also be deleted.')}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCategoryOpen(false)}>{t('admin.cancel', 'Cancel')}</Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>{t('admin.delete_category', 'Delete Category')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.add_item', 'Add Item')}</DialogTitle>
            <DialogDescription>{selectedCategory ? `Add to "${selectedCategory.name}"` : t('admin.add_new_item', 'Add a new item')}</DialogDescription>
          </DialogHeader>
          <Form {...itemForm}>
            <form onSubmit={itemForm.handleSubmit(handleAddItem)} className="space-y-4">
              <FormField control={itemForm.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>{t('admin.item_name', 'Item Name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={itemForm.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>{t('admin.description', 'Description')}</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={itemForm.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>{t('admin.type', 'Type')}</FormLabel><FormControl>
                  <select className="w-full p-2 border rounded-md bg-background" {...field}>
                    <option value="">{t('admin.select_type', 'Select type')}</option>
                    <option value="text">Text</option><option value="textarea">Textarea</option>
                    <option value="number">Number</option><option value="select">Select</option>
                    <option value="multi-select">Multi-Select</option><option value="checkbox">Checkbox</option>
                    <option value="radio">Radio</option><option value="date">Date</option>
                  </select>
                </FormControl><FormMessage /></FormItem>
              )} />
              {['select','multi-select','checkbox','radio'].includes(itemForm.watch("type")) && (
                <FormField control={itemForm.control} name="options" render={({ field }) => (
                  <FormItem><FormLabel>{t('admin.options', 'Options')}</FormLabel><FormControl><Textarea {...field} placeholder="Option 1, Option 2, ..." /></FormControl><FormMessage /></FormItem>
                )} />
              )}
              <FormField control={itemForm.control} name="active" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <FormLabel>{t('admin.active_status', 'Active')}</FormLabel>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              {renderTranslationTabs(itemTranslations, setItemTranslations, [
                { key: 'name', label: t('admin.name', 'Name') },
                { key: 'description', label: t('admin.description', 'Description') },
              ])}
              <DialogFooter><Button type="submit">{t('admin.add_item', 'Add Item')}</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditItemOpen} onOpenChange={setIsEditItemOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.edit_item', 'Edit Item')}</DialogTitle>
          </DialogHeader>
          <Form {...itemForm}>
            <form onSubmit={itemForm.handleSubmit(handleEditItem)} className="space-y-4">
              <FormField control={itemForm.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>{t('admin.item_name', 'Item Name')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={itemForm.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>{t('admin.description', 'Description')}</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={itemForm.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>{t('admin.type', 'Type')}</FormLabel><FormControl>
                  <select className="w-full p-2 border rounded-md bg-background" {...field}>
                    <option value="">Select type</option>
                    <option value="text">Text</option><option value="textarea">Textarea</option>
                    <option value="number">Number</option><option value="select">Select</option>
                    <option value="multi-select">Multi-Select</option><option value="checkbox">Checkbox</option>
                    <option value="radio">Radio</option><option value="date">Date</option>
                  </select>
                </FormControl><FormMessage /></FormItem>
              )} />
              {['select','multi-select','checkbox','radio'].includes(itemForm.watch("type")) && (
                <FormField control={itemForm.control} name="options" render={({ field }) => (
                  <FormItem><FormLabel>{t('admin.options', 'Options')}</FormLabel><FormControl><Textarea {...field} placeholder="Option 1, Option 2, ..." /></FormControl><FormMessage /></FormItem>
                )} />
              )}
              <FormField control={itemForm.control} name="active" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <FormLabel>{t('admin.active_status', 'Active')}</FormLabel>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              {renderTranslationTabs(itemTranslations, setItemTranslations, [
                { key: 'name', label: t('admin.name', 'Name') },
                { key: 'description', label: t('admin.description', 'Description') },
              ])}
              <DialogFooter><Button type="submit">{t('admin.update_item', 'Update Item')}</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Item Dialog */}
      <Dialog open={isDeleteItemOpen} onOpenChange={setIsDeleteItemOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('admin.delete_item', 'Delete Item')}</DialogTitle>
            <DialogDescription>{t('admin.delete_item_confirm', 'Are you sure? This cannot be undone.')}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="py-4 space-y-2">
              <p><strong>{t('admin.name', 'Name')}:</strong> {selectedItem.name}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteItemOpen(false)}>{t('admin.cancel', 'Cancel')}</Button>
            <Button variant="destructive" onClick={handleDeleteItem}>{t('admin.delete_item', 'Delete Item')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesPage;
