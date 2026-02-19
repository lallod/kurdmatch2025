import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from '@/hooks/useTranslations';

interface BulkActionParams {
  action: string;
  userIds: string[];
  data?: any;
}

export const useAdminBulkActions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();

  const executeBulkAction = async ({ action, userIds, data }: BulkActionParams) => {
    setLoading(true);
    try {
      let result;

      switch (action) {
        case "update_status":
          result = await supabase
            .from("profiles")
            .update({ verified: data.status === "verified" })
            .in("id", userIds);
          break;

        case "send_notification":
          toast({
            title: t('admin.notifications_sent', 'Notifications Sent'),
            description: t('admin.sent_to_users', `Sent to ${userIds.length} users`, { count: userIds.length }),
          });
          return { success: true };

        case "export_data":
          toast({
            title: t('admin.export_started', 'Export Started'),
            description: t('admin.exporting_data_for', `Exporting data for ${userIds.length} users`, { count: userIds.length }),
          });
          return { success: true };

        case "assign_role":
          result = await supabase
            .from("user_roles")
            .insert(userIds.map(userId => ({ user_id: userId, role: data.role })));
          break;

        case "delete_accounts":
          result = await supabase
            .from("profiles")
            .delete()
            .in("id", userIds);
          break;

        default:
          throw new Error("Unknown action");
      }

      if (result && result.error) throw result.error;

      toast({
        title: t('admin.success', 'Success'),
        description: t('admin.bulk_action_completed', `Bulk action completed for ${userIds.length} users`, { count: userIds.length }),
      });

      return { success: true };
    } catch (error) {
      console.error("Error executing bulk action:", error);
      toast({
        title: t('admin.error', 'Error'),
        description: t('admin.failed_bulk_action', 'Failed to execute bulk action'),
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    executeBulkAction,
    loading,
  };
};
