import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ABTest = Database["public"]["Tables"]["ab_tests"]["Row"];

export const useAdminABTests = () => {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("ab_tests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error("Error fetching AB tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTest = async (testData: Omit<ABTest, "id" | "created_at" | "updated_at" | "created_by">) => {
    try {
      const { error } = await supabase
        .from("ab_tests")
        .insert([testData]);

      if (error) throw error;
      await fetchTests();
      return { success: true };
    } catch (error) {
      console.error("Error creating AB test:", error);
      return { success: false, error };
    }
  };

  const updateTest = async (id: string, updates: Partial<ABTest>) => {
    try {
      const { error } = await supabase
        .from("ab_tests")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      await fetchTests();
      return { success: true };
    } catch (error) {
      console.error("Error updating AB test:", error);
      return { success: false, error };
    }
  };

  const deleteTest = async (id: string) => {
    try {
      const { error } = await supabase
        .from("ab_tests")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchTests();
      return { success: true };
    } catch (error) {
      console.error("Error deleting AB test:", error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return {
    tests,
    loading,
    refetch: fetchTests,
    createTest,
    updateTest,
    deleteTest,
  };
};