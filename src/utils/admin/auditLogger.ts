import { supabase } from '@/integrations/supabase/client';

type AdminAction =
  | 'delete_user'
  | 'unblock_user'
  | 'update_profile'
  | 'toggle_flag'
  | 'delete_content'
  | 'update_record'
  | 'delete_record'
  | 'insert_record';

interface AdminActionParams {
  action: AdminAction;
  table: string;
  recordId?: string;
  data?: Record<string, unknown>;
}

export const executeAdminAction = async ({ action, table, recordId, data }: AdminActionParams) => {
  const { data: result, error } = await supabase.functions.invoke('admin-actions', {
    body: { action, table, recordId, data },
  });

  if (error) {
    console.error('Admin action failed:', error);
    throw new Error(error.message || 'Admin action failed');
  }

  if (result?.error) {
    throw new Error(result.error);
  }

  return result?.data;
};

export const logAdminAction = executeAdminAction;
