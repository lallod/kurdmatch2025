import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type EmailCampaign = Database["public"]["Tables"]["email_campaigns"]["Row"];

export const useAdminEmailCampaigns = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("email_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error("Error fetching email campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData: Omit<EmailCampaign, "id" | "created_at" | "updated_at" | "created_by" | "sent_count" | "opened_count" | "clicked_count" | "bounced_count" | "unsubscribed_count">) => {
    try {
      const { error } = await supabase
        .from("email_campaigns")
        .insert([campaignData]);

      if (error) throw error;
      await fetchCampaigns();
      return { success: true };
    } catch (error) {
      console.error("Error creating email campaign:", error);
      return { success: false, error };
    }
  };

  const updateCampaign = async (id: string, updates: Partial<EmailCampaign>) => {
    try {
      const { error } = await supabase
        .from("email_campaigns")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      await fetchCampaigns();
      return { success: true };
    } catch (error) {
      console.error("Error updating email campaign:", error);
      return { success: false, error };
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      const { error } = await supabase
        .from("email_campaigns")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchCampaigns();
      return { success: true };
    } catch (error) {
      console.error("Error deleting email campaign:", error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    refetch: fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
};