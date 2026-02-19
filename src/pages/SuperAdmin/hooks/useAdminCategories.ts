import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { executeAdminAction } from "@/utils/admin/auditLogger";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Tables"]["content_categories"]["Row"];
type CategoryItem = Database["public"]["Tables"]["category_items"]["Row"];

export const useAdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("content_categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("category_items")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const createCategory = async (categoryData: Omit<Category, "id" | "created_at" | "updated_at" | "item_count">) => {
    try {
      const { error } = await supabase
        .from("content_categories")
        .insert([categoryData]);

      if (error) throw error;
      await fetchCategories();
      return { success: true };
    } catch (error) {
      console.error("Error creating category:", error);
      return { success: false, error };
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      await executeAdminAction({ action: 'update_record', table: 'content_categories', recordId: id, data: updates });
      await fetchCategories();
      return { success: true };
    } catch (error) {
      console.error("Error updating category:", error);
      return { success: false, error };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await executeAdminAction({ action: 'delete_record', table: 'content_categories', recordId: id });
      await fetchCategories();
      return { success: true };
    } catch (error) {
      console.error("Error deleting category:", error);
      return { success: false, error };
    }
  };

  const createItem = async (itemData: Omit<CategoryItem, "id" | "created_at" | "updated_at">) => {
    try {
      const { error } = await supabase
        .from("category_items")
        .insert([itemData]);

      if (error) throw error;
      await fetchItems();
      await fetchCategories();
      return { success: true };
    } catch (error) {
      console.error("Error creating item:", error);
      return { success: false, error };
    }
  };

  const updateItem = async (id: string, updates: Partial<CategoryItem>) => {
    try {
      await executeAdminAction({ action: 'update_record', table: 'category_items', recordId: id, data: updates });
      await fetchItems();
      return { success: true };
    } catch (error) {
      console.error("Error updating item:", error);
      return { success: false, error };
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await executeAdminAction({ action: 'delete_record', table: 'category_items', recordId: id });
      await fetchItems();
      await fetchCategories();
      return { success: true };
    } catch (error) {
      console.error("Error deleting item:", error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  return {
    categories,
    items,
    loading,
    refetchCategories: fetchCategories,
    refetchItems: fetchItems,
    createCategory,
    updateCategory,
    deleteCategory,
    createItem,
    updateItem,
    deleteItem,
  };
};
