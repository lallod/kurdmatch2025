import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DataExport = Database["public"]["Tables"]["data_exports"]["Row"];

export const useAdminDataExports = () => {
  const [exports, setExports] = useState<DataExport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("data_exports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setExports(data || []);
    } catch (error) {
      console.error("Error fetching data exports:", error);
    } finally {
      setLoading(false);
    }
  };

  const createExport = async (exportData: Omit<DataExport, "id" | "created_at" | "completed_at" | "created_by" | "file_url" | "file_size" | "row_count" | "error_message">) => {
    try {
      const { error } = await supabase
        .from("data_exports")
        .insert([exportData]);

      if (error) throw error;
      await fetchExports();
      return { success: true };
    } catch (error) {
      console.error("Error creating data export:", error);
      return { success: false, error };
    }
  };

  const updateExport = async (id: string, updates: Partial<DataExport>) => {
    try {
      const { error } = await supabase
        .from("data_exports")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      await fetchExports();
      return { success: true };
    } catch (error) {
      console.error("Error updating data export:", error);
      return { success: false, error };
    }
  };

  const deleteExport = async (id: string) => {
    try {
      const { error } = await supabase
        .from("data_exports")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchExports();
      return { success: true };
    } catch (error) {
      console.error("Error deleting data export:", error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchExports();
  }, []);

  return {
    exports,
    loading,
    refetch: fetchExports,
    createExport,
    updateExport,
    deleteExport,
  };
};