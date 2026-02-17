import { supabase } from '@/integrations/supabase/client';
import { fromUntyped } from '@/integrations/supabase/untypedClient';

export interface CreateReportInput {
  reported_user_id: string;
  reason: string;
  details?: string;
  context?: Record<string, any>;
}

export const createReport = async (payload: CreateReportInput) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('Not authenticated');

  const { data, error } = await fromUntyped('reports')
    .from('reports')
    .insert({
      reporter_user_id: session.user.id,
      reported_user_id: payload.reported_user_id,
      reason: payload.reason,
      details: payload.details ?? null,
      context: payload.context ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as any;
};
